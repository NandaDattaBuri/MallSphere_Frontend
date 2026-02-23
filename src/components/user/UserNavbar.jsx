import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaSearch, 
  FaBell, 
  FaUserCircle, 
  FaCog, 
  FaSignOutAlt,
  FaMapMarkerAlt,
  FaFilter,
  FaShoppingCart
} from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';

const UserNavbar = ({ user, onLogout, onSearch, onFilterClick }) => {
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/user/profile');
  };

  const handleSettingsClick = () => {
    navigate('/user/settings');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/user/dashboard" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-xl font-bold text-gray-800 hidden md:block">
                MallExplorer
              </span>
            </Link>
          </div>

          {/* Location Display */}
          <div className="hidden md:flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
            <FaMapMarkerAlt className="text-blue-600" />
            <span className="text-gray-700 font-medium">
              {user?.location || 'Detecting location...'}
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search malls, offers, stores..."
                className="w-full px-4 py-2 pl-10 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => onSearch(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <button
                onClick={onFilterClick}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600"
              >
                <FaFilter />
              </button>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Offers Notification */}
            <div className="relative">
              <button className="p-2 text-gray-600 hover:text-blue-600 relative">
                <FaBell className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
            </div>

            {/* Cart */}
            <button className="p-2 text-gray-600 hover:text-blue-600">
              <FaShoppingCart className="text-xl" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-9 h-9 rounded-full border-2 border-blue-500 object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                <span className="hidden md:block text-gray-700 font-medium">
                  {user?.name || 'User'}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  
                  <button
                    onClick={handleProfileClick}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 flex items-center space-x-2"
                  >
                    <FaUserCircle className="text-gray-500" />
                    <span>My Profile</span>
                  </button>
                  
                  <button
                    onClick={handleSettingsClick}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 flex items-center space-x-2"
                  >
                    <FaCog className="text-gray-500" />
                    <span>Settings</span>
                  </button>
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-gray-700 hover:text-blue-600"
            >
              {showMobileMenu ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex items-center justify-between mb-4 px-4">
              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-blue-600" />
                <span className="text-gray-700">{user?.location || 'Location'}</span>
              </div>
              <button className="text-blue-600 text-sm">Change</button>
            </div>
            
            <div className="px-4 space-y-3">
              <button className="w-full text-left py-2 text-gray-700 hover:text-blue-600">
                My Offers
              </button>
              <button className="w-full text-left py-2 text-gray-700 hover:text-blue-600">
                Favorites
              </button>
              <button className="w-full text-left py-2 text-gray-700 hover:text-blue-600">
                History
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default UserNavbar;