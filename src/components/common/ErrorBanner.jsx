import React from 'react';
import { FaTimesCircle } from 'react-icons/fa';

const ErrorBanner = ({ error, onDismiss }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 p-6 rounded-r-xl shadow-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <FaTimesCircle className="h-6 w-6 text-red-400" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm text-red-800">{error}</p>
          </div>
          <button onClick={onDismiss} className="ml-auto text-red-500 hover:text-red-700">
            <FaTimesCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBanner;