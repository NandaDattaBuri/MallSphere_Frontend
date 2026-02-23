import React, { useState } from 'react';
import { 
  FaFilter, 
  FaStar, 
  FaDollarSign, 
  FaCalendarAlt,
  FaMapMarkerAlt 
} from 'react-icons/fa';

const MallFilters = ({ onFilterChange, userLocation }) => {
  const [filters, setFilters] = useState({
    category: 'all',
    sortBy: 'distance',
    priceRange: 'all',
    rating: 'all',
    dateRange: 'today'
  });

  const categories = [
    { id: 'all', label: 'All Malls' },
    { id: 'premium', label: 'Premium Malls' },
    { id: 'budget', label: 'Budget Friendly' },
    { id: 'family', label: 'Family Friendly' },
    { id: 'luxury', label: 'Luxury' }
  ];

  const sortOptions = [
    { id: 'distance', label: 'Nearest First' },
    { id: 'rating', label: 'Highest Rated' },
    { id: 'offers', label: 'Most Offers' },
    { id: 'popular', label: 'Most Popular' }
  ];

  const priceRanges = [
    { id: 'all', label: 'All Price Ranges' },
    { id: 'low', label: '₹ - Budget' },
    { id: 'medium', label: '₹₹ - Moderate' },
    { id: 'high', label: '₹₹₹ - Expensive' }
  ];

  const handleFilterChange = (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FaFilter className="text-blue-600 text-xl" />
          <h2 className="text-xl font-bold text-gray-800">Filters</h2>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Clear All
        </button>
      </div>

      {/* Location Filter */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <FaMapMarkerAlt className="text-gray-500" />
          <h3 className="font-semibold text-gray-700">Location</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {userLocation || 'Your Location'}
          </span>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            + Add Area
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleFilterChange('category', category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filters.category === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Sort By</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {sortOptions.map(option => (
            <button
              key={option.id}
              onClick={() => handleFilterChange('sortBy', option.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 ${
                filters.sortBy === option.id
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {option.id === 'distance' && <FaMapMarkerAlt />}
              {option.id === 'rating' && <FaStar />}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <FaDollarSign className="text-gray-500" />
          <h3 className="font-semibold text-gray-700">Price Range</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {priceRanges.map(range => (
            <button
              key={range.id}
              onClick={() => handleFilterChange('priceRange', range.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filters.priceRange === range.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <FaCalendarAlt className="text-gray-500" />
          <h3 className="font-semibold text-gray-700">Offers Valid Until</h3>
        </div>
        <div className="flex gap-2">
          {['today', 'this-week', 'this-month'].map(period => (
            <button
              key={period}
              onClick={() => handleFilterChange('dateRange', period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                filters.dateRange === period
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MallFilters;