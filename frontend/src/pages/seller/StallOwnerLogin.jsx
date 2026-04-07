import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import FormInput from '../../components/FormInput';
import { FaEnvelope, FaStore, FaLock } from 'react-icons/fa';
import { sellerApi } from '../../hooks/sellerApi'; 

const StallOwnerLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      const response = await sellerApi.loginSellerStall(formData.email, formData.password);
      
      console.log('Login successful:', response);
      
      if (response.success || response.sellerId || response.token) {
        // Navigate to dashboard
        navigate('/stall-owner/dashboard');
      } else {
        setApiError('Login successful but unexpected response format');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.message) {
        if (error.message.includes('Invalid email or password')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (error.message.includes('not verified')) {
          errorMessage = 'Please verify your email first. Check your inbox for OTP.';
          setTimeout(() => {
            navigate('/stall-owner/verify-otp', { 
              state: { email: formData.email } 
            });
          }, 2000);
        } else if (error.message.includes('Network error')) {
          errorMessage = 'Unable to connect to server. Please check your internet connection.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle "Forgot Password" click
  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (formData.email) {
      navigate('/stall-owner/forgot-password', { 
        state: { email: formData.email } 
      });
    } else {
      navigate('/stall-owner/forgot-password');
    }
  };

  return (
    <AuthLayout type="login" role="stall-owner" backLink="/">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-xl">
        {/* API Error Message */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{apiError}</p>
          </div>
        )}

        <FormInput
          label="Email Address"
          type="email"
          name="email"
          placeholder="stall@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={<FaEnvelope className="text-gray-400" />}
          required
          disabled={isLoading}
        />

        <FormInput
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon={<FaLock className="text-gray-400" />}
          required
          disabled={isLoading}
        />

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              disabled={isLoading}
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-purple-600 hover:text-purple-800 font-medium bg-transparent border-none cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : (
            'Sign In to Dashboard'
          )}
        </button>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            New stall owner?{' '}
            <Link 
              to="/stall-owner/register" 
              className="text-purple-600 hover:text-purple-800 font-semibold"
            >
              Register your stall
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default StallOwnerLogin;