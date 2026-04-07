import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const RejectModal = ({
  isOpen,
  onClose,
  stall,
  rejectionReason,
  setRejectionReason,
  onReject,
  actionLoading
}) => {
  if (!isOpen || !stall) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Stall</h3>
        <p className="text-gray-600 mb-4">
          Are you sure you want to reject <span className="font-semibold">{stall.shopName}</span>?
        </p>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rejection Reason *
          </label>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Please provide a reason for rejection..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px]"
            required
          />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onReject}
            disabled={!rejectionReason.trim() || actionLoading[stall.shopId || stall._id] === 'rejecting'}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium disabled:opacity-50 flex items-center justify-center"
          >
            {actionLoading[stall.shopId || stall._id] === 'rejecting' ? (
              <>
                <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                Rejecting...
              </>
            ) : (
              'Confirm Rejection'
            )}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;