// sellerApi.js
const API_BASE_URL = 'https://mallsperebackend-uh9h.onrender.com/api';
const SELLER_URL = `${API_BASE_URL}/seller`;

let isRefreshing = false;
let failedQueue = [];

// ────────────────────────────────────────────────
// QUEUE MANAGEMENT
// ────────────────────────────────────────────────
const processQueue = (error = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
};

// ────────────────────────────────────────────────
// ERROR HANDLER
// ────────────────────────────────────────────────
const handleApiError = (error, context = '') => {
  console.error(`API Error ${context}:`, error);

  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    throw new Error('Network error. Please check your internet connection.');
  }

  if (error.status) {
    switch (error.status) {
      case 401:
        throw new Error('Your session has expired. Please login again.');
      case 403:
        if (
          error.message?.toLowerCase().includes('approv') ||
          error.message?.toLowerCase().includes('pending')
        ) {
          throw new Error(
            'Your account is pending approval. Please wait for vendor verification.'
          );
        }
        throw new Error('You do not have permission to perform this action.');
      case 404:
        throw new Error('The requested resource was not found.');
      case 429:
        throw new Error('Too many requests. Please try again later.');
      case 500:
      case 502:
      case 503:
        throw new Error('Server error. Please try again later.');
      default:
        throw new Error(
          error.message || `Request failed with status ${error.status}`
        );
    }
  }

  if (error instanceof Error) throw error;
  throw new Error(error?.message || 'An unexpected error occurred');
};

// ────────────────────────────────────────────────
// CORE: authenticatedFetch
// ────────────────────────────────────────────────
const authenticatedFetch = async (url, options = {}) => {
  const buildOptions = (opts) => {
    const built = {
      ...opts,
      credentials: 'include',
      headers: { ...(opts.headers || {}) },
    };
    if (opts.body instanceof FormData) {
      delete built.headers['Content-Type'];
    } else if (!built.headers['Content-Type']) {
      built.headers['Content-Type'] = 'application/json';
    }
    return built;
  };

  const defaultOptions = buildOptions(options);

  // First attempt
  let response;
  try {
    response = await fetch(url, defaultOptions);
  } catch (networkError) {
    throw { status: 0, message: 'Network error. Please check your connection.' };
  }

  // Handle 401
  if (response.status === 401) {
    console.log(`[Auth] 401 on ${url}`);

    if (isRefreshing) {
      console.log('[Auth] Refresh in progress, queuing...');
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => {
        console.log('[Auth] Retrying queued request:', url);
        return fetch(url, defaultOptions).then(async (retryRes) => {
          if (!retryRes.ok) {
            const errData = await retryRes.json().catch(() => ({}));
            throw {
              status: retryRes.status,
              message: errData.message || `Request failed with status ${retryRes.status}`,
            };
          }
          return retryRes;
        });
      });
    }

    isRefreshing = true;
    console.log('[Auth] Starting token refresh...');

    try {
      await sellerApi.refreshToken();
      console.log('[Auth] Refresh succeeded');
      processQueue();

      const retryResponse = await fetch(url, defaultOptions);

      if (retryResponse.status === 401) {
        sellerApi.clearAuthData();
        throw { status: 401, message: 'Session expired. Please login again.' };
      }

      if (!retryResponse.ok) {
        const errData = await retryResponse.json().catch(() => ({}));
        throw {
          status: retryResponse.status,
          message: errData.message || `Request failed with status ${retryResponse.status}`,
        };
      }

      return retryResponse;

    } catch (refreshError) {
      console.error('[Auth] Refresh failed:', refreshError);
      processQueue(refreshError);
      sellerApi.clearAuthData();
      throw { status: 401, message: 'Session expired. Please login again.' };

    } finally {
      isRefreshing = false;
    }
  }

  // Handle 403
  if (response.status === 403) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch { /* ignore parse errors */ }

    console.error('[Auth] 403 details:', errorData);

    if (
      errorData.message?.toLowerCase().includes('approv') ||
      errorData.message?.toLowerCase().includes('pending') ||
      errorData.message?.toLowerCase().includes('not approved')
    ) {
      throw {
        status: 403,
        message: 'Your account is pending approval. Please wait for vendor verification.',
        requiresApproval: true,
      };
    }

    throw {
      status: 403,
      message:
        errorData.message ||
        'Access denied. You may not have permission to view this resource.',
    };
  }

  // Handle other non-OK responses
  if (!response.ok) {
    let errorMessage;
    try {
      const ct = response.headers.get('content-type');
      if (ct && ct.includes('application/json')) {
        const errData = await response.json();
        errorMessage = errData.message || errData.error;
      } else {
        errorMessage = await response.text();
      }
    } catch {
      errorMessage = response.statusText;
    }

    throw {
      status: response.status,
      message: errorMessage || `Request failed with status ${response.status}`,
    };
  }

  return response;
};

// ────────────────────────────────────────────────
// HELPER FUNCTIONS
// ────────────────────────────────────────────────

const getSellerId = () => localStorage.getItem('sellerId');
const getShopId = () => localStorage.getItem('shopId');

const storeAuthData = (data) => {
  if (data.sellerId) localStorage.setItem('sellerId', data.sellerId);

  const shopId =
    data.shopId ||
    data.data?.shopId ||
    data.seller?.shopId ||
    data.sellerData?.shopId ||
    data.sellerId;

  if (shopId) {
    localStorage.setItem('shopId', shopId);
    console.log('Shop ID stored:', shopId);
  } else {
    console.warn('No shopId found in login response:', data);
  }

  localStorage.setItem('sellerAuthenticated', 'true');
  if (data.email) localStorage.setItem('sellerEmail', data.email);

  if (data.seller) {
    localStorage.setItem('sellerData', JSON.stringify(data.seller));
    if (data.seller.vendorApprovalStatus) {
      localStorage.setItem('vendorApprovalStatus', data.seller.vendorApprovalStatus);
    }
  }
  if (data.accessTokenValue) localStorage.setItem('accessToken', data.accessTokenValue);
  if (data.refreshTokenValue) localStorage.setItem('refreshToken', data.refreshTokenValue);
};

const clearAuthData = () => {
  [
    'sellerId',
    'sellerAuthenticated',
    'sellerEmail',
    'sellerData',
    'shopId',
    'accessToken',
    'refreshToken',
    'vendorApprovalStatus',
  ].forEach((key) => localStorage.removeItem(key));
};

const isAuthenticated = () =>
  localStorage.getItem('sellerAuthenticated') === 'true' &&
  !!localStorage.getItem('sellerId');

const ensureShopId = async () => {
  let shopId = localStorage.getItem('shopId');

  if (!shopId || shopId === 'undefined' || shopId === 'null') {
    console.log('No valid shopId, fetching from profile...');
    try {
      const profile = await sellerApi.getSellerStallProfile();
      shopId =
        profile.shopId ||
        profile.data?.shopId ||
        profile.seller?.shopId ||
        profile.data?.sellerId;

      if (shopId) {
        localStorage.setItem('shopId', shopId);
      } else {
        shopId = localStorage.getItem('sellerId');
        if (shopId) localStorage.setItem('shopId', shopId);
      }
    } catch (error) {
      console.error('Error fetching profile for shopId:', error);
      shopId = localStorage.getItem('sellerId');
      if (shopId) localStorage.setItem('shopId', shopId);
    }
  }

  return shopId;
};

const getErrorSuggestion = (error) => {
  if (error.status === 403) {
    if (error.message?.toLowerCase().includes('approv') || error.requiresApproval) {
      return 'Your account needs approval from the vendor admin. Please contact support.';
    }
    return 'You do not have permission to perform this action.';
  }
  if (error.status === 401) return 'Your session has expired. Please login again.';
  if (error.status === 404) return 'The requested resource was not found.';
  if (error.status >= 500) return 'Server error. Please try again later.';
  return 'An unexpected error occurred. Please try again.';
};

// ────────────────────────────────────────────────
// SELLER API
// ────────────────────────────────────────────────

