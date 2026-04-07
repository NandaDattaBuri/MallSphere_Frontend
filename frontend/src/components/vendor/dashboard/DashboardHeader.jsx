import { Link } from 'react-router-dom';
import { FaStore, FaBell, FaSignOutAlt } from 'react-icons/fa';

const DashboardHeader = ({ vendorData, pendingStallsCount, onLogout }) => {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg">
              <FaStore className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {vendorData?.shopName || 'Vendor Dashboard'}
              </h1>
              <p className="text-sm text-gray-600 flex items-center">
                <span className="mr-2">Welcome, {vendorData?.name || 'Vendor'}!</span>
                <span>{vendorData.vendorId || 'vendor ID'}</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Verified Vendor
                </span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition">
              <FaBell className="h-5 w-5" />
              {pendingStallsCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition"
            >
              <FaSignOutAlt className="h-4 w-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
            <Link to="/vendor/profile" className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="font-bold text-white text-lg">
                  {vendorData?.name?.charAt(0) || 'V'}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900">{vendorData?.name || 'Vendor'}</p>
                <p className="text-xs text-gray-500 truncate max-w-[150px]">{vendorData?.email || ''}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;