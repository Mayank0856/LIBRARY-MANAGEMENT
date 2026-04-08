import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Book as BookIcon, ChevronLeft, ArrowLeft } from 'lucide-react';

const Catalog = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(query);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/books');
      setBooks(data);
    } catch (err) {
      console.error('Failed to fetch catalog');
    } finally {
      setLoading(false);
    }
  };

  const filtered = books.filter(b => 
    b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.isbn?.includes(searchTerm) ||
    b.Author?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-indigo-600 pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <Link to="/" className="inline-flex items-center gap-2 text-indigo-100 hover:text-white transition mb-8 group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition" /> Back to Home
           </Link>
           <h1 className="text-4xl font-bold text-white">Public Library Catalog</h1>
           <p className="text-indigo-100 mt-2 opacity-90">Browse our collection and check real-time availability.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-[2rem] shadow-2xl p-4 md:p-8 mb-12 border border-blue-50">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={28} />
            <input 
              type="text" 
              className="w-full pl-16 pr-6 py-6 rounded-2xl border-none bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 text-xl font-medium transition-all"
              placeholder="Search by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
             <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
             <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Cataloging Archive...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {filtered.length === 0 ? (
               <div className="col-span-full py-32 px-10 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                  <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                     <BookIcon size={40} className="text-gray-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No matching books found</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">We couldn't find anything matching "{searchTerm}". Try searching by a different keyword or check the spelling.</p>
                  <button onClick={() => setSearchTerm('')} className="mt-8 text-indigo-600 font-bold hover:underline">Clear Search Filter</button>
               </div>
            ) : filtered.map(book => (
              <div key={book.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] transition-all duration-500 overflow-hidden flex flex-col group">
                 <div className="h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                    <BookIcon size={80} className="text-gray-200 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500" />
                    <div className="absolute top-6 right-6">
                       <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm ${book.available_copies > 0 ? 'bg-white text-green-600' : 'bg-white text-red-500'}`}>
                          {book.available_copies > 0 ? '✅ In Stock' : '❌ Issued'}
                       </span>
                    </div>
                 </div>
                 <div className="p-8 flex-1 flex flex-col">
                    <div className="mb-4">
                       <span className="text-[10px] uppercase tracking-[0.2em] font-black text-indigo-400 block mb-1">{book.Category?.name || 'GENERIC'}</span>
                       <h3 className="text-2xl font-black text-gray-900 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors uppercase">{book.title}</h3>
                    </div>
                    
                    <p className="text-gray-600 font-bold text-sm mb-6 flex items-center gap-2 italic">
                       by <span className="text-gray-900 not-italic">{book.Author?.name || 'Unknown Author'}</span>
                    </p>
                    
                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-black tracking-widest mb-8 border-y py-3 border-gray-50">
                       <span className="flex items-center gap-1.5 uppercase">ISBN: {book.isbn || 'N/A'}</span>
                       <span className="uppercase">{book.Publisher?.name || 'Direct'}</span>
                    </div>

                    <div className="mt-auto">
                       {book.available_copies > 0 ? (
                          <Link 
                            to="/login" 
                            className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold text-center block hover:bg-indigo-600 shadow-lg hover:shadow-indigo-200 transition-all duration-300"
                          >
                            Authenticate to Borrow
                          </Link>
                       ) : (
                          <div className="w-full py-4 rounded-2xl bg-gray-50 text-gray-400 font-bold text-center border border-gray-100">
                             Waitlisting Available
                          </div>
                       )}
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Catalog;
