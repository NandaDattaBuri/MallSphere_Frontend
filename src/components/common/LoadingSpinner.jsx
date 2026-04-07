import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-200 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;