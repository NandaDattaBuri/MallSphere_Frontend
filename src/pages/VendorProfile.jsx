// pages/VendorProfile.jsx - Standalone version without AuthLayout
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { vendorApi } from '../hooks/vendorApi';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaClock,
  FaSave,
  FaArrowLeft,
  FaCamera,
  FaKey,
  FaCheckCircle,
  FaStore,
  FaIdCard,
  FaSignOutAlt,
  FaTachometerAlt,
  FaBars,
  FaTimes,
  FaEdit,
  FaLock,
  FaUserCircle
} from 'react-icons/fa';

const VendorProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vendorData, setVendorData] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
    mallName: '',
    shopAddress: '',
    vendorShopDescription: '',
    vendorShopOpeningTime: '',
    vendorShopClosingTime: '',
    vendorShopNumberOfFloors: '',
    vendorShopNumberOfStalls: '',
    vendorLicenseNumber: ''
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Check authentication
    if (!vendorApi.isAuthenticated()) {
      navigate('/vendor/login');
      return;
    }

    loadVendorProfile();
  }, [navigate]);

  const loadVendorProfile = async () => {
    try {
      setLoading(true);
      
      let profile;
      try {
        profile = await vendorApi.getVendorAdminProfile();
        console.log('Vendor admin profile loaded:', profile);
      } catch (adminError) {
        console.log('Admin profile failed, trying regular profile:', adminError);
        profile = await vendorApi.getVendorProfile();
        console.log('Vendor profile loaded:', profile);
      }
      
      // Extract vendor data
      let vendor = {};
      
      if (profile.data?.vendor) {
        vendor = profile.data.vendor;
      } else if (profile.data) {
        vendor = profile.data;
      } else if (profile.vendor) {
        vendor = profile.vendor;
      } else {
        vendor = profile;
      }

      setVendorData(vendor);
      
      setFormData({
        name: vendor.name || '',
        email: vendor.email || '',
        phoneNumber: vendor.phoneNumber || '',
        location: vendor.location || '',
        mallName: vendor.mallName || vendor.shop?.name || '',
        shopAddress: vendor.shopAddress || vendor.shop?.address || '',
        vendorShopDescription: vendor.vendorShopDescription || vendor.shop?.description || '',
        vendorShopOpeningTime: vendor.vendorShopOpeningTime || vendor.shop?.openingTime || '',
        vendorShopClosingTime: vendor.vendorShopClosingTime || vendor.shop?.closingTime || '',
        vendorShopNumberOfFloors: vendor.vendorShopNumberOfFloors || vendor.shop?.numberOfFloors || '',
        vendorShopNumberOfStalls: vendor.vendorShopNumberOfStalls || vendor.shop?.numberOfStalls || '',
        vendorLicenseNumber: vendor.vendorLicenseNumber || ''
      });

      if (vendor.profileImage || vendor.profile) {
        setProfilePreview(vendor.profileImage || vendor.profile);
      }

    } catch (error) {
      console.error('Failed to load profile:', error);
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        navigate('/vendor/login');
      } else {
        setErrors({ general: 'Failed to load profile: ' + error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      
      if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/jpg')) {
        alert('Only JPG, JPEG, and PNG files are allowed');
        return;
      }
      
      setProfileImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateProfile = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.mallName.trim()) newErrors.mallName = 'Shop name is required';
    if (!formData.shopAddress.trim()) newErrors.shopAddress = 'Shop address is required';
    
    return newErrors;
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwordData.oldPassword) newErrors.oldPassword = 'Current password is required';
    if (!passwordData.newPassword) newErrors.newPassword = 'New password is required';
    else if (passwordData.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    if (!passwordData.confirmPassword) newErrors.confirmPassword = 'Please confirm password';
    else if (passwordData.newPassword !== passwordData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    return newErrors;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    
    const validationErrors = validateProfile();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setUpdating(true);

    try {
      const updateData = {
        ...formData,
        vendorShopNumberOfFloors: parseInt(formData.vendorShopNumberOfFloors) || 0,
        vendorShopNumberOfStalls: parseInt(formData.vendorShopNumberOfStalls) || 0
      };

      console.log('Updating profile with:', updateData);
      
      const response = await vendorApi.updateVendorProfile(updateData);
      console.log('Profile update response:', response);
      
      setSuccessMessage('Profile updated successfully!');
      setErrors({});
      
      setTimeout(() => {
        loadVendorProfile();
      }, 1000);
      
    } catch (error) {
      console.error('Profile update failed:', error);
      setErrors({ general: error.message || 'Failed to update profile' });
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    
    const validationErrors = validatePassword();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setUpdating(true);

    try {
      const response = await vendorApi.changePassword(
        passwordData.oldPassword,
        passwordData.newPassword,
        passwordData.confirmPassword
      );
      
      console.log('Password change response:', response);
      
      setSuccessMessage('Password changed successfully!');
      
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setErrors({});
      
    } catch (error) {
      console.error('Password change failed:', error);
      setErrors({ general: error.message || 'Failed to change password' });
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await vendorApi.logoutVendor();
      navigate('/vendor/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-md px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {sidebarOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
        </button>
        <h1 className="text-xl font-bold text-indigo-600">Vendor Profile</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 transform 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 transition duration-200 ease-in-out
          z-30 w-64 bg-white shadow-xl h-screen overflow-y-auto
        `}>
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <FaStore className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-800">Vendor Panel</span>
            </div>

            {/* Vendor Info */}
            <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center">
                  {profilePreview ? (
                    <img src={profilePreview} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <FaUserCircle className="w-8 h-8 text-indigo-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{formData.name || 'Vendor'}</p>
                  <p className="text-xs text-gray-500 truncate">{formData.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2">
              <Link
                to="/vendor/dashboard"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <FaTachometerAlt className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'profile' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                <FaEdit className="h-5 w-5" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => setActiveTab('password')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'password' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                <FaLock className="h-5 w-5" />
                <span>Change Password</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <FaSignOutAlt className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-gray-600 mt-1">Manage your vendor account and shop information</p>
              </div>
              <Link
                to="/vendor/dashboard"
                className="hidden lg:flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <FaArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex">
                <FaCheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-green-800">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-700">{errors.general}</p>
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {activeTab === 'profile' ? 'Profile Information' : 'Change Password'}
              </h2>
            </div>

            <div className="p-6">
              {activeTab === 'profile' ? (
                <form onSubmit={handleUpdateProfile}>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Image */}
                    <div className="lg:col-span-1">
                      <div className="text-center">
                        <div className="relative inline-block">
                          <div className="w-40 h-40 rounded-full border-4 border-indigo-100 overflow-hidden">
                            {profilePreview ? (
                              <img
                                src={profilePreview}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                <FaUser className="w-20 h-20 text-indigo-400" />
                              </div>
                            )}
                          </div>
                          
                          <label
                            htmlFor="profile-image"
                            className="absolute bottom-2 right-2 bg-indigo-600 text-white p-3 rounded-full cursor-pointer hover:bg-indigo-700 shadow-lg transition-colors"
                          >
                            <FaCamera className="h-5 w-5" />
                          </label>
                          <input
                            id="profile-image"
                            type="file"
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={handleProfileImageChange}
                            className="hidden"
                          />
                          
                          <p className="text-sm text-gray-500 mt-4">
                            Click to upload profile picture
                          </p>
                          <p className="text-xs text-gray-400">
                            JPG, PNG • Max 5MB
                          </p>
                        </div>
                      </div>

                      {/* License Info */}
                      {formData.vendorLicenseNumber && (
                        <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <FaIdCard className="h-4 w-4 text-indigo-600" />
                            <h3 className="font-medium text-gray-900">License Number</h3>
                          </div>
                          <p className="text-sm text-gray-700 font-mono bg-white p-2 rounded border border-indigo-100">
                            {formData.vendorLicenseNumber}
                          </p>
                        </div>
                      )}

                      {/* Shop Stats */}
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-3">Shop Statistics</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Floors:</span>
                            <span className="font-medium text-gray-900">{formData.vendorShopNumberOfFloors || 0}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Stalls:</span>
                            <span className="font-medium text-gray-900">{formData.vendorShopNumberOfStalls || 0}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Hours:</span>
                            <span className="font-medium text-gray-900">
                              {formData.vendorShopOpeningTime || 'N/A'} - {formData.vendorShopClosingTime || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Form Fields */}
                    <div className="lg:col-span-2">
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormInput
                            label="Full Name *"
                            type="text"
                            name="name"
                            placeholder="Your full name"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                            icon={<FaUser className="text-gray-400" />}
                            required
                          />

                          <FormInput
                            label="Email Address *"
                            type="email"
                            name="email"
                            placeholder="vendor@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            icon={<FaEnvelope className="text-gray-400" />}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormInput
                            label="Phone Number *"
                            type="tel"
                            name="phoneNumber"
                            placeholder="9876543210"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            error={errors.phoneNumber}
                            icon={<FaPhone className="text-gray-400" />}
                            required
                          />

                          <FormInput
                            label="Location *"
                            type="text"
                            name="location"
                            placeholder="City, State"
                            value={formData.location}
                            onChange={handleChange}
                            error={errors.location}
                            icon={<FaMapMarkerAlt className="text-gray-400" />}
                            required
                          />
                        </div>

                        <FormInput
                          label="Shop Name *"
                          type="text"
                          name="mallName"
                          placeholder="Your shop/mall name"
                          value={formData.mallName}
                          onChange={handleChange}
                          error={errors.mallName}
                          icon={<FaBuilding className="text-gray-400" />}
                          required
                        />

                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Shop Address *
                          </label>
                          <textarea
                            name="shopAddress"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 min-h-[100px] resize-none"
                            placeholder="Complete shop address..."
                            value={formData.shopAddress}
                            onChange={handleChange}
                            required
                          />
                          {errors.shopAddress && <p className="text-red-500 text-sm mt-1">{errors.shopAddress}</p>}
                        </div>

                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Shop Description
                          </label>
                          <textarea
                            name="vendorShopDescription"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 min-h-[120px] resize-none"
                            placeholder="Describe your shop/mall..."
                            value={formData.vendorShopDescription}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormInput
                            label="Number of Floors"
                            type="number"
                            name="vendorShopNumberOfFloors"
                            placeholder="2"
                            value={formData.vendorShopNumberOfFloors}
                            onChange={handleChange}
                            min="1"
                          />

                          <FormInput
                            label="Number of Stalls"
                            type="number"
                            name="vendorShopNumberOfStalls"
                            placeholder="10"
                            value={formData.vendorShopNumberOfStalls}
                            onChange={handleChange}
                            min="1"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormInput
                            label="Opening Time"
                            type="text"
                            name="vendorShopOpeningTime"
                            placeholder="09:00 AM"
                            value={formData.vendorShopOpeningTime}
                            onChange={handleChange}
                            icon={<FaClock className="text-gray-400" />}
                          />

                          <FormInput
                            label="Closing Time"
                            type="text"
                            name="vendorShopClosingTime"
                            placeholder="09:00 PM"
                            value={formData.vendorShopClosingTime}
                            onChange={handleChange}
                            icon={<FaClock className="text-gray-400" />}
                          />
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                          <button
                            type="submit"
                            disabled={updating}
                            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition duration-300 disabled:opacity-70 flex items-center"
                          >
                            <FaSave className="h-5 w-5 mr-2" />
                            {updating ? 'Updating...' : 'Save Changes'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                /* Password Change Form */
                <form onSubmit={handleChangePassword} className="max-w-lg mx-auto">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Your Password</h3>
                      <p className="text-sm text-gray-600 mb-6">
                        Choose a strong password that you don't use elsewhere
                      </p>
                      
                      <div className="space-y-4">
                        <FormInput
                          label="Current Password *"
                          type="password"
                          name="oldPassword"
                          placeholder="Enter current password"
                          value={passwordData.oldPassword}
                          onChange={handlePasswordChange}
                          error={errors.oldPassword}
                          icon={<FaKey className="text-gray-400" />}
                          required
                        />

                        <FormInput
                          label="New Password *"
                          type="password"
                          name="newPassword"
                          placeholder="At least 8 characters"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          error={errors.newPassword}
                          icon={<FaKey className="text-gray-400" />}
                          required
                        />

                        <FormInput
                          label="Confirm New Password *"
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm new password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          error={errors.confirmPassword}
                          icon={<FaCheckCircle className="text-gray-400" />}
                          required
                        />
                      </div>

                      <div className="mt-6">
                        <button
                          type="submit"
                          disabled={updating}
                          className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition duration-300 disabled:opacity-70 flex items-center justify-center"
                        >
                          <FaKey className="h-5 w-5 mr-2" />
                          {updating ? 'Changing Password...' : 'Change Password'}
                        </button>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500 text-center">
                      <p>Password must be at least 8 characters long</p>
                      <p>Use a mix of letters, numbers, and symbols for better security</p>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default VendorProfile;