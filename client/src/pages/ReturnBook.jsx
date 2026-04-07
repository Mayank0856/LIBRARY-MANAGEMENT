import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { RotateCcw, CheckCircle, AlertCircle, Search } from 'lucide-react';

const ReturnBook = () => {
  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState(null);

  const fetchIssues = () => api.get('/transactions/active').then(r => setIssues(r.data));

  useEffect(() => { fetchIssues(); }, []);

  const handleReturn = async (issue_id) => {
    setMsg(null);
    try {
      const { data } = await api.post('/transactions/return', { issue_id });
      setMsg({ type: 'success', text: data.message + (data.fine ? ` Fine applied: ₹${data.fine}` : '') });
      fetchIssues();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Return failed' });
    }
  };

  const filtered = issues.filter(i =>
    i.Book?.title?.toLowerCase().includes(search.toLowerCase()) ||
    i.Student?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><RotateCcw size={24} className="text-orange-500" /> Return Book</h1>

      {msg && (
        <div className={`flex items-center gap-2 p-4 rounded-lg text-sm font-medium ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {msg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {msg.text}
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input className="input pl-10 w-full max-w-md" placeholder="Search by book or member..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Book</th>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-left">Issued Date</th>
              <th className="px-4 py-3 text-left">Due Date</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">No active issues found.</td></tr>
            ) : filtered.map(issue => {
              const isOverdue = new Date(issue.due_date) < new Date();
              return (
                <tr key={issue.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-900">{issue.Book?.title}</td>
                  <td className="px-4 py-3 text-gray-600">{issue.Student?.name}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(issue.issue_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                      {new Date(issue.due_date).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${isOverdue ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-700'}`}>
                      {isOverdue ? '⚠ Overdue' : 'Issued'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleReturn(issue.id)}
                      className="bg-orange-500 text-white text-xs px-3 py-1.5 rounded hover:bg-orange-600 transition flex items-center gap-1 mx-auto"
                    >
                      <RotateCcw size={13} /> Return
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReturnBook;
