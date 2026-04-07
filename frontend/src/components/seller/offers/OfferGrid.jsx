import React from 'react';
import { Tag } from 'lucide-react';
import OfferCard from './OfferCard';

const OfferGrid = ({ offers, onView, onToggle, onEdit, onDelete }) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
      {offers.map(offer => (
        <OfferCard
          key={offer._id || offer.offerId}
          offer={offer}
          onView={onView}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default OfferGrid;