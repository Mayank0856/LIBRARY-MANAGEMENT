import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { BookOpen, UserCircle } from 'lucide-react';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <BookOpen size={20} className="text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">LibraryMS</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-gray-600 hover:text-indigo-600">Home</Link>
              <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-indigo-600">About</Link>
              <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-indigo-600">Contact</Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link to="/login" className="btn btn-secondary text-sm px-4 py-2 flex items-center gap-2">
                <UserCircle size={18} /> Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero / Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <div className="flex justify-center items-center gap-2 mb-4">
            <BookOpen size={24} className="text-indigo-500" />
            <span className="font-bold text-white text-lg">LibraryMS</span>
          </div>
          <p>© 2026 Library Management System. All rights reserved.</p>
          <div className="mt-4 flex justify-center gap-6">
            <Link to="/about" className="hover:text-white">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-white">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
