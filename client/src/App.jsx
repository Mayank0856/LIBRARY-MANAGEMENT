import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import PublicLayout from './layouts/PublicLayout';

// Auth & Public Pages
import Login from './pages/Login';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

// Dashboard Pages
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import IssueBook from './pages/IssueBook';
import ReturnBook from './pages/ReturnBook';
import Overdue from './pages/Overdue';
import Fines from './pages/Fines';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const NotFound = () => (
  <div className="text-center py-20 bg-white min-h-screen">
    <h2 className="text-8xl font-black text-gray-100 italic">404</h2>
    <p className="text-2xl font-bold text-gray-900 -mt-10 uppercase tracking-widest">Page not found</p>
    <div className="mt-8">
       <button onClick={() => window.history.back()} className="btn btn-primary px-8">Go Back</button>
    </div>
  </div>
);

function App() {
  const { loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
         <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
         <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm">LibraryMS</p>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
           <Route path="/" element={<Home />} />
           <Route path="/about" element={<About />} />
           <Route path="/contact" element={<Contact />} />
        </Route>

        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route path="/" element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="books" element={<Books />} />
          <Route path="members" element={<Members />} />
          <Route path="transactions/issue" element={<IssueBook />} />
          <Route path="transactions/return" element={<ReturnBook />} />
          <Route path="overdue" element={<Overdue />} />
          <Route path="fines" element={<Fines />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Link to="/dashboard" className="hidden" />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
