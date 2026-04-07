import React from 'react';
import { X } from 'lucide-react';

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
  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="df text-xl font-semibold text-stone-900">{editing ? "Edit Offer" : "Create New Offer"}</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-stone-100 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Offer Title *</label>
            <input 
              required 
              value={form.offerTitle} 
              onChange={e => handleChange("offerTitle", e.target.value)} 
              placeholder="e.g. Summer Special" 
              className={inputCls} 
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Description *</label>
            <textarea 
              required 
              rows={2} 
              value={form.offerDescription} 
              onChange={e => handleChange("offerDescription", e.target.value)} 
              placeholder="Describe the offer…" 
              className={`${inputCls} resize-none`} 
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Terms & Conditions</label>
            <textarea 
              rows={2} 
              value={form.offerTermsAndConditions} 
              onChange={e => handleChange("offerTermsAndConditions", e.target.value)} 
              placeholder="Terms and conditions…" 
              className={`${inputCls} resize-none`} 
            />
          </div>

          {/* Image Upload */}
          {!editing && (
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Offer Images * (Max 4)</label>
              <input 
                type="file" 
                accept="image/jpeg,image/png,image/jpg,image/webp"
                multiple 
                onChange={onImageChange}
                className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-stone-50 file:text-stone-700 hover:file:bg-stone-100"
              />
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-16 object-cover rounded-lg" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Discount Type</label>
              <select 
                value={form.offerType} 
                onChange={e => handleChange("offerType", e.target.value)} 
                className={inputCls}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Value *</label>
              <input 
                required 
                type="number" 
                min="1" 
                max={form.offerType === 'percentage' ? '100' : undefined}
                value={form.offerValue} 
                onChange={e => handleChange("offerValue", e.target.value)} 
                placeholder={form.offerType === 'percentage' ? '1-100' : 'Amount'} 
                className={inputCls} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Start Date *</label>
              <input 
                required 
                type="date" 
                value={form.offerStartDate} 
                min={new Date().toISOString().split('T')[0]}
                onChange={e => handleChange("offerStartDate", e.target.value)} 
                className={inputCls} 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">End Date *</label>
              <input 
                required 
                type="date" 
                value={form.offerEndDate} 
                min={form.offerStartDate}
                onChange={e => handleChange("offerEndDate", e.target.value)} 
                className={inputCls} 
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50">
              {loading ? "Saving..." : (editing ? "Update Offer" : "Create Offer")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditOfferModal;