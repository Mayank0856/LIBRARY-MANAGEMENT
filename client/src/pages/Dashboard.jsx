import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  BookOpen, Users, Clock, AlertCircle, TrendingUp, CheckCircle, DollarSign, Library
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

const StatCard = ({ title, value, icon, color }) => (
  <div className={`rounded-xl p-5 text-white flex items-center gap-4 shadow-sm ${color}`}>
    <div className="bg-white/20 rounded-lg p-3">{icon}</div>
    <div>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="text-3xl font-bold">{value ?? '—'}</p>
    </div>
  </div>
);

const chartData = [
  { month: 'Jan', issued: 42, returned: 38 },
  { month: 'Feb', issued: 58, returned: 50 },
  { month: 'Mar', issued: 65, returned: 60 },
  { month: 'Apr', issued: 48, returned: 44 },
  { month: 'May', issued: 73, returned: 68 },
  { month: 'Jun', issued: 90, returned: 85 },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {user.role === 'Admin' ? '🛡️ Admin Dashboard' :
           user.role === 'Librarian' ? '📚 Librarian Dashboard' : '🎓 Student Dashboard'}
        </h1>
        <p className="text-gray-500 mt-1">Welcome back, <strong>{user.name}</strong>! Here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Books" value={stats?.totalBooks ?? '...'} icon={<BookOpen size={24} />} color="bg-indigo-600" />
        <StatCard title="Active Members" value={stats?.totalMembers ?? '...'} icon={<Users size={24} />} color="bg-emerald-600" />
        <StatCard title="Books Issued" value={stats?.totalIssued ?? '...'} icon={<Clock size={24} />} color="bg-blue-600" />
        <StatCard title="Overdue Books" value={stats?.totalOverdue ?? '...'} icon={<AlertCircle size={24} />} color="bg-orange-500" />
      </div>

      {(user.role === 'Admin' || user.role === 'Librarian') && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard title="Available Books" value={stats?.availableBooks ?? '...'} icon={<Library size={24} />} color="bg-purple-600" />
          <StatCard title="Fines Collected" value={stats?.finesCollected ? `₹${stats.finesCollected}` : '₹0'} icon={<DollarSign size={24} />} color="bg-pink-600" />
          <StatCard title="Returned Today" value={stats?.returnedToday ?? '...'} icon={<CheckCircle size={24} />} color="bg-teal-600" />
        </div>
      )}

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-indigo-600" size={20} />
          <h2 className="text-lg font-semibold text-gray-800">Monthly Issue & Return Activity</h2>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 13 }} />
            <YAxis tick={{ fontSize: 13 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="issued" fill="#4F46E5" radius={[4,4,0,0]} name="Issued" />
            <Bar dataKey="returned" fill="#10B981" radius={[4,4,0,0]} name="Returned" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      {(user.role === 'Admin' || user.role === 'Librarian') && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/books/add" className="btn btn-primary">+ Add Book</Link>
            <Link to="/transactions/issue" className="bg-emerald-600 text-white btn hover:bg-emerald-700">Issue Book</Link>
            <Link to="/transactions/return" className="bg-orange-500 text-white btn hover:bg-orange-600">Return Book</Link>
            <Link to="/members/add" className="bg-blue-600 text-white btn hover:bg-blue-700">Add Member</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
