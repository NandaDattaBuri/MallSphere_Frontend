const API_BASE_URL = 'https://mallsperebackend-1.onrender.com/api/super-admin';

// Helper functions
const getSuperAdminId = () => {
  const data = getSuperAdminData();
  return data?.id || null;
};

const getSuperAdminData = () => {
  // We can't read HTTP-only cookies from JavaScript
  // We'll store minimal non-sensitive data in localStorage for UI
  const localData = localStorage.getItem('superAdminData');
  return localData ? JSON.parse(localData) : null;
};

const storeAuthData = (response, data) => {
  console.log('📦 Storing auth data:', data);
  
  // Store user data from response body (for UI display only)
  if (data.superAdmin) {
    // Store non-sensitive data in localStorage for UI
    localStorage.setItem('superAdminData', JSON.stringify(data.superAdmin));
    localStorage.setItem('isAuthenticated', 'true');
    console.log('✅ Super Admin data stored in localStorage (UI only)');
  }
  
  console.log('📦 Final stored data:', {
    hasData: !!data.superAdmin,
    superAdminData: data.superAdmin ? 'Present' : 'Missing'
  });
};

const clearAuthData = () => {
  localStorage.removeItem('superAdminData');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('pendingSuperAdminEmail');
  localStorage.removeItem('resetPasswordEmail');
  console.log('🗑️ All local auth data cleared');
};

const isAuthenticated = () => {
  const hasSession = localStorage.getItem('isAuthenticated') === 'true';
  const hasData = !!getSuperAdminData();
  
  console.log('🔐 Auth check:', { hasSession, hasData });
  
  // Authentication is handled by cookies, we just check if we have UI data
  return hasSession && hasData;
};

// Cookie-based authentication fetch (clean & correct)
const authFetch = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    console.log("📡 Fetching:", url);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      credentials: "include", // 🍪 ALWAYS send cookies
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    console.log("📬 Response status:", response.status);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;

      try {
        const errorData = await response.json();
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
      } catch (_) {}

      if (response.status === 401) {
        clearAuthData(); // Clear local UI data
        errorMessage = "Session expired. Please login again.";
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new Error("Request timeout. Please check your internet connection.");
    }

    if (error instanceof TypeError) {
      throw new Error("Network error. Please check your internet connection.");
    }

    throw error;
  }
};

