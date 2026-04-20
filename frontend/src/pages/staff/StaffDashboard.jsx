import { useState, useEffect } from 'react';
import API from '../../utils/api';
import { Plus, Eye, Edit, Trash2, Clock, CheckCircle, XCircle, FilePlus, Paperclip, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const StaffDashboard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyNotices();
  }, []);

  const fetchMyNotices = async () => {
    try {
      const { data } = await API.get('/notices');
      setNotices(data);
    } catch (error) {
      toast.error('Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await API.delete(`/notices/${id}`);
        setNotices(notices.filter(n => n._id !== id));
        toast.success('Notice deleted successfully');
      } catch (error) {
        toast.error('Failed to delete notice');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Approved': return <span className="bg-emerald-50 text-emerald-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-emerald-100 flex items-center w-fit gap-1.5"><CheckCircle size={12}/> Approved</span>;
      case 'Pending': return <span className="bg-amber-50 text-amber-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-amber-100 flex items-center w-fit gap-1.5"><Clock size={12}/> Pending Review</span>;
      case 'Rejected': return <span className="bg-rose-50 text-rose-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-rose-100 flex items-center w-fit gap-1.5"><XCircle size={12}/> Rejected</span>;
      default: return null;
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10 flex items-end justify-between border-b border-slate-100 pb-8">
        <div className="flex items-center gap-4 text-left">
          <ShieldCheck size={32} className="text-sky-400 shrink-0" strokeWidth={2.5} />
          <div>
            <h1 className="text-4xl font-black text-black tracking-tight">Staff Portal</h1>
            <p className="text-black mt-2 text-lg font-bold">Contribute to the institution with new updates.</p>
          </div>
        </div>
        <Link 
          to="/staff/create-notice" 
          className="bg-black text-white px-8 py-3.5 rounded-2xl flex items-center hover:bg-slate-800 transition-all font-black shadow-xl hover:-translate-y-1 active:scale-95"
        >
          <Plus size={20} className="mr-2" /> New Submission
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-premium border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-slate-700 font-black uppercase tracking-widest bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Title & Reference</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5">Expiry Date</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                   <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-600 border-r-4 border-slate-200 mx-auto"></div>
                   </td>
                </tr>
              ) : notices.length > 0 ? (
                notices.map((notice, idx) => (
                  <motion.tr 
                    key={notice._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6 font-bold text-slate-900">
                       <span className="block">{notice.title}</span>
                       <span className="text-[10px] text-slate-700 font-mono">#{notice._id.substring(18)}</span>
                    </td>
                    <td className="px-8 py-6">
                       <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-600 uppercase tracking-tight">{notice.category}</span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex justify-center">{getStatusBadge(notice.status)}</div>
                    </td>
                    <td className="px-8 py-6 font-medium text-slate-800">
                       {new Date(notice.expiryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {notice.attachmentUrl && (
                          <a 
                            href={`http://localhost:5000${notice.attachmentUrl}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2.5 text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all" 
                            title="View Attachment"
                          >
                            <Paperclip size={18} />
                          </a>
                        )}
                        <button className="p-2.5 text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all" title="View"><Eye size={18} /></button>
                        <button className="p-2.5 text-slate-700 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all" title="Edit"><Edit size={18} /></button>
                        {notice.status === 'Approved' && (
                          <button 
                            onClick={() => handleDelete(notice._id)}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md shadow-red-200 flex items-center gap-1.5 border-none font-black"
                            title="Delete Notice"
                          >
                            <Trash2 size={12} /> <span className="text-[9px] uppercase">Delete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-slate-700 italic font-medium">
                     <div className="mb-4 bg-slate-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto text-slate-200">
                        <FilePlus size={32} />
                     </div>
                     No submissions found. Start contributing today!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
