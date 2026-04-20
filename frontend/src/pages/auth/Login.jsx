import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Loader2, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo.role === 'Admin') navigate('/admin/dashboard');
      else if (userInfo.role === 'Staff') navigate('/staff/dashboard');
      else navigate('/student/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side: Illustration & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-white relative overflow-hidden items-center justify-center border-r border-slate-100">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="h-full w-full" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z"></path>
          </svg>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-black p-12 max-w-lg text-center"
        >

          <div className="flex items-center gap-8 justify-center">
            <ShieldCheck size={96} className="text-sky-400 shrink-0" strokeWidth={2.5} />
            <h1 className="text-6xl font-black tracking-tighter text-left leading-none">
              Smart <br/>
              <span className="text-primary-600">Notice Board</span>
            </h1>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white p-10 rounded-3xl shadow-premium border border-slate-100">
            <div className="mb-10 text-center">

              <h2 className="text-3xl font-black text-black mb-2">Sign In</h2>
              <p className="text-slate-500">Access your role-based dashboard</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold text-black font-black mb-2">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-600">
                    <Mail size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
                    placeholder="name@institution.edu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black font-black mb-2">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-600">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500" />
                  <span className="text-slate-600">Remember me</span>
                </label>
                <Link to="/forgot-password" size={12} className="text-primary-600 font-bold hover:text-primary-700 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-5 px-6 bg-black text-white font-black rounded-2xl hover:bg-slate-800 shadow-2xl transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                  <>
                    Sign In <ChevronRight size={20} className="ml-2" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-500 font-medium">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-600 font-bold hover:underline">Create Account</Link>
              </p>
            </div>
          </div>
          <p className="mt-10 text-center text-black text-sm font-black">
             Smart Digital Notice Board &copy; 2026
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

