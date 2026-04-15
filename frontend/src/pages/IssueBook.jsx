import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ClipboardList, CheckCircle, AlertCircle, RefreshCw, XCircle, User, Book as BookIcon, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const IssueBook = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/transactions/pending');
      setRequests(data);
    } catch (err) {
      toast.error('Failed to load pending requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApproveIssue = async (id) => {
    try {
      await api.put(`/transactions/${id}/approve-issue`);
      toast.success('Book issued successfully!');
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve issue');
    }
  };

  const pendingIssues = Array.isArray(requests) ? requests.filter(r => r?.status === 'Pending') : [];

  if (loading && (!requests || requests.length === 0)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Request <span className="text-indigo-600">Management</span></h1>
          <p className="text-gray-500 font-medium mt-2">Approve student requests to grant them digital access.</p>
        </div>
        <button onClick={fetchRequests} className="p-4 bg-white hover:bg-gray-50 text-gray-400 hover:text-indigo-600 rounded-2xl border border-gray-100 transition-all shadow-sm">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="bg-indigo-600 p-8 flex items-center justify-between">
           <div className="flex items-center gap-4 text-white">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <AlertCircle size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black">Borrowing Requests</h2>
                <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest">{pendingIssues.length} Pending Approval</p>
              </div>
           </div>
        </div>

        <div className="divide-y divide-gray-50">
           {pendingIssues.length === 0 ? (
              <div className="p-20 text-center space-y-4">
                 <div className="mx-auto w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200"><CheckCircle size={32} /></div>
                 <div>
                    <h3 className="text-lg font-black text-gray-900">All caught up!</h3>
                    <p className="text-gray-400 font-medium">No new requests need your attention right now.</p>
                 </div>
              </div>
           ) : pendingIssues.map(req => (
              <div key={req?.id} className="p-8 hover:bg-gray-50/50 transition-colors flex flex-col md:flex-row justify-between md:items-center gap-6 group">
                 <div className="flex items-start gap-6">
                    <div className="w-16 h-20 bg-gray-100 rounded-xl overflow-hidden shadow-sm shrink-0 border border-gray-100">
                       <img src={req?.Book?.cover_image_url || "https://images.unsplash.com/photo-1543005128-d39eef402740?w=100"} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                       <h3 className="text-lg font-black text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">{req?.Book?.title || 'Unknown Book'}</h3>
                       <div className="flex flex-col gap-1 mt-2">
                          <p className="text-sm text-gray-600 font-bold flex items-center gap-2">
                             <User size={14} className="text-gray-400" />
                             {req?.Student?.name || 'Unknown Student'}
                             <span className="text-gray-300 font-normal">({req?.Student?.email})</span>
                          </p>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-2">
                             <Clock size={12} />
                             Requested {req?.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Unknown Date'}
                          </p>
                       </div>
                    </div>
                 </div>
                 <button 
                   onClick={() => handleApproveIssue(req?.id)} 
                   className="px-8 py-4 bg-indigo-600 text-white font-black text-xs rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all active:scale-95 whitespace-nowrap uppercase tracking-widest"
                 >
                   Approve & Grant Access
                 </button>
              </div>
           ))}
        </div>
      </div>

      <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-start gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl font-black">!</div>
          <div className="space-y-1">
             <h4 className="font-black text-amber-900 leading-none">Automated Returns Enabled</h4>
             <p className="text-sm text-amber-700 font-medium">Students can now return books directly from their history page. You no longer need to verify returns manually.</p>
          </div>
      </div>
    </div>
  );
};

export default IssueBook;
