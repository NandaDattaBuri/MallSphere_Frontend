import React from 'react';
import { Clock, Zap, Edit, Trash2 } from 'lucide-react';
import { STATUS_CONFIG } from '../../utils/constants';

const OfferRow = ({ offer, onToggle, onEdit, onDelete }) => {
  const status = offer.offerStatus || (offer.isEnabled ? 'active' : 'disabled');
  const sc = STATUS_CONFIG[status] || STATUS_CONFIG.disabled;
  const imageUrl = offer.offerImages?.[0]?.url || 
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop";

  return (
    <tr className="hover:bg-stone-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <img 
            src={imageUrl} 
            alt={offer.offerTitle}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div>
            <p className="font-medium text-sm text-stone-900">{offer.offerTitle}</p>
            <p className="text-xs text-stone-400 line-clamp-1">{offer.offerDescription}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${sc.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
          {sc.label}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm font-medium text-stone-900">
          {offer.offerType === "percentage" && <>{offer.offerValue}%</>}
          {offer.offerType === "flat" && <>${offer.offerValue}</>}
          {offer.offerType === "bogo" && <>BOGO</>}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-stone-600">
        {new Date(offer.offerEndDate).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <button 
            onClick={() => onToggle(offer)} 
            className={`p-1.5 rounded-lg ${
              offer.isEnabled 
                ? "text-amber-400 hover:text-amber-600 hover:bg-amber-50" 
                : "text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50"
            }`}
          >
            {offer.isEnabled ? <Clock className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          </button>
          <button onClick={() => onEdit(offer)} className="p-1.5 rounded-lg text-stone-400 hover:text-blue-600 hover:bg-blue-50">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(offer.offerId || offer._id)} className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default OfferRow;