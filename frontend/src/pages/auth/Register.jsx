import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, Loader2, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, 'Student');
      toast.success('Registration successful! Welcome to the dashboard.');
      navigate('/student/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white p-10 rounded-[2.5rem] shadow-premium border border-slate-100">
          <div className="mb-10 text-center">

            <div className="flex items-center gap-4 justify-center mb-6">
               <ShieldCheck size={48} className="text-sky-400 shrink-0" strokeWidth={2.5} />
               <h2 className="text-3xl font-black text-slate-900 tracking-tight">Join as Student</h2>
            </div>
            <p className="text-slate-500 font-medium text-center">Create your institutional account</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-black text-black font-black uppercase tracking-widest mb-3">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm font-bold"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-black font-black uppercase tracking-widest mb-3">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm font-bold"
                  placeholder="john@institution.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-black font-black uppercase tracking-widest mb-3">Create Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm font-bold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-black font-black uppercase tracking-widest mb-3">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600">
                  <ShieldCheck size={18} />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm font-bold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-5 px-6 bg-black text-white font-black rounded-2xl hover:bg-slate-800 shadow-2xl transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                <>
                  Register Now <ChevronRight size={20} className="ml-2" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-black font-black">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-black hover:underline">Sign In</Link>
          </p>
          <p className="mt-10 text-center text-black text-sm font-black">
             Smart Digital Notice Board &copy; 2026
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
