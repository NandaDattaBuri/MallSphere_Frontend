import React from 'react';
import { Tag } from 'lucide-react';
import OfferRow from './OfferRow';

const OfferList = ({ offers, onToggle, onEdit, onDelete, onView }) => {
  if (offers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-stone-200">
        <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
          <Tag className="w-7 h-7 text-stone-300" />
        </div>
        <p className="font-medium text-stone-600">No offers found</p>
        <p className="text-sm text-stone-400 mt-1">Try changing your filter or create a new offer</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden mb-6">
      <table className="w-full">
        <thead className="bg-stone-50 border-b border-stone-200">
          <tr>
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">Offer</th>
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">Status</th>
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">Discount</th>
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">Valid Until</th>
            <th className="text-right text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {offers.map(offer => (
            <OfferRow
              key={offer._id || offer.offerId}
              offer={offer}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OfferList;