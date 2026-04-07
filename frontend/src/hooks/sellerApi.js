// sellerApi.js
const API_BASE_URL = 'https://mallsperebackend-psbx.onrender.com/api';
const SELLER_URL = `${API_BASE_URL}/seller`;

let isRefreshing = false;
let failedQueue = [];

// ────────────────────────────────────────────────
// QUEUE MANAGEMENT
// Fixed: queue stores resolve/reject AND retries the actual fetch after refresh
// ────────────────────────────────────────────────
const processQueue = (error = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(); // signals "refresh done, you may retry"
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
// Key fixes:
//   1. refreshToken() is called once; concurrent 401s queue and wait
//   2. After refresh, every queued request retries fetch() fresh (new cookies)
//   3. Response body is never consumed twice
// ────────────────────────────────────────────────
const authenticatedFetch = async (url, options = {}) => {
  const buildOptions = (opts) => {
    const built = {
      ...opts,
      credentials: 'include',
      headers: { ...(opts.headers || {}) },
    };
    if (opts.body instanceof FormData) {
      // Let the browser set multipart boundary automatically
      delete built.headers['Content-Type'];
    } else if (!built.headers['Content-Type']) {
      built.headers['Content-Type'] = 'application/json';
    }
    return built;
  };

  const defaultOptions = buildOptions(options);

  // ── First attempt ──
  let response;
  try {
    response = await fetch(url, defaultOptions);
  } catch (networkError) {
    throw { status: 0, message: 'Network error. Please check your connection.' };
  }

  // ── Handle 401 ──
  if (response.status === 401) {
    console.log(`[Auth] 401 on ${url}`);

    if (isRefreshing) {
      // Another refresh is already running — queue this request
      console.log('[Auth] Refresh in progress, queuing...');
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => {
        // Refresh succeeded — retry with fresh cookies
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

    // ── This request triggers the refresh ──
    isRefreshing = true;
    console.log('[Auth] Starting token refresh...');

    try {
      await sellerApi.refreshToken(); // throws on failure
      console.log('[Auth] Refresh succeeded');

      // Unblock all queued requests
      processQueue();

      // Retry the current request
      const retryResponse = await fetch(url, defaultOptions);

      if (retryResponse.status === 401) {
        // Refresh token itself has expired → force logout
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
      processQueue(refreshError); // unblock queue with error
      sellerApi.clearAuthData();
      throw { status: 401, message: 'Session expired. Please login again.' };

    } finally {
      isRefreshing = false;
    }
  }

  // ── Handle 403 ──
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

  // ── Handle other non-OK responses ──
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

  // Store tokens if returned in body (some backends do this)
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

  // ── Token Refresh ──
  // Fixed: no double .json() consumption; returns true on success, throws on failure
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
        // Consume body once
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

      // Optionally store tokens if backend returns them in body
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

  // ── Protected Endpoints ──

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
      const res = await authenticatedFetch(`${SELLER_URL}/get-single-offer/${offerId}`);
      return await res.json();
    } catch (error) {
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

  // ── Utilities ──

  validateOfferDates: (startDate, endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start < today) throw new Error('Start date cannot be in the past');
    if (end <= start) throw new Error('End date must be after start date');
    return true;
  },

  formatOfferData: (offer) => ({
    ...offer,
    formattedStartDate: new Date(offer.offerStartDate).toLocaleDateString(),
    formattedEndDate: new Date(offer.offerEndDate).toLocaleDateString(),
    isActive: offer.offerStatus === 'active' && offer.isEnabled,
    isScheduled: offer.offerStatus === 'scheduled' && offer.isEnabled,
    isExpired: offer.offerStatus === 'expired',
    isDisabled: !offer.isEnabled,
  }),
};

export default sellerApi;