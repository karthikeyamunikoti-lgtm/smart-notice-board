import { useEffect, useState } from 'react';
import API from '../../utils/api';
import { io } from 'socket.io-client';
import { Search, Filter, Calendar, Tag, Download, Eye, AlertCircle, Trash2, Trash, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NoticeDetailModal from '../../components/modals/NoticeDetailModal';

const StudentDashboard = () => {
  const location = useLocation();
  const { userInfo } = useAuth();
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState(location.state?.filterStatus || 'All');
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchNotices();
    
    // Refresh notices in real-time when a new one is approved
    const socket = io('http://localhost:5000');
    socket.on('newNotice', () => {
      fetchNotices();
    });

    return () => socket.disconnect();
  }, []);

  const fetchNotices = async () => {
    try {
      const { data } = await API.get('/notices');
      setNotices(data);
    } catch (error) {
      toast.error('Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (notice) => {
    setSelectedNotice(notice);
    setIsModalOpen(true);
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          notice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All' || notice.category === category;
    
    let matchesStatus = true;
    if (statusFilter === 'Expired') {
      matchesStatus = new Date(notice.expiryDate) < new Date();
    } else if (statusFilter !== 'All') {
      matchesStatus = notice.status === statusFilter;
    }
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await API.patch(`/notices/${id}/status`, { status: newStatus });
      setNotices(notices.map(n => n._id === id ? { ...n, status: newStatus } : n));
      toast.success(`Notice ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice permanently?')) {
      try {
        await API.delete(`/notices/${id}`);
        setNotices(notices.filter(n => n._id !== id));
        toast.success('Notice deleted successfully');
      } catch (error) {
        toast.error('Failed to delete notice');
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <NoticeDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        notice={selectedNotice} 
        onDelete={handleDelete}
      />
      
      <div className="mb-10 md:flex md:items-end md:justify-between border-b border-slate-100 pb-8">
        <div className="flex items-center gap-4 text-left">
          <ShieldCheck size={32} className="text-sky-400 shrink-0" strokeWidth={2.5} />
          <div>
            <h1 className="text-4xl font-black text-black tracking-tight">
              {userInfo.role === 'Student' ? 'Student Hub' : 'Notice Repository'}
              {!loading && (
                <span className="ml-3 text-sm font-bold bg-slate-100 text-black px-3 py-1 rounded-full">
                  {notices.length} Total
                </span>
              )}
            </h1>
            <p className="text-black mt-2 text-lg font-bold">
              {userInfo.role === 'Student' ? 'Find everything you need to stay updated.' : 'Oversee and manage institutional communications.'}
            </p>
          </div>
        </div>
        <div className="hidden md:block">
           <div className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-slate-100 px-4 py-2 rounded-full">
              <Calendar size={16} /> {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
           </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl shadow-soft border border-white mb-10 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-700">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm font-medium"
            placeholder="Search for titles, topics, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-56">
          <select
            className="block w-full pl-4 pr-10 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm font-bold text-slate-700 appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Notices</option>
            <option value="Approved">Approved</option>
            {userInfo.role !== 'Student' && (
              <>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </>
            )}
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-primary-600 mb-4"></div>
          <p className="text-slate-800 font-bold animate-pulse">Fetching latest updates...</p>
        </div>
      ) : notices.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-inner">
          <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
             <AlertCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Notice Board Empty</h2>
          <p className="text-slate-800 font-medium italic">There are currently no approved notices to display.</p>
        </div>
      ) : filteredNotices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNotices.map((notice, idx) => (
            <motion.div 
              key={notice._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white rounded-[2rem] shadow-soft border border-slate-100 overflow-hidden hover:shadow-premium hover:-translate-y-2 transition-all duration-300"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getPriorityColor(notice.priority)}`}>
                      {notice.priority}
                    </span>
                    {userInfo.role !== 'Student' && (
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        notice.status === 'Approved' ? 'bg-green-100 text-green-600' : 
                        notice.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {notice.status}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    {userInfo?.role === 'Admin' && notice.status === 'Approved' && (
                      <button 
                        onClick={() => {
                          handleDelete(notice._id);
                          onClose();
                        }}
                        className="px-3 py-2 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 flex items-center gap-2 border-none"
                        title="Delete Notice Permanently"
                      >
                        <Trash2 size={14} /> <span className="text-[10px] uppercase">Delete</span>
                      </button>
                    )}
                    <div className="bg-slate-50 p-2 rounded-xl text-slate-700 group-hover:text-primary-600 transition-colors">
                      <Tag size={16} />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors mb-3 leading-snug">{notice.title}</h3>
                <p className="text-slate-800 text-sm mb-6 line-clamp-3 leading-relaxed font-medium">{notice.description}</p>
                
                <div className="flex items-center gap-4 mb-8 text-xs font-bold text-slate-700 bg-slate-50 p-4 rounded-2xl">
                   <div className="flex items-center"><Calendar size={14} className="mr-2" /> {new Date(notice.createdAt).toLocaleDateString()}</div>
                   <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                   <div className="flex items-center uppercase tracking-tighter">{notice.category}</div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleViewDetails(notice)}
                      className="flex-1 px-4 py-3 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-primary-600 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 group/btn"
                    >
                      <Eye size={16} className="group-hover/btn:scale-110 transition-transform" /> View Details
                    </button>
                    {notice.attachmentUrl && (
                      <a 
                        href={`http://localhost:5000${notice.attachmentUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-primary-600 transition-all"
                      >
                        <Download size={18} />
                      </a>
                    )}
                  </div>
                  
                  {userInfo.role === 'Admin' && notice.status === 'Pending' && (
                    <div className="flex gap-2 pt-2 border-t border-slate-50">
                      <button 
                        onClick={() => handleStatusUpdate(notice._id, 'Approved')}
                        className="flex-1 py-3 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-green-600 transition-all"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(notice._id, 'Rejected')}
                        className="flex-1 py-3 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-inner">
          <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
             <AlertCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No matching results</h2>
          <p className="text-slate-800 font-medium">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
