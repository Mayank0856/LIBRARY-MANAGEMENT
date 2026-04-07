import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { AlertTriangle } from 'lucide-react';

const Overdue = () => {
  const [overdue, setOverdue] = useState([]);

  useEffect(() => { api.get('/transactions/overdue').then(r => setOverdue(r.data)); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><AlertTriangle size={24} className="text-red-500" /> Overdue Books</h1>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Book</th>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-left">Issued Date</th>
              <th className="px-4 py-3 text-left">Due Date</th>
              <th className="px-4 py-3 text-right">Days Overdue</th>
              <th className="px-4 py-3 text-right">Fine (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {overdue.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">🎉 No overdue books!</td></tr>
            ) : overdue.map(issue => {
              const daysOverdue = Math.max(0, Math.floor((new Date() - new Date(issue.due_date)) / 86400000));
              const fine = (daysOverdue * 5).toFixed(2);
              return (
                <tr key={issue.id} className="hover:bg-red-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-900">{issue.Book?.title}</td>
                  <td className="px-4 py-3 text-gray-600">{issue.Student?.name}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(issue.issue_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-red-600 font-semibold">{new Date(issue.due_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right font-bold text-red-600">{daysOverdue} days</td>
                  <td className="px-4 py-3 text-right font-bold text-pink-600">₹{fine}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Overdue;
