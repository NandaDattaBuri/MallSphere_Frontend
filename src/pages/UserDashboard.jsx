import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../components/user/UserNavbar';
import MallFilters from '../components/user/MallFilters';
import MallCard from '../components/user/MallCard';
import OffersGrid from '../components/user/OffersGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { mockMalls, mockOffers } from '../components/data/mockData';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    sortBy: 'distance',
    priceRange: 'all',
    rating: 'all',
    dateRange: 'today'
  });
  const [activeTab, setActiveTab] = useState('malls');
  const [userLocation, setUserLocation] = useState('Bangalore, India');

  // Simulate user data fetch
  useEffect(() => {
    const fetchUserData = () => {
      setTimeout(() => {
        setUser({
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          avatar: null,
          location: 'Bangalore, India',
          favorites: []
        });
        setLoading(false);
      }, 1000);
    };

    fetchUserData();
  }, []);

  // Filter and search logic
  const filteredMalls = useMemo(() => {
    return mockMalls.filter(mall => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        mall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mall.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = filters.category === 'all' || 
        mall.category === filters.category;

      // Price range filter
      const matchesPrice = filters.priceRange === 'all' ||
        (filters.priceRange === 'low' && mall.priceRange === 'low') ||
        (filters.priceRange === 'medium' && mall.priceRange === 'medium') ||
        (filters.priceRange === 'high' && mall.priceRange === 'high');

      // Rating filter
      const matchesRating = filters.rating === 'all' ||
        (filters.rating === '4+' && mall.rating >= 4) ||
        (filters.rating === '3+' && mall.rating >= 3);

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    }).sort((a, b) => {
      // Sorting logic
      switch (filters.sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        case 'offers':
          return b.activeOffers - a.activeOffers;
        case 'popular':
          return b.popularity - a.popularity;
        default:
          return 0;
      }
    });
  }, [searchQuery, filters]);

  // Filtered offers
  const filteredOffers = useMemo(() => {
    return mockOffers.filter(offer => {
      const today = new Date();
      const validUntil = new Date(offer.validUntil);
      return validUntil >= today;
    });
  }, []);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem('userToken');
    navigate('/');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <UserNavbar
        user={user}
        onLogout={handleLogout}
        onSearch={handleSearch}
        onFilterClick={() => document.getElementById('filters').scrollIntoView({ behavior: 'smooth' })}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-blue-100">
            Discover amazing offers in malls near {userLocation}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('malls')}
            className={`px-6 py-3 font-semibold text-lg border-b-2 transition-colors ${
              activeTab === 'malls'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Nearby Malls
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-6 py-3 font-semibold text-lg border-b-2 transition-colors ${
              activeTab === 'offers'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            All Offers
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-6 py-3 font-semibold text-lg border-b-2 transition-colors ${
              activeTab === 'favorites'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Favorites
          </button>
        </div>

        {/* Filters Section */}
        <div id="filters" className="mb-8">
          <MallFilters
            onFilterChange={handleFilterChange}
            userLocation={userLocation}
          />
        </div>

        {/* Content Area */}
        {activeTab === 'malls' ? (
          <>
            {/* Results Summary */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {filteredMalls.length} Malls Found
                <span className="text-gray-500 text-lg font-normal ml-2">
                  in {userLocation}
                </span>
              </h2>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Sort by: Distance</option>
                <option>Sort by: Rating</option>
                <option>Sort by: Offers</option>
              </select>
            </div>

            {/* Malls Grid */}
            {filteredMalls.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🏬</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No malls found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMalls.map(mall => (
                  <MallCard key={mall.id} mall={mall} />
                ))}
              </div>
            )}
          </>
        ) : activeTab === 'offers' ? (
          <OffersGrid offers={filteredOffers} />
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Your favorite malls will appear here
            </h3>
            <p className="text-gray-500">
              Start adding malls to your favorites
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3">
        <div className="flex justify-around">
          <button className="flex flex-col items-center text-blue-600">
            <div className="text-xl">🏬</div>
            <span className="text-xs mt-1">Malls</span>
          </button>
          <button className="flex flex-col items-center text-gray-500">
            <div className="text-xl">🏷️</div>
            <span className="text-xs mt-1">Offers</span>
          </button>
          <button className="flex flex-col items-center text-gray-500">
            <div className="text-xl">⭐</div>
            <span className="text-xs mt-1">Favorites</span>
          </button>
          <button className="flex flex-col items-center text-gray-500">
            <div className="text-xl">👤</div>
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;