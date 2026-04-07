import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaStore,
  FaBarcode,
  FaEdit,
  FaSignOutAlt
} from 'react-icons/fa';

const OverviewTab = ({
  pendingStalls,
  approvedStalls,
  rejectedStalls,
  licenses,
  vendorData,
  onTabChange,
  getPaginatedItems,
  onLogout
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-yellow-100 text-yellow-600 mr-4">
                <FaHourglassHalf className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Approval</p>
                <p className="text-2xl font-bold text-gray-900">{pendingStalls.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-green-100 text-green-600 mr-4">
                <FaCheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{approvedStalls.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-red-100 text-red-600 mr-4">
                <FaTimesCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{rejectedStalls.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Pending Stalls */}
        {pendingStalls.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Pending Stalls</h3>
              <button
                onClick={() => onTabChange('pending')}
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {getPaginatedItems(pendingStalls, 1, 3).map((stall) => (
                <div key={stall._id || stall.shopId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900">{stall.shopName || 'Unnamed Stall'}</div>
                    <div className="text-sm text-gray-500">{stall.shopId}</div>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Approved Stalls */}
        {approvedStalls.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Approved Stalls</h3>
              <button
                onClick={() => onTabChange('approved')}
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {getPaginatedItems(approvedStalls, 1, 3).map((stall) => (
                <div key={stall._id || stall.shopId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900">{stall.shopName || 'Unnamed Stall'}</div>
                    <div className="text-sm text-gray-500">{stall.shopId}</div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Approved
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Licenses */}
        {licenses.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Licenses</h3>
              <button
                onClick={() => onTabChange('licenses')}
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {getPaginatedItems(licenses, 1, 3).map((license) => (
                <div key={license.licenseId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900">{license.category}</div>
                    <div className="text-xs text-gray-500 font-mono">{license.licenseId}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    license.isUsed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {license.isUsed ? 'Used' : 'Available'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="space-y-8">
        {/* Quick Actions Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/vendor/profile"
              className="w-full flex items-center p-3 text-left rounded-xl hover:shadow-md transition-all border border-gray-200 hover:border-indigo-300"
            >
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 mr-3">
                <FaEdit className="h-4 w-4" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">Update Profile</div>
                <div className="text-xs text-gray-500">Edit your information</div>
              </div>
            </Link>
            
            {pendingStalls.length > 0 && (
              <button
                onClick={() => onTabChange('pending')}
                className="w-full flex items-center p-3 text-left rounded-xl hover:shadow-md transition-all border border-gray-200 hover:border-yellow-300"
              >
                <div className="p-2 rounded-xl bg-yellow-50 text-yellow-600 mr-3">
                  <FaHourglassHalf className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Review Pending</div>
                  <div className="text-xs text-gray-500">{pendingStalls.length} stalls waiting</div>
                </div>
              </button>
            )}
            
            {licenses.filter(l => !l.isUsed).length > 0 && (
              <button
                onClick={() => onTabChange('licenses')}
                className="w-full flex items-center p-3 text-left rounded-xl hover:shadow-md transition-all border border-gray-200 hover:border-purple-300"
              >
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600 mr-3">
                  <FaBarcode className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Available Licenses</div>
                  <div className="text-xs text-gray-500">{licenses.filter(l => !l.isUsed).length} ready to use</div>
                </div>
              </button>
            )}
            
            <button
              onClick={onLogout}
              className="w-full flex items-center p-3 text-left rounded-xl hover:shadow-md transition-all border border-red-200 hover:border-red-300"
            >
              <div className="p-2 rounded-xl bg-red-50 text-red-600 mr-3">
                <FaSignOutAlt className="h-4 w-4" />
              </div>
              <div>
                <div className="font-semibold text-red-700 text-sm">Logout</div>
                <div className="text-xs text-red-500">Sign out from dashboard</div>
              </div>
            </button>
          </div>
        </div>

        {/* Vendor Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Vendor Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Name</p>
              <p className="font-medium text-gray-900">{vendorData?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{vendorData?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">{vendorData?.phoneNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Shop Name</p>
              <p className="font-medium text-gray-900">{vendorData?.shopName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Address</p>
              <p className="font-medium text-gray-900">{vendorData?.shopAddress || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* License Summary Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">License Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Licenses</span>
              <span className="font-bold text-gray-900">{licenses.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Available</span>
              <span className="font-bold text-green-600">{licenses.filter(l => !l.isUsed).length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Used</span>
              <span className="font-bold text-blue-600">{licenses.filter(l => l.isUsed).length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Expiring Soon</span>
              <span className="font-bold text-yellow-600">
                {licenses.filter(l => !l.isUsed && new Date(l.expiresAt) > new Date() && 
                 (new Date(l.expiresAt) - new Date()) < 30 * 24 * 60 * 60 * 1000).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;