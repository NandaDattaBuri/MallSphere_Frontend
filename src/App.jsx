import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import StallOwnerLogin from './pages/StallOwnerLogin';
import StallOwnerRegister from './pages/StallOwnerRegister';

import VendorLogin from './pages/VendorLogin';
import VendorRegister from './pages/VendorRegister';
import VendorOTPVerificationPage from './pages/VendorOTPVerificationPage';
import VendorForgotPassword from './pages/VendorForgotPassword';
import VendorDashboard from './pages/VendorDashboard';
import VendorProfile from './pages/VendorProfile'

import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AuthModal from './components/superadmin/AuthModal';

import RoleSelector from './components/RoleSelector';

import './index.css';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Routes>
          <Route path="/" element={<RoleSelector />} />
          <Route path="/stall-owner/login" element={<StallOwnerLogin />} />
          <Route path="/stall-owner/register" element={<StallOwnerRegister />} />

          <Route path="/vendor/login" element={<VendorLogin />} />
          <Route path="/vendor/register" element={<VendorRegister />} /> 
          <Route path="/vendor/verify-otp" element={<VendorOTPVerificationPage />} />
          <Route path="/vendor/forgot-password" element={<VendorForgotPassword />} />
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/profile" element={<VendorProfile />} />
          
          <Route path="/superadmin/login" element={<AuthModal />} />
          <Route path="/superadmin/register" element={<AuthModal />} />
          <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />



          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;