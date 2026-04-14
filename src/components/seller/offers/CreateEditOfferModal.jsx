import React, { useState, useEffect } from 'react';
import { X, Zap, Calendar } from 'lucide-react';

const inputCls = "w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-800 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-100 transition-all bg-white";

const CreateEditOfferModal = ({
  isOpen,
  onClose,
  form,
  setForm,
  editing,
  imageFiles,
  imagePreviews,
  onImageChange,
  onSubmit,
  loading
}) => {
  // FIX: Determine initial offer type based on editing data
  const getInitialOfferType = () => {
    if (editing) {
      // Check if it's a flash deal by looking for flash-specific fields
      const isFlashDeal = form.isFlashDeal || 
                         !!form.flashDealTitle || 
                         form.offerCategory === 'flash' ||
                         !!form.flashDealStartTime ||
                         !!form.status; // flash deals have status instead of offerStatus
      
      return isFlashDeal ? 'flash' : 'regular';
    }
    return form.offerCategory || 'regular';
  };

  const [offerType, setOfferType] = useState(getInitialOfferType());

  // FIX: Update offerType when editing prop changes
  useEffect(() => {
    if (editing) {
      const isFlashDeal = form.isFlashDeal || 
                         !!form.flashDealTitle || 
                         form.offerCategory === 'flash' ||
                         !!form.flashDealStartTime ||
                         !!form.status;
      
      setOfferType(isFlashDeal ? 'flash' : 'regular');
    }
  }, [editing, form]);

  if (!isOpen) return null;

  const isFlash = offerType === 'flash';

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleOfferTypeChange = (type) => {
    setOfferType(type);
    handleChange("offerCategory", type);
    
    if (type === 'flash') {
      // Initialize flash deal specific fields from regular offer fields if they exist
      if (!form.flashDealTitle && form.offerTitle) handleChange("flashDealTitle", form.offerTitle);
      if (!form.flashDealDescription && form.offerDescription) handleChange("flashDealDescription", form.offerDescription);
      if (!form.flashDealType && form.offerType) handleChange("flashDealType", form.offerType);
      if (!form.flashDealValue && form.offerValue) handleChange("flashDealValue", form.offerValue);
      if (!form.flashDealTermsAndConditions && form.offerTermsAndConditions) handleChange("flashDealTermsAndConditions", form.offerTermsAndConditions);
      if (!form.flashDealStartTime) handleChange("flashDealStartTime", form.offerStartDate || "");
      if (!form.flashDealEndTime) handleChange("flashDealEndTime", form.offerEndDate || "");
      if (!form.timezone) handleChange("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);
    } else {
      // Initialize regular offer fields from flash deal data if they exist
      if (!form.offerTitle && form.flashDealTitle) handleChange("offerTitle", form.flashDealTitle);
      if (!form.offerDescription && form.flashDealDescription) handleChange("offerDescription", form.flashDealDescription);
      if (!form.offerType && form.flashDealType) handleChange("offerType", form.flashDealType);
      if (!form.offerValue && form.flashDealValue) handleChange("offerValue", form.flashDealValue);
      if (!form.offerTermsAndConditions && form.flashDealTermsAndConditions) handleChange("offerTermsAndConditions", form.flashDealTermsAndConditions);
      if (!form.offerStartDate && form.flashDealStartTime) {
        // Extract just the date part for regular offers
        const dateOnly = form.flashDealStartTime.split('T')[0];
        handleChange("offerStartDate", dateOnly);
      }
      if (!form.offerEndDate && form.flashDealEndTime) {
        const dateOnly = form.flashDealEndTime.split('T')[0];
        handleChange("offerEndDate", dateOnly);
      }
    }
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return '';
    const diffMs = new Date(end) - new Date(start);
    const diffHours = diffMs / (1000 * 60 * 60);
    if (diffHours < 1) return `${Math.floor(diffMs / 60000)} minutes`;
    if (diffHours < 24) return `${Math.floor(diffHours)}h ${Math.floor((diffHours % 1) * 60)}m`;
    const days = Math.floor(diffHours / 24);
    const hours = Math.floor(diffHours % 24);
    return `${days} day${days > 1 ? 's' : ''}${hours > 0 ? ` ${hours}h` : ''}`;
  };

  const validateForm = () => {
    if (isFlash) {
      if (!form.flashDealTitle?.trim()) { alert("Please enter flash deal title"); return false; }
      if (!form.flashDealDescription?.trim()) { alert("Please enter flash deal description"); return false; }
      if (!form.flashDealStartTime) { alert("Please set flash deal start time"); return false; }
      if (!form.flashDealEndTime) { alert("Please set flash deal end time"); return false; }
      if (!form.flashDealValue || Number(form.flashDealValue) <= 0) { alert("Please enter a valid discount value"); return false; }
      
      const start = new Date(form.flashDealStartTime);
      const end = new Date(form.flashDealEndTime);
      const now = new Date();
      
      // Only validate past dates for new deals, not when editing
      if (!editing && start < now) { alert("Start time cannot be in the past"); return false; }
      if (end <= start) { alert("End time must be after start time"); return false; }
      
      const diffHours = (end - start) / (1000 * 60 * 60);
      if (diffHours > 48) { alert("Flash deal duration cannot exceed 48 hours"); return false; }
      if (diffHours < 1) { alert("Flash deal duration must be at least 1 hour"); return false; }
      
      if (form.flashDealType === 'percentage') {
        const value = Number(form.flashDealValue);
        if (value <= 0 || value > 100) { alert("Percentage must be between 1 and 100"); return false; }
      }
    } else {
      if (!form.offerTitle?.trim()) { alert("Please enter offer title"); return false; }
      if (!form.offerDescription?.trim()) { alert("Please enter offer description"); return false; }
      if (!form.offerStartDate) { alert("Please set offer start date"); return false; }
      if (!form.offerEndDate) { alert("Please set offer end date"); return false; }
      if (!form.offerValue || Number(form.offerValue) <= 0) { alert("Please enter a valid discount value"); return false; }
      
      const start = new Date(form.offerStartDate);
      const end = new Date(form.offerEndDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Only validate past dates for new offers, not when editing
      if (!editing && start < today) { alert("Start date cannot be in the past"); return false; }
      if (end <= start) { alert("End date must be after start date"); return false; }
      
      if (form.offerType === 'percentage') {
        const value = Number(form.offerValue);
        if (value <= 0 || value > 100) { alert("Percentage must be between 1 and 100"); return false; }
      }
    }
    
    if (!editing && imagePreviews.length === 0) {
      alert(`Please upload at least one ${isFlash ? 'flash deal' : 'offer'} image`);
      return false;
    }
    
    return true;
  };

  const handleSubmitWrapper = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = { ...form };
      handleChange("offerCategory", offerType);
      onSubmit(e, submitData);
    }
  };

  const maxImages = isFlash ? 3 : 4;
  const canUploadMore = imagePreviews.length < maxImages;

  // FIX: Format datetime-local value for flash deals
  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16);
    } catch {
      return '';
    }
  };

  // FIX: Format date value for regular offers
  const formatDateValue = (dateString) => {
    if (!dateString) return '';
    try {
      return dateString.split('T')[0];
    } catch {
      return '';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-0">
          <div>
            <h2 className="df text-xl font-semibold text-stone-900 flex items-center gap-2">
              {isFlash && <Zap className="w-5 h-5 text-amber-500" />}
              {editing ? "Edit" : "Create New"} {isFlash ? 'Flash Deal' : 'Offer'}
            </h2>
            {isFlash && (
              <p className="text-xs text-amber-600 mt-1">⚡ Time-sensitive promotion with higher visibility</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-stone-100 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmitWrapper} className="p-6 space-y-4">

          {/* Offer Type - Disabled when editing */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">
              Promotion Type *
            </label>
            <select
              value={offerType}
              onChange={e => handleOfferTypeChange(e.target.value)}
              className={inputCls}
              disabled={editing} // FIX: Disabled when editing since you can't change type
            >
              <option value="regular">📅 Regular Offer</option>
              <option value="flash">⚡ Flash Deal</option>
            </select>
            {editing && (
              <p className="text-xs text-stone-400 mt-1">Promotion type cannot be changed when editing</p>
            )}
          </div>

          {/* Flash deal info banner */}
          {isFlash && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
              ⚡ Flash deals run for a limited time window (max 48 hours) and appear with urgency badges to shoppers.
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">
              {isFlash ? "Flash Deal Title" : "Offer Title"} *
            </label>
            <input
              required
              value={isFlash ? (form.flashDealTitle || '') : (form.offerTitle || '')}
              onChange={e => handleChange(isFlash ? "flashDealTitle" : "offerTitle", e.target.value)}
              placeholder={isFlash ? "e.g. 24-Hour Mega Sale ⚡" : "e.g. Summer Special"}
              className={inputCls}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Description *</label>
            <textarea
              required
              rows={2}
              value={isFlash ? (form.flashDealDescription || '') : (form.offerDescription || '')}
              onChange={e => handleChange(isFlash ? "flashDealDescription" : "offerDescription", e.target.value)}
              placeholder={isFlash ? "Describe your flash deal..." : "Describe the offer…"}
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Terms & Conditions */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Terms & Conditions</label>
            <textarea
              rows={2}
              value={isFlash ? (form.flashDealTermsAndConditions || '') : (form.offerTermsAndConditions || '')}
              onChange={e => handleChange(isFlash ? "flashDealTermsAndConditions" : "offerTermsAndConditions", e.target.value)}
              placeholder="Terms and conditions…"
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Images (create only) */}
          {!editing && (
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">
                {isFlash ? 'Flash Deal Images' : 'Offer Images'} * (Max {maxImages})
                {imagePreviews.length > 0 && (
                  <span className="ml-1 text-stone-400">({imagePreviews.length}/{maxImages})</span>
                )}
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                multiple
                onChange={onImageChange}
                disabled={!canUploadMore}
                className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-stone-50 file:text-stone-700 hover:file:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {!canUploadMore && (
                <p className="text-xs text-amber-600 mt-1">Maximum {maxImages} images reached</p>
              )}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-16 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => {
                          const newFiles = Array.from(imageFiles);
                          newFiles.splice(index, 1);
                          onImageChange({ target: { files: newFiles } });
                        }}
                        className="absolute top-0 right-0 -mt-1 -mr-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Discount Type + Value */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Discount Type</label>
              <select
                value={isFlash ? (form.flashDealType || 'percentage') : (form.offerType || 'percentage')}
                onChange={e => handleChange(isFlash ? "flashDealType" : "offerType", e.target.value)}
                className={inputCls}
              >
                <option value="percentage">📊 Percentage (%)</option>
                <option value="flat">💰 Flat Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Value *</label>
              <input
                required
                type="number"
                min="1"
                max={(isFlash ? form.flashDealType : form.offerType) === 'percentage' ? '100' : undefined}
                step={(isFlash ? form.flashDealType : form.offerType) === 'percentage' ? '1' : '0.01'}
                value={isFlash ? (form.flashDealValue || '') : (form.offerValue || '')}
                onChange={e => handleChange(isFlash ? "flashDealValue" : "offerValue", e.target.value)}
                placeholder={(isFlash ? form.flashDealType : form.offerType) === 'percentage' ? '1–100' : 'Amount'}
                className={inputCls}
              />
            </div>
          </div>

          {/* Date / Time fields */}
          {isFlash ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1.5">Start Date & Time *</label>
                  <input
                    required
                    type="datetime-local"
                    value={formatDateTimeLocal(form.flashDealStartTime)}
                    min={!editing ? new Date().toISOString().slice(0, 16) : undefined}
                    onChange={e => handleChange("flashDealStartTime", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1.5">End Date & Time *</label>
                  <input
                    required
                    type="datetime-local"
                    value={formatDateTimeLocal(form.flashDealEndTime)}
                    min={form.flashDealStartTime ? formatDateTimeLocal(form.flashDealStartTime) : undefined}
                    onChange={e => handleChange("flashDealEndTime", e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Timezone *</label>
                <select
                  required
                  value={form.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}
                  onChange={e => handleChange("timezone", e.target.value)}
                  className={inputCls}
                >
                  <option value="Asia/Kolkata">🇮🇳 India (IST)</option>
                  <option value="Asia/Dubai">🇦🇪 Dubai (GST)</option>
                  <option value="America/New_York">🇺🇸 USA Eastern (EST)</option>
                  <option value="America/Los_Angeles">🇺🇸 USA Pacific (PST)</option>
                  <option value="Europe/London">🇬🇧 UK (GMT)</option>
                  <option value="Europe/Paris">🇫🇷 France (CET)</option>
                  <option value="Australia/Sydney">🇦🇺 Australia (AEDT)</option>
                  <option value="Asia/Tokyo">🇯🇵 Japan (JST)</option>
                  <option value="Asia/Singapore">🇸🇬 Singapore (SGT)</option>
                </select>
              </div>

              {form.flashDealStartTime && form.flashDealEndTime && (
                <div className="bg-amber-50 rounded-lg px-4 py-2.5 border border-amber-100 flex items-center justify-between text-xs">
                  <span className="text-amber-700 font-medium">⏱️ Duration:</span>
                  <span className="text-amber-600 font-semibold">
                    {calculateDuration(form.flashDealStartTime, form.flashDealEndTime)}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Start Date *</label>
                <input
                  required
                  type="date"
                  value={formatDateValue(form.offerStartDate)}
                  min={!editing ? new Date().toISOString().split('T')[0] : undefined}
                  onChange={e => handleChange("offerStartDate", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">End Date *</label>
                <input
                  required
                  type="date"
                  value={formatDateValue(form.offerEndDate)}
                  min={form.offerStartDate ? formatDateValue(form.offerStartDate) : undefined}
                  onChange={e => handleChange("offerEndDate", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-2.5 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 ${
                isFlash ? 'bg-amber-600 hover:bg-amber-700' : 'bg-stone-900 hover:bg-stone-800'
              }`}
            >
              {loading ? "Saving..." : (editing ? "Update" : "Create")}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateEditOfferModal;