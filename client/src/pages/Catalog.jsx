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
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <input 
              type="text" 
              className="w-full pl-14 pr-4 py-4 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-600 text-lg"
              placeholder="Search by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading library collection...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length === 0 ? (
               <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed text-gray-400 font-medium text-lg">
                  No books matching "{searchTerm}" found.
               </div>
            ) : filtered.map(book => (
              <div key={book.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                 <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                    <BookIcon size={64} className="text-gray-300" />
                    <div className="absolute top-4 right-4">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${book.available_copies > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {book.available_copies > 0 ? 'Available' : 'Issued'}
                       </span>
                    </div>
                 </div>
                 <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-1">{book.title}</h3>
                    <p className="text-indigo-600 font-medium text-sm mb-4">{book.Author?.name || 'Unknown Author'}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-6 font-medium">
                       <span>{book.Category?.name || 'General'}</span>
                       <span>ISBN: {book.isbn || 'N/A'}</span>
                    </div>

                    <div className="mt-auto border-t pt-4">
                       <Link 
                          to="/login" 
                          className={`w-full py-3 rounded-xl font-bold text-center block transition ${book.available_copies > 0 ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                       >
                          {book.available_copies > 0 ? 'Login to Borrow' : 'Currently Unavailable'}
                       </Link>
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
