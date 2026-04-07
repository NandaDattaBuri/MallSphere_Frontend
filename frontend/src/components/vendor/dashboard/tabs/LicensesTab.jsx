import React, { useMemo } from 'react';
import { 
  FaBarcode, 
  FaSearch, 
  FaFilter, 
  FaTimes, 
  FaSpinner, 
  FaSyncAlt,
  FaExclamationTriangle,
  FaFileInvoice,
  FaPlus,
  FaArrowLeft,
  FaArrowRight
} from 'react-icons/fa';

const LicensesTab = ({
  licenses,
  licensesLoading,
  licensesError,
  licenseFilters,
  setLicenseFilters,
  showLicenseFilters,
  setShowLicenseFilters,
  licenseSearchTerm,
  setLicenseSearchTerm,
  licenseItemsPerPage,
  setLicenseItemsPerPage,
  licenseCurrentPage,
  setLicenseCurrentPage,
  clearLicenseFilters,
  onRefresh,
  onAssignLicense,
  approvedStalls
}) => {
  // Filter Functions
  const filterLicenses = (licenses) => {
    if (!licenses) return [];
    
    return licenses.filter(license => {
      if (licenseFilters.status) {
        if (licenseFilters.status === 'used' && !license.isUsed) return false;
        if (licenseFilters.status === 'available' && license.isUsed) return false;
      }
      
      if (licenseFilters.category && license.category !== licenseFilters.category) {
        return false;
      }
      
      if (licenseFilters.expiryStatus) {
        const today = new Date();
        const expiryDate = new Date(license.expiresAt);
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        
        switch(licenseFilters.expiryStatus) {
          case 'valid':
            if (expiryDate < today) return false;
            break;
          case 'expired':
            if (expiryDate >= today) return false;
            break;
          case 'expiringSoon':
            if (expiryDate < today || daysUntilExpiry > 30) return false;
            break;
          default:
            break;
        }
      }
      
      if (licenseFilters.dateRange) {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        switch(licenseFilters.dateRange) {
          case 'thisMonth':
            const expiryDate = new Date(license.expiresAt);
            if (expiryDate.getMonth() !== currentMonth || expiryDate.getFullYear() !== currentYear) {
              return false;
            }
            break;
          case 'nextMonth':
            const nextMonthExpiry = new Date(license.expiresAt);
            const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
            const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
            if (nextMonthExpiry.getMonth() !== nextMonth || nextMonthExpiry.getFullYear() !== nextMonthYear) {
              return false;
            }
            break;
          case 'lastMonth':
            if (license.isUsed) {
              const usedDate = new Date(license.usedAt);
              const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
              const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
              if (usedDate.getMonth() !== lastMonth || usedDate.getFullYear() !== lastMonthYear) {
                return false;
              }
            } else {
              return false;
            }
            break;
          default:
            break;
        }
      }
      
      if (licenseFilters.shopId) {
        const searchShopId = licenseFilters.shopId.toLowerCase();
        if (!license.usedForShopId?.toLowerCase().includes(searchShopId)) {
          return false;
        }
      }
      
      if (licenseSearchTerm) {
        const search = licenseSearchTerm.toLowerCase();
        return (
          license.category?.toLowerCase().includes(search) ||
          license.licenseId?.toLowerCase().includes(search) ||
          license.usedForShopId?.toLowerCase().includes(search)
        );
      }
      
      return true;
    });
  };

  const sortLicenses = (licenses) => {
    if (!licenses || !licenseFilters.sortBy) return licenses;
    
    return [...licenses].sort((a, b) => {
      switch(licenseFilters.sortBy) {
        case 'expiryAsc':
          return new Date(a.expiresAt) - new Date(b.expiresAt);
        case 'expiryDesc':
          return new Date(b.expiresAt) - new Date(a.expiresAt);
        case 'usedDateDesc':
          if (!a.usedAt) return 1;
          if (!b.usedAt) return -1;
          return new Date(b.usedAt) - new Date(a.usedAt);
        case 'categoryAsc':
          return (a.category || '').localeCompare(b.category || '');
        case 'categoryDesc':
          return (b.category || '').localeCompare(a.category || '');
        default:
          return 0;
      }
    });
  };

  const filteredLicenses = useMemo(() => {
    let filtered = filterLicenses(licenses);
    filtered = sortLicenses(filtered);
    return filtered;
  }, [licenses, licenseFilters, licenseSearchTerm]);

  const paginatedLicenses = useMemo(() => {
    const startIndex = (licenseCurrentPage - 1) * licenseItemsPerPage;
    return filteredLicenses.slice(startIndex, startIndex + licenseItemsPerPage);
  }, [filteredLicenses, licenseCurrentPage, licenseItemsPerPage]);

  const licenseTotalPages = Math.ceil(filteredLicenses.length / licenseItemsPerPage);

  if (licensesLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center py-12">
        <FaSpinner className="animate-spin h-8 w-8 text-purple-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading your licenses...</p>
      </div>
    );
  }

  if (licensesError) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center py-12">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaExclamationTriangle className="h-10 w-10 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Error Loading Licenses</h3>
        <p className="text-gray-500">{licensesError}</p>
        <button
          onClick={onRefresh}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (filteredLicenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaFileInvoice className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">No Licenses Found</h3>
        <p className="text-gray-500">
          {Object.keys(licenseFilters).length > 0 || licenseSearchTerm
            ? "No licenses match your filter criteria. Try adjusting your filters."
            : "You don't have any stall licenses yet."}
        </p>
        {(Object.keys(licenseFilters).length > 0 || licenseSearchTerm) && (
          <button
            onClick={clearLicenseFilters}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FaBarcode className="mr-2 text-purple-600" />
              Your Stall Licenses
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage and track your stall licenses ({licenses.length} total)
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search licenses..."
                value={licenseSearchTerm}
                onChange={(e) => setLicenseSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
              />
            </div>
            
            <button
              onClick={() => setShowLicenseFilters(!showLicenseFilters)}
              className={`px-4 py-2 border rounded-xl font-medium flex items-center ${
                showLicenseFilters || Object.keys(licenseFilters).length > 0
                  ? 'bg-purple-50 border-purple-300 text-purple-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FaFilter className="mr-2 h-4 w-4" />
              Filters
              {Object.keys(licenseFilters).length > 0 && (
                <span className="ml-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {Object.keys(licenseFilters).length}
                </span>
              )}
            </button>
            
            {Object.keys(licenseFilters).length > 0 && (
              <button
                onClick={clearLicenseFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium flex items-center"
              >
                <FaTimes className="mr-1 h-4 w-4" />
                Clear
              </button>
            )}
            
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 font-medium flex items-center"
            >
              <FaSyncAlt className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
        
        {showLicenseFilters && (
          <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={licenseFilters.status || ''}
                  onChange={(e) => setLicenseFilters({...licenseFilters, status: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Statuses</option>
                  <option value="used">Used</option>
                  <option value="available">Available</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={licenseFilters.category || ''}
                  onChange={(e) => setLicenseFilters({...licenseFilters, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Categories</option>
                  {[...new Set(licenses.map(l => l.category))].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Status</label>
                <select
                  value={licenseFilters.expiryStatus || ''}
                  onChange={(e) => setLicenseFilters({...licenseFilters, expiryStatus: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All</option>
                  <option value="valid">Valid (Not Expired)</option>
                  <option value="expired">Expired</option>
                  <option value="expiringSoon">Expiring Soon (30 days)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={licenseFilters.dateRange || ''}
                  onChange={(e) => setLicenseFilters({...licenseFilters, dateRange: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Dates</option>
                  <option value="thisMonth">Expires This Month</option>
                  <option value="nextMonth">Expires Next Month</option>
                  <option value="lastMonth">Used Last Month</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={licenseFilters.sortBy || 'expiryAsc'}
                  onChange={(e) => setLicenseFilters({...licenseFilters, sortBy: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="expiryAsc">Expiry Date (Earliest First)</option>
                  <option value="expiryDesc">Expiry Date (Latest First)</option>
                  <option value="usedDateDesc">Used Date (Newest First)</option>
                  <option value="categoryAsc">Category (A-Z)</option>
                  <option value="categoryDesc">Category (Z-A)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shop ID Search</label>
                <input
                  type="text"
                  placeholder="Search by shop ID..."
                  value={licenseFilters.shopId || ''}
                  onChange={(e) => setLicenseFilters({...licenseFilters, shopId: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items Per Page</label>
                <select
                  value={licenseItemsPerPage}
                  onChange={(e) => {
                    setLicenseItemsPerPage(Number(e.target.value));
                    setLicenseCurrentPage(1);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={6}>6 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={24}>24 per page</option>
                  <option value={48}>48 per page</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="mb-4 text-sm text-gray-600">
          Showing {paginatedLicenses.length} of {filteredLicenses.length} licenses
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedLicenses.map((license) => (
            <div
              key={license.licenseId}
              className="border-2 border-gray-100 rounded-2xl p-5 hover:border-purple-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-3 rounded-xl mr-4 ${
                    license.isUsed ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <FaBarcode className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{license.category}</h3>
                    <p className="text-xs text-gray-500 font-mono mt-1">{license.licenseId}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  license.isUsed 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {license.isUsed ? 'Used' : 'Available'}
                </span>
              </div>
              
              <div className="space-y-3">
                {/* EXPIRES ON */}
              <div>
              <p className="text-xs text-gray-500">Expires On</p>
              <p className="font-medium text-gray-900">
                    {license.isUsed && license.expiresAt
                      ? new Date(license.expiresAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : "Not Used"}
              </p>
              </div>
              
                {/* USED INFO */}
                {license.isUsed && (
              <>
              <div>
              <p className="text-xs text-gray-500">Used On</p>
              <p className="font-medium text-gray-900">
                        {new Date(license.usedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
              </p>
              </div>
              
                    <div>
              <p className="text-xs text-gray-500">Used For Shop</p>
              <p className="font-medium text-indigo-600 font-mono">
                        {license.usedForShopId}
              </p>
              </div>
              </>
                )}
              
                {/* ❌ EXPIRED (FIXED) */}
                {license.isUsed &&
                  license.expiresAt &&
                  new Date(license.expiresAt) < new Date() && (
              <div className="mt-3 p-2 bg-red-50 rounded-lg">
              <p className="text-xs text-red-600 flex items-center">
              <FaExclamationTriangle className="mr-1" />
                        License Expired
              </p>
              </div>
                )}
              
                {/* ⚠️ EXPIRING SOON (FIXED) */}
                {license.isUsed &&
                  license.expiresAt &&
                  new Date(license.expiresAt) > new Date() &&
                  (new Date(license.expiresAt) - new Date()) < 30 * 24 * 60 * 60 * 1000 && (
              <div className="mt-3 p-2 bg-yellow-50 rounded-lg">
              <p className="text-xs text-yellow-600 flex items-center">
              <FaExclamationTriangle className="mr-1" />
                        Expiring soon
              </p>
              </div>
                )}
              
              </div>
              
              {!license.isUsed && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-medium text-sm flex items-center justify-center"
                    onClick={() => onAssignLicense(license)}
                  >
                    <FaPlus className="mr-2 h-3 w-3" />
                    Assign to Stall
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {licenseTotalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing page {licenseCurrentPage} of {licenseTotalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setLicenseCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={licenseCurrentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setLicenseCurrentPage(prev => Math.min(prev + 1, licenseTotalPages))}
                disabled={licenseCurrentPage === licenseTotalPages}
                className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LicensesTab;