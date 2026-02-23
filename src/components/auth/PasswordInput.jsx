import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

const PasswordInput = ({ 
  label = "Password", 
  name = "password", 
  value, 
  onChange, 
  error,
  showStrength = false,
  placeholder = "••••••••",
  required = true
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = () => {
    if (!value) return { score: 0, text: '', color: 'text-gray-500', width: '0%' };
    
    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[a-z]/.test(value)) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;
    
    const percentage = (score / 5) * 100;
    
    if (score <= 1) return { score, text: 'Weak', color: 'text-red-500', width: `${percentage}%` };
    if (score <= 3) return { score, text: 'Good', color: 'text-yellow-500', width: `${percentage}%` };
    return { score, text: 'Strong', color: 'text-green-500', width: `${percentage}%` };
  };

  const strength = passwordStrength();

  const passwordRequirements = [
    { label: 'At least 8 characters', met: value?.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(value) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(value) },
    { label: 'Contains number', met: /\d/.test(value) },
  ];

  return (
    <div className="mb-6">
      <label className="block text-slate-700 text-sm font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="text-slate-400 w-5 h-5" />
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          className={`w-full px-4 py-3 pl-10 pr-10 rounded-xl border ${
            error ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
          } focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 bg-white`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      
      {/* Password Strength Meter */}
      {showStrength && value && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Password strength</span>
            <span className={`text-sm font-semibold ${strength.color}`}>
              {strength.text}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                strength.text === 'Weak' ? 'bg-red-500' :
                strength.text === 'Good' ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: strength.width }}
            />
          </div>
          
          {/* Password Requirements Checklist */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            {passwordRequirements.map((req, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  req.met ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                }`}>
                  {req.met && <Check className="w-3 h-3" />}
                </div>
                <span className={`text-xs ${req.met ? 'text-green-700' : 'text-slate-500'}`}>
                  {req.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {error && (
        <p className="text-red-500 text-sm mt-2 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" /> {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;