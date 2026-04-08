import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import {
  LogOut, BookOpen, Users, Settings as SettingsIcon, LayoutDashboard,
  RotateCcw, AlertTriangle, DollarSign, Menu, X, Library, FileText, User as UserIcon,
  ShieldCheck
} from 'lucide-react';

const NavLink = ({ to, icon, label }) => {
  const { pathname } = useLocation();
  const active = pathname.startsWith(to);
  return (
    <Link to={to} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
      ${active ? 'bg-indigo-600 text-white font-semibold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return <Navigate to="/login" />;

  const isAdmin = user.role === 'Admin';
  const isLibrarian = user.role === 'Librarian';
  const canManage = isAdmin || isLibrarian;

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-gray-700 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Library size={20} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-white text-sm leading-none">LibraryMS</p>
          <p className="text-gray-400 text-xs mt-0.5">{user.role}</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-xs text-gray-500 uppercase px-3 py-2 tracking-wider">Main</p>
        <NavLink to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
        <NavLink to="/books" icon={<BookOpen size={18} />} label="Books Catalog" />

        {canManage && (
          <>
            <p className="text-xs text-gray-500 uppercase px-3 py-2 mt-3 tracking-wider">Operations</p>
            <NavLink to="/members" icon={<Users size={18} />} label="Members" />
            <NavLink to="/transactions/issue" icon={<BookOpen size={18} />} label="Issue Book" />
            <NavLink to="/transactions/return" icon={<RotateCcw size={18} />} label="Return Book" />
            <NavLink to="/overdue" icon={<AlertTriangle size={18} />} label="Overdue Books" />
            <NavLink to="/fines" icon={<DollarSign size={18} />} label="Fines" />
            <NavLink to="/reports" icon={<FileText size={18} />} label="Reports" />
          </>
        )}

        {isAdmin && (
          <>
            <p className="text-xs text-gray-500 uppercase px-3 py-2 mt-3 tracking-wider">Admin</p>
            <NavLink to="/masters" icon={<Library size={18} />} label="Master Data" />
            <NavLink to="/staff" icon={<ShieldCheck size={18} />} label="Staff Management" />
            <NavLink to="/logs" icon={<SettingsIcon size={18} />} label="Activity Logs" />
            <NavLink to="/settings" icon={<SettingsIcon size={18} />} label="System Settings" />
          </>
        )}
      </nav>

      <div className="p-4 border-t border-gray-700 space-y-4">
        <NavLink to="/profile" icon={<UserIcon size={18} />} label="My Profile" />
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-800">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
          <button onClick={logout} title="Logout"
            className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600/40 rounded-lg transition shrink-0">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-gray-900 flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Side Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <aside className="w-64 bg-gray-900 flex flex-col h-full">
            <SidebarContent />
          </aside>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Page Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <div className="md:hidden bg-white border-b px-4 py-3 flex items-center gap-3">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1.5 rounded hover:bg-gray-100">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="font-semibold text-gray-800">LibraryMS</span>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
