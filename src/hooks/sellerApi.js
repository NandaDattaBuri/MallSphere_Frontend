// api/sellerApi.js - COMPLETE VERSION WITH COOKIE-BASED AUTH
const API_BASE_URL = 'https://mallsperebackend-1.onrender.com/api';
const SELLER_URL = `${API_BASE_URL}/seller`;

// ==================== HELPER FUNCTIONS ====================

const getSellerId = () => {
  return localStorage.getItem('sellerId');
};

const storeAuthData = (data) => {
  if (data.sellerId) {
    localStorage.setItem('sellerId', data.sellerId);
  }
  localStorage.setItem('sellerAuthenticated', 'true');

  if (data.email) {
    localStorage.setItem('sellerEmail', data.email);
  }
};

const clearAuthData = () => {
  localStorage.removeItem('sellerId');
  localStorage.removeItem('sellerAuthenticated');
  localStorage.removeItem('sellerEmail');
  localStorage.removeItem('sellerData');
};

const isAuthenticated = () => {
  const isAuth = localStorage.getItem('sellerAuthenticated') === 'true';
  const hasSellerId = !!localStorage.getItem('sellerId');

  console.log('Auth check - isAuth:', isAuth, 'hasSellerId:', hasSellerId);
  return isAuth && hasSellerId;
};

// ==================== SELLER API ====================

export const sellerApi = {
  // Auth Helper Functions
  isAuthenticated,
  getSellerId,
  storeAuthData,
  clearAuthData,

  // ==================== REGISTRATION & AUTH ====================

  // 1. Register Seller Stall (multipart/form-data)
  registerSellerStall: async (sellerData, profilePicture, sellerShopImages) => {
    try {
      console.log('=== SELLER STALL REGISTRATION START ===');

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

      if (!profilePicture) {
        throw new Error('Profile picture is required');
      }
      formData.append('profilePicture', profilePicture);

      if (!sellerShopImages || sellerShopImages.length === 0) {
        throw new Error('At least one shop image is required');
      }
      sellerShopImages.forEach((image) => {
        formData.append('sellerShopImage', image);
      });

      const response = await fetch(`${SELLER_URL}/seller-stall-register`, {
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
      console.error('Register Seller Stall Error:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection.');
      }
      throw error;
    }
  },

  // 2. Login Seller Stall
  loginSellerStall: async (email, password) => {
    try {
      const response = await fetch(`${SELLER_URL}/seller-stall-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || data?.error || 'Login failed');

      console.log('Seller login response:', data);
      storeAuthData(data);
      return data;
    } catch (error) {
      console.error('Login Seller Stall Error:', error);
      throw error;
    }
  },

  // 3. Logout Seller Stall
  logoutSellerStall: async () => {
    try {
      const response = await fetch(`${SELLER_URL}/seller-stall-logout`, {
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
      console.error('Logout Seller Stall Error:', error);
      clearAuthData();
      return { success: true, message: 'Logged out locally' };
    }
  },

  // 4. Verify OTP (Email Verification)
  verifyOtp: async (email, otp) => {
    try {
      const response = await fetch(`${SELLER_URL}/seller-stall-verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
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

  // 5. Resend OTP
  resendOtp: async (email) => {
    try {
      const response = await fetch(`${SELLER_URL}/seller-stall-resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
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

  // 6. Forgot Password (Send OTP)
  forgotPassword: async (email) => {
    try {
      const response = await fetch(`${SELLER_URL}/seller-stall-forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
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

  // 7. Verify Forgot Password OTP
  verifyForgotPasswordOtp: async (email, otp) => {
    try {
      const response = await fetch(`${SELLER_URL}/seller-verify-forgot-password-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || data?.error || 'OTP verification failed');
      return data;
    } catch (error) {
      console.error('Verify Forgot Password OTP Error:', error);
      throw error;
    }
  },

  // 8. Reset Password
  resetPassword: async (email, otp, newPassword, confirmPassword) => {
    try {
      const response = await fetch(`${SELLER_URL}/seller-stall-reset-password`, {
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

  // 9. Change Password (Auth Required)
  changePassword: async (oldPassword, newPassword, confirmPassword) => {
    try {
      const response = await fetch(`${SELLER_URL}/seller-stall-change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || data?.error || 'Password change failed');
      return data;
    } catch (error) {
      console.error('Change Password Error:', error);
      throw error;
    }
  },

  // 10. Refresh Token
  refreshToken: async () => {
    try {
      const response = await fetch(`${SELLER_URL}/seller-stall-refresh-token`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || data?.error || 'Token refresh failed');
      return data;
    } catch (error) {
      console.error('Refresh Token Error:', error);
      throw error;
    }
  },

  // ==================== PROFILE ====================

  // 11. Get Seller Stall Profile (Auth Required)
  getSellerStallProfile: async () => {
    try {
      const response = await fetch(`${SELLER_URL}/seller-stall-profile`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          clearAuthData();
          throw new Error('Unauthorized - Please login again');
        }
        throw new Error(data?.message || data?.error || 'Failed to fetch profile');
      }

      return data;
    } catch (error) {
      console.error('Get Seller Stall Profile Error:', error);
      throw error;
    }
  },
};

export default sellerApi;