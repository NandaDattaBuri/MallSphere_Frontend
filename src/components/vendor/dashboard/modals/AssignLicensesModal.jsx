import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const AssignLicenseModal = ({
  isOpen,
  onClose,
  license,
  approvedStalls,
  selectedStallForLicense,
  setSelectedStallForLicense,
  onAssign,
  assigningLicense
}) => {
  if (!isOpen || !license) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Assign License to Stall</h3>
        <p className="text-gray-600 mb-4">
          Assign license <span className="font-semibold">{license.licenseId}</span> to a stall
        </p>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Stall *
          </label>
          <select
            value={selectedStallForLicense}
            onChange={(e) => setSelectedStallForLicense(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Choose a stall...</option>
            {approvedStalls.map(stall => (
              <option key={stall.shopId || stall._id} value={stall.shopId || stall._id}>
                {stall.shopName} ({stall.shopId})
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onAssign}
            disabled={!selectedStallForLicense || assigningLicense}
            className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-medium disabled:opacity-50 flex items-center justify-center"
          >
            {assigningLicense ? (
              <>
                <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                Assigning...
              </>
            ) : (
              'Assign License'
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

export default AssignLicenseModal;