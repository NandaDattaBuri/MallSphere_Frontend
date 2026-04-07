import React from 'react';
import { 
  FaTags, 
  FaSpinner, 
  FaSyncAlt, 
  FaStore, 
  FaPercent, 
  FaShoppingCart, 
  FaMoneyBillWave, 
  FaRegClock,
  FaExclamationTriangle,
  FaArrowLeft,
  FaArrowRight
} from 'react-icons/fa';

const ActiveOffersTab = ({
  activeOffers,
  activeOffersLoading,
  activeOffersError,
  activeOffersPagination,
  onPageChange,
  onRefresh,
  getPaginatedOffers
}) => {
  if (activeOffersLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center py-12">
        <FaSpinner className="animate-spin h-8 w-8 text-green-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading active offers...</p>
      </div>
    );
  }

  if (activeOffersError) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center py-12">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaExclamationTriangle className="h-10 w-10 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Error Loading Offers</h3>
        <p className="text-gray-500">{activeOffersError}</p>
        <button
          onClick={onRefresh}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (activeOffers.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaTags className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">No Active Offers</h3>
        <p className="text-gray-500">There are no active offers in the mall at the moment.</p>
      </div>
    );
  }

  const paginatedOffers = getPaginatedOffers();

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FaTags className="mr-2 text-green-600" />
              Mall Active Offers
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Current active offers in the mall ({activeOffers.length} total)
            </p>
            <p className="text-xs text-green-600 mt-1">
              Showing {Math.min((activeOffersPagination.page - 1) * activeOffersPagination.limit + 1, activeOffers.length)} to{' '}
              {Math.min(activeOffersPagination.page * activeOffersPagination.limit, activeOffers.length)} of{' '}
              {activeOffers.length} offers
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 font-medium flex items-center"
            >
              <FaSyncAlt className="mr-2 h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedOffers.map((offer) => (
            <div key={offer._id || offer.offerId} className="border-2 border-gray-100 rounded-2xl p-5 hover:border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-xl bg-green-50 text-green-600 mr-3">
                  <FaStore className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{offer.stallName || 'Unknown Stall'}</h3>
                  <p className="text-xs text-gray-500">{offer.shopId}</p>
                </div>
              </div>
              
              <div className="mb-3">
                <span className="inline-block px-2 py-1 bg-gray-100 rounded-lg text-xs font-mono text-gray-600">
                  {offer.offerId}
                </span>
              </div>
              
              <div className="space-y-2">
                {offer.discount && (
                  <div className="flex items-center text-sm">
                    <FaPercent className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-gray-700 font-medium">{offer.discount}% off</span>
                  </div>
                )}
                
                {offer.discountType && (
                  <div className="flex items-center text-sm">
                    <FaTags className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-gray-600">{offer.discountType}</span>
                  </div>
                )}
                
                {offer.minPurchase && (
                  <div className="flex items-center text-sm">
                    <FaShoppingCart className="h-4 w-4 text-purple-600 mr-2" />
                    <span className="text-gray-600">Min. Purchase: ₹{offer.minPurchase}</span>
                  </div>
                )}
                
                {offer.maxDiscount && (
                  <div className="flex items-center text-sm">
                    <FaMoneyBillWave className="h-4 w-4 text-yellow-600 mr-2" />
                    <span className="text-gray-600">Max Discount: ₹{offer.maxDiscount}</span>
                  </div>
                )}
                
                {offer.validFrom && offer.validTo && (
                  <div className="flex items-center text-sm">
                    <FaRegClock className="h-4 w-4 text-orange-600 mr-2" />
                    <span className="text-gray-600">
                      {new Date(offer.validFrom).toLocaleDateString()} - {new Date(offer.validTo).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                {offer.validUntil && (
                  <div className="flex items-center text-sm">
                    <FaRegClock className="h-4 w-4 text-orange-600 mr-2" />
                    <span className="text-gray-600">
                      Valid until: {new Date(offer.validUntil).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                {offer.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{offer.description}</p>
                )}
                
                {offer.terms && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 font-medium">Terms & Conditions:</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{offer.terms}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-3">
                <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>

        {activeOffersPagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Page {activeOffersPagination.page} of {activeOffersPagination.totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onPageChange(activeOffersPagination.page - 1)}
                disabled={activeOffersPagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <FaArrowLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
              
              <div className="flex space-x-1">
                {[...Array(activeOffersPagination.totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === activeOffersPagination.totalPages ||
                    (pageNumber >= activeOffersPagination.page - 1 && 
                     pageNumber <= activeOffersPagination.page + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => onPageChange(pageNumber)}
                        className={`w-10 h-10 rounded-xl font-medium ${
                          activeOffersPagination.page === pageNumber
                            ? 'bg-green-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                  if (pageNumber === activeOffersPagination.page - 2 || 
                      pageNumber === activeOffersPagination.page + 2) {
                    return (
                      <span key={pageNumber} className="w-10 h-10 flex items-center justify-center">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
              
              <button
                onClick={() => onPageChange(activeOffersPagination.page + 1)}
                disabled={activeOffersPagination.page === activeOffersPagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next
                <FaArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveOffersTab;