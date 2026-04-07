export const emptyForm = () => ({
  offerTitle: "", 
  offerDescription: "", 
  offerType: "percentage", 
  offerValue: "",
  offerStartDate: new Date().toISOString().split("T")[0],
  offerEndDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
  offerTermsAndConditions: "",
  offerImages: [],
  shopId: localStorage.getItem('shopId') || "",
});

export const calculateStats = (offers) => ({
  all: offers.length,
  active: offers.filter(o => o.offerStatus === 'active').length,
  scheduled: offers.filter(o => o.offerStatus === 'scheduled').length,
  expired: offers.filter(o => o.offerStatus === 'expired').length,
  disabled: offers.filter(o => o.offerStatus === 'disabled').length
});

export const filterOffers = (offers, filter, search) => {
  return offers
    .filter(o => filter === "all" || o.offerStatus === filter)
    .filter(o =>
      (o.offerTitle?.toLowerCase().includes(search.toLowerCase()) ||
       o.offerDescription?.toLowerCase().includes(search.toLowerCase()))
    );
};

export const validateOfferDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (start < today) {
    return { valid: false, error: 'Start date cannot be in the past' };
  }
  if (end <= start) {
    return { valid: false, error: 'End date must be after start date' };
  }
  return { valid: true };
};

export const validateDiscountValue = (type, value) => {
  const numValue = Number(value);
  if (type === 'percentage') {
    if (numValue < 1 || numValue > 100) {
      return { valid: false, error: 'Percentage discount must be between 1 and 100' };
    }
  } else if (type === 'flat') {
    if (numValue <= 0) {
      return { valid: false, error: 'Discount value must be greater than 0' };
    }
  }
  return { valid: true };
};

export const getChangedFields = (original, updated) => {
  const changes = {};
  
  if (updated.offerTitle !== original.offerTitle) {
    changes.offerTitle = updated.offerTitle;
  }
  if (updated.offerDescription !== original.offerDescription) {
    changes.offerDescription = updated.offerDescription;
  }
  
  const originalStartDate = original.offerStartDate?.split('T')[0] || original.offerStartDate;
  const originalEndDate = original.offerEndDate?.split('T')[0] || original.offerEndDate;
  
  if (updated.offerStartDate !== originalStartDate) {
    changes.offerStartDate = updated.offerStartDate;
  }
  if (updated.offerEndDate !== originalEndDate) {
    changes.offerEndDate = updated.offerEndDate;
  }
  
  if (updated.offerTermsAndConditions !== original.offerTermsAndConditions) {
    changes.offerTermsAndConditions = updated.offerTermsAndConditions;
  }
  if (updated.offerType !== original.offerType) {
    changes.offerType = updated.offerType;
  }
  if (updated.offerValue !== original.offerValue) {
    changes.offerValue = updated.offerValue;
  }
  
  return changes;
};