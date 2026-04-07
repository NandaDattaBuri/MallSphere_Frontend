import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import FormInput from '../../components/FormInput';
import { vendorApi } from '../../hooks/vendorApi';
import { 
  FaBuilding, 
  FaEnvelope,
  FaUser, 
  FaMapMarkerAlt, 
  FaPhone,
  FaLock,
  FaCheck,
  FaClock,
  FaAlignLeft,
  FaCamera,
  FaUpload,
  FaImages,
  FaTrash
} from 'react-icons/fa';

const VendorRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    mallName: '',
    shopAddress: '',
    phoneNumber: '',
    vendorLicenseNumber: '',
    vendorShopOpeningTime: '09:00 AM',
    vendorShopClosingTime: '09:00 PM',
    vendorShopDescription: '',
    vendorShopNumberOfFloors: '',
    vendorShopNumberOfStalls: '',
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState('');
  const [shopImages, setShopImages] = useState([]);
  const [shopImagePreviews, setShopImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [apiError, setApiError] = useState('');
  const totalSteps = 3;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profileImage: 'File size should be less than 5MB' }));
        return;
      }
      
      // Check file type
      if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/jpg')) {
        setErrors(prev => ({ ...prev, profileImage: 'Only JPG, JPEG, and PNG files are allowed' }));
        return;
      }
      
      setProfileImage(file);
      setErrors(prev => ({ ...prev, profileImage: '' }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShopImagesChange = (e) => {
    const files = Array.from(e.target.files);
    let validFiles = [];
    let invalidFiles = [];
    
    files.forEach(file => {
      // Check file size (max 5MB per image)
      if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name} - File too large (max 5MB)`);
        return;
      }
      
      // Check file type
      if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/jpg')) {
        invalidFiles.push(`${file.name} - Invalid file type (only JPG, JPEG, PNG)`);
        return;
      }
      
      validFiles.push(file);
    });
    
    if (invalidFiles.length > 0) {
      setErrors(prev => ({ 
        ...prev, 
        shopImages: `Invalid files: ${invalidFiles.join(', ')}` 
      }));
    }
    
    if (validFiles.length > 0) {
      const updatedShopImages = [...shopImages, ...validFiles].slice(0, 10); // Limit to 10 images
      setShopImages(updatedShopImages);
      setErrors(prev => ({ ...prev, shopImages: '' }));
      
      //previews for new files
      const newPreviews = [];
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result);
          if (newPreviews.length === validFiles.length) {
            setShopImagePreviews(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeShopImage = (index) => {
    const updatedImages = [...shopImages];
    const updatedPreviews = [...shopImagePreviews];
    
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    
    setShopImages(updatedImages);
    setShopImagePreviews(updatedPreviews);
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!profileImage) newErrors.profileImage = 'Profile picture is required';
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.location.trim()) newErrors.location = 'Location is required';
      if (!formData.mallName.trim()) newErrors.mallName = 'Mall name is required';
    }
    
    if (step === 2) {
      if (!formData.shopAddress.trim()) newErrors.shopAddress = 'Shop address is required';
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
      else if (!/^\+?[\d\s-]{10,}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
        newErrors.phoneNumber = 'Valid phone number is required';
      }
      if (!formData.vendorLicenseNumber.trim()) newErrors.vendorLicenseNumber = 'License number is required';
      
      if (!formData.vendorShopNumberOfFloors) newErrors.vendorShopNumberOfFloors = 'Number of floors is required';
      else if (isNaN(formData.vendorShopNumberOfFloors) || formData.vendorShopNumberOfFloors <= 0) {
        newErrors.vendorShopNumberOfFloors = 'Must be a positive number';
      }
      
      if (!formData.vendorShopNumberOfStalls) newErrors.vendorShopNumberOfStalls = 'Number of stalls is required';
      else if (isNaN(formData.vendorShopNumberOfStalls) || formData.vendorShopNumberOfStalls <= 0) {
        newErrors.vendorShopNumberOfStalls = 'Must be a positive number';
      }
    }
    
    if (step === 3) {
      if (!formData.vendorShopOpeningTime.trim()) newErrors.vendorShopOpeningTime = 'Opening time is required';
      if (!formData.vendorShopClosingTime.trim()) newErrors.vendorShopClosingTime = 'Closing time is required';
      if (!formData.vendorShopDescription.trim()) newErrors.vendorShopDescription = 'Shop description is required';
      
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm password';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const nextStep = () => {
    const validationErrors = validateStep(currentStep);
    if (Object.keys(validationErrors).length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // In VendorRegister.jsx - Replace the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all steps
    let allErrors = {};
    for (let step = 1; step <= totalSteps; step++) {
      const stepErrors = validateStep(step);
      allErrors = { ...allErrors, ...stepErrors };
    }
    
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      const firstErrorStep = Object.keys(allErrors)[0];
      if (firstErrorStep === 'profileImage' || firstErrorStep === 'name' || firstErrorStep === 'email' || 
          firstErrorStep === 'location' || firstErrorStep === 'mallName') {
        setCurrentStep(1);
              console.log('Profile image before submit:', profileImage);
      console.log('Profile image type:', profileImage?.type);
      console.log('Profile image size:', profileImage?.size);
      } else if (firstErrorStep === 'shopAddress' || firstErrorStep === 'phoneNumber' || 
                firstErrorStep === 'vendorLicenseNumber' || firstErrorStep === 'vendorShopNumberOfFloors' || 
                firstErrorStep === 'vendorShopNumberOfStalls') {
        setCurrentStep(2);
      } else {
        setCurrentStep(3);
      }

      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      console.log('Submitting form data:', formData);
      const response = await vendorApi.registerVendor(formData, profileImage, shopImages);
      console.log('API Response:', response);
      
      // Store verification data in localStorage
      localStorage.setItem('pendingVendorVerification', JSON.stringify({
        email: formData.email,
        vendorLicenseNumber: formData.vendorLicenseNumber,
        name: formData.name,
        mallName: formData.mallName,
        registrationTime: new Date().toISOString()
      }));
      
      // Redirect to OTP verification page
      navigate('/vendor/verify-otp', {
        state: {
          email: formData.email,
          vendorLicenseNumber: formData.vendorLicenseNumber,
          fromRegistration: true,
          message: 'Registration successful! Please verify your email with the OTP sent.'
        }
      });
      
    } catch (error) {
      console.error('Registration failed:', error);
      setApiError(error.message || 'Registration failed. Please try again.');
      window.scrollTo(0, 0);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step === currentStep 
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white' 
                : step < currentStep 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gray-100 text-gray-400'
            }`}>
              {step < currentStep ? '✓' : step}
            </div>
            <span className="text-xs mt-2 text-gray-600">
              {step === 1 ? 'Profile & Basic Info' : step === 2 ? 'Shop Details' : 'Timings & Security'}
            </span>
          </div>
        ))}
      </div>
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200"></div>
        <div 
          className="absolute top-0 left-0 h-1 bg-gradient-to-r from-indigo-600 to-indigo-700 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <AuthLayout type="register" role="vendor" backLink="/vendor/login">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-xl">
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium">{apiError}</p>
          </div>
        )}

        {renderStepIndicator()}

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Vendor Registration</h3>
            <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-xs font-semibold rounded-full">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
        </div>

        {currentStep === 1 && (
          <>
            {/* Profile Picture Upload */}
            <div className="mb-8 text-center">
              <label className="block text-gray-700 text-sm font-semibold mb-4">
                Profile Picture *
              </label>
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                    {profilePreview ? (
                      <img 
                        src={profilePreview} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  <label 
                    htmlFor="profile-upload"
                    className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition"
                  >
                    <FaCamera className="w-4 h-4" />
                  </label>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  Click camera icon to upload profile picture
                </p>
                <p className="text-xs text-gray-400">
                  Supported: JPG, PNG • Max: 5MB
                </p>
                {errors.profileImage && (
                  <p className="text-red-500 text-sm mt-2">{errors.profileImage}</p>
                )}
              </div>
            </div>

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

            <FormInput
              label="Mall Name *"
              type="text"
              name="mallName"
              placeholder="Your mall name"
              value={formData.mallName}
              onChange={handleChange}
              error={errors.mallName}
              icon={<FaBuilding className="text-gray-400" />}
              required
            />
          </>
        )}

        {currentStep === 2 && (
          <>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Shop Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-gray-400" />
                </div>
                <textarea
                  name="shopAddress"
                  className="w-full px-4 py-3 pl-10 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-indigo-500 min-h-[80px] resize-none"
                  placeholder="Complete shop address..."
                  value={formData.shopAddress}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.shopAddress && <p className="text-red-500 text-sm mt-1">{errors.shopAddress}</p>}
            </div>

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
              label="License Number *"
              type="text"
              name="vendorLicenseNumber"
              placeholder="LIC12345"
              value={formData.vendorLicenseNumber}
              onChange={handleChange}
              error={errors.vendorLicenseNumber}
              required
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FormInput
                label="Number of Floors *"
                type="number"
                name="vendorShopNumberOfFloors"
                placeholder="2"
                value={formData.vendorShopNumberOfFloors}
                onChange={handleChange}
                error={errors.vendorShopNumberOfFloors}
                required
              />

              <FormInput
                label="Number of Stalls *"
                type="number"
                name="vendorShopNumberOfStalls"
                placeholder="10"
                value={formData.vendorShopNumberOfStalls}
                onChange={handleChange}
                error={errors.vendorShopNumberOfStalls}
                required
              />
            </div>

            {/* Shop Images Upload */}
            <div className="mt-8 mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-4">
                Shop Images (Upload multiple images of your shop)
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
                <div className="text-center">
                  <FaImages className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">Upload photos of your shop/mall</p>
                  <p className="text-sm text-gray-500 mb-4">
                    You can upload multiple images (max 10)
                  </p>
                  
                  <label className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition">
                    <FaUpload className="w-4 h-4 mr-2" />
                    Choose Images
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleShopImagesChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              
              {shopImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Selected Images ({shopImages.length}/10):
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {shopImagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={preview} 
                          alt={`Shop image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeShopImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center rounded-b-lg">
                          {shopImages[index].name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {errors.shopImages && (
                <p className="text-yellow-600 text-sm mt-2">{errors.shopImages}</p>
              )}
              
              <p className="text-xs text-gray-500 mt-2">
                • Upload clear images of your shop
                <br />
                • Supported formats: JPG, PNG
                <br />
                • Max file size: 5MB per image
                <br />
                • Max images: 10
              </p>
            </div>
          </>
        )}

        {currentStep === 3 && (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Opening Time *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaClock className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="vendorShopOpeningTime"
                    placeholder="09:00 AM"
                    value={formData.vendorShopOpeningTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-10 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                {errors.vendorShopOpeningTime && <p className="text-red-500 text-sm mt-1">{errors.vendorShopOpeningTime}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Closing Time *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaClock className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="vendorShopClosingTime"
                    placeholder="09:00 PM"
                    value={formData.vendorShopClosingTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-10 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                {errors.vendorShopClosingTime && <p className="text-red-500 text-sm mt-1">{errors.vendorShopClosingTime}</p>}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Shop Description *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                  <FaAlignLeft className="text-gray-400" />
                </div>
                <textarea
                  name="vendorShopDescription"
                  className="w-full px-4 py-3 pl-10 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-indigo-500 min-h-[100px] resize-none"
                  placeholder="Describe your shop/mall..."
                  value={formData.vendorShopDescription}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.vendorShopDescription && <p className="text-red-500 text-sm mt-1">{errors.vendorShopDescription}</p>}
            </div>

            <FormInput
              label="Password *"
              type="password"
              name="password"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={<FaLock className="text-gray-400" />}
              required
            />

            <FormInput
              label="Confirm Password *"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={<FaCheck className="text-gray-400" />}
              required
            />

            <div className="mt-8 mb-8">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreement"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
                  required
                />
                <label htmlFor="agreement" className="ml-2 block text-sm text-gray-700">
                  I agree to the terms and conditions, and confirm that all information provided is accurate
                </label>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition duration-300"
            >
              Previous
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className={`px-6 py-3 ${
                currentStep > 1 ? 'ml-auto' : ''
              } bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-indigo-800 transition duration-300`}
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 ${
                currentStep > 1 ? 'ml-auto' : ''
              } bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition duration-300 disabled:opacity-70`}
            >
              {isLoading ? 'Registering...' : 'Complete Registration'}
            </button>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already registered?{' '}
            <Link to="/vendor/login" className="text-indigo-600 hover:text-indigo-800 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </form>

      <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
        <h4 className="font-bold text-gray-900 mb-2">Support</h4>
        <p className="text-sm text-gray-600 mb-4">
          Need help with registration? Contact our support team.
        </p>
        <div className="flex items-center text-sm">
          <FaPhone className="h-4 w-4 text-indigo-600 mr-2" />
          <span className="text-gray-700">Support: +1 (555) 123-4567</span>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VendorRegister;