export const sellerApi = {
  isAuthenticated,
  getSellerId,
  getShopId,
  storeAuthData,
  clearAuthData,
  ensureShopId,
  getErrorSuggestion,

  checkAccountStatus: async () => {
    try {
      const profile = await sellerApi.getSellerStallProfile().catch((e) => {
        console.warn('Profile fetch in status check failed:', e);
        return null;
      });

      const sellerDataStr = localStorage.getItem('sellerData');
      const sellerData = sellerDataStr ? JSON.parse(sellerDataStr) : {};
      const sellerId = localStorage.getItem('sellerId');
      const shopId = localStorage.getItem('shopId');
      const approvalStatus =
        localStorage.getItem('vendorApprovalStatus') ||
        sellerData?.vendorApprovalStatus ||
        profile?.data?.vendorApprovalStatus ||
        profile?.seller?.vendorApprovalStatus ||
        'unknown';

      return {
        isAuthenticated: isAuthenticated(),
        hasSellerId: !!sellerId,
        hasShopId: !!shopId,
        hasSellerData: !!sellerDataStr,
        vendorApprovalStatus: approvalStatus,
        isEmailVerified:
          sellerData?.isEmailVerified || profile?.data?.isEmailVerified || false,
        isActive: sellerData?.isActive || profile?.data?.isActive || false,
        profileFetchStatus: profile ? 'success' : 'failed',
        profileData: profile,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        isAuthenticated: isAuthenticated(),
        error: error.message,
        errorStatus: error.status,
        hasLocalData: !!localStorage.getItem('sellerData'),
        suggestion: getErrorSuggestion(error),
        timestamp: new Date().toISOString(),
      };
    }
  },

  // ── Auth ──

  registerSellerStall: async (sellerData, profilePicture, sellerShopImages) => {
    try {
      const formData = new FormData();
      formData.append('name', sellerData.name);
      formData.append('email', sellerData.email);
      formData.append('password', sellerData.password);
      formData.append('licenseId', sellerData.licenseId);
      formData.append('mallName', sellerData.mallName);
      formData.append('shopName', sellerData.shopName);
      formData.append('category', sellerData.category);
      formData.append('sellerShopAddress', sellerData.sellerShopAddress);
      formData.append('sellerContactNumber', sellerData.sellerContactNumber);
      formData.append('location', sellerData.location);
      formData.append('floorNumber', sellerData.floorNumber);

      if (!profilePicture) throw new Error('Profile picture is required');
      formData.append('profilePicture', profilePicture);

      if (!sellerShopImages?.length) throw new Error('At least one shop image required');
      sellerShopImages.forEach((img) => formData.append('sellerShopImage', img));

      const response = await fetch(`${SELLER_URL}/seller-stall-register`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        throw { status: response.status, message: data.message || data.error || 'Registration failed' };
      }

      storeAuthData(data);
      return data;
    } catch (err) {
      return handleApiError(err, 'in registration');
    }
  },

  loginSellerStall: async (email, password) => {
    try {
      const response = await fetch(`${SELLER_URL}/seller-stall-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        throw { status: response.status, message: data.message || data.error || 'Login failed' };
      }

      storeAuthData(data);
      console.log('Login successful:', {
        sellerId: localStorage.getItem('sellerId'),
        shopId: localStorage.getItem('shopId'),
        approvalStatus: data.seller?.vendorApprovalStatus || 'unknown',
      });
      return data;
    } catch (err) {
      return handleApiError(err, 'during login');
    }
  },

  logoutSellerStall: async () => {
    try {
      const response = await fetch(`${SELLER_URL}/seller-stall-logout`, {
        method: 'POST',
        credentials: 'include',
      });
      clearAuthData();
      return response.ok
        ? await response.json()
        : { success: true, message: 'Logged out locally' };
    } catch {
      clearAuthData();
      return { success: true, message: 'Logged out locally' };
    }
  },

  verifyOtp: async (email, otp) => {
    try {
      const res = await fetch(`${SELLER_URL}/seller-stall-verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw { status: res.status, message: data.message || 'OTP verification failed' };
      return data;
    } catch (error) {
      return handleApiError(error, 'during OTP verification');
    }
  },

  resendOtp: async (email) => {
    try {
      const res = await fetch(`${SELLER_URL}/seller-stall-resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw { status: res.status, message: data.message || 'Failed to resend OTP' };
      return data;
    } catch (error) {
      return handleApiError(error, 'while resending OTP');
    }
  },

  forgotPassword: async (email) => {
    try {
      const res = await fetch(`${SELLER_URL}/seller-stall-forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw { status: res.status, message: data.message || 'Failed to send reset OTP' };
      return data;
    } catch (error) {
      return handleApiError(error, 'during forgot password');
    }
  },

  verifyForgotPasswordOtp: async (email, otp) => {
    try {
      const res = await fetch(`${SELLER_URL}/seller-verify-forgot-password-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw { status: res.status, message: data.message || 'OTP verification failed' };
      return data;
    } catch (error) {
      return handleApiError(error, 'during OTP verification');
    }
  },

  resetPassword: async (email, otp, newPassword, confirmPassword) => {
    try {
      const res = await fetch(`${SELLER_URL}/seller-stall-reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw { status: res.status, message: data.message || 'Failed to reset password' };
      return data;
    } catch (error) {
      return handleApiError(error, 'during password reset');
    }
  },

  changePassword: async (oldPassword, newPassword, confirmPassword) => {
    try {
      const res = await authenticatedFetch(`${SELLER_URL}/seller-stall-change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      return handleApiError(error, 'while changing password');
    }
  },

  refreshToken: async () => {
    try {
      console.log('[Token Refresh] Attempting...');

      const res = await fetch(`${SELLER_URL}/seller-stall-refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });

      if (!res.ok) {
        let errorMessage = 'Refresh token failed';
        try {
          const ct = res.headers.get('content-type');
          if (ct && ct.includes('application/json')) {
            const errData = await res.json();
            errorMessage = errData.message || errorMessage;
          } else {
            errorMessage = (await res.text()) || errorMessage;
          }
        } catch { /* ignore */ }

        console.error(`[Token Refresh] Failed ${res.status}:`, errorMessage);
        throw { status: res.status, message: errorMessage };
      }

      console.log('[Token Refresh] Success');

      try {
        const ct = res.headers.get('content-type');
        if (ct && ct.includes('application/json')) {
          const data = await res.json();
          if (data.accessTokenValue) localStorage.setItem('accessToken', data.accessTokenValue);
          if (data.refreshTokenValue) localStorage.setItem('refreshToken', data.refreshTokenValue);
        }
      } catch { /* no body is fine — cookies-only flow */ }

      return true;

    } catch (err) {
      console.error('[Token Refresh] Error:', err);
      clearAuthData();
      throw { status: 401, message: 'Session expired. Please login again.' };
    }
  },

  getSellerStallProfile: async () => {
    try {
      const res = await authenticatedFetch(`${SELLER_URL}/seller-stall-profile`);
      const data = await res.json();

      const shopId =
        data.shopId ||
        data.data?.shopId ||
        data.seller?.shopId ||
        data.data?.sellerId ||
        data.sellerId;

      if (shopId) {
        localStorage.setItem('shopId', shopId);
        console.log('ShopId updated from profile:', shopId);
      }

      const approvalStatus =
        data.vendorApprovalStatus ||
        data.data?.vendorApprovalStatus ||
        data.seller?.vendorApprovalStatus;
      if (approvalStatus) localStorage.setItem('vendorApprovalStatus', approvalStatus);
      return data;
    } catch (error) {
      return handleApiError(error, 'fetching profile');
    }
  },

  // ── Regular Offers ──────────────────────────────────────────────────────────
  // (Keep all existing offer methods unchanged)
  // ... offer methods ...

  createOffer: async (offerData, offerImages) => {
    try {
      let shopId = offerData.shopId;
      if (!shopId || shopId === 'undefined' || shopId === 'null') {
        shopId = await ensureShopId();
      }
      if (!shopId) {
        throw new Error('No valid shop ID found. Please ensure you have a shop associated with your account.');
      }

      const formData = new FormData();
      formData.append('shopId', shopId);
      formData.append('offerTitle', offerData.offerTitle || '');
      formData.append('offerDescription', offerData.offerDescription || '');
      formData.append('offerStartDate', offerData.offerStartDate || '');
      formData.append('offerEndDate', offerData.offerEndDate || '');
      formData.append('offerTermsAndConditions', offerData.offerTermsAndConditions || '');
      formData.append('offerType', offerData.offerType || 'percentage');
      formData.append('offerValue', String(offerData.offerValue || 0));

      if (!offerImages?.length) throw new Error('At least one offer image is required');
      if (offerImages.length > 4) throw new Error('Maximum 4 images allowed');
      offerImages.forEach((img) => formData.append('offerImages', img));

      const res = await authenticatedFetch(`${SELLER_URL}/offer-create`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      return data;
    } catch (error) {
      return handleApiError(error, 'creating offer');
    }
  },

  getCreatedOffers: async () => {
    try {
      const res = await authenticatedFetch(`${SELLER_URL}/get-created-offers`);
      const data = await res.json();
      return data;
    } catch (error) {
      return handleApiError(error, 'fetching created offers');
    }
  },

  deleteOffer: async (offerId) => {
    try {
      const res = await authenticatedFetch(`${SELLER_URL}/delete-offer/${offerId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      return data;
    } catch (error) {
      return handleApiError(error, 'deleting offer');
    }
  },

  enableOffer: async (offerId, offerStartDate, offerEndDate) => {
    try {
      const res = await authenticatedFetch(`${SELLER_URL}/enable-offer/${offerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerStartDate, offerEndDate }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      return handleApiError(error, 'enabling offer');
    }
  },

  disableOffer: async (offerId) => {
    try {
      const res = await authenticatedFetch(`${SELLER_URL}/disable-offer/${offerId}`, {
        method: 'PUT',
      });
      const data = await res.json();
      return data;
    } catch (error) {
      return handleApiError(error, 'disabling offer');
    }
  },

  getActiveOffers: async (page = 1, limit = 10) => {
    try {
      const res = await authenticatedFetch(
        `${SELLER_URL}/get-active-offers?page=${page}&limit=${limit}`
      );
      return await res.json();
    } catch (error) {
      return handleApiError(error, 'fetching active offers');
    }
  },

  getScheduledOffers: async (page = 1, limit = 10) => {
    try {
      const res = await authenticatedFetch(
        `${SELLER_URL}/get-scheduled-offers?page=${page}&limit=${limit}`
      );
      return await res.json();
    } catch (error) {
      return handleApiError(error, 'fetching scheduled offers');
    }
  },

  getExpiredOffers: async (page = 1, limit = 10) => {
    try {
      const res = await authenticatedFetch(
        `${SELLER_URL}/get-expired-offers?page=${page}&limit=${limit}`
      );
      return await res.json();
    } catch (error) {
      return handleApiError(error, 'fetching expired offers');
    }
  },

  getDisabledOffers: async (page = 1, limit = 10) => {
    try {
      const res = await authenticatedFetch(
        `${SELLER_URL}/get-disabled-offers?page=${page}&limit=${limit}`
      );
      return await res.json();
    } catch (error) {
      return handleApiError(error, 'fetching disabled offers');
    }
  },

  getSingleOffer: async (offerId) => {
    try {
      if (!offerId) {
        throw new Error('Offer ID is required');
      }
      
      // Try to refresh token before making request
      try {
        await sellerApi.refreshToken();
      } catch (refreshError) {
        console.log('Token refresh failed, will try with existing token');
      }
      
      console.log('Fetching single offer with ID:', offerId);
      const res = await authenticatedFetch(`${SELLER_URL}/get-single-offer/${offerId}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw { status: res.status, message: data.message || 'Failed to fetch offer details' };
      }
      
      return data;
    } catch (error) {
      console.error('Get single offer error:', error);
      return handleApiError(error, 'fetching offer details');
    }
  },

  editOffer: async (offerId, offerData, offerImages = []) => {
    try {
      if (!offerId) throw new Error('Offer ID is required');

      const hasNewImages = offerImages && offerImages.length > 0;

      if (hasNewImages) {
        if (offerImages.length > 4) throw new Error('Maximum 4 images allowed');
        const formData = new FormData();
        Object.entries(offerData).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') {
            formData.append(key, key === 'offerValue' ? String(val) : val);
          }
        });
        offerImages.forEach((img) => formData.append('offerImages', img));

        const res = await authenticatedFetch(`${SELLER_URL}/edit-offer/${offerId}`, {
          method: 'PUT',
          body: formData,
        });
        return await res.json();

      } else {
        const cleanData = Object.fromEntries(
          Object.entries(offerData).filter(([, v]) => v !== undefined && v !== null && v !== '')
        );
        const res = await authenticatedFetch(`${SELLER_URL}/edit-offer/${offerId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cleanData),
        });
        return await res.json();
      }
    } catch (error) {
      return handleApiError(error, 'editing offer');
    }
  },

  // ────────────────────────────────────────────────────────────────────────────
  // FLASH DEALS API - COMPLETE IMPLEMENTATION
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Create a new flash deal
   * POST /api/seller/create-flash-deal
   */
  /**
 * Create a new flash deal
 * POST /api/seller/create-flash-deal
 */
createFlashDeal: async (flashDealData, flashDealImages = []) => {
  try {
    // 🔹 STEP 1: Verify authentication state FIRST
    const sellerId = localStorage.getItem('sellerId');
    const isAuth = localStorage.getItem('sellerAuthenticated') === 'true';
    const approvalStatus = localStorage.getItem('vendorApprovalStatus');
    
    console.log('=== Create Flash Deal Debug ===');
    console.log('Seller ID:', sellerId);
    console.log('Is Authenticated:', isAuth);
    console.log('Approval Status:', approvalStatus);
    console.log('Has Images:', flashDealImages.length);
    console.log('Flash Deal Data:', flashDealData);
    
    // Check if user is logged in
    if (!sellerId || !isAuth) {
      throw new Error('You are not logged in. Please login as a seller first.');
    }
    
    // Check if seller is approved (if your backend requires this)
    if (approvalStatus && approvalStatus !== 'approved') {
      throw new Error(`Your account is ${approvalStatus}. Please wait for vendor verification.`);
    }
    
    // 🔹 STEP 2: Validate required fields
    const requiredFields = [
      'flashDealTitle',
      'flashDealStartTime',
      'flashDealEndTime',
      'flashDealType',
      'flashDealValue',
      'timezone'
    ];
    
    const missingFields = requiredFields.filter(field => {
      const value = flashDealData[field];
      return value === undefined || value === null || value === '';
    });
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // 🔹 STEP 3: Validate values
    if (flashDealData.flashDealType === 'percentage') {
      const value = Number(flashDealData.flashDealValue);
      if (value < 0 || value > 100) {
        throw new Error('Percentage discount must be between 0 and 100');
      }
    } else {
      const value = Number(flashDealData.flashDealValue);
      if (value < 0) {
        throw new Error('Discount value cannot be negative');
      }
    }

    // 🔹 STEP 4: Validate image count
    if (flashDealImages.length === 0) {
      throw new Error('At least one image is required for flash deal');
    }
    
    if (flashDealImages.length > 3) {
      throw new Error('Maximum 3 images allowed for flash deals');
    }

    // 🔹 STEP 5: Try to refresh token before making request (ensure session is valid)
    try {
      console.log('[Debug] Attempting token refresh before create...');
      await sellerApi.refreshToken();
      console.log('[Debug] Token refresh successful');
    } catch (refreshError) {
      console.warn('[Debug] Token refresh failed, will proceed with existing token:', refreshError.message);
      // Don't throw here, let the main request try
    }

    // 🔹 STEP 6: Build FormData
    const formData = new FormData();

    formData.append('flashDealTitle', String(flashDealData.flashDealTitle || '').trim());
    formData.append('flashDealDescription', String(flashDealData.flashDealDescription || '').trim());
    formData.append('flashDealStartTime', String(flashDealData.flashDealStartTime || ''));
    formData.append('flashDealEndTime', String(flashDealData.flashDealEndTime || ''));
    formData.append('flashDealType', String(flashDealData.flashDealType || 'percentage'));
    formData.append('flashDealValue', String(flashDealData.flashDealValue || 0));
    formData.append('flashDealTermsAndConditions', String(flashDealData.flashDealTermsAndConditions || '').trim());
    formData.append('timezone', flashDealData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);

    // Append images
    flashDealImages.forEach((img) => {
      formData.append('flashDealImages', img);
    });

    console.log('[Debug] Making request to:', `${SELLER_URL}/create-flash-deal`);
    console.log('[Debug] FormData entries:');
    for (let pair of formData.entries()) {
      if (pair[0] === 'flashDealImages') {
        console.log(`  ${pair[0]}: [File] ${pair[1].name}`);
      } else {
        console.log(`  ${pair[0]}: ${pair[1]}`);
      }
    }

    // 🔹 STEP 7: Make the request
    const res = await authenticatedFetch(`${SELLER_URL}/create-flash-deal`, {
      method: 'POST',
      body: formData,
    });

    console.log('[Debug] Response status:', res.status);
    
    const data = await res.json();
    console.log('[Debug] Response data:', data);
    
    if (!res.ok) {
      // Handle specific error cases
      if (res.status === 403) {
        if (data.message?.toLowerCase().includes('approv') || data.message?.toLowerCase().includes('pending')) {
          throw new Error('Your seller account is pending approval. Please wait for verification.');
        }
        throw new Error('You do not have seller permissions. Please login with a seller account.');
      }
      throw new Error(data.message || 'Failed to create flash deal');
    }
    
    console.log('[Debug] Flash deal created successfully!');
    return data;
    
  } catch (error) {
    console.error('Create flash deal error:', error);
    
    // Handle specific error types
    if (error.message?.includes('not logged in') || error.message?.includes('login')) {
      // Redirect to login
      window.location.href = '/seller/login';
      throw error;
    }
    
    if (error.status === 401 || error.message?.includes('session expired')) {
      sellerApi.clearAuthData();
      window.location.href = '/seller/login';
      throw new Error('Your session has expired. Please login again.');
    }
    
    return handleApiError(error, 'creating flash deal');
  }
},

  /**
   * Get all active flash deals
   * GET /api/seller/get-active-flash-deals
   */
  getActiveFlashDeals: async () => {
    try {
      const res = await authenticatedFetch(`${SELLER_URL}/get-active-flash-deals`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch active flash deals');
      }
      
      return data;
    } catch (error) {
      console.error('Get active flash deals error:', error);
      return handleApiError(error, 'fetching active flash deals');
    }
  },

  /**
   * Get all expired flash deals
   * GET /api/seller/get-expired-flash-deals
   */
  getExpiredFlashDeals: async () => {
    try {
      const res = await authenticatedFetch(`${SELLER_URL}/get-expired-flash-deals`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch expired flash deals');
      }
      
      return data;
    } catch (error) {
      console.error('Get expired flash deals error:', error);
      return handleApiError(error, 'fetching expired flash deals');
    }
  },

  /**
   * Get all flash deals for the authenticated seller
   * GET /api/seller/get-seller-flash-deals
   */
  getSellerFlashDeals: async () => {
    try {
      const res = await authenticatedFetch(`${SELLER_URL}/get-seller-flash-deals`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch seller flash deals');
      }
      
      return data;
    } catch (error) {
      console.error('Get seller flash deals error:', error);
      return handleApiError(error, 'fetching seller flash deals');
    }
  },

  /**
   * Get active flash deals for the authenticated seller
   * GET /api/seller/get-seller-flash-deal-active
   */
  getSellerActiveFlashDeals: async () => {
    try {
      const res = await authenticatedFetch(`${SELLER_URL}/get-seller-flash-deal-active`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch seller active flash deals');
      }
      
      return data;
    } catch (error) {
      console.error('Get seller active flash deals error:', error);
      return handleApiError(error, 'fetching seller active flash deals');
    }
  },

  /**
   * Get expired flash deals for the authenticated seller
   * GET /api/seller/get-seller-flash-deal-expired
   */
  getSellerExpiredFlashDeals: async () => {
    try {
      const res = await authenticatedFetch(`${SELLER_URL}/get-seller-flash-deal-expired`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch seller expired flash deals');
      }
      
      return data;
    } catch (error) {
      console.error('Get seller expired flash deals error:', error);
      return handleApiError(error, 'fetching seller expired flash deals');
    }
  },

  /**
   * Get scheduled flash deals for the authenticated seller
   * GET /api/seller/get-seller-flash-deal-scheduled
   */
  getSellerScheduledFlashDeals: async () => {
    try {
      const res = await authenticatedFetch(`${SELLER_URL}/get-seller-flash-deal-scheduled`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch seller scheduled flash deals');
      }
      
      return data;
    } catch (error) {
      console.error('Get seller scheduled flash deals error:', error);
      return handleApiError(error, 'fetching seller scheduled flash deals');
    }
  },

  /**
   * Get a single flash deal by ID
   * GET /api/seller/get-single-flash-deal/:flashDealId
   */
  getSingleFlashDeal: async (flashDealId) => {
    try {
      if (!flashDealId) {
        throw new Error('Flash deal ID is required');
      }
      
      const res = await authenticatedFetch(`${SELLER_URL}/get-single-flash-deal/${flashDealId}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch flash deal details');
      }
      
      return data;
    } catch (error) {
      console.error('Get single flash deal error:', error);
      return handleApiError(error, 'fetching flash deal details');
    }
  },

  /**
   * Edit an existing flash deal
   * PUT /api/seller/edit-flash-deal/:flashDealId
   */
  editFlashDeal: async (flashDealId, flashDealData, flashDealImages = []) => {
    try {
      if (!flashDealId) {
        throw new Error('Flash deal ID is required');
      }

      // Validate flash deal value if provided
      if (flashDealData.flashDealValue !== undefined) {
        const dealType = flashDealData.flashDealType || 'percentage';
        if (dealType === 'percentage') {
          const value = Number(flashDealData.flashDealValue);
          if (value < 0 || value > 100) {
            throw new Error('Percentage discount must be between 0 and 100');
          }
        } else {
          const value = Number(flashDealData.flashDealValue);
          if (value < 0) {
            throw new Error('Discount value cannot be negative');
          }
        }
      }

      // Validate date logic if both dates are provided
      if (flashDealData.flashDealStartTime && flashDealData.flashDealEndTime) {
        const start = new Date(flashDealData.flashDealStartTime);
        const end = new Date(flashDealData.flashDealEndTime);
        if (end <= start) {
          throw new Error('End time must be greater than start time');
        }
      }

      const hasNewImages = flashDealImages && flashDealImages.length > 0;

      if (hasNewImages) {
        if (flashDealImages.length > 3) {
          throw new Error('Maximum 3 images allowed for flash deals');
        }

        const formData = new FormData();
        
        // Append all fields that are not undefined or null
        Object.entries(flashDealData).forEach(([key, val]) => {
          if (val !== undefined && val !== null) {
            const value = key === 'flashDealValue' ? String(val) : val;
            formData.append(key, value);
          }
        });
        
        // Append new images with correct field name (flashDealBanners for edit)
        flashDealImages.forEach((img) => formData.append('flashDealBanners', img));

        const res = await authenticatedFetch(`${SELLER_URL}/edit-flash-deal/${flashDealId}`, {
          method: 'PUT',
          body: formData,
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || 'Failed to edit flash deal');
        }
        
        return data;
      } else {
        // Clean data - remove undefined and null values
        const cleanData = Object.fromEntries(
          Object.entries(flashDealData).filter(([, v]) => v !== undefined && v !== null)
        );
        
        const res = await authenticatedFetch(`${SELLER_URL}/edit-flash-deal/${flashDealId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cleanData),
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || 'Failed to edit flash deal');
        }
        
        return data;
      }
    } catch (error) {
      console.error('Edit flash deal error:', error);
      
      // Handle specific error cases
      if (error.message?.includes('overlap')) {
        throw new Error('Another deal overlaps this time period');
      }
      if (error.message?.includes('end time must be greater')) {
        throw new Error('End time must be greater than start time');
      }
      
      return handleApiError(error, 'editing flash deal');
    }
  },

  /**
   * Delete a flash deal
   * DELETE /api/seller/delete-flash-deal/:flashDealId
   */
  deleteFlashDeal: async (flashDealId) => {
    try {
      if (!flashDealId) {
        throw new Error('Flash deal ID is required');
      }
      
      const res = await authenticatedFetch(`${SELLER_URL}/delete-flash-deal/${flashDealId}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete flash deal');
      }
      
      return data;
    } catch (error) {
      console.error('Delete flash deal error:', error);
      return handleApiError(error, 'deleting flash deal');
    }
  },

  // ────────────────────────────────────────────────────────────────────────────
  // UTILITY FUNCTIONS
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Validate offer/flash deal dates
   */
  validateOfferDates: (startDate, endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime())) {
      throw new Error('Invalid start date');
    }
    
    if (isNaN(end.getTime())) {
      throw new Error('Invalid end date');
    }
    
    if (start < today) {
      throw new Error('Start date cannot be in the past');
    }
    
    if (end <= start) {
      throw new Error('End date must be after start date');
    }
    
    return true;
  },

  /**
   * Format offer data for display
   */
  formatOfferData: (offer) => {
    if (!offer) return null;
    
    return {
      ...offer,
      formattedStartDate: offer.offerStartDate 
        ? new Date(offer.offerStartDate).toLocaleDateString() 
        : 'N/A',
      formattedEndDate: offer.offerEndDate 
        ? new Date(offer.offerEndDate).toLocaleDateString() 
        : 'N/A',
      isActive: offer.offerStatus === 'active' && offer.isEnabled,
      isScheduled: offer.offerStatus === 'scheduled' && offer.isEnabled,
      isExpired: offer.offerStatus === 'expired',
      isDisabled: !offer.isEnabled,
    };
  },

  /**
   * Format flash deal data for display
   */
  formatFlashDealData: (deal) => {
    if (!deal) return null;
    
    const startTime = deal.flashDealStartTime || deal.startTime;
    const endTime = deal.flashDealEndTime || deal.endTime;
    
    return {
      ...deal,
      formattedStartTime: startTime 
        ? new Date(startTime).toLocaleString() 
        : 'N/A',
      formattedEndTime: endTime 
        ? new Date(endTime).toLocaleString() 
        : 'N/A',
      isActive: deal.status === 'active',
      isScheduled: deal.status === 'scheduled',
      isExpired: deal.status === 'expired',
      discountDisplay: deal.dealType === 'percentage' 
        ? `${deal.dealValue}% OFF` 
        : `₹${deal.dealValue} OFF`,
      bannerUrls: deal.banners?.map(b => b.url) || [],
    };
  },

};

export default sellerApi;