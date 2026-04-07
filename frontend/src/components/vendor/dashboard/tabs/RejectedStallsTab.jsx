import React from 'react';
import { 
  FaTimesCircle, 
  FaSearch, 
  FaSpinner, 
  FaEye, 
  FaStore
} from 'react-icons/fa';
import StatusBadge from '../../../common/StatusBadge';
import Pagination from '../../../common/Pagination';

const RejectedStallsTab = ({
  rejectedStalls,
  actionLoading,
  searchTerm,
  setSearchTerm,
  pagination,
  onPageChange,
  onViewDetails,
  getFilteredStalls,
  getPaginatedItems
}) => {
  if (actionLoading.rejected) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center py-12">
        <FaSpinner className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading rejected stalls...</p>
      </div>
    );
  }

  if (rejectedStalls.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaTimesCircle className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">No Rejected Stalls</h3>
        <p className="text-gray-500">You don't have any rejected stalls.</p>
      </div>
    );
  }

  const filteredStalls = getFilteredStalls(rejectedStalls);
  const paginatedStalls = getPaginatedItems(filteredStalls, pagination.page, pagination.limit);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FaTimesCircle className="mr-2 text-red-600" />
              Rejected Stalls
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Your rejected stalls ({rejectedStalls.length} total)
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search stalls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {paginatedStalls.map((stall) => (
            <div key={stall._id || stall.shopId} className="border-2 border-gray-100 rounded-2xl p-5 hover:border-red-200 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex items-start mb-4">
                    <div className="p-3 rounded-xl bg-red-50 text-red-600 mr-4">
                      <FaStore className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{stall.shopName || 'Unnamed Stall'}</h3>
                        <StatusBadge status="rejected" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Shop ID</p>
                          <p className="font-medium text-gray-900">{stall.shopId || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="font-medium text-gray-900">{stall.location || 'Not specified'}</p>
                        </div>
                      </div>

                      {stall.rejectedReason && (
                        <div className="mb-4 p-3 bg-red-50 rounded-xl">
                          <p className="text-xs text-red-600 font-medium mb-1">Rejection Reason:</p>
                          <p className="text-sm text-gray-700">{stall.rejectedReason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-4 md:mt-0 md:ml-4">
                  <button
                    onClick={() => onViewDetails(stall._id || stall.shopId)}
                    className="px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 font-medium flex items-center"
                  >
                    <FaEye className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default RejectedStallsTab;