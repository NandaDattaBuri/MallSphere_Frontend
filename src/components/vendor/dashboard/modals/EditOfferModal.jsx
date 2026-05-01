// components/EditOfferModal.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaImage, FaSpinner, FaTrash } from 'react-icons/fa';
import vendorApi from '../../../../hooks/vendorApi';

const EditOfferModal = ({ offer, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    offerTitle: '',
    offerDescription: '',
    offerType: 'flat',
    offerValue: '',
    offerStartDate: '',
    offerEndDate: '',
    offerTermsAndConditions: ''
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (offer && isOpen) {
      try {
        console.log('Editing offer:', offer);

        let startDate = '';
        let endDate = '';

        if (offer.offerStartDate) {
          const date = new Date(offer.offerStartDate);
          if (!isNaN(date.getTime())) {
            startDate = date.toISOString().slice(0, 16);
          }
        }

        if (offer.offerEndDate) {
          const date = new Date(offer.offerEndDate);
          if (!isNaN(date.getTime())) {
            endDate = date.toISOString().slice(0, 16);
          }
        }

        setFormData({
          offerTitle: offer.offerTitle || '',
          offerDescription: offer.offerDescription || '',
          offerType: offer.offerType || 'flat',
          offerValue: offer.offerValue || '',
          offerStartDate: startDate,
          offerEndDate: endDate,
          offerTermsAndConditions: offer.offerTermsAndConditions || ''
        });

        setExistingImages(offer.offerImages || []);
        setNewImages([]);
        setError('');
      } catch (err) {
        console.error('Error setting form data:', err);
        setError('Error loading offer data');
      }
    }
  }, [offer, isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    try {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => file.type.startsWith('image/'));

      if (validFiles.length + newImages.length + existingImages.length > 4) {
        setError('Maximum 4 images allowed');
        return;
      }

      setNewImages(prev => [...prev, ...validFiles]);
      setError('');
    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Error uploading images');
    }
  };

  const removeExistingImage = (publicId) => {
    setExistingImages(prev => prev.filter(img => img.publicId !== publicId));
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!offer || !offer.offerId) {
      setError('Invalid offer data');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!formData.offerStartDate || !formData.offerEndDate) {
        setError('Please select both start and end dates');
        setLoading(false);
        return;
      }

      const startDate = new Date(formData.offerStartDate);
      const endDate = new Date(formData.offerEndDate);
      const now = new Date();

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        setError('Invalid date format');
        setLoading(false);
        return;
      }

      if (endDate <= now) {
        setError('End date must be in the future');
        setLoading(false);
        return;
      }

      if (endDate <= startDate) {
        setError('End date must be after start date');
        setLoading(false);
        return;
      }

      const offerValue = parseFloat(formData.offerValue);
      if (isNaN(offerValue) || offerValue <= 0) {
        setError('Please enter a valid offer value');
        setLoading(false);
        return;
      }

      if (formData.offerType === 'percentage' && (offerValue <= 0 || offerValue > 100)) {
        setError('Percentage discount must be between 1 and 100');
        setLoading(false);
        return;
      }

      const offerData = {
        offerTitle: formData.offerTitle,
        offerDescription: formData.offerDescription,
        offerType: formData.offerType,
        offerValue: offerValue,
        offerStartDate: startDate.toISOString(),
        offerEndDate: endDate.toISOString(),
        offerTermsAndConditions: formData.offerTermsAndConditions
      };

      console.log('Submitting offer update:', offerData);

      const response = await vendorApi.editOffer(offer.offerId, offerData, newImages);

      console.log('Edit offer response:', response);

      if (response && response.success) {
        if (onSuccess) onSuccess(response.data || response);
        if (onClose) onClose();
      } else {
        setError(response?.message || 'Failed to update offer');
      }
    } catch (err) {
      console.error('Edit offer error:', err);
      setError(err.message || 'An error occurred while updating the offer');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !offer) return null;

  return createPortal(
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
      className="flex items-center justify-center p-4"
    >
      <div
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(107,114,128,0.75)' }}
        onClick={onClose}
      />

      <div
        className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl w-full max-w-lg max-h-screen overflow-y-auto"
        style={{ zIndex: 10000 }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit Offer</h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Offer Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offer Title *
                </label>
                <input
                  type="text"
                  name="offerTitle"
                  value={formData.offerTitle}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Summer Sale, Weekend Special"
                />
              </div>

              {/* Offer Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="offerDescription"
                  value={formData.offerDescription}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  placeholder="Describe your offer details..."
                />
              </div>

              {/* Offer Type & Value */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Offer Type *
                  </label>
                  <select
                    name="offerType"
                    value={formData.offerType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="flat">Flat Discount (AED)</option>
                    <option value="percentage">Percentage Discount (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value *
                  </label>
                  <input
                    type="number"
                    name="offerValue"
                    value={formData.offerValue}
                    onChange={handleInputChange}
                    required
                    min={formData.offerType === 'percentage' ? 1 : 0}
                    max={formData.offerType === 'percentage' ? 100 : undefined}
                    step={formData.offerType === 'percentage' ? 1 : 'any'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.offerType === 'percentage' 
                      ? 'Enter percentage (1-100)' 
                      : 'Enter amount in AED (e.g., 50 for 50 AED off)'}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="datetime-local"
                    name="offerStartDate"
                    value={formData.offerStartDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="datetime-local"
                    name="offerEndDate"
                    value={formData.offerEndDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Terms & Conditions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Terms & Conditions
                </label>
                <textarea
                  name="offerTermsAndConditions"
                  value={formData.offerTermsAndConditions}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  placeholder="Terms and conditions apply..."
                />
              </div>

              {/* Images Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Images (Max 4)
                </label>

                {existingImages.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">Current Images:</p>
                    <div className="flex flex-wrap gap-2">
                      {existingImages.map((img, idx) => (
                        <div key={img.publicId || idx} className="relative">
                          <img
                            src={img.url}
                            alt={`Offer ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(img.publicId)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <FaTrash className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {newImages.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">New Images:</p>
                    <div className="flex flex-wrap gap-2">
                      {newImages.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`Preview ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(idx)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <FaTrash className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {existingImages.length + newImages.length < 4 && (
                  <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <FaImage className="mr-2 text-gray-600" />
                    <span className="text-sm text-gray-600">Add Images</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {4 - (existingImages.length + newImages.length)} slots remaining
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                'Update Offer'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditOfferModal;