import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import StallOwnerLogin from './pages/seller/StallOwnerLogin';
import StallOwnerRegister from './pages/seller/StallOwnerRegister';
import StallOwnerDashboard from './pages/seller/StallOwnerDashboard';
import StallOwnerOtpVerification from './pages/seller/StallOwnerOtpVerification';
import StallOwnerForgotPassword from './pages/seller/StallOwnerForgotPassword';

import VendorLogin from './pages/vendor/VendorLogin';
import VendorRegister from './pages/vendor/VendorRegister';
import VendorOTPVerificationPage from './pages/vendor/VendorOTPVerificationPage';
import VendorForgotPassword from './pages/vendor/VendorForgotPassword';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorProfile from './pages/vendor/VendorProfile'

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
          <Route path="/stall-owner/dashboard" element={<StallOwnerDashboard />} />
          <Route path="/stall-owner/verify-otp" element={<StallOwnerOtpVerification />} />
          <Route path="/stall-owner/forgot-password" element={<StallOwnerForgotPassword />} />


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