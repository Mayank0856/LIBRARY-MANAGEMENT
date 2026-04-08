import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, Phone, MapPin, Shield, Key, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user.name || '',
    phone: user.phone || '',
    address: user.address || '',
    currentPassword: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password) {
      if (!form.currentPassword) {
        return toast.error('Current password is required to change password');
      }
      if (form.password !== form.confirmPassword) {
        return toast.error('Passwords do not match');
      }
    }

    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.password) {
        delete payload.password;
        delete payload.currentPassword;
      }
      delete payload.confirmPassword;

      await api.put(`/users/${user.id}`, payload);
      
      // Update local context
      const updatedUser = { ...user, name: form.name, phone: form.phone, address: form.address };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully!');
      setForm({ ...form, currentPassword: '', password: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">👤 My Profile</h1>
        <p className="text-gray-500 font-medium">Manage your personal information and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-8 flex flex-col items-center text-center shadow-indigo-100/50 shadow-xl border-indigo-50">
             <div className="w-24 h-24 rounded-3xl bg-indigo-600 flex items-center justify-center text-white text-4xl font-black mb-4 shadow-lg shadow-indigo-200">
                {user.name[0]}
             </div>
             <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
             <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mt-1">{user.role}</p>
             <div className="w-full border-t border-gray-100 my-6"></div>
             <div className="w-full space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                   <Mail size={16} className="text-gray-400" />
                   <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                   <Shield size={16} className="text-gray-400" />
                   <span className="capitalize">{user.status || 'Active'} Account</span>
                </div>
             </div>
          </div>
        </div>

        {/* Right: Edit Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card p-8 space-y-8 shadow-sm">
            <div className="space-y-6">
               <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-4">
                  <User size={18} className="text-indigo-600" /> Basic Information
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Display Name</label>
                    <div className="relative">
                       <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                       <input className="input pl-10" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                    <div className="relative">
                       <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                       <input className="input pl-10" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                    </div>
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Residential Address</label>
                  <div className="relative">
                     <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                     <textarea className="input pl-10" rows={2} value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-4">
                  <Key size={18} className="text-indigo-600" /> Security
               </h3>
               <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
                  <p className="text-sm text-amber-700 font-medium">
                     Providing your current password is required if you wish to change your login credentials.
                  </p>
               </div>
               <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Current Password</label>
                    <input type="password" placeholder="Verify your identity" className="input shadow-sm" value={form.currentPassword} onChange={e => setForm({...form, currentPassword: e.target.value})} />
                  </div>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Password</label>
                    <input type="password" placeholder="Leave blank to keep same" className="input" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm Password</label>
                    <input type="password" placeholder="Repeat new password" className="input" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} />
                  </div>
               </div>
            </div>


            <div className="pt-4 flex justify-end">
               <button disabled={loading} className="btn btn-primary px-10 py-4 rounded-xl flex items-center gap-2 text-lg font-bold shadow-lg shadow-indigo-100">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  Save Changes
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
