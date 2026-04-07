import React from 'react';
import { X } from 'lucide-react';
import { STATUS_CONFIG } from '../../utils/constants';

const OfferDetailModal = ({ offer, onClose, onEdit, onDelete }) => {
  if (!offer) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img 
            src={offer.offerImages?.[0]?.url || 
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop"} 
            alt={offer.offerTitle}
            className="w-full h-48 object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-4">
            <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
              STATUS_CONFIG[offer.offerStatus || 'active'].badge
            }`}>
              {STATUS_CONFIG[offer.offerStatus || 'active'].label}
            </span>
          </div>
        </div>
        <div className="p-6">
          <h2 className="df text-2xl font-semibold text-stone-900 mb-2">{offer.offerTitle}</h2>
          <p className="text-stone-600 mb-6">{offer.offerDescription}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-stone-50 p-4 rounded-xl">
              <p className="text-xs text-stone-400 mb-1">Discount</p>
              <p className="text-lg font-semibold text-stone-900">
                {offer.offerType === "percentage" && <>{offer.offerValue}% OFF</>}
                {offer.offerType === "flat" && <>${offer.offerValue} OFF</>}
                {offer.offerType === "bogo" && <>Buy One Get One</>}
              </p>
            </div>
            <div className="bg-stone-50 p-4 rounded-xl">
              <p className="text-xs text-stone-400 mb-1">Status</p>
              <p className="text-lg font-semibold text-stone-900 capitalize">{offer.offerStatus}</p>
            </div>
            <div className="bg-stone-50 p-4 rounded-xl">
              <p className="text-xs text-stone-400 mb-1">Valid Period</p>
              <p className="text-sm font-medium text-stone-900">
                {new Date(offer.offerStartDate).toLocaleDateString()} - {new Date(offer.offerEndDate).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-stone-50 p-4 rounded-xl">
              <p className="text-xs text-stone-400 mb-1">Terms & Conditions</p>
              <p className="text-sm text-stone-600 line-clamp-2">{offer.offerTermsAndConditions || 'No terms specified'}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(offer);
              }}
              className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium rounded-xl transition-all"
            >
              Edit Offer
            </button>
            <button
              onClick={() => {
                onDelete(offer.offerId || offer._id);
                onClose();
              }}
              className="flex-1 py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 text-sm font-medium rounded-xl transition-all"
            >
              Delete Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetailModal;