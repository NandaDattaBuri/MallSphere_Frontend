import React, { useState, useEffect } from 'react';
import { 
  FaCheckCircle, 
  FaSearch, 
  FaSpinner, 
  FaEye, 
  FaStore,
  FaMapMarkerAlt,
  FaStar,
  FaSyncAlt,
  FaChevronUp
} from 'react-icons/fa';
import StatusBadge from '../../../common/StatusBadge';
import Pagination from '../../../common/Pagination';

const ApprovedStallsTab = ({
  approvedStalls,
  actionLoading,
  searchTerm,
  setSearchTerm,
  pagination,
  onPageChange,
  onViewDetails,
  getFilteredStalls,
  getPaginatedItems,
  getRatingStars,
  onRefresh // Add refresh handler prop
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (actionLoading.approved) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center py-12">
        <FaSpinner className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading approved stalls...</p>
      </div>
    );
  }

  const filteredStalls = getFilteredStalls(approvedStalls);
  const paginatedStalls = getPaginatedItems(filteredStalls, pagination.page, pagination.limit);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Fixed Header with Refresh Button */}
      <div className="sticky top-0 z-10 bg-white shadow-md border-b border-gray-200">
        <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <FaCheckCircle className="mr-2 text-green-600" />
                Approved Stalls
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Your approved stalls ({approvedStalls.length} total)
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search stalls..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                />
              </div>
              
              <button
                onClick={onRefresh}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 font-medium flex items-center transition-colors duration-200"
                disabled={actionLoading.refreshing}
              >
                {actionLoading.refreshing ? (
                  <>
                    <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <FaSyncAlt className="h-4 w-4 mr-2" />
                    Refresh
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="px-6 py-3 bg-white border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {paginatedStalls.length} of {filteredStalls.length} approved stalls
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-6">
        {approvedStalls.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No Approved Stalls</h3>
            <p className="text-gray-500">You don't have any approved stalls yet.</p>
            <button
              onClick={onRefresh}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 inline-flex items-center"
              disabled={actionLoading.refreshing}
            >
              {actionLoading.refreshing ? (
                <FaSpinner className="animate-spin h-4 w-4 mr-2" />
              ) : (
                <FaSyncAlt className="h-4 w-4 mr-2" />
              )}
              Refresh
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedStalls.map((stall) => (
                <div key={stall._id || stall.shopId} className="border-2 border-gray-100 rounded-2xl p-5 hover:border-green-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-3 rounded-xl bg-green-50 text-green-600 mr-4">
                        <FaStore className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{stall.shopName || 'Unnamed Stall'}</h3>
                        <p className="text-sm text-gray-500">{stall.shopId}</p>
                      </div>
                    </div>
                    <StatusBadge status="approved" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <FaMapMarkerAlt className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">{stall.location || 'Location not specified'}</span>
                    </div>
                    
                    {stall.rating && (
                      <div className="flex items-center">
                        {getRatingStars(stall.rating)}
                        <span className="ml-2 text-sm text-gray-600">{stall.rating}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-3">
                      <div className="text-sm">
                        <span className="text-gray-500">Active: </span>
                        <span className={`font-medium ${stall.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {stall.isActive ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <button
                        onClick={() => onViewDetails(stall._id || stall.shopId)}
                        disabled={actionLoading[stall._id || stall.shopId] === 'loading'}
                        className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 font-medium flex items-center transition-colors duration-200"
                      >
                        {actionLoading[stall._id || stall.shopId] === 'loading' ? (
                          <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                        ) : (
                          <FaEye className="h-4 w-4 mr-2" />
                        )}
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredStalls.length > pagination.limit && (
              <div className="mt-6">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={onPageChange}
                  totalItems={filteredStalls.length}
                  pageSize={pagination.limit}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 z-50"
          aria-label="Scroll to top"
        >
          <FaChevronUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default ApprovedStallsTab;