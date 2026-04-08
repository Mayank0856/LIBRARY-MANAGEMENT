import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const IssueBook = () => {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ book_id: '', student_id: '' });
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    api.get('/books').then(r => setBooks(r.data.filter(b => b.available_copies > 0)));
    api.get('/users').then(r => setMembers(r.data.filter(u => u.Role?.name === 'Student')));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      await api.post('/transactions/issue', form);
      toast.success('Book issued successfully! Due in 14 days.');
      setForm({ book_id: '', student_id: '' });
      api.get('/books').then(r => setBooks(r.data.filter(b => b.available_copies > 0)));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to issue book');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><BookOpen size={24} className="text-indigo-600" /> Issue Book</h1>

      {msg && (
        <div className={`flex items-center gap-2 p-4 rounded-lg text-sm font-medium ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {msg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {msg.text}
        </div>
      )}

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Select Book *</label>
            <select className="input" required value={form.book_id} onChange={e => setForm({...form, book_id: e.target.value})}>
              <option value="">— Choose a book —</option>
              {books.map(b => (
                <option key={b.id} value={b.id}>{b.title} ({b.available_copies} available)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Select Student *</label>
            <select className="input" required value={form.student_id} onChange={e => setForm({...form, student_id: e.target.value})}>
              <option value="">— Choose a member —</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.enrollment_no || m.email})</option>
              ))}
            </select>
          </div>
          <div className="bg-blue-50 text-blue-700 rounded p-3 text-sm">
            📅 Due date will be set to <strong>14 days</strong> from today. Fine is ₹5/day for overdue.
          </div>
          <button type="submit" className="btn btn-primary w-full">Issue Book</button>
        </form>
      </div>
    </div>
  );
};

export default IssueBook;
