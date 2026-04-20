import { useState, useEffect } from 'react';
import API from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  RotateCcw, 
  Trash,
  Clock, 
  Eye, 
  Calendar,
  User,
  ShieldCheck,
  Tag,
  AlertCircle,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DeletedNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeletedNotices();
  }, []);

  const fetchDeletedNotices = async () => {
    try {
      const { data } = await API.get('/notices/trash');
      setNotices(data);
    } catch (error) {
      toast.error('Failed to fetch trash');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      await API.patch(`/notices/${id}/restore`);
      setNotices(notices.filter(n => n._id !== id));
      toast.success('Notice restored successfully');
    } catch (error) {
      toast.error('Failed to restore notice');
    }
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm('WARNING: This action is permanent and cannot be undone. Delete forever?')) return;
    
    try {
      await API.delete(`/notices/${id}/permanent`);
      setNotices(notices.filter(n => n._id !== id));
      toast.success('Notice permanently removed');
    } catch (error) {
      toast.error('Failed to delete notice');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="animate-spin h-14 w-14 text-primary-600 mb-4" />
        <p className="text-black font-black animate-pulse">Accessing archives...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10 border-b border-slate-100 pb-8 flex justify-between items-end">
        <div className="flex items-center gap-4 text-left">
          <ShieldCheck size={32} className="text-sky-400 shrink-0" strokeWidth={2.5} />
          <div>
            <h1 className="text-4xl font-black text-black tracking-tight">Recycle Bin</h1>
            <p className="text-black mt-2 text-lg font-bold">Manage previously deleted institutional communications.</p>
          </div>
        </div>
        <div className="bg-black px-6 py-2 rounded-2xl shadow-xl flex items-center gap-3">
          <Trash size={20} className="text-sky-400" />
          <span className="text-white font-black text-xl">{notices.length}</span>
          <span className="text-sky-400/80 font-bold text-[10px] uppercase tracking-widest text-center">Archived</span>
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
                  <div className="flex items-center justify-between mb-6 text-black">
                     <div className="flex items-center gap-2">
                        <Clock size={14} className="text-sky-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                           Deleted {new Date(notice.deletedAt).toLocaleDateString()}
                        </span>
                     </div>
                     <Tag size={16} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-black mb-3 leading-snug">{notice.title}</h3>
                  <p className="text-black text-sm mb-6 line-clamp-3 leading-relaxed font-bold opacity-70">{notice.description}</p>
                  
                  <div className="flex flex-col gap-4 mb-8 bg-slate-50 p-4 rounded-2xl">
                     <div className="flex items-center text-xs font-black text-black">
                        <User size={14} className="mr-2 text-sky-400" /> 
                        <span className="opacity-60 mr-1.5">Created by:</span> {notice.createdBy?.name || 'Staff User'}
                     </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs font-black text-black">
                           <Calendar size={14} className="mr-2 text-sky-400" /> {new Date(notice.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-tighter bg-white px-2 py-1 rounded-md border border-slate-100 text-black">{notice.category}</div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 font-black">
                     <button 
                       onClick={() => handleRestore(notice._id)}
                       className="flex items-center justify-center gap-2 py-3 bg-black text-white text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                     >
                        <RotateCcw size={14} /> Restore
                     </button>
                     <button 
                       onClick={() => handlePermanentDelete(notice._id)}
                       className="flex items-center justify-center gap-2 py-3 border border-red-100 text-red-600 text-[10px] uppercase tracking-widest rounded-xl hover:bg-red-50 transition-all font-black"
                     >
                        <Trash2 size={14} /> Purge
                     </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-inner">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
             <Trash size={48} />
          </div>
          <h2 className="text-3xl font-black text-black mb-2">Trash is Empty</h2>
          <p className="text-black text-lg font-bold opacity-60">No deleted notices found in the archives.</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-8 px-8 py-3 bg-black text-white rounded-2xl font-black text-sm shadow-xl hover:bg-slate-800 transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default DeletedNotices;
