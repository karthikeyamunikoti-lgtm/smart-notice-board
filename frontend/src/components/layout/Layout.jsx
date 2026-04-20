import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex pt-16 overflow-hidden bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} />
        <main
          className={`relative w-full h-full overflow-y-auto bg-slate-50 min-h-screen transition-all duration-300 ${
            isSidebarOpen ? 'lg:ml-72' : ''
          }`}
        >
          <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
