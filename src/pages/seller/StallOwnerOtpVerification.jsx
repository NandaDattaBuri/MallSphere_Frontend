import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import OtpVerification from '../../components/auth/OtpVerification';
import { sellerApi } from '../../hooks/sellerApi';
import { CheckCircle, AlertCircle } from 'lucide-react';

const StallOwnerOtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);

  useEffect(() => {
    // Get email from navigation state or localStorage
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      // Try to get from localStorage
      const pendingVerification = localStorage.getItem('pendingStallOwnerVerification');
      if (pendingVerification) {
        try {
          const data = JSON.parse(pendingVerification);
          if (data.email) {
            setEmail(data.email);
            
            // Check if OTP might be expired (if timestamp is stored)
            if (data.timestamp) {
              const expiryTime = new Date(data.timestamp).getTime() + (10 * 60 * 1000); // 10 minutes
              if (Date.now() > expiryTime) {
                setOtpExpired(true);
                setError('Your verification code has expired. Please request a new one.');
              }
            }
          } else {
            navigate('/stall-owner/register');
          }
        } catch (error) {
          console.error('Error parsing verification data:', error);
          navigate('/stall-owner/register');
        }
      } else {
        navigate('/stall-owner/register');
      }
    }
  }, [location.state, navigate]);

  useEffect(() => {
    // Handle resend cooldown timer
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async (email, otp) => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Verifying OTP for stall owner:', { email });
      
      const response = await sellerApi.verifyOtp(email, otp);
      console.log('OTP verification response:', response);
      
      setVerificationSuccess(true);
      localStorage.removeItem('pendingStallOwnerVerification');
      
      setTimeout(() => {
        navigate('/stall-owner/login', {
          state: {
            message: 'Email verified successfully! You can now login to your stall owner account.',
            verifiedEmail: email,
            verified: true
          }
        });
      }, 2000);
      
    } catch (error) {
      console.error('OTP verification failed:', error);
      
      // Handle specific error cases
      if (error.message.includes('expired')) {
        setError('Your verification code has expired. Please request a new one.');
        setOtpExpired(true);
        throw new Error('expired');
      } else if (error.message.includes('invalid')) {
        setError('Invalid verification code. Please check and try again.');
        throw new Error('invalid');
      } else {
        setError(error.message || 'OTP verification failed. Please try again.');
        throw error;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async (email) => {
    setIsResending(true);
    setError('');
    
    try {
      console.log('Resending OTP to stall owner:', email);
      
      const response = await sellerApi.resendOtp(email);
      console.log('Resend OTP response:', response);
      
      // Reset expired state
      setOtpExpired(false);
      
      // Start cooldown (60 seconds)
      setResendCooldown(60);
      
      // Update localStorage with new timestamp
      localStorage.setItem('pendingStallOwnerVerification', JSON.stringify({
        email,
        timestamp: new Date().toISOString()
      }));
      
      // Show success message
      alert('A new verification code has been sent to your email address. Please check your inbox.');
      
    } catch (error) {
      console.error('Resend OTP failed:', error);
      
      if (error.message.includes('cooldown')) {
        setError('Please wait before requesting another code.');
      } else {
        setError(error.message || 'Failed to resend verification code. Please try again.');
      }
      throw error;
    } finally {
      setIsResending(false);
    }
  };

  const handleBack = () => {
    navigate('/stall-owner/register');
  };

  // Show error message with option to resend
  if (otpExpired) {
    return (
      <AuthLayout 
        type="verify" 
        role="stall-owner" 
        backLink="/stall-owner/register"
        title="Stall Owner Verification"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Verification Code Expired
            </h2>
            <p className="text-slate-600 mb-6">
              Your verification code has expired. Please request a new one to continue.
            </p>
            
            <button
              onClick={() => handleResend(email)}
              disabled={isResending || resendCooldown > 0}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : resendCooldown > 0 ? (
                `Resend available in ${resendCooldown}s`
              ) : (
                'Request New Code'
              )}
            </button>
            
            <button
              onClick={handleBack}
              className="mt-4 text-sm text-slate-600 hover:text-slate-900"
            >
              ← Back to Registration
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      type="verify" 
      role="stall-owner" 
      backLink="/stall-owner/register"
      title="Stall Owner Verification"
    >
      {verificationSuccess ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Verification Successful!
          </h2>
          <p className="text-slate-600 mb-6">
            Your email has been verified successfully. Redirecting you to the login page...
          </p>
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : (
        <>
          {error && !otpExpired && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}
          
          <OtpVerification
            email={email}
            onVerify={handleVerify}
            onResend={handleResend}
            onBack={handleBack}
            isLoading={isLoading}
            isResending={isResending}
            resendCooldown={resendCooldown}
            title="Verify Your Stall Owner Account"
            subtitle={`We've sent a 6-digit verification code to ${email || 'your email'}`}
          />
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  <strong>Important:</strong> The verification code will expire in 10 minutes. 
                  Please check your spam or junk folder if you don't see the email.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Having trouble? Contact support at{' '}
              <a href="mailto:support@mallspere.com" className="text-blue-600 hover:underline">
                support@mallspere.com
              </a>
            </p>
          </div>
        </>
      )}
    </AuthLayout>
  );
};

export default StallOwnerOtpVerification;