import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const UserLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
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
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      // Redirect to dashboard after login
      navigate('/user/dashboard'); 
    }, 1500);
  };

  return (
    <AuthLayout type="login" role="user" backLink="/">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-xl">
        <FormInput
          label="Email Address"
          type="email"
          name="email"
          placeholder="you@example.com"
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
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg disabled:opacity-70"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/user/register" className="text-blue-600 hover:text-blue-800 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </form>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
      </div>
    </AuthLayout>
  );
};

export default UserLogin;