export const superAdminAuth = {
  // Authentication Helper Functions
  isAuthenticated: isAuthenticated,
  getSuperAdminId: getSuperAdminId,
  getSuperAdminData: getSuperAdminData,
  clearAuthData: clearAuthData,

  // Super Admin Register
  register: async (name, email, password) => {
    try {
      console.log('\n=== 📝 SUPER ADMIN REGISTRATION START ===');
      console.log('📧 Email:', email);
      console.log('👤 Name:', name);
      
      const response = await fetch(`${API_BASE_URL}/super-admin-register`, {
        method: 'POST',
        credentials: 'include', // Send/receive cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      console.log('📬 Registration response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      if (data.success) {
        localStorage.setItem('pendingSuperAdminEmail', email);
      }
      
      return data;
    } catch (error) {
      console.error('❌ Registration Error:', error);
      throw error;
    }
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    try {
      console.log('\n=== 🔐 VERIFYING OTP ===');
      console.log('📧 Email:', email);
      
      const response = await fetch(`${API_BASE_URL}/super-admin-verify-otp`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      console.log('📬 OTP verification response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }
      
      if (data.message?.includes('successfully')) {
        localStorage.removeItem('pendingSuperAdminEmail');
      }
      
      return data;
    } catch (error) {
      console.error('❌ OTP Verification Error:', error);
      throw error;
    }
  },

  // Resend OTP
  resendOTP: async (email) => {
    try {
      console.log('\n=== 🔄 RESENDING OTP ===');
      console.log('📧 Email:', email);
      
      const response = await fetch(`${API_BASE_URL}/super-admin-resend-otp`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log('📬 Resend OTP response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Resend OTP Error:', error);
      throw error;
    }
  },

  // Login - COOKIE-BASED (backend sets HTTP-only cookies)
  login: async (email, password) => {
    try {
      console.log('\n=== 🔑 SUPER ADMIN LOGIN START ===');
      console.log('📧 Email:', email);
      
      // Clear any existing local data first
      clearAuthData();
      
      const response = await fetch(`${API_BASE_URL}/super-admin-login`, {
        method: 'POST',
        credentials: 'include', // IMPORTANT: For cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('📬 Login response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      if (data.success && data.superAdmin) {
        storeAuthData(response, data);
        console.log('✅ Login successful, cookies should be set by backend');
        console.log('✅ Using cookie-based authentication');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Login Error:', error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      console.log('\n=== 🚪 SUPER ADMIN LOGOUT START ===');
      
      const response = await fetch(`${API_BASE_URL}/super-admin-logout`, {
        method: 'POST',
        credentials: 'include',
      });

      console.log('📬 Logout response status:', response.status);
      
      clearAuthData();
      console.log('✅ Logged out successfully');
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('❌ Logout Error:', error);
      clearAuthData();
      return { success: true, message: 'Logged out locally' };
    }
  },

  // Get Profile (Protected) - COOKIE-BASED
  getProfile: async () => {
    try {
      console.log('\n=== 👤 GET SUPER ADMIN PROFILE ===');
      
      if (!isAuthenticated()) {
        throw new Error('Not authenticated. Please login.');
      }
      
      const response = await authFetch(`${API_BASE_URL}/super-admin-profile`, {
        method: 'GET',
      });

      if (response.success && response.superAdmin) {
        // Update local data with fresh profile info
        localStorage.setItem('superAdminData', JSON.stringify(response.superAdmin));
        console.log('✅ Profile data updated');
      }
      
      return response;
    } catch (error) {
      console.error('❌ Get Profile Error:', error);
      throw error;
    }
  },

  // Refresh Token - COOKIE-BASED (GET method)
  refreshToken: async () => {
    try {
      console.log('\n=== 🔄 REFRESH TOKEN ===');
      
      // Cookie-based refresh
      const response = await fetch(`${API_BASE_URL}/super-admin-refresh-token`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      console.log('📬 Cookie refresh response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Token refresh failed');
      }
      
      console.log('✅ Tokens refreshed via cookies');
      return data;
    } catch (error) {
      console.error('❌ Refresh Token Error:', error);
      throw error;
    }
  },

  // Forgot Password
  forgotPassword: async (email) => {
    try {
      console.log('\n=== 🔒 FORGOT PASSWORD ===');
      console.log('📧 Email:', email);
      
      const response = await fetch(`${API_BASE_URL}/super-admin-forgot-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log('📬 Forgot password response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      
      if (data.message?.includes('successfully')) {
        localStorage.setItem('resetPasswordEmail', email);
      }
      
      return data;
    } catch (error) {
      console.error('❌ Forgot Password Error:', error);
      throw error;
    }
  },

  // Reset Password
  resetPassword: async (email, otp, newPassword, confirmPassword) => {
    try {
      console.log('\n=== 🔐 RESET PASSWORD ===');
      console.log('📧 Email:', email);
      
      const response = await fetch(`${API_BASE_URL}/super-admin-reset-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
      });

      const data = await response.json();
      console.log('📬 Reset password response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Password reset failed');
      }
      
      if (data.message?.includes('successful')) {
        localStorage.removeItem('resetPasswordEmail');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Reset Password Error:', error);
      throw error;
    }
  },

  // Change Password (Protected)
  changePassword: async (oldPassword, newPassword, confirmPassword) => {
    try {
      console.log('\n=== 🔑 CHANGE PASSWORD ===');
      
      const response = await authFetch(`${API_BASE_URL}/super-admin-change-password`, {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
      });

      console.log('✅ Password changed successfully');
      return response;
    } catch (error) {
      console.error('❌ Change Password Error:', error);
      throw error;
    }
  },

  verifyResetOTP: async (email, otp) => {
    try {
      console.log('\n=== 🔐 VERIFYING PASSWORD RESET OTP ===');
      console.log('📧 Email:', email);
      
      const response = await fetch(`${API_BASE_URL}/super-admin-verify-forgot-password-otp`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      console.log('📬 Password reset OTP verification response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Password Reset OTP Verification Error:', error);
      throw error;
    }
  },

  // VENDOR MANAGEMENT APIs (All Protected)
  
  // Get Pending Vendors
  getPendingVendors: async () => {
    try {
      console.log('\n=== 📋 GET PENDING VENDORS ===');
      
      const response = await authFetch(`${API_BASE_URL}/pending-vendors`, {
        method: 'GET',
      });

      console.log('✅ Pending vendors retrieved:', response.vendors?.length || 0);
      return response;
    } catch (error) {
      console.error('❌ Get Pending Vendors Error:', error);
      throw error;
    }
  },

  // Get Approved Vendors
  getApprovedVendors: async () => {
    try {
      console.log('\n=== ✅ GET APPROVED VENDORS ===');
      
      const response = await authFetch(`${API_BASE_URL}/approved-vendors`, {
        method: 'GET',
      });

      console.log('✅ Approved vendors retrieved:', response.vendors?.length || 0);
      return response;
    } catch (error) {
      console.error('❌ Get Approved Vendors Error:', error);
      throw error;
    }
  },

  // Get Rejected Vendors
  getRejectedVendors: async () => {
    try {
      console.log('\n=== ❌ GET REJECTED VENDORS ===');
      
      const response = await authFetch(`${API_BASE_URL}/rejected-vendors`, {
        method: 'GET',
      });

      console.log('✅ Rejected vendors retrieved:', response.vendors?.length || 0);
      return response;
    } catch (error) {
      console.error('❌ Get Rejected Vendors Error:', error);
      throw error;
    }
  },

  // Get All Vendors
  getAllVendors: async () => {
    try {
      console.log('\n=== 📊 GET ALL VENDORS ===');
      
      const response = await authFetch(`${API_BASE_URL}/all-vendors`, {
        method: 'GET',
      });

      console.log('✅ All vendors retrieved:', response.vendors?.length || 0);
      return response;
    } catch (error) {
      console.error('❌ Get All Vendors Error:', error);
      throw error;
    }
  },

  // Get Single Vendor
  getSingleVendor: async (vendorId) => {
    try {
      console.log('\n=== 🔍 GET SINGLE VENDOR ===');
      console.log('🆔 Vendor ID:', vendorId);
      
      const response = await authFetch(`${API_BASE_URL}/single-vendor/${vendorId}`, {
        method: 'GET',
      });

      console.log('✅ Vendor retrieved:', response.vendor?.businessName || 'Unknown');
      return response;
    } catch (error) {
      console.error('❌ Get Single Vendor Error:', error);
      throw error;
    }
  },

  // Approve Vendor
  approveVendor: async (vendorId) => {
    try {
      console.log('\n=== ✅ APPROVE VENDOR ===');
      console.log('🆔 Vendor ID:', vendorId);
      
      const response = await authFetch(`${API_BASE_URL}/super-admin-approve-vendor/${vendorId}`, {
        method: 'PATCH',
      });

      console.log('✅ Vendor approved successfully');
      return response;
    } catch (error) {
      console.error('❌ Approve Vendor Error:', error);
      throw error;
    }
  },

  // Reject Vendor
  rejectVendor: async (vendorId, reason = '') => {
    try {
      console.log('\n=== ❌ REJECT VENDOR ===');
      console.log('🆔 Vendor ID:', vendorId);
      console.log('📝 Reason:', reason);
      
      const options = {
        method: 'PATCH',
      };
      
      if (reason) {
        options.body = JSON.stringify({ reason });
      }
      
      const response = await authFetch(`${API_BASE_URL}/super-admin-reject-vendor/${vendorId}`, options);

      console.log('✅ Vendor rejected successfully');
      return response;
    } catch (error) {
      console.error('❌ Reject Vendor Error:', error);
      throw error;
    }
  },

  // Utility methods
  validatePassword(password) {
    const requirements = {
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[@$!%*?&]/.test(password),
      hasMinLength: password.length >= 6
    };

    const isValid = Object.values(requirements).every(req => req === true);
    
    return {
      isValid,
      requirements,
      message: isValid ? 'Password is strong' : 'Password must contain uppercase, lowercase, number, special character, and be at least 6 characters long'
    };
  },

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validateName(name) {
    return name.length >= 3;
  },

  // Debug function
  debugAuth: () => {
    const data = getSuperAdminData();
    const isAuth = isAuthenticated();
    
    console.log('\n=== 🔍 AUTH DEBUG INFO ===');
    console.log('🔐 Is Authenticated:', isAuth);
    console.log('🍪 Cookies visible to JS:', document.cookie || 'None (HTTP-only cookies not visible)');
    console.log('👤 Super Admin Data (local):', data);
    console.log('💾 localStorage keys:', Object.keys(localStorage));
    
    return {
      isAuth,
      hasLocalData: !!data,
      cookies: document.cookie
    };
  },

  // Test endpoint connectivity
  testConnection: async () => {
    try {
      console.log('🔌 Testing backend connection...');
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        credentials: 'include'
      });
      console.log('🔌 Connection test status:', response.status);
      return response.ok;
    } catch (error) {
      console.error('🔌 Connection test failed:', error);
      return false;
    }
  }
};

export default superAdminAuth;