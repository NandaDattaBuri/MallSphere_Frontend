import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import FormInput from '../../components/FormInput';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { vendorApi } from '../../hooks/vendorApi';

const VendorLogin = () => {
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
  setApiError('');
  
  const validationErrors = validateForm();
  
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setIsLoading(true);

  try {
    console.log('Attempting vendor login...');
    
    // Call the vendor login API
    const response = await vendorApi.loginVendor({
      email: formData.email,
      password: formData.password
    });

    console.log('Login successful:', response);

    // The token should already be stored by vendorApi.loginVendor()
    // But we can double-check and store user data
    if (response.user || response.vendor) {
      localStorage.setItem('vendorData', JSON.stringify(response.user || response.vendor));
    }

    // Show success message
    if (response.message) {
      console.log('Login message:', response.message);
    }

    // Redirect to vendor dashboard
    navigate('/vendor/dashboard');

  } catch (error) {
    console.error('Login error:', error);
    
    // Handle specific error cases
    if (error.message.includes('Network')) {
      setApiError('Network error. Please check your internet connection.');
    } else if (error.message.includes('401') || error.message.includes('Invalid credentials')) {
      setApiError('Invalid email or password. Please try again.');
    } else if (error.message.includes('not verified')) {
      setApiError('Please verify your email first. Check your inbox for verification OTP.');
    } else {
      setApiError(error.message || 'Login failed. Please try again.');
    }
  } finally {
    setIsLoading(false);
  }
};

  const handleForgotPassword = () => {
    // Navigate to forgot password page with email pre-filled if available
    if (formData.email) {
      navigate('/vendor/forgot-password', { state: { email: formData.email } });
    } else {
      navigate('/vendor/forgot-password');
    }
  };

  return (
    <AuthLayout type="login" role="vendor" backLink="/">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-xl">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Vendor Login</h3>
            <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-xs font-semibold rounded-full">
              Shop Owner
            </span>
          </div>
          <p className="text-gray-600 mb-6">Access your vendor dashboard to manage your shop</p>
        </div>

        {/* API Error Message */}
        {apiError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{apiError}</p>
          </div>
        )}

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

        <FormInput
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon={<FaLock className="text-gray-400" />}
          required
        />

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </span>
          ) : (
            'Login to Dashboard'
          )}
        </button>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have a vendor account?{' '}
            <Link to="/vendor/register" className="text-indigo-600 hover:text-indigo-800 font-semibold">
              Register your shop
            </Link>
          </p>
        </div>
      </form>

      <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-indigo-800">
              <strong>Need help?</strong> Contact support at support@mallsphere.com or call +1 (555) 123-4567.
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VendorLogin;