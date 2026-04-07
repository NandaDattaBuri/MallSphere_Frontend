import { 
  FaHourglassHalf, 
  FaSearch, 
  FaSpinner, 
  FaEye, 
  FaThumbsUp, 
  FaThumbsDown,
  FaStore
} from 'react-icons/fa';
import StatusBadge from '../../../common/StatusBadge';
import Pagination from '../../../common/Pagination';

const PendingStallsTab = ({
  pendingStalls,
  actionLoading,
  searchTerm,
  setSearchTerm,
  pagination,
  onPageChange,
  onViewDetails,
  onApprove,
  onReject,
  getFilteredStalls,
  getPaginatedItems
}) => {
  if (actionLoading.pending) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center py-12">
        <FaSpinner className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading pending stalls...</p>
      </div>
    );
  }

  if (pendingStalls.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaHourglassHalf className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">No Pending Stalls</h3>
        <p className="text-gray-500">All your stalls have been processed.</p>
      </div>
    );
  }

  const filteredStalls = getFilteredStalls(pendingStalls);
  const paginatedStalls = getPaginatedItems(filteredStalls, pagination.page, pagination.limit);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FaHourglassHalf className="mr-2 text-yellow-600" />
              Pending Stalls
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Stalls awaiting your approval ({pendingStalls.length} total)
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
            <div key={stall._id || stall.shopId} className="border-2 border-gray-100 rounded-2xl p-5 hover:border-yellow-200 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex items-start mb-4">
                    <div className="p-3 rounded-xl bg-yellow-50 text-yellow-600 mr-4">
                      <FaStore className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{stall.shopName || 'Unnamed Stall'}</h3>
                        <StatusBadge status={stall.approvalStatus || 'pending'} />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Shop ID</p>
                          <p className="font-medium text-gray-900">{stall.shopId || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="font-medium text-gray-900">{stall.location || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Status</p>
                          <p className={`font-medium ${stall.isActive ? 'text-green-600' : 'text-yellow-600'}`}>
                            {stall.isActive ? 'Active' : 'Inactive'}
                          </p>
                        </div>
                      </div>

                      {stall.documents && stall.documents.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-2">Documents</p>
                          <div className="flex flex-wrap gap-2">
                            {stall.documents.map((doc, idx) => (
                              <span key={idx} className="px-3 py-1 bg-gray-100 rounded-lg text-xs text-gray-700">
                                {typeof doc === 'string' ? doc : doc.name || 'Document'}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-4 md:mt-0 md:ml-4">
                  <button
                    onClick={() => onViewDetails(stall._id || stall.shopId)}
                    disabled={actionLoading[stall._id || stall.shopId] === 'loading'}
                    className="px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 font-medium flex items-center"
                  >
                    {actionLoading[stall._id || stall.shopId] === 'loading' ? (
                      <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                    ) : (
                      <FaEye className="h-4 w-4 mr-2" />
                    )}
                    View Details
                  </button>
                  <button
                    onClick={() => onApprove(stall.shopId || stall._id)}
                    disabled={actionLoading[stall.shopId || stall._id] === 'approving'}
                    className="px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium flex items-center"
                  >
                    {actionLoading[stall.shopId || stall._id] === 'approving' ? (
                      <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                    ) : (
                      <FaThumbsUp className="h-4 w-4 mr-2" />
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(stall)}
                    disabled={actionLoading[stall.shopId || stall._id] === 'rejecting'}
                    className="px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium flex items-center"
                  >
                    {actionLoading[stall.shopId || stall._id] === 'rejecting' ? (
                      <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                    ) : (
                      <FaThumbsDown className="h-4 w-4 mr-2" />
                    )}
                    Reject
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

export default PendingStallsTab;