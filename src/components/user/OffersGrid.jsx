import React from 'react';
import { FaTag, FaShoppingBag, FaTicketAlt, FaCopy } from 'react-icons/fa';

const OffersGrid = ({ offers }) => {
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Copied: ${code}`);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'shopping': return 'bg-blue-100 text-blue-800';
      case 'food': return 'bg-green-100 text-green-800';
      case 'entertainment': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Active Offers ({offers.length})
        </h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <FaTag className="inline mr-2" />
          View All Categories
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map(offer => (
          <div key={offer.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            {/* Offer Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(offer.category)}`}>
                    {offer.category.toUpperCase()}
                  </span>
                  <h3 className="text-xl font-bold mt-2">{offer.title}</h3>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{offer.discount}</div>
                  <div className="text-sm opacity-90">Discount</div>
                </div>
              </div>
            </div>

            {/* Offer Details */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaShoppingBag className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Mall</p>
                    <p className="font-semibold">{offer.mall}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FaTag className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Store</p>
                    <p className="font-semibold">{offer.store}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FaTicketAlt className="text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Offer Code</p>
                    <div className="flex items-center justify-between">
                      <code className="font-mono bg-gray-100 px-3 py-1 rounded">
                        {offer.code}
                      </code>
                      <button
                        onClick={() => handleCopyCode(offer.code)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">{offer.terms}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Valid until: {new Date(offer.validUntil).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold">
                  Get Offer
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Save
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersGrid;