import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Home from './pages/Home';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import PendingApprovals from './pages/admin/PendingApprovals';
import DeletedNotices from './pages/admin/DeletedNotices';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import CreateNotice from './pages/staff/CreateNotice';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';

import { NotificationProvider } from './context/NotificationContext';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route element={<Layout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<ManageUsers />} />
                <Route path="/admin/approvals" element={<PendingApprovals />} />
                <Route path="/admin/trash" element={<DeletedNotices />} />
              </Route>
            </Route>

            {/* Staff Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Staff', 'Admin']} />}>
              <Route element={<Layout />}>
                <Route path="/staff/dashboard" element={<StaffDashboard />} />
                <Route path="/staff/create-notice" element={<CreateNotice />} />
              </Route>
            </Route>

            {/* Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Student', 'Staff', 'Admin']} />}>
              <Route element={<Layout />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/notices" element={<StudentDashboard />} />
              </Route>
            </Route>

            <Route path="/unauthorized" element={<div className="flex items-center justify-center h-screen">Access Denied</div>} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<div className="flex items-center justify-center h-screen">404 - Not Found</div>} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
