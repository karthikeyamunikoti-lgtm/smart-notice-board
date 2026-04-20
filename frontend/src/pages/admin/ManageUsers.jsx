import { useState, useEffect } from 'react';
import API from '../../utils/api';
import { Users, Mail, Shield, Trash2, Loader2, AlertCircle, ChevronDown, Activity, ShieldCheck, Key, Eye, EyeOff, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    setUpdatingId(id);
    try {
      await API.patch(`/users/${id}/role`, { role: newRole });
      setUsers(users.map(user => user._id === id ? { ...user, role: newRole } : user));
      toast.success(`Role updated to ${newRole}`);
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      console.error('Role Update Error:', error);
      toast.error(`Update failed: ${msg}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (user) => {
    if (user.role === 'Admin') return toast.error('Cannot delete an admin');
    if (!window.confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) return;

    try {
      await API.delete(`/users/${user._id}`);
      setUsers(users.filter(u => u._id !== user._id));
      toast.success('User removed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Deletion failed');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="animate-spin h-14 w-14 text-primary-600 mb-4" />
        <p className="text-slate-800 font-bold animate-pulse">Loading directory...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10 border-b border-slate-100 pb-8 flex items-center gap-4">
        <ShieldCheck size={32} className="text-sky-400 shrink-0" strokeWidth={2.5} />
        <div>
          <h1 className="text-4xl font-black text-black tracking-tight">Identity & Access</h1>
          <p className="text-black mt-2 text-lg font-black">Manage institutional roles and monitor account activity.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-soft border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-black uppercase tracking-widest">User Profile</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-700 uppercase tracking-widest">Current Role</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-700 uppercase tracking-widest text-center">Activity</th>
                <th className="px-8 py-6 text-[10px] font-black text-black uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              <AnimatePresence>
                {users.map((user) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="hover:bg-slate-50/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 font-black text-lg border border-primary-100 group-hover:scale-110 transition-transform">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-slate-900 font-bold text-base">{user.name}</p>
                          <p className="text-black font-bold">
                            <Mail size={12} /> {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {user.role === 'Admin' ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-full">
                          <Shield size={10} /> Admin
                        </span>
                      ) : (
                        <div className="relative inline-block w-40">
                          <select
                            className="w-full bg-slate-100 border-none rounded-xl px-4 py-2 text-xs font-black text-black cursor-pointer appearance-none focus:ring-2 focus:ring-primary-500"
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            disabled={updatingId === user._id}
                          >
                            <option value="Staff">Staff Member</option>
                            <option value="Student">Student</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none" size={14} />
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 text-slate-700 font-bold">
                          <Activity size={16} className="text-primary-500" />
                          <span>{user.noticeCount} Notices</span>
                        </div>
                        <p className="text-[10px] text-black font-black uppercase mt-1">Total Created</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className={`p-3 rounded-2xl transition-all ${user.role === 'Admin' ? 'text-slate-200 cursor-not-allowed' : 'text-slate-700 hover:text-red-600 hover:bg-red-50'}`}
                        disabled={user.role === 'Admin'}
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 mt-10">
          <AlertCircle className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-800 font-bold">No institutional accounts found.</p>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;

