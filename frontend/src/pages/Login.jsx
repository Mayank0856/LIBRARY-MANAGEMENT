import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, ArrowRight, UserPlus, LogIn, ShieldAlert, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('student'); // 'student' or 'staff'
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    enrollment_no: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (isSignup && loginType === 'student') {
        // Register logic (Only available for students)
        await axios.post('/api/auth/register', formData);
        toast.success('Registration successful! Please log in.');
        setIsSignup(false);
      } else {
        // Login logic
        const { data } = await axios.post('/api/auth/login', {
          email: formData.email,
          password: formData.password
        });
        login(data.user, data.token);
        toast.success(`Welcome back, ${data.user.name}!`);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || (isSignup ? 'Registration failed.' : 'Login failed.'));
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    const creds = {
      admin: { email: 'admin@library.com', password: 'password123', type: 'staff' },
      librarian: { email: 'librarian@library.com', password: 'password123', type: 'staff' },
      student: { email: 'student@library.com', password: 'password123', type: 'student' },
    };
    setFormData({ ...formData, email: creds[role].email, password: creds[role].password });
    setLoginType(creds[role].type);
    setIsSignup(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 font-sans">
      <div className="w-full max-w-lg">
        {/* Logo Section */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mx-auto bg-indigo-600 text-white w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl shadow-indigo-200 rotate-3 hover:rotate-0 transition-transform duration-500">
            <BookOpen size={40} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">LibraryMS</h1>
          <p className="text-gray-500 mt-2 font-medium">Digital Library Management Portal</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-gray-100 relative overflow-hidden flex flex-col">
          {/* Top Bar Decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>

          {/* Role Switcher Tabs */}
          <div className="flex p-2 bg-gray-50 border-b border-gray-100 rounded-t-[2.5rem] mt-2">
            <button 
              onClick={() => { setLoginType('student'); setIsSignup(false); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-black transition-all ${loginType === 'student' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <GraduationCap size={18} />
              STUDENT ACCESS
            </button>
            <button 
              onClick={() => { setLoginType('staff'); setIsSignup(false); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-black transition-all ${loginType === 'staff' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <ShieldAlert size={18} />
              STAFF PORTAL
            </button>
          </div>

          <div className="p-10">
            {error && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl mb-8 text-sm font-semibold border border-rose-100 flex items-center gap-3 animate-in shake duration-500">
                <span className="w-2 h-2 bg-rose-600 rounded-full"></span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignup && loginType === 'student' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all text-gray-900 font-bold" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your name" 
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <input 
                  type="email" 
                  required 
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all text-gray-900 font-bold" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="email@university.com" 
                />
              </div>

              {isSignup && loginType === 'student' && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Phone</label>
                    <input 
                      type="text" 
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all text-gray-900 font-bold" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      placeholder="+91..." 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Enrollment No</label>
                    <input 
                      type="text" 
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all text-gray-900 font-bold" 
                      value={formData.enrollment_no}
                      onChange={e => setFormData({...formData, enrollment_no: e.target.value})}
                      placeholder="Student ID" 
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                <input 
                  type="password" 
                  required 
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all text-gray-900 font-bold" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••" 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    {isSignup ? 'Create Account' : loginType === 'student' ? 'Student Sign In' : 'Staff Sign In'}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Signup Link - Only visible for Student login type */}
            {loginType === 'student' && (
              <div className="mt-10 text-center animate-in fade-in duration-500">
                <button 
                  onClick={() => { setIsSignup(!isSignup); setError(''); }}
                  className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors flex items-center gap-2 mx-auto"
                >
                  {isSignup ? <LogIn size={18} /> : <UserPlus size={18} />}
                  {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up now"}
                </button>
              </div>
            )}
            {/* Footer / Demo Buttons Section */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 mb-4 text-center font-black uppercase tracking-[0.2em]">Quick Evaluation Access</p>
              <div className="grid grid-cols-3 gap-3">
                {['admin','librarian','student'].map(role => (
                  <button key={role} onClick={() => fillDemo(role)}
                    className="text-[10px] font-black uppercase tracking-widest bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 text-gray-400 py-3 rounded-xl border border-transparent hover:border-indigo-100 transition-all">
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <p className="mt-10 text-center text-gray-400 text-sm font-medium">
          &copy; 2026 TechInnovate Library Systems. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
