import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react';

const MemberModal = ({ member, onClose, onSaved }) => {
  const isEdit = !!member?.id;
  const [form, setForm] = useState({
    name: member?.name || '',
    email: member?.email || '',
    password: '',
    phone: member?.phone || '',
    enrollment_no: member?.enrollment_no || '',
    department: member?.department || '',
    address: member?.address || '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        await api.put(`/users/${member.id}`, payload);
      } else {
        await api.post('/auth/register', form);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save member');
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-bold">{isEdit ? 'Edit Member' : 'Add Member'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
        </div>
        {error && <div className="mx-5 mt-4 bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input className="input" required value={form.name} onChange={set('name')} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input type="email" className="input" required value={form.email} onChange={set('email')} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password {isEdit && '(leave blank)'}</label>
              <input type="password" className="input" required={!isEdit} value={form.password} onChange={set('password')} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input className="input" value={form.phone} onChange={set('phone')} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Enrollment No.</label>
              <input className="input" value={form.enrollment_no} onChange={set('enrollment_no')} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <input className="input" value={form.department} onChange={set('department')} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea className="input" rows={2} value={form.address} onChange={set('address')} />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">{isEdit ? 'Update' : 'Add Member'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Members = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  const fetchMembers = () => api.get('/users').then(r => setMembers(r.data));

  useEffect(() => { fetchMembers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this member?')) return;
    await api.delete(`/users/${id}`);
    fetchMembers();
  };

  const filtered = members.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.enrollment_no?.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900">👥 Member Management</h1>
        <button className="btn btn-primary flex items-center gap-2" onClick={() => setModal('add')}>
          <Plus size={18} /> Add Member
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input className="input pl-10 w-full max-w-md" placeholder="Search by name, email, enrollment..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Enrollment</th>
              <th className="px-4 py-3 text-left">Department</th>
              <th className="px-4 py-3 text-center">Role</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">No members found.</td></tr>
            ) : filtered.map(m => (
              <tr key={m.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium text-gray-900">{m.name}</td>
                <td className="px-4 py-3 text-gray-600">{m.email}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{m.enrollment_no || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{m.department || '—'}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${m.Role?.name === 'Admin' ? 'bg-purple-100 text-purple-700' :
                      m.Role?.name === 'Librarian' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'}`}>
                    {m.Role?.name || 'Student'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${m.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {m.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded" onClick={() => setModal(m)}><Edit2 size={15} /></button>
                    <button className="p-1.5 hover:bg-red-50 text-red-500 rounded" onClick={() => handleDelete(m.id)}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <MemberModal
          member={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetchMembers(); }}
        />
      )}
    </div>
  );
};

export default Members;
