import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, X, Search, ShieldCheck, Mail, Phone, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';

const StaffModal = ({ staff, onClose, onSaved }) => {
  const isEdit = !!staff?.id;
  const [form, setForm] = useState({
    name: staff?.name || '',
    email: staff?.email || '',
    password: '',
    role_id: staff?.role_id || '',
    phone: staff?.phone || '',
    status: staff?.status || 'Active',
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/roles').then(r => {
      // Filter out 'Student' role if needed, or show all
      setRoles(r.data.filter(role => role.name !== 'Student'));
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        const { password, ...payload } = form;
        if (password) payload.password = password;
        await api.put(`/users/${staff.id}`, payload);
        toast.success('Staff updated successfully');
      } else {
        await api.post('/users', form);
        toast.success('Staff created successfully');
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save staff');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">{isEdit ? '🛠️ Edit Staff Member' : '👨‍💼 Add Staff Member'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
              <input className="input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. John Doe" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                <input type="email" className="input" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@library.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                <input className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 98765 43210" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password {isEdit && '(Leave blank if same)'}</label>
                <input type="password" className="input" required={!isEdit} value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">System Role</label>
                <select className="input font-bold" required value={form.role_id} onChange={e => setForm({...form, role_id: e.target.value})}>
                   <option value="">Select Role</option>
                   {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
            </div>

            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Account Status</label>
               <div className="flex gap-4">
                  {['Active', 'Inactive', 'Suspended'].map(s => (
                    <label key={s} className="flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition peer-checked:bg-indigo-50 peer-checked:border-indigo-600">
                       <input type="radio" name="status" value={s} checked={form.status === s} onChange={e => setForm({...form, status: e.target.value})} className="accent-indigo-600" />
                       <span className="text-sm font-bold">{s}</span>
                    </label>
                  ))}
               </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t mt-8">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1 py-4 text-lg">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary flex-1 py-4 text-lg">
               {loading ? 'Processing...' : isEdit ? 'Update Member' : 'Create Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Staff = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users');
      // Filter for Staff (Admin/Librarian) - usually role_id != Student's id or just based on role name
      // Here we show only those with non-Student roles or just let admin see everyone but focus on staff
      setUsers(data.filter(u => u.Role?.name !== 'Student'));
    } catch (err) {
      toast.error('Failed to load staff members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this staff member? This will revoke their access immediately.')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('Staff member removed');
      fetchUsers();
    } catch (err) {
      toast.error('Cannot remove staff member');
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-1">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
               <ShieldCheck className="text-indigo-600" size={32} /> Staff Management
            </h1>
            <p className="text-gray-500 font-medium">Control administrative and operational access to the system.</p>
         </div>
         <button className="btn btn-primary px-6 py-4 rounded-xl flex items-center gap-2 text-lg font-bold shadow-lg shadow-indigo-100" onClick={() => setModal('add')}>
           <Plus size={24} /> New Staff Member
         </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
         <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
               className="input pl-12 py-4 h-14 text-lg bg-white" 
               placeholder="Search by name or email..." 
               value={search} 
               onChange={e => setSearch(e.target.value)} 
            />
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {loading ? (
            Array(4).fill(0).map((_,i) => <div key={i} className="card h-48 animate-pulse bg-gray-50"></div>)
        ) : filtered.length === 0 ? (
           <div className="col-span-full py-20 text-center card bg-gray-50 border-dashed border-2">
              <p className="text-gray-400 font-bold text-xl">No staff members matching your search.</p>
           </div>
        ) : filtered.map(u => (
          <div key={u.id} className="card p-6 flex items-start justify-between group hover:border-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-50">
             <div className="flex gap-6">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black border-4 shadow-sm ${u.Role?.name === 'Admin' ? 'bg-purple-600 text-white border-purple-100' : 'bg-indigo-600 text-white border-indigo-100'}`}>
                   {u.name[0]}
                </div>
                <div className="space-y-4">
                   <div>
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{u.name}</h3>
                      <div className="flex gap-2 mt-1">
                         <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${u.Role?.name === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'}`}>
                           {u.Role?.name || 'Staff'}
                         </span>
                         <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${u.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                           {u.status}
                         </span>
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                         <Mail size={14} className="text-gray-300" /> {u.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                         <Phone size={14} className="text-gray-300" /> {u.phone || 'No phone provided'}
                      </div>
                   </div>
                </div>
             </div>
             <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setModal(u)}
                  className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-amber-50 hover:text-amber-600 transition shadow-sm border border-gray-100"
                >
                   <Edit2 size={20} />
                </button>
                <button 
                  onClick={() => handleDelete(u.id)}
                  disabled={u.Role?.name === 'Admin'} // Prevent deleting admins via UI for safety
                  className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition shadow-sm border border-gray-100 disabled:opacity-30 disabled:hover:bg-gray-50"
                >
                   <Trash2 size={20} />
                </button>
             </div>
          </div>
        ))}
      </div>

      {modal && (
        <StaffModal
          staff={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetchUsers(); }}
        />
      )}
    </div>
  );
};

export default Staff;
