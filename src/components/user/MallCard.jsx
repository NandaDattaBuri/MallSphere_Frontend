import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaStar, 
  FaMapMarkerAlt, 
  FaTag, 
  FaShoppingBag,
  FaDirections,
  FaParking
} from 'react-icons/fa';

const MallCard = ({ mall }) => {
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-50';
    if (rating >= 4.0) return 'text-blue-600 bg-blue-50';
    if (rating >= 3.0) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Mall Image with Badges */}
      <div className="relative">
        <img
          src={mall.image}
          alt={mall.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        
        {/* Rating Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full flex items-center space-x-1 ${getRatingColor(mall.rating)}`}>
          <FaStar className="text-sm" />
          <span className="font-bold">{mall.rating}</span>
        </div>

        {/* Active Offers Badge */}
        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {mall.activeOffers}+ Offers
        </div>

        {/* Distance Badge */}
        <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium shadow flex items-center space-x-1">
          <FaMapMarkerAlt className="text-blue-600" />
          <span>{mall.distance} km</span>
        </div>
      </div>

      {/* Mall Info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800">{mall.name}</h3>
          <span className="text-sm font-medium px-2 py-1 rounded bg-blue-100 text-blue-800">
            {mall.category}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{mall.description}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {mall.parking && (
            <span className="flex items-center space-x-1 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
              <FaParking />
              <span>Parking</span>
            </span>
          )}
          {mall.foodCourt && (
            <span className="flex items-center space-x-1 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
              <FaShoppingBag />
              <span>Food Court</span>
            </span>
          )}
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {mall.floors} Floors
          </span>
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {mall.stores}+ Stores
          </span>
        </div>

        {/* Top Offers */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <FaTag className="text-green-600" />
            <h4 className="font-semibold text-gray-700">Top Offers</h4>
          </div>
          <div className="space-y-2">
            {mall.topOffers.slice(0, 2).map((offer, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-700">{offer.store}</span>
                <span className="font-semibold text-green-700">{offer.discount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Link
            to={`/mall/${mall.id}`}
            className="flex-1 btn-primary py-3 rounded-lg text-center font-semibold hover:shadow-lg transition-shadow"
          >
            View Details
          </Link>
          <button className="px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            <FaDirections />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MallCard;