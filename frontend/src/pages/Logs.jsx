import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Search, Loader2, Calendar, User, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import format from 'date-fns/format';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionFilter, setActionFilter] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/logs?page=${page}&action=${actionFilter}`);
      setLogs(data.data);
      setTotalPages(data.pages);
    } catch (err) {
      console.error('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter]);

  const getActionColor = (action) => {
    if (action.includes('CREATE') || action.includes('SIGNUP')) return 'text-emerald-600 bg-emerald-50';
    if (action.includes('UPDATE') || action.includes('LOGIN')) return 'text-amber-600 bg-amber-50';
    if (action.includes('DELETE') || action.includes('RETURN')) return 'text-rose-600 bg-rose-50';
    return 'text-indigo-600 bg-indigo-50';
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">🛡️ System Audit Logs</h1>
        <div className="flex items-center gap-3">
           <select 
             className="input py-2 text-sm"
             value={actionFilter}
             onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
           >
               <option value="">All Actions</option>
               <option value="USER_LOGIN">Logins</option>
               <option value="USER_SIGNUP">Signups</option>
               <option value="BOOK_CREATED">Book Creation</option>
               <option value="BOOK_ISSUED">Book Issued</option>
               <option value="BOOK_RETURNED">Book Returned</option>
               <option value="FINE_PAID">Fine Payments</option>
               <option value="AUTHOR_CREATED">Manage Authors</option>
               <option value="CATEGORY_CREATED">Manage Categories</option>
               <option value="SETTINGS_UPDATED">System Settings</option>
           </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left font-bold text-gray-600 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-4 text-left font-bold text-gray-600 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-left font-bold text-gray-600 uppercase tracking-wider">Action</th>
              <th className="px-6 py-4 text-left font-bold text-gray-600 uppercase tracking-wider">Details</th>
              <th className="px-6 py-4 text-left font-bold text-gray-600 uppercase tracking-wider">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                   <div className="flex flex-col items-center gap-2">
                      <Loader2 className="animate-spin text-indigo-600" size={32} />
                      <p>Fetching audit trail...</p>
                   </div>
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No logs found.</td></tr>
            ) : logs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                   <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm:ss')}
                   </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase px-1 overflow-hidden">
                         {log.user_name?.[0] || 'G'}
                      </div>
                      <div>
                         <p className="font-bold text-gray-900 leading-none">{log.user_name || 'Guest'}</p>
                         <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">ID: {log.user_id || 'N/A'}</p>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getActionColor(log.action)}`}>
                      <Activity size={12} />
                      {log.action.replace(/_/g, ' ')}
                   </span>
                </td>
                <td className="px-6 py-4 text-gray-600 font-medium">
                   {log.details}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-400">
                   {log.ip_address || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-4">
           <button 
             disabled={page === 1}
             onClick={() => setPage(p => p - 1)}
             className="p-2 border rounded-xl hover:bg-white disabled:opacity-30 transition"
           >
              <ChevronLeft />
           </button>
           <span className="font-bold text-gray-900 px-4 py-2 bg-white rounded-xl shadow-sm border">
              Page {page} of {totalPages}
           </span>
           <button 
             disabled={page === totalPages}
             onClick={() => setPage(p => p + 1)}
             className="p-2 border rounded-xl hover:bg-white disabled:opacity-30 transition"
           >
              <ChevronRight />
           </button>
        </div>
      )}
    </div>
  );
};

export default Logs;
