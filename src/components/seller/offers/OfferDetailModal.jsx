import React from 'react';
import { X, Zap, Timer, Calendar } from 'lucide-react';
import { STATUS_CONFIG } from '../../utils/constants';

const OfferDetailModal = ({ offer, onClose, onEdit, onDelete }) => {
  if (!offer) return null;

  const isFlashDeal = offer.isFlashDeal || !!offer.flashDealTitle;
  
  const imageUrl = offer.offerImages?.[0]?.url || 
    offer.banners?.[0]?.url || 
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop";

  const title = offer.offerTitle || offer.title || offer.flashDealTitle || 'Untitled';
  const description = offer.offerDescription || offer.description || offer.flashDealDescription || '';
  const discountType = offer.offerType || offer.dealType || offer.flashDealType || 'percentage';
  const discountValue = offer.offerValue || offer.dealValue || offer.flashDealValue || 0;
  const status = offer.offerStatus || offer.status || (offer.isEnabled ? 'active' : 'disabled');
  const startDate = offer.offerStartDate || offer.startTime || offer.flashDealStartTime;
  const endDate = offer.offerEndDate || offer.endTime || offer.flashDealEndTime;
  const terms = offer.offerTermsAndConditions || offer.termsAndConditions || offer.flashDealTermsAndConditions || 'No terms specified';
  const timezone = offer.timezone;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-48 object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="absolute bottom-4 left-4 flex gap-2">
            {isFlashDeal && (
              <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-amber-500 text-white flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-white" />
                Flash Deal
              </span>
            )}
            <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
              STATUS_CONFIG[status]?.badge || STATUS_CONFIG.disabled.badge
            }`}>
              {STATUS_CONFIG[status]?.label || status}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="df text-2xl font-semibold text-stone-900 mb-2 flex items-center gap-2">
            {isFlashDeal && <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />}
            {title}
          </h2>
          <p className="text-stone-600 mb-6">{description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-stone-50 p-4 rounded-xl">
              <p className="text-xs text-stone-400 mb-1">Discount</p>
              <p className="text-lg font-semibold text-stone-900">
                {discountType === "percentage" && <>{discountValue}% OFF</>}
                {discountType === "flat" && <>₹{discountValue} OFF</>}
                {discountType === "bogo" && <>Buy One Get One</>}
              </p>
            </div>
            <div className="bg-stone-50 p-4 rounded-xl">
              <p className="text-xs text-stone-400 mb-1">Status</p>
              <p className="text-lg font-semibold text-stone-900 capitalize">{status}</p>
            </div>
            <div className="bg-stone-50 p-4 rounded-xl">
              <p className="text-xs text-stone-400 mb-1">
                {isFlashDeal ? 'Time Period' : 'Valid Period'}
              </p>
              <p className="text-sm font-medium text-stone-900">
                {isFlashDeal ? (
                  <>
                    {new Date(startDate).toLocaleString()}
                    <br />
                    <span className="text-stone-400">to</span>
                    <br />
                    {new Date(endDate).toLocaleString()}
                  </>
                ) : (
                  <>
                    {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                  </>
                )}
              </p>
            </div>
            <div className="bg-stone-50 p-4 rounded-xl">
              <p className="text-xs text-stone-400 mb-1">Terms & Conditions</p>
              <p className="text-sm text-stone-600 line-clamp-2">{terms}</p>
            </div>
          </div>

          {isFlashDeal && timezone && (
            <div className="mb-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-xs text-amber-600">
                <span className="font-medium">Timezone:</span> {timezone}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(offer);
              }}
              className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium rounded-xl transition-all"
            >
              Edit {isFlashDeal ? 'Flash Deal' : 'Offer'}
            </button>
            <button
              onClick={() => {
                onDelete(offer.offerId || offer._id);
                onClose();
              }}
              className="flex-1 py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 text-sm font-medium rounded-xl transition-all"
            >
              Delete {isFlashDeal ? 'Flash Deal' : 'Offer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetailModal;