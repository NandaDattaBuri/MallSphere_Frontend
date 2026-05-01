import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import FormInput from '../../components/FormInput';
import sellerApi from '../../hooks/sellerApi'
import {
  FaUser,
  FaEnvelope,
  FaStore,
  FaMapMarkerAlt,
  FaPhone,
  FaImage,
  FaLock,
  FaCheck,
  FaBuilding,
  FaIdCard,
  FaTags,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';

const StallOwnerRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    licenseId: '',
    mallName: '',
    shopName: '',
    category: '',
    sellerShopAddress: '',
    sellerContactNumber: '',
    location: '',
    floorNumber: '',
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [sellerShopImages, setSellerShopImages] = useState([]);
  const [profilePreview, setProfilePreview] = useState('');
  const [shopImagePreviews, setShopImagePreviews] = useState([]);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  // Handle profile picture
  const handleProfilePicture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle shop images (1–5)
  const handleShopImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setSellerShopImages(files);
    const previews = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === files.length) setShopImagePreviews([...previews]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Client-side validation
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.licenseId.trim()) newErrors.licenseId = 'License ID is required';
    if (!formData.mallName.trim()) newErrors.mallName = 'Mall name is required';
    if (!formData.shopName.trim()) newErrors.shopName = 'Shop name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.sellerShopAddress.trim()) newErrors.sellerShopAddress = 'Shop address is required';
    if (!formData.sellerContactNumber.trim()) newErrors.sellerContactNumber = 'Contact number is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.floorNumber) newErrors.floorNumber = 'Floor number is required';
    if (!profilePicture) newErrors.profilePicture = 'Profile picture is required';
    if (sellerShopImages.length === 0) newErrors.sellerShopImages = 'At least one shop image is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const sellerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        licenseId: formData.licenseId,
        mallName: formData.mallName,
        shopName: formData.shopName,
        category: formData.category,
        sellerShopAddress: formData.sellerShopAddress,
        sellerContactNumber: formData.sellerContactNumber,
        location: formData.location,
        floorNumber: formData.floorNumber,
      };

      const data = await sellerApi.registerSellerStall(sellerData, profilePicture, sellerShopImages);
      console.log('Registration success:', data);

      // Redirect to OTP verification, passing email along
      navigate('/stall-owner/verify-otp', { state: { email: data.email } });
    } catch (error) {
      console.error('Registration error:', error);
      setApiError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <AuthLayout type="register" role="stall-owner" backLink="/stall-owner/login">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-xl">

        {/* API Error Banner */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {apiError}
          </div>
        )}

        {/* Profile Section - MOVED TO TOP */}
        <div className="mb-8 pb-6 border-b-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaUser className="text-purple-600" />
            Profile Information
          </h2>
          
          {/* Profile Picture */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Profile Picture <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-purple-300 shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <FaImage className="text-gray-400 text-2xl" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleProfilePicture}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: Square image, 400x400px</p>
              </div>
            </div>
            {errors.profilePicture && (
              <p className="text-red-500 text-xs mt-1">{errors.profilePicture}</p>
            )}
          </div>

          {/* Shop Images */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Shop Images <span className="text-red-500">*</span>{' '}
              <span className="text-gray-400 font-normal">(1–5 images)</span>
            </label>
            <input
              type="file"
              name="sellerShopImage"
              accept="image/*"
              multiple
              onChange={handleShopImages}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            {shopImagePreviews.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {shopImagePreviews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Shop ${i + 1}`}
                    className="w-20 h-20 rounded-lg object-cover border-2 border-gray-300 hover:border-purple-400 transition-colors"
                  />
                ))}
              </div>
            )}
            {errors.sellerShopImages && (
              <p className="text-red-500 text-xs mt-1">{errors.sellerShopImages}</p>
            )}
          </div>
        </div>

        {/* Business Information Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaStore className="text-purple-600" />
            Business Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FormInput
              label="Shop Name"
              type="text"
              name="shopName"
              placeholder="Fashion Hub"
              value={formData.shopName}
              onChange={handleChange}
              error={errors.shopName}
              icon={<FaStore className="text-gray-400" />}
              required
            />

            <FormInput
              label="Mall Name"
              type="text"
              name="mallName"
              placeholder="City Mall"
              value={formData.mallName}
              onChange={handleChange}
              error={errors.mallName}
              icon={<FaBuilding className="text-gray-400" />}
              required
            />

            <FormInput
              label="License ID"
              type="text"
              name="licenseId"
              placeholder="LIC-2024-001"
              value={formData.licenseId}
              onChange={handleChange}
              error={errors.licenseId}
              icon={<FaIdCard className="text-gray-400" />}
              required
            />

            <FormInput
              label="Category"
              type="text"
              name="category"
              placeholder="Fashion, Food, Electronics..."
              value={formData.category}
              onChange={handleChange}
              error={errors.category}
              icon={<FaTags className="text-gray-400" />}
              required
            />

            <FormInput
              label="Contact Number"
              type="tel"
              name="sellerContactNumber"
              placeholder="+1 234 567 8900"
              value={formData.sellerContactNumber}
              onChange={handleChange}
              error={errors.sellerContactNumber}
              icon={<FaPhone className="text-gray-400" />}
              required
            />

            <FormInput
              label="Location"
              type="text"
              name="location"
              placeholder="Hyderabad"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              icon={<FaMapMarkerAlt className="text-gray-400" />}
              required
            />

            <FormInput
              label="Floor Number"
              type="text"
              name="floorNumber"
              placeholder="1"
              value={formData.floorNumber}
              onChange={handleChange}
              error={errors.floorNumber}
              required
            />
          </div>
        </div>

        {/* Shop Address */}
        <div className="mt-6 mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Shop Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <FaMapMarkerAlt className="text-gray-400" />
            </div>
            <textarea
              name="sellerShopAddress"
              className={`w-full px-4 py-3 pl-10 rounded-lg border-2 focus:outline-none focus:border-purple-500 min-h-[100px] resize-none ${
                errors.sellerShopAddress ? 'border-red-400' : 'border-gray-300'
              }`}
              placeholder="Full shop address including mall name..."
              value={formData.sellerShopAddress}
              onChange={handleChange}
              required
            />
          </div>
          {errors.sellerShopAddress && (
            <p className="text-red-500 text-xs mt-1">{errors.sellerShopAddress}</p>
          )}
        </div>

        {/* Owner Information Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaUser className="text-purple-600" />
            Owner Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FormInput
              label="Full Name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              icon={<FaUser className="text-gray-400" />}
              required
            />

            <FormInput
              label="Email Address"
              type="email"
              name="email"
              placeholder="owner@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<FaEnvelope className="text-gray-400" />}
              required
            />
          </div>
        </div>

        {/* Password Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaLock className="text-purple-600" />
            Security
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Password Field */}
            <div className="relative">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:outline-none focus:border-purple-500 ${
                    errors.password ? 'border-red-400' : 'border-gray-300'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCheck className="text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:outline-none focus:border-purple-500 ${
                    errors.confirmPassword ? 'border-red-400' : 'border-gray-300'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        </div>

        {/* Agreement */}
        <div className="mt-8 mb-8">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="agreement"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
              required
            />
            <label htmlFor="agreement" className="ml-2 block text-sm text-gray-700">
              I agree to the stall owner agreement and mall regulations
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-70"
        >
          {isLoading ? 'Registering Stall...' : 'Register Stall'}
        </button>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already registered?{' '}
            <Link to="/stall-owner/login" className="text-purple-600 hover:text-purple-800 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default StallOwnerRegister;