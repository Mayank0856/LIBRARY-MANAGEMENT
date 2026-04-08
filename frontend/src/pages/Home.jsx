import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Book, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

const FeatureCard = ({ icon, title, text }) => (
  <div className="p-8 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300">
    <div className="bg-white p-3 rounded-xl shadow-sm inline-block mb-4 text-indigo-600">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{text}</p>
  </div>
);

const Home = () => {
  const navigate = React.useMemo(() => {
    const fn = (q) => window.location.href = `/catalog?q=${encodeURIComponent(q)}`;
    return fn;
  }, []);
  const [q, setQ] = React.useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      window.location.href = `/catalog?q=${encodeURIComponent(q)}`;
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-purple-200/30 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center animate-fade-in">
          <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-widest mb-6 shadow-sm border border-indigo-100">
            ✨ Intelligent Library Management
          </span>
          <h1 className="text-5xl lg:text-8xl font-black text-gray-900 leading-[1.05] mb-8 tracking-tight">
            Manage your library <br/> with <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">effortless precision.</span>
          </h1>
          <p className="max-w-2xl text-xl text-gray-600 mb-10 leading-relaxed font-medium">
            The all-in-one system for schools and colleges to automate book tracking, member records, and fine collection with a stunning modern interface.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
            <Link to="/login" className="btn btn-primary text-lg px-12 py-5 rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-indigo-200 hover:-translate-y-1 transition-all duration-300">
              Get Started Now <ArrowRight size={22} />
            </Link>
            <Link to="/catalog" className="btn btn-secondary text-lg px-12 py-5 rounded-2xl flex items-center justify-center gap-3 hover:-translate-y-1 transition-all duration-300">
              Browse Catalog
            </Link>
          </div>
          
          <div className="mt-20 relative w-full max-w-5xl mx-auto rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(79,70,229,0.2)] border border-gray-100 group">
            <div className="bg-gray-50 p-3 flex items-center gap-2 border-b">
               <div className="w-3 h-3 rounded-full bg-red-400"></div>
               <div className="w-3 h-3 rounded-full bg-amber-400"></div>
               <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
               <div className="bg-white rounded-lg px-4 py-1.5 text-xs text-gray-400 flex-1 mx-10 text-center font-bold tracking-tight shadow-sm border border-gray-100">https://library-pro.academic.edu/dashboard</div>
            </div>
            <div className="relative overflow-hidden aspect-[16/9]">
               <img 
                  src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1200" 
                  alt="Library Dashboard" 
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Automation Features</h2>
          <p className="text-gray-600 max-w-xl mx-auto text-lg">Everything you need to run a high-performance modern library at scale.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Book size={32} />} 
            title="Book Catalog" 
            text="Centralized inventory with rich metadata, ISBN tracking, and real-time status updates."
          />
          <FeatureCard 
            icon={<Clock size={32} />} 
            title="Auto-Due Dates" 
            text="Set dynamic return periods. System automatically flags overdue books and triggers fine logic."
          />
          <FeatureCard 
            icon={<ShieldCheck size={32} />} 
            title="Role Access" 
            text="Secure role-based access for Admins, Librarians, and Students ensuring data integrity."
          />
        </div>
      </section>

      {/* Search CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-[3rem] p-12 lg:p-20 flex flex-col lg:flex-row items-center gap-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[120px] opacity-20 -mr-32 -mt-32"></div>
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Want to check book availability?</h2>
            <p className="text-gray-400 text-lg mb-10">Use our public catalog to search for resources before visiting. Sign in to reserve or borrow!</p>
            <div className="relative max-w-md mx-auto lg:mx-0">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
               <input 
                  type="text" 
                  placeholder="ISBN or Book Title..." 
                  className="w-full bg-gray-800 border-none rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-indigo-600"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={handleSearch}
               />
            </div>
          </div>
          <div className="flex-1 w-full lg:w-auto">
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-6 rounded-3xl text-center">
                   <p className="text-4xl font-bold text-white mb-1">5k+</p>
                   <p className="text-gray-500 text-sm">Books Available</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-3xl text-center">
                   <p className="text-4xl font-bold text-white mb-1">2k+</p>
                   <p className="text-gray-500 text-sm">Active Students</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-3xl text-center">
                   <p className="text-4xl font-bold text-white mb-1">98%</p>
                   <p className="text-gray-500 text-sm">Return Rate</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-3xl text-center">
                   <p className="text-4xl font-bold text-white mb-1">24/7</p>
                   <p className="text-gray-500 text-sm">Catalog Access</p>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
