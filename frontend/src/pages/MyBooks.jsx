import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Clock, RefreshCcw, BookOpen, Trash2, BookMarked } from 'lucide-react';
import toast from 'react-hot-toast';
import { differenceInDays, differenceInHours } from 'date-fns';
import BookReaderModal from './BookReaderModal';

const Timer = ({ dueDate }) => {
  if (!dueDate) return null;
  const [timeLeft, setTimeLeft] = useState('');
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    const calcTimer = () => {
      const now = new Date();
      const due = new Date(dueDate);
      if (now > due) {
        setIsOverdue(true);
        setTimeLeft('Overdue');
        return;
      }
      const days = differenceInDays(due, now);
      const hours = differenceInHours(due, now) % 24;
      setTimeLeft(`${days}d ${hours}h left`);
    };

    calcTimer();
    const int = setInterval(calcTimer, 1000 * 60);
    return () => clearInterval(int);
  }, [dueDate]);

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm ${isOverdue ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
      <Clock size={14} />
      {timeLeft}
    </div>
  );
};

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readingBook, setReadingBook] = useState(null);
  const [progress, setProgress] = useState({}); // { [book_id]: { page_number, percent_complete } }

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/transactions/my-books');
      setBooks(data);
      // Fetch reading progress for all active issued books
      const issued = data.filter(i => i.status === 'Issued' || i.status === 'Overdue');
      const progressMap = {};
      await Promise.all(issued.map(async (issue) => {
        try {
          const res = await api.get(`/progress/${issue.Book?.id}`);
          progressMap[issue.Book?.id] = res.data;
        } catch (_) {}
      }));
      setProgress(progressMap);
    } catch (err) {
      toast.error('Failed to load your reading history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const handleReturnAction = async (issueId) => {
    if (!window.confirm('Are you sure you want to return this book now?')) return;
    try {
      const { data } = await api.put(`/transactions/${issueId}/request-return`);
      toast.success(data.message);
      if (data.fine) toast.error(data.fine);
      fetchMyBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to return book');
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
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Reading <span className="text-indigo-600">History</span></h1>
          <p className="text-gray-500 font-medium mt-2">Manage your active checkouts and digital content access.</p>
        </div>
        <button onClick={fetchMyBooks} className="p-4 bg-white hover:bg-gray-50 text-gray-400 hover:text-indigo-600 rounded-2xl border border-gray-100 transition-all shadow-sm">
          <RefreshCcw size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.length === 0 ? (
           <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center space-y-4">
             <div className="p-6 bg-gray-50 rounded-full text-gray-300"><BookOpen size={48} /></div>
             <div>
               <h3 className="text-xl font-black text-gray-900">Your shelf is empty</h3>
               <p className="text-gray-500 font-medium mt-1">Go to the catalog and request your first e-book!</p>
             </div>
           </div>
        ) : books.map(issue => (
          <div key={issue.id} className="group bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col animate-scale-in">
            <div className="p-8 flex gap-6 flex-1">
               <div className="w-24 h-32 bg-gray-50 rounded-2xl shadow-inner overflow-hidden shrink-0">
                  {issue.Book?.cover_image_url ? (
                     <img src={issue.Book.cover_image_url} alt="" className="w-full h-full object-cover" />
                  ) : <div className="h-full flex items-center justify-center text-[10px] text-gray-300 font-black uppercase">No Cover</div>}
               </div>
               <div className="flex flex-col justify-center gap-3">
                 <h3 className="text-lg font-black text-gray-900 leading-tight line-clamp-2">{issue.Book?.title}</h3>
                 
                 <div className="flex flex-wrap gap-2">
                    {issue.status === 'Pending' && <span className="px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-widest rounded-full">Pending Approval</span>}
                    {issue.status === 'Returned' && <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">Returned</span>}
                    {(issue.status === 'Issued' || issue.status === 'Overdue') && <Timer dueDate={issue.due_date} />}
                 </div>
               </div>
            </div>

            {/* Reading progress bar */}
            {(issue.status === 'Issued' || issue.status === 'Overdue') && progress[issue.Book?.id] && (
              <div className="px-8 pb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1 text-[10px] text-indigo-400 font-black uppercase tracking-widest">
                    <BookMarked size={10} />
                    {progress[issue.Book?.id]?.page_number > 1
                      ? `Continue from page ${progress[issue.Book?.id]?.page_number}`
                      : 'Not started yet'}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold">
                    {progress[issue.Book?.id]?.percent_complete ?? 0}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress[issue.Book?.id]?.percent_complete ?? 0}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions for Active Issues */}
            {(issue.status === 'Issued' || issue.status === 'Overdue') && (
              <div className="p-6 bg-gray-50/50 border-t border-gray-50 grid grid-cols-2 gap-3">
                <button
                   onClick={() => setReadingBook(issue.Book)}
                   className="flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
                 >
                   <BookOpen size={16} />
                   READ ONLINE
                 </button>
                <button 
                  onClick={() => handleReturnAction(issue.id)}
                  className="flex items-center justify-center gap-2 py-4 bg-white hover:bg-rose-50 text-rose-500 font-black text-xs rounded-2xl border border-rose-100 shadow-sm transition-all active:scale-95"
                >
                  <Trash2 size={16} />
                  RETURN NOW
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* In-App Book Reader Modal */}
      {readingBook && (
        <BookReaderModal
          book={readingBook}
          onClose={() => setReadingBook(null)}
        />
      )}
    </div>
  );
};

export default MyBooks;
