import React from 'react';
import { 
  FaTimesCircle,
  FaCheckCircle,
  FaTimesCircle as FaTimesCircleIcon,
  FaHourglassHalf,
  FaInfoCircle
} from 'react-icons/fa';
import StatusBadge from '../../../common/StatusBadge';
import RatingStars from '../../../common/RatingStars';
import { getStatusColor } from '../../../utils/vendorHelper';

const StallDetailsModal = ({
  isOpen,
  onClose,
  stall,
  onApprove,
  onReject
}) => {
  if (!isOpen || !stall) return null;

  // Helper function to get status icon (since we need it inline here)
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <FaCheckCircle className="text-green-500" />;
      case 'rejected':
        return <FaTimesCircleIcon className="text-red-500" />;
      case 'pending':
        return <FaHourglassHalf className="text-yellow-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Stall Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimesCircle className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Shop Name</p>
              <p className="font-medium text-gray-900">{stall.shopName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Shop ID</p>
              <p className="font-medium text-gray-900">{stall.shopId || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <div className="flex items-center mt-1">
                {/* Use StatusBadge component instead of manual rendering */}
                <StatusBadge status={stall.approvalStatus || stall.status} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="font-medium text-gray-900">{stall.isActive ? 'Yes' : 'No'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium text-gray-900">{stall.location || 'N/A'}</p>
            </div>
            {stall.rating && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Rating</p>
                <div className="flex items-center mt-1">
                  {/* Use RatingStars component */}
                  <RatingStars rating={stall.rating} />
                </div>
              </div>
            )}
          </div>

          {stall.documents && stall.documents.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Documents</p>
              <div className="flex flex-wrap gap-2">
                {stall.documents.map((doc, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-700">
                    {typeof doc === 'string' ? doc : doc.name || `Document ${idx + 1}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {stall.rejectedReason && (
            <div className="p-4 bg-red-50 rounded-xl">
              <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
              <p className="text-sm text-gray-700">{stall.rejectedReason}</p>
            </div>
          )}

          {(stall.approvalStatus === 'pending' || stall.status === 'pending') && (
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  onClose();
                  onApprove(stall.shopId || stall._id);
                }}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium"
              >
                Approve Stall
              </button>
              <button
                onClick={() => {
                  onClose();
                  onReject(stall);
                }}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium"
              >
                Reject Stall
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StallDetailsModal;