import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
      <div className="text-sm text-gray-500">
        Showing page {currentPage} of {totalPages}
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaArrowLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;