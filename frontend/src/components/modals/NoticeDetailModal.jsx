import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, AlertCircle, Download, User, Info, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NoticeDetailModal = ({ isOpen, onClose, notice, onDelete }) => {
  const { userInfo } = useAuth();
  if (!notice) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[2.5rem] shadow-premium z-[1000] overflow-hidden"
          >
            <div className="relative p-8 md:p-10">
              <button
                onClick={onClose}
                className="absolute right-6 top-6 p-2 rounded-xl text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-3 mb-8">
                <div className="bg-primary-50 p-3 rounded-2xl text-primary-600">
                  <Info size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">{notice.title}</h2>
                  <p className="text-slate-500 font-medium">Detailed Announcement</p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 align-middle">
                    <Tag size={12} /> Category
                  </span>
                  <span className="text-sm font-bold text-slate-900 truncate">{notice.category}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 align-middle">
                    <AlertCircle size={12} /> Priority
                  </span>
                  <span className="text-sm font-bold text-slate-900 truncate">{notice.priority}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 align-middle">
                    <Calendar size={12} /> Posted
                  </span>
                  <span className="text-sm font-bold text-slate-900 truncate">{new Date(notice.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 align-middle">
                    <Calendar size={12} /> Expires
                  </span>
                  <span className="text-sm font-bold text-slate-900 truncate">{new Date(notice.expiryDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mb-10">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Description</label>
                <div className="bg-slate-50/50 p-6 rounded-[1.5rem] border border-slate-100 min-h-[150px]">
                  <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{notice.description}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{notice.createdBy?.name || 'Staff User'}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter italic">Authorized Personnel</p>
                  </div>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                   {notice.attachmentUrl && (
                      <a 
                        href={`http://localhost:5000${notice.attachmentUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none px-6 py-3.5 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                      >
                         <Download size={16} /> Attachment
                      </a>
                   )}
                   {userInfo?.role === 'Admin' && notice.status === 'Approved' && onDelete && (
                      <button 
                        onClick={() => {
                          onDelete(notice._id);
                          onClose();
                        }}
                        className="px-6 py-3.5 bg-red-600 text-white text-xs font-black rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-200"
                      >
                         <Trash2 size={16} /> Delete Notice
                      </button>
                    )}
                   <button 
                     onClick={onClose}
                     className="flex-1 sm:flex-none px-6 py-3.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all"
                   >
                     Close View
                   </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NoticeDetailModal;
