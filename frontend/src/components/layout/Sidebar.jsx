import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  CheckCircle, 
  PlusCircle, 
  Info,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen }) => {
  const { userInfo, logout } = useAuth();
  const role = userInfo?.role;

  const links = [
    { name: 'Dashboard', path: `/${role.toLowerCase()}/dashboard`, icon: <LayoutDashboard size={20} />, roles: ['Admin', 'Staff', 'Student'] },
    { name: 'All Notices', path: '/notices', icon: <FileText size={20} />, roles: ['Admin', 'Staff', 'Student'] },
    { name: 'Pending Approvals', path: '/admin/approvals', icon: <CheckCircle size={20} />, roles: ['Admin'] },
    { name: 'Manage Users', path: '/admin/users', icon: <Users size={20} />, roles: ['Admin'] },
    { name: 'Create Notice', path: '/staff/create-notice', icon: <PlusCircle size={20} />, roles: ['Admin', 'Staff'] },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-20 flex-col flex-shrink-0 transition-all duration-300 pt-16 h-full bg-white border-r border-slate-100 lg:flex ${
        isOpen ? 'w-72' : 'hidden'
      }`}
    >
      <div className="flex flex-col flex-1 min-h-0 pt-0 bg-white">
        <div className="flex flex-col flex-1 pt-8 pb-4 overflow-y-auto">
          <div className="flex-1 px-4 space-y-2 bg-white">
            <p className="text-[10px] font-bold text-black uppercase tracking-widest px-3 mb-4">Main Navigation</p>
            <ul className="space-y-1.5">
              {links
                .filter((link) => link.roles.includes(role))
                .map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-sm font-black rounded-2xl transition-all duration-200 group ${
                          isActive
                            ? 'bg-black text-white shadow-xl translate-x-1 font-black'
                            : 'text-black hover:bg-slate-100'
                        }`
                      }
                    >
                      <span className="transition-transform group-hover:scale-110">{link.icon}</span>
                      <span className="ml-3.5 tracking-tight">{link.name}</span>
                    </NavLink>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div className="p-6 border-t border-slate-50">
          <button
            onClick={logout}
            className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-red-600 bg-red-50 rounded-2xl hover:bg-red-100 transition-all group"
          >
            <LogOut size={18} className="mr-3 group-hover:-translate-x-0.5 transition-transform" /> Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
