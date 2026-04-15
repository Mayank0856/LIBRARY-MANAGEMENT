import React, { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import { Search, Filter, Book, BookOpen, Clock, ChevronRight, X, Star, Menu, BookText } from 'lucide-react';
import toast from 'react-hot-toast';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedBook, setSelectedBook] = useState(null);
  const [requesting, setRequesting] = useState(false);
  const [showNcertSidebar, setShowNcertSidebar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [booksRes, catsRes] = await Promise.all([
          api.get('/books'),
          api.get('/categories')
        ]);
        setBooks(booksRes.data);
        setCategories(catsRes.data);
      } catch (err) {
        toast.error('Failed to load library data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter and Sort Logic
  const filteredBooks = useMemo(() => {
    return books
      .filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             book.Author?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        
        let matchesCategory = selectedCategory === 'All' || book.Category?.name === selectedCategory;
        
        // If NCERT is selected, we also filter by class_level if selectedClass isn't 'All'
        if (selectedCategory === 'NCERT' && selectedClass !== 'All') {
            matchesCategory = matchesCategory && book.class_level === selectedClass;
        }

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [books, searchQuery, selectedCategory, selectedClass]);

  const handleCategoryClick = (catName) => {
      setSelectedCategory(catName);
      if (catName === 'NCERT') {
          setShowNcertSidebar(true);
          setSelectedClass('All');
      } else {
          setShowNcertSidebar(false);
          setSelectedClass('All');
      }
  };

  const handleRequest = async (bookId) => {
    try {
      setRequesting(true);
      await api.post('/transactions/request', { book_id: bookId });
      toast.success('Request sent! Librarian will approve it soon.');
      setSelectedBook(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request book');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex gap-10 relative">
      
      {/* NCERT CLASS SIDEBAR (Animated) */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-2xl transition-transform duration-500 ease-out transform ${showNcertSidebar ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 ${showNcertSidebar ? 'md:w-72 md:block' : 'md:hidden'}`}
      >
        <div className="p-8 space-y-8 sticky top-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2"><Menu className="text-indigo-600" /> NCERT Classes</h2>
              <button onClick={() => setShowNcertSidebar(false)} className="md:hidden p-2 bg-gray-50 rounded-xl"><X size={20} /></button>
           </div>
           
           <div className="space-y-2">
              <button 
                onClick={() => setSelectedClass('All')}
                className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${selectedClass === 'All' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                All Classes
              </button>
              {[1,2,3,4,5,6,7,8,9,10].map(grade => (
                <button 
                  key={grade}
                  onClick={() => setSelectedClass(grade.toString())}
                  className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${selectedClass === grade.toString() ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-[1.02]' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
                >
                  Class {grade}
                </button>
              ))}
           </div>

           <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100">
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest leading-loose">Academic Portal</p>
              <p className="text-xs font-bold text-indigo-900 mt-2">Study materials and textbooks for all grades.</p>
           </div>
        </div>
      </div>

      <div className="flex-1 space-y-10 animate-fade-in px-4">
        {/* Header & Search */}
        <div className="flex flex-col items-start space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-6">
            <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-none">
              The <span className="text-indigo-600 underline decoration-indigo-200 decoration-8 underline-offset-8">Library</span> HUB
            </h1>
            <div className="w-full md:w-96 relative group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                <Search size={20} />
              </div>
              <input 
                type="text"
                placeholder="Search anything..."
                className="w-full pl-14 pr-8 py-4 bg-white border-2 border-transparent shadow-xl shadow-gray-200/50 rounded-2xl text-sm font-bold focus:border-indigo-600/10 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Categories bar */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar w-full">
            <button 
              onClick={() => handleCategoryClick('All')}
              className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${selectedCategory === 'All' ? 'bg-gray-900 text-white shadow-xl shadow-gray-300' : 'bg-white text-gray-400 border border-gray-100'}`}
            >
              All
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 ${selectedCategory === cat.name ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-200'}`}
              >
                {cat.name === 'NCERT' && <BookText size={14} />}
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredBooks.map(book => (
            <div 
              key={book.id}
              onClick={() => setSelectedBook(book)}
              className="group cursor-pointer animate-scale-in"
            >
              <div className="relative aspect-[7/10] rounded-[2.5rem] overflow-hidden bg-gray-50 shadow-2xl shadow-gray-200/50 transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-indigo-200/50">
                <img 
                  src={book.cover_image_url || 'https://images.unsplash.com/photo-1543005128-d39eef402740?w=400&h=600&fit=crop'} 
                  alt={book.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500"></div>
                
                {book.class_level && (
                    <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur text-[10px] font-black uppercase tracking-widest text-indigo-600 rounded-full shadow-lg">
                        Class {book.class_level}
                    </div>
                )}
              </div>
              <div className="mt-6 px-2 text-center md:text-left">
                <h3 className="font-black text-lg text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">{book.title}</h3>
                <p className="text-xs text-gray-400 font-black uppercase tracking-widest mt-2">{book.Author?.name}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-32 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100">
             <div className="text-gray-200 mb-6 flex justify-center"><Book size={64} /></div>
             <h3 className="text-2xl font-black text-gray-900">Library under construction</h3>
             <p className="text-gray-400 font-bold mt-2">Try searching for something else or pick another class.</p>
          </div>
        )}
      </div>

      {/* Modern Details Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setSelectedBook(null)}></div>
          
          <div className="relative bg-white w-full max-w-5xl rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 duration-500">
            <button 
              onClick={() => setSelectedBook(null)}
              className="absolute top-8 right-8 z-10 p-4 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-900 transition-all active:scale-90"
            >
              <X size={24} />
            </button>

            <div className="w-full lg:w-[45%] aspect-[3/4] lg:aspect-auto bg-gray-50 flex items-center justify-center">
                <img 
                  src={selectedBook.cover_image_url} 
                  alt="" 
                  className="w-full h-full object-cover lg:scale-[1.01]" 
                />
            </div>

            <div className="flex-1 p-10 lg:p-16 flex flex-col justify-between">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="px-5 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-indigo-100">{selectedBook.Category?.name}</span>
                  {selectedBook.class_level && <span className="px-5 py-2 bg-gray-100 text-gray-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-gray-200">Class {selectedBook.class_level}</span>}
                </div>
                
                <div>
                  <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">{selectedBook.title}</h2>
                  <p className="text-xl text-gray-400 font-bold mt-4 italic">by {selectedBook.Author?.name}</p>
                </div>

                <div className="text-gray-500 font-medium leading-relaxed text-lg line-clamp-6">
                   {selectedBook.description || "Every book tells a story. Dive into the contents of this volume to expand your knowledge and explore new worlds."}
                </div>

                <div className="flex gap-10">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">ISBN Code</span>
                    <span className="font-mono text-gray-900 font-bold text-lg">{selectedBook.isbn}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Stock Status</span>
                    <span className="text-emerald-500 font-black text-lg uppercase tracking-widest">In Stock</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <button 
                  onClick={() => handleRequest(selectedBook.id)}
                  disabled={requesting || selectedBook.available_copies <= 0}
                  className="flex-1 py-6 bg-indigo-600 text-white font-black text-xl rounded-[2.5rem] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-4 group"
                >
                  <BookOpen size={24} className="group-hover:rotate-12 transition-transform" />
                  {requesting ? 'Granting Access...' : 'Request for Publish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
