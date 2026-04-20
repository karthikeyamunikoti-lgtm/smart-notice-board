import { useState, useEffect } from 'react';
import API from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Download, 
  AlertCircle,
  Calendar,
  User,
  Tag,
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import NoticeDetailModal from '../../components/modals/NoticeDetailModal';

const PendingApprovals = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPendingNotices();
  }, []);

  const fetchPendingNotices = async () => {
    try {
      const { data } = await API.get('/notices');
      // Filter for only pending notices
      setNotices(data.filter(n => n.status === 'Pending'));
    } catch (error) {
      toast.error('Failed to fetch pending notices');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (notice) => {
    setSelectedNotice(notice);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await API.patch(`/notices/${id}/status`, { status: newStatus });
      setNotices(notices.filter(n => n._id !== id));
      toast.success(`Notice ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      toast.error('Failed to update status');
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-primary-600 mb-4"></div>
        <p className="text-slate-800 font-bold animate-pulse">Loading pending queue...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <NoticeDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        notice={selectedNotice} 
      />

      <div className="mb-10 border-b border-slate-100 pb-8 flex justify-between items-end">
        <div className="flex items-center gap-4 text-left">
          <ShieldCheck size={32} className="text-sky-400 shrink-0" strokeWidth={2.5} />
          <div>
            <h1 className="text-4xl font-black text-black tracking-tight">Pending Approvals</h1>
            <p className="text-black mt-2 text-lg font-bold">Review and authorize institutional communications.</p>
          </div>
        </div>
        <div className="bg-black px-6 py-2 rounded-2xl shadow-xl flex items-center gap-3">
          <Clock className="text-sky-400" size={20} />
          <span className="text-white font-black text-xl">{notices.length}</span>
          <span className="text-sky-400/80 font-bold text-[10px] uppercase tracking-widest">In Queue</span>
        </div>
      </div>

      {notices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {notices.map((notice, idx) => (
              <motion.div 
                key={notice._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
                className="group bg-white rounded-[2rem] shadow-soft border border-slate-100 overflow-hidden hover:shadow-premium transition-all duration-300"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getPriorityColor(notice.priority)}`}>
                      {notice.priority} Priority
                    </span>
                    <div className="bg-slate-50 p-2 rounded-xl text-slate-700">
                      <Tag size={16} />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug">{notice.title}</h3>
                  <p className="text-slate-800 text-sm mb-6 line-clamp-3 leading-relaxed font-medium">{notice.description}</p>
                  
                  <div className="flex flex-col gap-4 mb-8 bg-slate-50 p-4 rounded-2xl">
                     <div className="flex items-center text-xs font-bold text-slate-600">
                        <User size={14} className="mr-2 text-primary-500" /> 
                        <span className="text-slate-700 mr-1.5">Submitted by:</span> {notice.createdBy?.name || 'Staff User'}
                     </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs font-bold text-slate-700">
                           <Calendar size={14} className="mr-2" /> {new Date(notice.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-tighter bg-white px-2 py-1 rounded-md border border-slate-100">{notice.category}</div>
                     </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                       <button 
                         onClick={() => handlePreview(notice)}
                         className="flex-1 px-4 py-3 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                       >
                          <Eye size={16} /> Preview
                       </button>
                       {notice.attachmentUrl && (
                          <a 
                             href={`${BASE_URL}${notice.attachmentUrl}`} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="p-3 bg-white border border-slate-200 text-slate-900 rounded-xl hover:bg-slate-50 transition-all"
                          >
                             <Download size={18} />
                          </a>
                       )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-50">
                       <button 
                         onClick={() => handleStatusUpdate(notice._id, 'Approved')}
                         className="flex items-center justify-center gap-2 py-3.5 bg-green-500 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-green-600 shadow-lg shadow-green-100 transition-all hover:-translate-y-0.5"
                       >
                          <CheckCircle size={16} /> Approve
                       </button>
                       <button 
                         onClick={() => handleStatusUpdate(notice._id, 'Rejected')}
                         className="flex items-center justify-center gap-2 py-3.5 bg-red-500 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-red-600 shadow-lg shadow-red-100 transition-all hover:-translate-y-0.5"
                       >
                          <XCircle size={16} /> Reject
                       </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-inner">
          <div className="bg-primary-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-600">
             <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Queue Cleared</h2>
          <p className="text-slate-800 text-lg font-medium">All pending notices have been reviewed.</p>
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;
