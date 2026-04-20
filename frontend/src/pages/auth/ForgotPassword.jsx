import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import { Mail, Loader2, ShieldCheck, ChevronRight, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: Reset
  const [loading, setLoading] = useState(false);
  const [demoPin, setDemoPin] = useState('');

  const handleRequestPin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Diagnostic check
      await API.get('/auth/test').then(r => console.log('Auth check:', r.data));
      
      const { data } = await API.post('/auth/forgot-password', { email });
      setDemoPin(data.demoPin);
      toast.success('Reset PIN generated!');
      setStep(2);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error('Request PIN Error:', error);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/reset-password', { email, pin, newPassword });
      toast.success('Password reset successfully!');
      window.location.href = '/login';
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white p-10 rounded-[2.5rem] shadow-premium border border-slate-100">
          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-600">
                <KeyRound size={32} />
            </div>
            <h2 className="text-3xl font-black text-black mb-2">Password Recovery</h2>
            <p className="text-slate-500 font-medium">
              {step === 1 ? 'Enter your email to receive a reset PIN' : 'Enter the PIN and your new password'}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleRequestPin} className="space-y-6">
              <div>
                <label className="block text-sm font-black text-black mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                    placeholder="name@institution.edu"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-black text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Request Reset PIN <ChevronRight size={20}/></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              {demoPin && (
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl mb-6">
                   <p className="text-amber-800 text-xs font-black uppercase tracking-widest mb-1">Demo Mode: Your PIN</p>
                   <p className="text-2xl font-black text-amber-900 tracking-[0.5em]">{demoPin}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-black text-black mb-2">6-Digit PIN</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="block w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-black text-center text-2xl tracking-[0.5em]"
                  placeholder="000000"
                />
              </div>
              <div>
                <label className="block text-sm font-black text-black mb-2">New Password</label>
                <input
                  type="password"
                  required
                  minlength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                  placeholder="At least 6 characters"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-black text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
              </button>
            </form>
          )}

          <div className="mt-10 text-center">
            <Link to="/login" className="text-primary-600 font-bold hover:underline underline-offset-4">
              Return to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
