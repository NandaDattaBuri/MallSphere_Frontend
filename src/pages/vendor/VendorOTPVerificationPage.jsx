import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import OtpVerification from '../../components/auth/OtpVerification';
import { vendorApi } from '../../hooks/vendorApi';
import { CheckCircle } from 'lucide-react';

const VendorOTPVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [vendorLicenseNumber, setVendorLicenseNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  useEffect(() => {
    // Get data from navigation state or localStorage
    if (location.state) {
      setEmail(location.state.email || '');
      setVendorLicenseNumber(location.state.vendorLicenseNumber || '');
    } else {
      // Try to get from localStorage
      const savedVerification = localStorage.getItem('pendingVendorVerification');
      if (savedVerification) {
        const data = JSON.parse(savedVerification);
        setEmail(data.email || '');
        setVendorLicenseNumber(data.vendorLicenseNumber || '');
      } else {
        // No verification data found, redirect to register
        navigate('/vendor/register');
      }
    }
  }, [location.state, navigate]);

  const handleVerify = async (email, otp) => {
    setIsLoading(true);
    
    try {
      console.log('Verifying OTP for vendor:', { email, vendorLicenseNumber });
      
      const response = await vendorApi.verifyOtp(email, otp, vendorLicenseNumber);
      console.log('OTP verification response:', response);
      
      // Set verification success
      setVerificationSuccess(true);
      
      // Clear pending verification data
      localStorage.removeItem('pendingVendorVerification');
      
      // If API returns token on verification, store it
      if (response.accessToken) {
        localStorage.setItem('vendorAccessToken', response.accessToken);
      }
      
      if (response.user || response.vendor) {
        localStorage.setItem('vendorData', JSON.stringify(response.user || response.vendor));
      }
      
      // Show success message for 2 seconds, then redirect to login
      setTimeout(() => {
        navigate('/vendor/login', {
          state: {
            message: 'Email verified successfully! You can now login to your account.',
            verifiedEmail: email,
            verified: true
          }
        });
      }, 2000);
      
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw error; // Pass error back to OTP component
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async (email) => {
    try {
      console.log('Resending OTP to:', email);
      
      const response = await vendorApi.resendOtp(email, vendorLicenseNumber);
      console.log('Resend OTP response:', response);
      
      alert('New OTP has been sent to your email.');
      
    } catch (error) {
      console.error('Resend OTP failed:', error);
      alert('Failed to resend OTP. Please try again.');
      throw error;
    }
  };

  const handleBack = () => {
    navigate('/vendor/register');
  };

  return (
    <AuthLayout type="verify" role="vendor" backLink="/vendor/register">
      {verificationSuccess ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Verification Successful!
          </h2>
          <p className="text-slate-600 mb-6">
            Your email has been verified. Redirecting to login page...
          </p>
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : (
        <OtpVerification
          email={email}
          onVerify={handleVerify}
          onResend={handleResend}
          onBack={handleBack}
          isLoading={isLoading}
          title="Verify Vendor Account"
          subtitle="We've sent a 6-digit OTP to verify your vendor account"
        />
      )}
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Check your spam folder if you don't see the OTP email. 
              After verification, you'll be redirected to login.
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VendorOTPVerificationPage;