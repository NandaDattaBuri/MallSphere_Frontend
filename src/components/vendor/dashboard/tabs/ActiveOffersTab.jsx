import React, { useState } from 'react';
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
  FaArrowRight,
  FaEdit,
  FaTimes,
  FaFastBackward,
  FaFastForward
} from 'react-icons/fa';
import EditOfferModal from '../modals/EditOfferModal';
import vendorApi from '../../../../hooks/vendorApi';

const ActiveOffersTab = ({
  activeOffers,
  activeOffersLoading,
  activeOffersError,
  activeOffersPagination,
  onPageChange,
  onRefresh,
  getPaginatedOffers,
  canEdit = false,
  onOfferUpdated
}) => {
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleEditClick = (offer) => {
    console.log('Opening edit modal for offer:', offer);
    setSelectedOffer(offer);
    setShowEditModal(true);
  };

  const handleEditSuccess = (updatedOffer) => {
    console.log('Offer updated successfully:', updatedOffer);
    setShowEditModal(false);
    setSelectedOffer(null);
    if (onRefresh) {
      onRefresh();
    }
    if (onOfferUpdated) {
      onOfferUpdated(updatedOffer);
    }
  };

  const handleDeleteClick = (offer) => {
    setOfferToDelete(offer);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!offerToDelete) return;
    
    setDeleting(true);
    try {
      const response = await vendorApi.deleteOffer(offerToDelete._id);
      if (response.success) {
        setShowDeleteConfirm(false);
        setOfferToDelete(null);
        if (onRefresh) {
          onRefresh();
        }
      } else {
        alert(response.message || 'Failed to delete offer');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(error.message || 'An error occurred while deleting the offer');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setOfferToDelete(null);
  };

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
        {canEdit && (
          <button
            onClick={() => window.location.href = '/vendor/create-offer'}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
          >
            Create New Offer
          </button>
        )}
      </div>
    );
  }

  const paginatedOffers = getPaginatedOffers();

  const getOfferTypeBadge = (type) => {
    switch(type) {
      case 'percentage':
        return <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Percentage</span>;
      case 'flat':
        return <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Flat Discount</span>;
      default:
        return null;
    }
  };

  const getOfferValueDisplay = (type, value) => {
    if (type === 'percentage') {
      return `${value}% off`;
    }
    return `AED ${value} off`;
  };

  // Pagination helper functions
  const goToFirstPage = () => {
    if (activeOffersPagination.page !== 1) {
      onPageChange(1);
    }
  };

  const goToLastPage = () => {
    if (activeOffersPagination.page !== activeOffersPagination.totalPages) {
      onPageChange(activeOffersPagination.totalPages);
    }
  };

  const goToPreviousPage = () => {
    if (activeOffersPagination.page > 1) {
      onPageChange(activeOffersPagination.page - 1);
    }
  };

  const goToNextPage = () => {
    if (activeOffersPagination.page < activeOffersPagination.totalPages) {
      onPageChange(activeOffersPagination.page + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const { page, totalPages } = activeOffersPagination;
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = page - 1; i <= page + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <>
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
            
            <div className="mt-4 md:mt-0 flex space-x-3">
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
              <div 
                key={offer._id || offer.offerId} 
                className="border-2 border-gray-100 rounded-2xl p-5 hover:border-green-200 hover:shadow-lg transition-all duration-300 relative"
              >
                {/* Edit/Delete Actions */}
                {canEdit && (
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button
                      onClick={() => handleEditClick(offer)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      title="Edit Offer"
                    >
                      <FaEdit className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(offer)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      title="Delete Offer"
                    >
                      <FaTimes className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                {/* Offer Images Carousel */}
                {offer.offerImages && offer.offerImages.length > 0 && (
                  <div className="mb-3 -mt-2 -mx-2">
                    <div className="flex overflow-x-auto space-x-2 pb-2">
                      {offer.offerImages.slice(0, 3).map((img, idx) => (
                        <img
                          key={idx}
                          src={img.url}
                          alt={`Offer ${idx + 1}`}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                          }}
                        />
                      ))}
                      {offer.offerImages.length > 3 && (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-gray-500">+{offer.offerImages.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
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
                
                {/* Offer Title */}
                {offer.offerTitle && (
                  <h4 className="font-semibold text-gray-800 mb-2 line-clamp-1">
                    {offer.offerTitle}
                  </h4>
                )}
                
                <div className="space-y-2">
                  {/* Offer Value Display */}
                  {(offer.offerValue || offer.discount) && (
                    <div className="flex items-center text-sm">
                      <FaPercent className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-gray-700 font-medium">
                        {offer.offerValue 
                          ? getOfferValueDisplay(offer.offerType, offer.offerValue)
                          : offer.discount 
                            ? `${offer.discount}% off` 
                            : ''
                        }
                      </span>
                      {offer.offerType && getOfferTypeBadge(offer.offerType)}
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
                      <span className="text-gray-600">Min. Purchase: AED {offer.minPurchase}</span>
                    </div>
                  )}
                  
                  {offer.maxDiscount && (
                    <div className="flex items-center text-sm">
                      <FaMoneyBillWave className="h-4 w-4 text-yellow-600 mr-2" />
                      <span className="text-gray-600">Max Discount: AED {offer.maxDiscount}</span>
                    </div>
                  )}
                  
                  {/* Date Range */}
                  {(offer.offerStartDate && offer.offerEndDate) && (
                    <div className="flex items-center text-sm">
                      <FaRegClock className="h-4 w-4 text-orange-600 mr-2" />
                      <span className="text-gray-600">
                        {new Date(offer.offerStartDate).toLocaleDateString()} - {new Date(offer.offerEndDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  {(offer.validFrom && offer.validTo) && (
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
                  
                  {/* Description */}
                  {(offer.offerDescription || offer.description) && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {offer.offerDescription || offer.description}
                    </p>
                  )}
                  
                  {/* Terms & Conditions */}
                  {(offer.offerTermsAndConditions || offer.terms) && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 font-medium">Terms & Conditions:</p>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {offer.offerTermsAndConditions || offer.terms}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mt-3">
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {offer.offerStatus === 'active' ? 'Active' : 
                     offer.offerStatus === 'scheduled' ? 'Scheduled' : 
                     offer.offerStatus === 'expired' ? 'Expired' : 
                     offer.offerStatus || 'Active'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Pagination */}
          {activeOffersPagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
              <div className="text-sm text-gray-500">
                Page {activeOffersPagination.page} of {activeOffersPagination.totalPages}
              </div>
              
              <div className="flex items-center space-x-2">
                {/* First Page Button */}
                <button
                  onClick={goToFirstPage}
                  disabled={activeOffersPagination.page === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="First Page"
                >
                  <FaFastBackward className="h-4 w-4" />
                </button>
                
                {/* Previous Button */}
                <button
                  onClick={goToPreviousPage}
                  disabled={activeOffersPagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <FaArrowLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                
                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {getPageNumbers().map((pageNum, index) => (
                    pageNum === '...' ? (
                      <span key={`dots-${index}`} className="px-3 py-2 text-gray-500">
                        ...
                      </span>
                    ) : (
                      <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          activeOffersPagination.page === pageNum
                            ? 'bg-green-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  ))}
                </div>
                
                {/* Next Button */}
                <button
                  onClick={goToNextPage}
                  disabled={activeOffersPagination.page === activeOffersPagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Next
                  <FaArrowRight className="h-4 w-4 ml-1" />
                </button>
                
                {/* Last Page Button */}
                <button
                  onClick={goToLastPage}
                  disabled={activeOffersPagination.page === activeOffersPagination.totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Last Page"
                >
                  <FaFastForward className="h-4 w-4" />
                </button>
              </div>
              
              {/* Items per page selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Show:</span>
                <select
                  value={activeOffersPagination.limit}
                  onChange={(e) => {
                    const newLimit = parseInt(e.target.value);
                    onPageChange(1, newLimit);
                  }}
                  className="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                >
                  <option value={6}>6 per page</option>
                  <option value={9}>9 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={18}>18 per page</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Offer Modal */}
      {showEditModal && selectedOffer && (
        <EditOfferModal
          offer={selectedOffer}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedOffer(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
{showDeleteConfirm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div 
      className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
      onClick={handleCancelDelete} 
    />
    
    <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl w-full max-w-lg z-10">
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <FaExclamationTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="mt-0 ml-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Delete Offer
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete this offer? This action cannot be undone.
              </p>
              {offerToDelete && (
                <p className="mt-2 text-sm font-medium text-gray-700">
                  Offer: {offerToDelete.offerTitle || offerToDelete.offerId}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 flex flex-row-reverse gap-2">
        <button
          type="button"
          onClick={handleConfirmDelete}
          disabled={deleting}
          className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-sm disabled:opacity-50"
        >
          {deleting ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Deleting...
            </>
          ) : (
            'Delete'
          )}
        </button>
        <button
          type="button"
          onClick={handleCancelDelete}
          className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default ActiveOffersTab;