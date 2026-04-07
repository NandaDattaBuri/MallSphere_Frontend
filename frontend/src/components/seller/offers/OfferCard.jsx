import React from 'react';
import { Calendar, Eye, Clock, Zap, Edit, Trash2 } from 'lucide-react';
import { STATUS_CONFIG } from '../../utils/constants';

const OfferCard = ({ offer, onView, onToggle, onEdit, onDelete }) => {
  const status = offer.offerStatus || (offer.isEnabled ? 'active' : 'disabled');
  const sc = STATUS_CONFIG[status] || STATUS_CONFIG.disabled;
  const imageUrl = offer.offerImages?.[0]?.url || 
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop";

  return (
    <div className="group bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
      {/* Image Container */}
      <div className="relative h-40 overflow-hidden bg-stone-100">
        <img 
          src={imageUrl} 
          alt={offer.offerTitle}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold ${sc.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
            {sc.label}
          </span>
        </div>

        {/* Discount Badge */}
        <div className="absolute bottom-2 left-2">
          <span className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold">
            {offer.offerType === "percentage" && <>{offer.offerValue}% OFF</>}
            {offer.offerType === "flat" && <>${offer.offerValue} OFF</>}
            {offer.offerType === "bogo" && <>BOGO</>}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-stone-900 text-sm mb-1 line-clamp-1">{offer.offerTitle}</h3>
        <p className="text-stone-500 text-xs mb-3 line-clamp-2">{offer.offerDescription}</p>
        
        {/* Date Range */}
        <div className="flex items-center gap-1 text-[10px] text-stone-400 mb-3">
          <Calendar className="w-3 h-3" />
          <span>
            {new Date(offer.offerStartDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            {" - "}
            {new Date(offer.offerEndDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-1 pt-2 border-t border-stone-100">
          <button 
            onClick={() => onView(offer)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition-all"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => onToggle(offer)}
            className={`p-1.5 rounded-lg transition-all ${
              offer.isEnabled 
                ? "text-amber-400 hover:text-amber-600 hover:bg-amber-50" 
                : "text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50"
            }`}
            title={offer.isEnabled ? "Disable" : "Enable"}
          >
            {offer.isEnabled ? <Clock className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
          </button>
          <button 
            onClick={() => onEdit(offer)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
            title="Edit"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => onDelete(offer.offerId || offer._id)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;