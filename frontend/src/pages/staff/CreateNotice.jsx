import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import { FilePlus, Send, Calendar, Tag, AlertCircle, Upload, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const CreateNotice = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    priority: 'Medium',
    expiryDate: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('priority', formData.priority);
    data.append('expiryDate', formData.expiryDate);
    if (file) data.append('attachment', file);

    try {
      await API.post('/notices', data);
      toast.success('Notice created successfully!');
      navigate(-1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create notice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto pb-20"
    >
      <div className="mb-10 text-center flex flex-col items-center">
        <ShieldCheck size={48} className="text-sky-400 mb-4" strokeWidth={2.5} />
        <h1 className="text-4xl font-black text-black tracking-tight">Create Announcement</h1>
        <p className="text-black mt-2 text-lg font-bold">Broadcast your message to the institution.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-premium border border-slate-100 p-10 space-y-8">
        <div className="grid grid-cols-1 gap-8">
          <div>
            <label className="block text-xs font-black text-black uppercase tracking-widest mb-3">Notice Title</label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm font-black text-black"
              placeholder="e.g. Annual Sports Meet 2026"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-black uppercase tracking-widest mb-3">Notice Description</label>
            <textarea
              name="description"
              required
              rows="5"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm font-black text-black leading-relaxed"
              placeholder="Provide detailed information for the students and staff..."
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-black text-black uppercase tracking-widest mb-3">Category</label>
            <div className="relative">
               <select
                 name="category"
                 className="w-full pl-6 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm font-bold text-slate-700 appearance-none"
                 value={formData.category}
                 onChange={handleChange}
               >
                 <option value="General">General</option>
                 <option value="Academic">Academic</option>
                 <option value="Exam">Exam</option>
                 <option value="Event">Event</option>
                 <option value="Holiday">Holiday</option>
               </select>
               <Tag size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-black uppercase tracking-widest mb-3">Priority</label>
            <div className="relative">
               <select
                 name="priority"
                 className="w-full pl-6 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm font-bold text-slate-700 appearance-none"
                 value={formData.priority}
                 onChange={handleChange}
               >
                 <option value="Low">Low</option>
                 <option value="Medium">Medium</option>
                 <option value="High">High</option>
               </select>
               <AlertCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-black uppercase tracking-widest mb-3">Expiry Date</label>
            <div className="relative">
               <input
                 type="date"
                 name="expiryDate"
                 required
                 min={new Date().toISOString().split('T')[0]}
                 className="w-full pl-6 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm font-black text-black"
                 value={formData.expiryDate}
                 onChange={handleChange}
               />
               <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none" />
            </div>
          </div>
        </div>

        <div>
           <label className="block text-xs font-black text-black uppercase tracking-widest mb-3">Digital Attachment</label>
           <div 
             onClick={() => document.getElementById('file-upload').click()}
             className="mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-slate-200 border-dashed rounded-[2rem] bg-slate-50/50 hover:bg-slate-50 hover:border-primary-400 transition-all cursor-pointer group"
           >
             <div className="space-y-4 text-center">
               <div className="bg-white p-4 rounded-2xl shadow-sm text-slate-700 group-hover:text-primary-600 transition-colors inline-block">
                  <Upload size={32} />
               </div>
               <div className="flex flex-col text-sm text-slate-600">
                 <label className="relative cursor-pointer font-bold text-primary-600 hover:text-primary-500 focus-within:outline-none">
                   <span>Browse internal storage</span>
                   <input 
                     id="file-upload"
                     type="file" 
                     className="sr-only" 
                     onChange={handleFileChange} 
                   />
                 </label>
                 <p className="mt-1 font-medium text-slate-700 text-xs">PNG, JPG or PDF (Max 10MB)</p>
               </div>
               {file && (
                 <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-100 flex items-center justify-center gap-2">
                    <Send size={14} /> Ready: {file.name}
                 </div>
               )}
             </div>
           </div>
        </div>



        <div className="pt-6 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] bg-black text-white py-4 px-6 rounded-2xl font-black hover:bg-slate-800 shadow-xl transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5 mr-3" /> : <Send size={20} className="mr-3" />}
            Publish Notice
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-4 border border-slate-200 rounded-2xl text-slate-900 hover:bg-slate-50 font-black transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateNotice;
