import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import FormInput from '../../components/FormInput';
import { vendorApi } from '../../hooks/vendorApi';
import { FaEnvelope, FaKey, FaArrowLeft, FaCheckCircle, FaLock } from 'react-icons/fa';

const VendorForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    

    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.otp) {
      newErrors.otp = 'OTP is required';
    } else if (!/^\d{6}$/.test(formData.otp)) {
      newErrors.otp = 'OTP must be 6 digits';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setApiError('');
    setApiSuccess('');

    const validationErrors = validateStep1();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      console.log('Requesting password reset OTP...');
      
      const response = await vendorApi.forgotPassword(
        formData.email, 
      );

      console.log('OTP request successful:', response);
      setApiSuccess('OTP has been sent to your email. Please check your inbox.');
      setStep(2); // Move to password reset step
      
    } catch (error) {
      console.error('OTP request failed:', error);
      
      if (error.message.includes('Network')) {
        setApiError('Network error. Please check your internet connection.');
      } else if (error.message.includes('not found') || error.message.includes('invalid')) {
        setApiError('No account found with this email and license number.');
      } else {
        setApiError(error.message || 'Failed to send OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setApiError('');
    setApiSuccess('');

    const validationErrors = validateStep2();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      console.log('Resetting password...');
      
      const response = await vendorApi.resetPassword(
        formData.email,
        formData.otp,
        formData.newPassword,
        formData.confirmPassword
      );

      console.log('Password reset successful:', response);
      setApiSuccess('Password reset successful! You can now login with your new password.');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/vendor/login', {
          state: {
            message: 'Password reset successful! Please login with your new password.',
            email: formData.email
          }
        });
      }, 3000);
      
    } catch (error) {
      console.error('Password reset failed:', error);
      
      if (error.message.includes('Invalid') || error.message.includes('expired')) {
        setApiError('Invalid or expired OTP. Please request a new OTP.');
      } else if (error.message.includes('match')) {
        setApiError('Passwords do not match. Please try again.');
      } else {
        setApiError(error.message || 'Password reset failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/vendor/login');
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate('/vendor/login');
    }
  };

  return (
    <AuthLayout type="forgot-password" role="vendor" backLink="/vendor/login">
      <div className="bg-white rounded-2xl p-8 shadow-xl">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {step === 1 ? 'Reset Your Password' : 'Set New Password'}
            </h3>
            <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-xs font-semibold rounded-full">
              {step === 1 ? 'Step 1' : 'Step 2'}
            </span>
          </div>
          <p className="text-gray-600 mb-6">
            {step === 1 ? 'Enter your email and license number to receive a reset OTP' : 'Enter the OTP and your new password'}
          </p>
        </div>

        {/* API Error Message */}
        {apiError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{apiError}</p>
          </div>
        )}

        {/* API Success Message */}
        {apiSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">{apiSuccess}</p>
          </div>
        )}

        {/* Step 1: Request OTP */}
        {step === 1 && (
          <form onSubmit={handleRequestOTP}>
            <FormInput
              label="Email Address"
              type="email"
              name="email"
              placeholder="your.shop@email.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<FaEnvelope className="text-gray-400" />}
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? 'Sending OTP...' : 'Send Reset OTP'}
            </button>
          </form>
        )}

        {/* Step 2: Reset Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <FormInput
              label="6-digit OTP"
              type="text"
              name="otp"
              placeholder="Enter OTP sent to your email"
              value={formData.otp}
              onChange={handleChange}
              error={errors.otp}
              icon={<FaKey className="text-gray-400" />}
              required
              maxLength="6"
            />

            <FormInput
              label="New Password"
              type="password"
              name="newPassword"
              placeholder="At least 8 characters"
              value={formData.newPassword}
              onChange={handleChange}
              error={errors.newPassword}
              icon={<FaLock className="text-gray-400" />}
              required
            />

            <FormInput
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={<FaCheckCircle className="text-gray-400" />}
              required
            />

            <div className="flex space-x-4 mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition duration-300"
              >
                <FaArrowLeft className="inline mr-2" />
                Back
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition duration-300 disabled:opacity-70"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Remember your password?{' '}
            <Link to="/vendor/login" className="text-indigo-600 hover:text-indigo-800 font-semibold">
              Back to login
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-indigo-800">
              <strong>Note:</strong> The OTP is valid for 10 minutes. Check your spam folder if you don't see the email.
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VendorForgotPassword;