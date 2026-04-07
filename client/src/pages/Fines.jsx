import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { DollarSign, CheckCircle } from 'lucide-react';

const Fines = () => {
  const [fines, setFines] = useState([]);
  const [filter, setFilter] = useState('all');

  const fetchFines = () => api.get('/fines').then(r => setFines(r.data));

  useEffect(() => { fetchFines(); }, []);

  const handleMarkPaid = async (id) => {
    await api.put(`/fines/${id}/pay`);
    fetchFines();
  };

  const filtered = fines.filter(f => filter === 'all' ? true : f.status === (filter === 'paid' ? 'Paid' : 'Unpaid'));

  const total = fines.filter(f => f.status === 'Paid').reduce((sum, f) => sum + parseFloat(f.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><DollarSign size={24} className="text-pink-600" /> Fine Management</h1>
        <div className="bg-pink-50 text-pink-700 px-4 py-2 rounded-lg font-semibold text-sm">
          Total Collected: ₹{total.toFixed(2)}
        </div>
      </div>

      <div className="flex gap-2">
        {['all', 'unpaid', 'paid'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`btn capitalize ${filter === f ? 'btn-primary' : 'btn-secondary'}`}>{f}</button>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-left">Book</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Paid Date</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">No fines found.</td></tr>
            ) : filtered.map(fine => (
              <tr key={fine.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium text-gray-900">{fine.User?.name || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{fine.IssuedBook?.Book?.title || '—'}</td>
                <td className="px-4 py-3 text-right font-semibold text-red-600">₹{parseFloat(fine.amount).toFixed(2)}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${fine.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {fine.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-gray-500 text-xs">{fine.paid_date ? new Date(fine.paid_date).toLocaleDateString() : '—'}</td>
                <td className="px-4 py-3 text-center">
                  {fine.status === 'Unpaid' && (
                    <button onClick={() => handleMarkPaid(fine.id)} className="flex items-center gap-1 mx-auto text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition">
                      <CheckCircle size={13} /> Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Fines;
