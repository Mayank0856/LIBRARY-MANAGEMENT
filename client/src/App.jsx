import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import IssueBook from './pages/IssueBook';
import ReturnBook from './pages/ReturnBook';
import Overdue from './pages/Overdue';
import Fines from './pages/Fines';

const NotFound = () => (
  <div className="text-center py-20">
    <h2 className="text-4xl font-bold text-gray-300">404</h2>
    <p className="text-gray-500 mt-2">Page not found.</p>
  </div>
);

const Settings = () => (
  <div className="card p-8 text-center text-gray-500">⚙️ Settings page coming soon...</div>
);

function App() {
  const { loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="books" element={<Books />} />
          <Route path="members" element={<Members />} />
          <Route path="transactions/issue" element={<IssueBook />} />
          <Route path="transactions/return" element={<ReturnBook />} />
          <Route path="overdue" element={<Overdue />} />
          <Route path="fines" element={<Fines />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
