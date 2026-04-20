import { LogOut, User, Bell, Menu, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';

const Navbar = ({ toggleSidebar }) => {
  const { userInfo, logout } = useAuth();
  const { notifications, clearAll, markAsRead } = useNotifications();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 fixed w-full z-30 top-0 transition-all duration-300">
      <div className="px-4 py-3 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-slate-600 rounded-xl cursor-pointer hover:text-primary-600 hover:bg-primary-50 transition-colors"
            >
              <Menu size={20} />
            </button>
            <a href="/" className="flex ml-2 md:mr-24 group">
              <div className="mr-3 group-hover:rotate-12 transition-transform">
                 <ShieldCheck size={24} className="text-sky-400" strokeWidth={2.5} />
              </div>
              <span className="self-center text-2xl font-black whitespace-nowrap text-black tracking-tight">
                Notice<span className="text-primary-600">Board</span>
              </span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfile(false);
                }}
                className="flex p-2 text-slate-900 font-bold hover:text-primary-600 hover:bg-primary-50 transition-all relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-12 z-50 w-80 md:w-96 bg-white border border-slate-100 rounded-2xl shadow-premium overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Notifications</p>
                      <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest mt-0.5">Recent Updates</p>
                    </div>
                    {notifications.length > 0 && (
                      <button 
                        onClick={clearAll}
                        className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-primary-100"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                    {notifications.length === 0 ? (
                      <div className="py-12 text-center">
                        <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                          <Bell size={24} />
                        </div>
                        <p className="text-slate-700 text-xs font-bold uppercase tracking-widest leading-loose">No new notifications</p>
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`px-5 py-4 border-b border-slate-50 flex gap-4 hover:bg-slate-50/50 transition-colors group cursor-pointer ${!notification.read ? 'bg-primary-50/20' : ''}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex-shrink-0 mt-1">
                             <div className={`w-2 h-2 rounded-full ${!notification.read ? 'bg-primary-600' : 'bg-slate-200'}`}></div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-900 mb-0.5 line-clamp-1">{notification.title}</p>
                            <p className="text-xs font-medium text-slate-800 line-clamp-2 leading-relaxed mb-2">{notification.message}</p>
                            <p className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">
                              {new Date(notification.time).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-3 bg-slate-50 border-t border-slate-100">
                      <button className="w-full text-center py-2 text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-slate-600 transition-colors">
                        Close Notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center ml-3 relative">
              <button
                onClick={() => {
                  setShowProfile(!showProfile);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-slate-100 transition-all"
              >
                <div className="flex items-center justify-center text-sky-400">
                  <ShieldCheck size={20} className="shrink-0" strokeWidth={2.5} />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-black text-black">{userInfo?.name || 'User'}</p>
                  <p className="text-[10px] text-primary-700 uppercase font-black tracking-tighter">{userInfo?.role || 'Role'}</p>
                </div>
              </button>
              {showProfile && (
                <div className="absolute right-0 top-12 z-50 w-56 bg-white border border-slate-100 rounded-2xl shadow-premium overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/50">
                    <p className="text-sm font-bold text-slate-900">{userInfo?.name}</p>
                    <p className="text-xs font-medium text-slate-800 truncate mt-0.5">{userInfo?.email}</p>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={logout}
                      className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
                    >
                      <LogOut size={16} className="mr-3 group-hover:-translate-x-0.5 transition-transform" /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
