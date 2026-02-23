// api/vendorApi.js - COMPLETE VERSION WITH COOKIE-BASED AUTH
const API_BASE_URL = 'https://mallsperebackend-1.onrender.com/api';
const AUTH_URL = `${API_BASE_URL}/auth`;

// Helper functions
const getVendorId = () => {
  return localStorage.getItem('vendorId');
};

const storeAuthData = (data) => {
  if (data.vendorId) {
    localStorage.setItem('vendorId', data.vendorId);
  }
  localStorage.setItem('vendorAuthenticated', 'true');
  
  if (data.data?.vendor || data.vendor) {
    localStorage.setItem('vendorData', JSON.stringify(data.data?.vendor || data.vendor));
  }
};

const clearAuthData = () => {
  localStorage.removeItem('vendorId');
  localStorage.removeItem('vendorAuthenticated');
  localStorage.removeItem('vendorData');
};

const isAuthenticated = () => {
  const isAuth = localStorage.getItem('vendorAuthenticated') === 'true';
  const hasVendorId = !!localStorage.getItem('vendorId');
  
  console.log('Auth check - isAuth:', isAuth, 'hasVendorId:', hasVendorId);
  return isAuth && hasVendorId;
};

export const vendorApi = {
  // Authentication Helper Functions
  isAuthenticated: isAuthenticated,
  getVendorId: getVendorId,
  storeAuthData: storeAuthData,
  clearAuthData: clearAuthData,

  // ==================== AUTHENTICATION ENDPOINTS ====================

  // 1. Register vendor
  registerVendor: async (vendorData, profileImage, shopImages) => {
    try {
      console.log('=== VENDOR REGISTRATION START ===');
      
      const formData = new FormData();
      
      formData.append('name', vendorData.name);
      formData.append('email', vendorData.email);
      formData.append('password', vendorData.password);
      formData.append('location', vendorData.location);
      formData.append('mallName', vendorData.mallName);
      formData.append('shopAddress', vendorData.shopAddress);
      formData.append('phoneNumber', vendorData.phoneNumber);
      formData.append('vendorLicenseNumber', vendorData.vendorLicenseNumber);
      formData.append('vendorShopNumberOfFloors', parseInt(vendorData.vendorShopNumberOfFloors));
      formData.append('vendorShopNumberOfStalls', parseInt(vendorData.vendorShopNumberOfStalls));
      formData.append('vendorShopOpeningTime', vendorData.vendorShopOpeningTime);
      formData.append('vendorShopClosingTime', vendorData.vendorShopClosingTime);
      formData.append('vendorShopDescription', vendorData.vendorShopDescription);
      
      if (!profileImage) {
        throw new Error('Profile picture is required');
      }
      formData.append('profile', profileImage);
      
      if (shopImages && shopImages.length > 0) {
        shopImages.forEach((image) => {
          formData.append('vendorShopImages', image);
        });
      }

      const response = await fetch(`${AUTH_URL}/vendor-register`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = 'Registration failed. ';
        if (data?.message) errorMessage += data.message;
        else if (data?.error) errorMessage += data.error;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('Fetch Error:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection.');
      }
      throw error;
    }
  },

  // 2. Verify OTP
  verifyOtp: async (email, otp, vendorLicenseNumber) => {
    try {
      const response = await fetch(`${AUTH_URL}/vendor-verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, vendorLicenseNumber }),
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || data?.error || 'OTP verification failed');
      return data;
    } catch (error) {
      console.error('Verify OTP Error:', error);
      throw error;
    }
  },

  // 3. Resend OTP
  resendOtp: async (email, vendorLicenseNumber) => {
    try {
      const response = await fetch(`${AUTH_URL}/vendor-resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, vendorLicenseNumber }),
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || data?.error || 'Failed to resend OTP');
      return data;
    } catch (error) {
      console.error('Resend OTP Error:', error);
      throw error;
    }
  },

  // 4. Vendor Login
  loginVendor: async (credentials) => {
    try {
      const response = await fetch(`${AUTH_URL}/vendor-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Login failed');

      console.log('Login response data:', data);
      storeAuthData(data);
      return data;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  },

  // 5. Forgot Password
  forgotPassword: async (email, vendorLicenseNumber) => {
    try {
      const response = await fetch(`${AUTH_URL}/vendor-forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, vendorLicenseNumber }),
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || data?.error || 'Failed to send reset OTP');
      return data;
    } catch (error) {
      console.error('Forgot Password Error:', error);
      throw error;
    }
  },

  // 6. Reset Password
  resetPassword: async (email, otp, newPassword, confirmPassword) => {
    try {
      const response = await fetch(`${AUTH_URL}/vendor-reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || data?.error || 'Failed to reset password');
      return data;
    } catch (error) {
      console.error('Reset Password Error:', error);
      throw error;
    }
  },

  // 7. Change Password (Auth Required)
  changePassword: async (oldPassword, newPassword, confirmPassword) => {
    try {
      const response = await fetch(`${AUTH_URL}/vendor-change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Password change failed');
      return data;
    } catch (error) {
      console.error('Change Password Error:', error);
      throw error;
    }
  },

  // 8. Vendor Logout (Auth Required)
  logoutVendor: async () => {
    try {
      const response = await fetch(`${AUTH_URL}/vendor-logout`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();
      clearAuthData();

      if (!response.ok) {
        console.warn('Logout API warning:', data.message);
        return { success: true, message: 'Logged out locally' };
      }

      return data;
    } catch (error) {
      console.error('Logout Error:', error);
      clearAuthData();
      return { success: true, message: 'Logged out locally' };
    }
  },

  // 9. Refresh Token
  refreshToken: async () => {
    try {
      const response = await fetch(`${AUTH_URL}/vendor-refresh-token`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Token refresh failed');
      return data;
    } catch (error) {
      console.error('Refresh Token Error:', error);
      throw error;
    }
  },

  // 10. Vendor Admin Profile (Auth Required)
  getVendorAdminProfile: async () => {
    try {
      const response = await fetch(`${AUTH_URL}/vendor-admin-profile`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          clearAuthData();
          throw new Error('Unauthorized - Please login again');
        }
        throw new Error(data.message || data.error || 'Failed to fetch profile');
      }

      return data;
    } catch (error) {
      console.error('Get Vendor Admin Profile Error:', error);
      throw error;
    }
  },

  // ==================== STALLS MANAGEMENT ENDPOINTS ====================
  // NOTE: Stalls routes are under /api/auth/ (same as auth routes)

  // Get Pending Stalls (Paginated)
  getPendingStalls: async (page = 1, limit = 10) => {
    try {
      const response = await fetch(`${AUTH_URL}/get-pending-stalls?page=${page}&limit=${limit}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) { clearAuthData(); throw new Error('Unauthorized - Please login again'); }
        throw new Error(data.message || data.error || 'Failed to fetch pending stalls');
      }

      return data;
    } catch (error) {
      console.error('Get Pending Stalls Error:', error);
      throw error;
    }
  },

  // Get Approved Stalls (Paginated)
  getApprovedStalls: async (page = 1, limit = 10) => {
    try {
      const response = await fetch(`${AUTH_URL}/get-approved-stalls?page=${page}&limit=${limit}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) { clearAuthData(); throw new Error('Unauthorized - Please login again'); }
        throw new Error(data.message || data.error || 'Failed to fetch approved stalls');
      }

      return data;
    } catch (error) {
      console.error('Get Approved Stalls Error:', error);
      throw error;
    }
  },

  // Get All Stalls (Paginated)
  getAllStalls: async (page = 1, limit = 10) => {
    try {
      const response = await fetch(`${AUTH_URL}/get-all-stalls?page=${page}&limit=${limit}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) { clearAuthData(); throw new Error('Unauthorized - Please login again'); }
        throw new Error(data.message || data.error || 'Failed to fetch stalls');
      }

      return data;
    } catch (error) {
      console.error('Get All Stalls Error:', error);
      throw error;
    }
  },

  // Get Single Stall
  getSingleStall: async (stallId) => {
    try {
      if (!stallId) throw new Error('Stall ID is required');

      const response = await fetch(`${AUTH_URL}/get-single-stall/${stallId}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) { clearAuthData(); throw new Error('Unauthorized - Please login again'); }
        throw new Error(data.message || data.error || 'Failed to fetch stall');
      }

      return data;
    } catch (error) {
      console.error('Get Single Stall Error:', error);
      throw error;
    }
  },

  // ==================== STALL APPROVAL ENDPOINTS ====================

  // Approve Stall (Vendor Admin)
  approveStall: async (shopId) => {
    try {
      if (!shopId) throw new Error('Shop ID is required');

      const response = await fetch(`${AUTH_URL}/vendor-admin-approve-stall/${shopId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) { clearAuthData(); throw new Error('Unauthorized - Please login again'); }
        throw new Error(data.message || data.error || 'Failed to approve stall');
      }

      return data;
    } catch (error) {
      console.error('Approve Stall Error:', error);
      throw error;
    }
  },

  // Reject Stall (Vendor Admin)
  rejectStall: async (shopId, rejectedReason = 'Documents required, try again') => {
    try {
      if (!shopId) throw new Error('Shop ID is required');

      const response = await fetch(`${AUTH_URL}/vendor-admin-reject-stall/${shopId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectedReason }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) { clearAuthData(); throw new Error('Unauthorized - Please login again'); }
        throw new Error(data.message || data.error || 'Failed to reject stall');
      }

      return data;
    } catch (error) {
      console.error('Reject Stall Error:', error);
      throw error;
    }
  },

  // ==================== VENDOR STALL STATUS ENDPOINTS ====================

  // Get Vendor's Own Pending Stalls
  getVendorPendingStalls: async () => {
    try {
      const response = await fetch(`${AUTH_URL}/get-vendor-pending-stalls`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) { clearAuthData(); throw new Error('Unauthorized - Please login again'); }
        throw new Error(data.message || 'Failed to fetch vendor pending stalls');
      }
      return data;
    } catch (error) {
      console.error('Get Vendor Pending Stalls Error:', error);
      throw error;
    }
  },

  // Get Vendor's Own Approved Stalls
  getVendorApprovedStalls: async () => {
    try {
      const response = await fetch(`${AUTH_URL}/get-vendor-approved-stalls`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) { clearAuthData(); throw new Error('Unauthorized - Please login again'); }
        throw new Error(data.message || 'Failed to fetch vendor approved stalls');
      }
      return data;
    } catch (error) {
      console.error('Get Vendor Approved Stalls Error:', error);
      throw error;
    }
  },

  // Get Vendor's Own Rejected Stalls
  getVendorRejectedStalls: async () => {
    try {
      const response = await fetch(`${AUTH_URL}/get-vendor-rejected-stalls`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) { clearAuthData(); throw new Error('Unauthorized - Please login again'); }
        throw new Error(data.message || 'Failed to fetch vendor rejected stalls');
      }
      return data;
    } catch (error) {
      console.error('Get Vendor Rejected Stalls Error:', error);
      throw error;
    }
  },

  // ==================== UTILITY FUNCTIONS ====================

  // Check Auth Status
  checkAuthStatus: async () => {
    try {
      const response = await fetch(`${AUTH_URL}/check-status`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        clearAuthData();
        return { authenticated: false };
      }

      if (data.authenticated && data.vendorId) {
        localStorage.setItem('vendorId', data.vendorId);
        localStorage.setItem('vendorAuthenticated', 'true');
      }

      return data;
    } catch (error) {
      console.error('Check Auth Status Error:', error);
      clearAuthData();
      return { authenticated: false };
    }
  }
};

export default vendorApi;