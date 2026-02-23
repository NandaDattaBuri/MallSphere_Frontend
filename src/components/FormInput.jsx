import React from 'react';

const FormInput = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange,
  name, 
  error, 
  icon,
  required = false 
}) => {
  const handleChange = (e) => {
    onChange(e);
  };

  return (
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-semibold mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          className={`
            w-full px-4 py-3 rounded-lg border-2 
            ${icon ? 'pl-10' : 'pl-4'}
            ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}
            focus:outline-none focus:shadow-outline transition duration-300
            ${error ? 'bg-red-50' : 'bg-white'}
            hover:border-blue-400 transition-colors duration-200
          `}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          required={required}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1 animate-pulse">{error}</p>}
    </div>
  );
};

export default FormInput;