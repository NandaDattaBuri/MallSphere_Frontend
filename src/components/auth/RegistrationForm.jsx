import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import ProfileUpload from './ProfileUpload';
import PasswordInput from './PasswordInput';

const RegistrationForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({ ...formData, profilePicture });
  };

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

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
      <ProfileUpload
        profilePicture={profilePicture}
        onFileChange={setProfilePicture}
      />

      {/* Username Input */}
      <div className="mb-6">
        <label className="block text-slate-700 text-sm font-medium mb-2">
          Username <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="text-slate-400 w-5 h-5" />
          </div>
          <input
            type="text"
            name="username"
            className={`w-full px-4 py-3 pl-10 rounded-xl border ${
              errors.username ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
            } focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 bg-white`}
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        {errors.username && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" /> {errors.username}
          </p>
        )}
      </div>

      {/* Email Input */}
      <div className="mb-6">
        <label className="block text-slate-700 text-sm font-medium mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="text-slate-400 w-5 h-5" />
          </div>
          <input
            type="email"
            name="email"
            className={`w-full px-4 py-3 pl-10 rounded-xl border ${
              errors.email ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
            } focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 bg-white`}
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" /> {errors.email}
          </p>
        )}
      </div>

      <PasswordInput
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        showStrength={true}
        required={true}
      />

      {/* Confirm Password Input */}
      <div className="mb-6">
        <label className="block text-slate-700 text-sm font-medium mb-2">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CheckCircle className="text-slate-400 w-5 h-5" />
          </div>
          <input
            type="password"
            name="confirmPassword"
            className={`w-full px-4 py-3 pl-10 rounded-xl border ${
              errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
            } focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 bg-white`}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" /> {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Terms Checkbox */}
      <div className="mb-8">
        <div className="flex items-start p-4 bg-slate-50 rounded-xl border border-slate-200">
          <input
            type="checkbox"
            id="terms"
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300 mt-1 flex-shrink-0"
            required
          />
          <label htmlFor="terms" className="ml-3 block text-sm text-slate-700">
            I agree to the{' '}
            <Link to="/terms" className="text-blue-600 hover:text-blue-800 font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-800 font-medium">
              Privacy Policy
            </Link>
            <p className="text-xs text-slate-500 mt-1">
              By creating an account, you agree to receive OTP verification and important updates.
            </p>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Creating Account...</span>
          </div>
        ) : (
          'Create Account'
        )}
      </button>

      {/* Login Link */}
      <div className="mt-8 text-center text-slate-600">
        Already have an account?{' '}
        <Link to="/user/login" className="text-blue-600 hover:text-blue-800 font-medium">
          Sign in here
        </Link>
      </div>
    </form>
  );
};

export default RegistrationForm;