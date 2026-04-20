import { useEffect, useState } from 'react';
import API from '../../utils/api';
import { Users, FileText, CheckCircle, Clock, ShieldCheck, Trash } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch stats
    API.get('notices/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error('Stats fetch error:', err?.response?.data || err.message));
  }, []);

  const cards = [
    { title: 'Total Notices', value: stats?.totalNotices || 0, icon: <FileText className="text-blue-600" />, color: 'bg-blue-50', path: '/notices', filter: 'All' },
    { title: 'Approved', value: stats?.approvedNotices || 0, icon: <CheckCircle className="text-green-600" />, color: 'bg-green-50', path: '/notices', filter: 'Approved' },
    { title: 'Pending', value: stats?.pendingNotices || 0, icon: <Clock className="text-yellow-600" />, color: 'bg-yellow-50', path: '/admin/approvals', filter: 'Pending' },
    { title: 'Expired', value: stats?.expiredNotices || 0, icon: <Clock className="text-red-600" />, color: 'bg-red-50', path: '/notices', filter: 'Expired' },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-8 gap-4">
        <div className="flex items-center gap-4">
          <ShieldCheck size={32} className="text-sky-400 shrink-0" strokeWidth={2.5} />
          <div>
            <h1 className="text-4xl font-black text-black tracking-tight">System Oversight</h1>
            <p className="text-black mt-2 text-lg font-bold">Monitoring notice distribution and approval workflows.</p>
          </div>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={() => navigate('/admin/users')}
             className="px-5 py-2.5 bg-black text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2"
           >
              <Users size={18} /> Manage Users
           </button>
           <button 
             onClick={() => navigate('/admin/approvals')}
             className="px-5 py-2.5 bg-slate-700 text-white font-black rounded-2xl shadow shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2"
           >
              <CheckCircle size={18} /> Review Pendings
           </button>
           <button 
             onClick={() => navigate('/admin/trash')}
             className="px-5 py-2.5 bg-white border border-slate-200 text-black font-black rounded-2xl shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
           >
              <Trash size={18} /> Recycle Bin
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {cards.map((card, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => navigate(card.path, { state: { filterStatus: card.filter } })}
            className={`p-8 rounded-[2rem] border border-white shadow-soft hover:shadow-premium transition-all duration-300 cursor-pointer ${card.color}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1">{card.title}</p>
                <p className="text-4xl font-black text-black leading-tight">{card.value}</p>
              </div>
              <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm">
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
