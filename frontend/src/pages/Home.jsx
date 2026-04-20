import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);



  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-primary-200 selection:text-primary-900 flex flex-col">
      {/* Navigation */}
      <nav className="fixed w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-3">
              <ShieldCheck className="text-sky-400 w-10 h-10" />
              <span className="font-black text-4xl tracking-tighter text-black">SmartNotice</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/login" 
                className="bg-black hover:bg-slate-800 text-white font-black px-8 py-3 rounded-full shadow-xl transition-all hover:-translate-y-0.5 active:scale-95"
              >
                Sign In
              </Link>
            </div>

            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-600 hover:text-primary-600 transition-colors"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-4 shadow-xl"
          >
            <hr className="border-slate-100 mt-2" />
            <div className="flex flex-col space-y-3 pt-2">
              <Link to="/login" className="text-center font-black text-white bg-black py-4 rounded-xl shadow-xl">Sign In</Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary-400/20 blur-[120px] mix-blend-multiply" />
          <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[120px] mix-blend-multiply" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >

            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8">
              A centralized platform for <br className="hidden md:block"/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-500">
                seamless communication.
              </span>
            </h1>
            
            <p className="text-xl text-black mb-10 leading-relaxed font-bold">
              Efficient notice management for your institution.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/login"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black hover:bg-slate-800 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-2xl transition-all hover:-translate-y-1 active:scale-95 group"
              >
                Sign into Dashboard
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </motion.div>

          {/* Hero Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-20 mx-auto w-full max-w-5xl rounded-3xl border border-slate-200/60 bg-white/50 backdrop-blur-xl p-2 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white/95 pointer-events-none z-10 hidden lg:block" />
            <div className="bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex flex-col h-[400px] lg:h-[600px] relative">
              {/* Fake Browser Header */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="mx-auto bg-white rounded-md px-32 py-1 border border-slate-200 hidden sm:block">
                  <div className="w-32 h-2 bg-slate-100 rounded-full" />
                </div>
              </div>
              
              {/* Fake Dashboard Content */}
              <div className="flex flex-1 overflow-hidden pointer-events-none select-none">
                <div className="w-64 border-r border-slate-200 bg-white p-4 hidden md:block">
                  <div className="w-full h-8 bg-slate-100 rounded-lg mb-8" />
                  <div className="space-y-4">
                    <div className="w-3/4 h-4 bg-primary-100 rounded" />
                    <div className="w-1/2 h-4 bg-slate-100 rounded" />
                    <div className="w-2/3 h-4 bg-slate-100 rounded" />
                    <div className="w-3/4 h-4 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="flex-1 p-8 bg-slate-50/50">
                   <div className="flex justify-between items-center mb-8">
                     <div className="w-1/3 h-8 bg-slate-200 rounded-lg" />
                     <div className="w-12 h-12 bg-white rounded-full border border-slate-200" />
                   </div>
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     <div className="lg:col-span-2 space-y-4">
                       {[1, 2, 3].map(i => (
                         <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                           <div className="w-1/4 h-4 bg-primary-100 rounded mb-4" />
                           <div className="w-full h-6 bg-slate-100 rounded mb-2" />
                           <div className="w-5/6 h-6 bg-slate-100 rounded" />
                         </div>
                       ))}
                     </div>
                     <div className="space-y-4 hidden lg:block">
                       <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-64">
                         <div className="w-1/2 h-5 bg-slate-200 rounded mb-6" />
                         <div className="space-y-3">
                           {[1, 2, 3, 4].map(i => (
                              <div key={i} className="flex gap-3 items-center">
                                <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0" />
                                <div className="w-full h-3 bg-slate-100 rounded" />
                              </div>
                           ))}
                         </div>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>





      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-sky-400 w-9 h-9" />
            <span className="font-black text-3xl tracking-tighter text-black">SmartNotice</span>
          </div>
          <div className="text-black font-black">
            Smart Digital Notice Board &copy; 2026
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-black hover:text-primary-600 transition-colors font-black">Privacy</a>
            <a href="#" className="text-black hover:text-primary-600 transition-colors font-black">Terms</a>
            <a href="#" className="text-black hover:text-primary-600 transition-colors font-black">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
