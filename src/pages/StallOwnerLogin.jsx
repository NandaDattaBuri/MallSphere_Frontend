import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import { FaEnvelope, FaStore, FaLock } from 'react-icons/fa';

const StallOwnerLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    stallId: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.stallId) {
      newErrors.stallId = 'Stall ID is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    // API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/stall-owner/dashboard');
    }, 1500);
  };

  return (
    <AuthLayout type="login" role="stall-owner" backLink="/">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-xl">
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
        />

        <FormInput
          label="Stall ID"
          type="text"
          name="stallId"
          placeholder="STALL-12345"
          value={formData.stallId}
          onChange={handleChange}
          error={errors.stallId}
          icon={<FaStore className="text-gray-400" />}
          required
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
        />

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-800 font-medium">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-70"
        >
          {isLoading ? 'Signing in...' : 'Sign In to Dashboard'}
        </button>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            New stall owner?{' '}
            <Link to="/stall-owner/register" className="text-purple-600 hover:text-purple-800 font-semibold">
              Register your stall
            </Link>
          </p>
        </div>
      </form>

      <div className="mt-8 p-4 bg-purple-50 rounded-lg border border-purple-100">
        <p className="text-sm text-purple-800">
          <strong>Note:</strong> Stall ID is provided during registration. Contact mall administration if you've lost your Stall ID.
        </p>
      </div>
    </AuthLayout>
  );
};

export default StallOwnerLogin;