import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, X, Users, Tag, Building } from 'lucide-react';
import toast from 'react-hot-toast';

const MasterTable = ({ title, icon, data, onEdit, onDelete, onAdd }) => (
  <div className="card shadow-sm">
    <div className="flex items-center justify-between p-6 border-b">
      <div className="flex items-center gap-2">
        <div className="text-indigo-600">{icon}</div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <button onClick={onAdd} className="btn btn-primary py-2 flex items-center gap-2">
        <Plus size={18} /> Add
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-4 text-left font-bold text-gray-600">Name</th>
            <th className="px-6 py-4 text-center font-bold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr><td colSpan={2} className="px-6 py-10 text-center text-gray-400">No records found.</td></tr>
          ) : data.map(item => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
              <td className="px-6 py-4 flex justify-center gap-2">
                <button onClick={() => onEdit(item)} className="p-1.5 hover:bg-amber-50 text-amber-600 rounded">
                   <Edit2 size={16} />
                </button>
                <button onClick={() => onDelete(item.id)} className="p-1.5 hover:bg-rose-50 text-rose-600 rounded">
                   <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const EntityModal = ({ type, item, onClose, onSave }) => {
  const [name, setName] = useState(item?.name || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (item?.id) await api.put(`/${type}/${item.id}`, { name });
      else await api.post(`/${type}`, { name });
      toast.success(`${type.slice(0,-1)} saved!`);
      onSave();
    } catch (err) {
      toast.error('Failed to save record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-gray-50 p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold">{item?.id ? 'Edit' : 'Add'} {type.slice(0, -1)}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Name</label>
            <input 
              required
              className="input text-lg py-4"
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder={`Enter ${type.slice(0,-1)} name...`} 
              autoFocus
            />
          </div>
          <div className="flex gap-3">
             <button type="button" onClick={onClose} className="btn btn-secondary flex-1 py-4 text-lg">Cancel</button>
             <button type="submit" disabled={loading} className="btn btn-primary flex-1 py-4 text-lg">
                {loading ? 'Saving...' : 'Save Record'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Masters = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(null); // { type, item }

  const fetchData = async () => {
    try {
      const { data } = await api.get(`/${activeTab}`);
      setData(data);
    } catch (err) {
      toast.error(`Failed to load ${activeTab}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This may affect linked books.')) return;
    try {
      await api.delete(`/${activeTab}/${id}`);
      toast.success('Deleted successfully');
      fetchData();
    } catch (err) {
      toast.error('Cannot delete record (it might be linked to books)');
    }
  };

  const tabs = [
    { id: 'categories', label: 'Categories', icon: <Tag size={20}/> },
    { id: 'authors', label: 'Authors', icon: <Users size={20}/> },
    { id: 'publishers', label: 'Publishers', icon: <Building size={20}/> },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-2">
         <h1 className="text-3xl font-black text-gray-900 tracking-tight">⚙️ Master Data Management</h1>
         <p className="text-gray-500 font-medium">Control the core definitions used across the library system.</p>
      </div>

      <div className="flex border-b border-gray-200 gap-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-bold transition ${activeTab === tab.id ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-4xl">
         <MasterTable 
            title={tabs.find(t => t.id === activeTab).label}
            icon={tabs.find(t => t.id === activeTab).icon}
            data={data}
            onAdd={() => setModal({ type: activeTab, item: null })}
            onEdit={(item) => setModal({ type: activeTab, item })}
            onDelete={handleDelete}
         />
      </div>

      {modal && (
        <EntityModal 
          type={modal.type}
          item={modal.item}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); fetchData(); }}
        />
      )}
    </div>
  );
};

export default Masters;
