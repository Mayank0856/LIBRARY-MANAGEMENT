import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen } from 'lucide-react';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await axios.post('/api/auth/login', formData);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    const creds = {
      admin: { email: 'admin@library.com', password: 'password123' },
      librarian: { email: 'librarian@library.com', password: 'password123' },
      student: { email: 'student@library.com', password: 'password123' },
    };
    setFormData(creds[role]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto bg-indigo-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <BookOpen size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Library System</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-5 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input type="email" required className="input" value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="admin@library.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" required className="input" value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full py-2.5 text-base disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-3 text-center font-medium">Quick Demo Login</p>
            <div className="grid grid-cols-3 gap-2">
              {['admin','librarian','student'].map(role => (
                <button key={role} onClick={() => fillDemo(role)}
                  className="text-xs bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 text-gray-600 py-1.5 rounded-lg capitalize transition">
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
