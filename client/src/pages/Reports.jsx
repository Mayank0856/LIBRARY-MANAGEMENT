import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FileText, Download, TrendingUp, Book, Users, Activity, ExternalLink } from 'lucide-react';

const ReportCard = ({ title, description, icon, onExport, loading }) => (
  <div className="card p-6 flex flex-col justify-between">
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
        {icon}
      </div>
      <button 
        onClick={onExport}
        disabled={loading}
        className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition disabled:opacity-50"
      >
        <Download size={16} /> Export CSV
      </button>
    </div>
    <div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  </div>
);

const Reports = () => {
  const [loading, setLoading] = useState(false);

  const convertToCSV = (objArray) => {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    const header = Object.keys(array[0]).join(',');
    str += header + '\r\n';

    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (const index in array[i]) {
        if (line !== '') line += ',';
        line += `"${array[i][index]}"`;
      }
      str += line + '\r\n';
    }
    return str;
  };

  const downloadCSV = (data, filename) => {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async (type) => {
    setLoading(true);
    try {
      let endpoint = '';
      let filename = '';
      
      switch(type) {
        case 'books': endpoint = '/books'; filename = 'books_inventory'; break;
        case 'members': endpoint = '/users'; filename = 'member_list'; break;
        case 'transactions': endpoint = '/transactions/active'; filename = 'active_transactions'; break;
        case 'fines': endpoint = '/fines'; filename = 'fines_report'; break;
        default: return;
      }

      const { data } = await api.get(endpoint);
      
      // Flatten data for CSV
      const flattened = data.map(item => {
        const flat = { ...item };
        // Handle nested objects for cleaner CSV
        if (item.Author) flat.Author = item.Author.name;
        if (item.Category) flat.Category = item.Category.name;
        if (item.Role) flat.Role = item.Role.name;
        if (item.Book) flat.Book = item.Book.title;
        if (item.Student) flat.Student = item.Student.name;
        
        // Clean up some fields
        delete flat.createdAt;
        delete flat.updatedAt;
        return flat;
      });

      downloadCSV(flattened, filename);
    } catch (err) {
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText size={24} className="text-indigo-600" /> System Reports
        </h1>
        <p className="text-gray-500 mt-1">Download detailed data snapshots from your library system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReportCard 
          title="Books Inventory" 
          description="A complete list of all books, authors, categories, and current availability status." 
          icon={<Book size={24} />} 
          onExport={() => handleExport('books')}
          loading={loading}
        />
        <ReportCard 
          title="Member Registry" 
          description="Detailed directory of all registered students, staff, and their membership status." 
          icon={<Users size={24} />} 
          onExport={() => handleExport('members')}
          loading={loading}
        />
        <ReportCard 
          title="Transaction History" 
          description="Log of all active issues, due dates, and pending returns across the system." 
          icon={<Activity size={24} />} 
          onExport={() => handleExport('transactions')}
          loading={loading}
        />
        <ReportCard 
          title="Fines & Collections" 
          description="Comprehensive report of all generated fines, payment status, and total collections." 
          icon={<TrendingUp size={24} />} 
          onExport={() => handleExport('fines')}
          loading={loading}
        />
      </div>

      <div className="bg-indigo-600 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-lg">
        <div className="mb-6 md:mb-0">
          <h2 className="text-2xl font-bold mb-2">Need a custom analytics view?</h2>
          <p className="text-indigo-100 opacity-90 max-w-lg">Advanced insights and graphical reports are being generated in the main dashboard. Use these exports for physical archives or custom data processing.</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition flex items-center gap-2"
        >
          <ExternalLink size={20} /> Print Snapshot
        </button>
      </div>
    </div>
  );
};

export default Reports;
