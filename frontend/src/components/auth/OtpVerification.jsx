import React, { useState, useEffect } from 'react';
import { Key, Clock, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import OTPInput from './OTPInput';

const OtpVerification = ({ 
  email, 
  onVerify, 
  onResend, 
  onBack, 
  isLoading,
  externalError = '', // Add external error prop
  isResending = false, // Add resending state
  resendCooldown = 0 // Add resend cooldown from parent
}) => {
  const [otpTimer, setOtpTimer] = useState(120); // 2 minutes
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [localError, setLocalError] = useState('');

  // Combine external and local errors
  const error = externalError || localError;

  // OTP Timer Effect
  useEffect(() => {
    let timer;
    if (otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setCanResendOtp(true);
    }
    return () => clearInterval(timer);
  }, [otpTimer]);

  // Reset timer when OTP expires
  useEffect(() => {
    if (externalError?.includes('expired')) {
      setCanResendOtp(true);
    }
  }, [externalError]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpComplete = (completeOtp) => {
    setOtp(completeOtp);
    setLocalError('');
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setLocalError('Please enter the 6-digit OTP');
      return;
    }
    
    try {
      await onVerify(email, otp);
    } catch (error) {
      // Handle specific error cases
      if (error.message === 'expired') {
        setLocalError('OTP has expired. Please request a new one.');
        setCanResendOtp(true);
      } else if (error.message === 'invalid') {
        setLocalError('Invalid OTP. Please check and try again.');
      } else {
        setLocalError(error.message || 'Verification failed. Please try again.');
      }
    }
  };

  const handleResend = async () => {
    if (canResendOtp || resendCooldown === 0) {
      try {
        await onResend(email);
        setOtpTimer(120);
        setCanResendOtp(false);
        setOtp('');
        setLocalError('');
      } catch (error) {
        setLocalError(error.message || 'Failed to resend OTP');
      }
    }
  };

  // Determine if resend button should be enabled
  const isResendEnabled = (canResendOtp || resendCooldown === 0) && !isResending && !isLoading;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Key className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Verify Your Email
        </h2>
        
        <p className="text-slate-600 mb-2">
          We've sent a 6-digit OTP to:
        </p>
        <p className="text-lg font-semibold text-blue-600 mb-6">{email}</p>
        
        <div className="flex items-center justify-center space-x-2 text-sm text-slate-500 mb-8">
          <Clock className="w-4 h-4" />
          <span>OTP expires in: </span>
          <span className={`font-mono font-bold ${otpTimer < 30 ? 'text-red-500' : 'text-green-500'}`}>
            {formatTime(otpTimer)}
          </span>
        </div>
      </div>

      {/* Error Message Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* OTP Input Component */}
      <OTPInput
        length={6}
        onComplete={handleOtpComplete}
        error={error}
        disabled={isLoading || isResending}
      />
      
      <p className="text-center text-sm text-slate-500 mt-4 mb-8">
        Can't see the OTP? Check your spam folder
      </p>

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        disabled={isLoading || otp.length !== 6 || isResending}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 mb-4"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Verifying...</span>
          </div>
        ) : (
          'Verify OTP'
        )}
      </button>

      {/* Resend OTP Button */}
      <div className="text-center">
        {isResendEnabled ? (
          <button
            onClick={handleResend}
            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center space-x-2"
            disabled={isLoading || isResending}
          >
            <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
            <span>{isResending ? 'Sending...' : 'Resend OTP'}</span>
          </button>
        ) : (
          <p className="text-slate-500 text-sm">
            {resendCooldown > 0 
              ? `Resend OTP available in ${resendCooldown}s`
              : `Resend OTP available in ${formatTime(otpTimer)}`}
          </p>
        )}
      </div>

      {/* Back to Registration */}
      <div className="mt-8 pt-6 border-t border-slate-200 text-center">
        <button
          onClick={onBack}
          className="text-slate-600 hover:text-slate-800 font-medium"
          disabled={isLoading || isResending}
        >
          ← Back to registration
        </button>
      </div>
    </div>
  );
};

export default OtpVerification;