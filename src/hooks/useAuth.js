import { useState } from 'react';
import { toast } from 'react-toastify';

const API_URL = 'https://mallsperebackend-1.onrender.com/api/auth';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const registerUser = async (formData) => {
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      
      if (formData.profilePicture) {
        formDataToSend.append('profilePicture', formData.profilePicture);
      }

      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      toast.success('✓ Account created! OTP sent to your email.', {
        position: "top-right",
        autoClose: 5000
      });

      return { success: true, data: data.user };

    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.', {
        position: "top-right",
        autoClose: 5000
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email, otp) => {
    setIsVerifyingOtp(true);
    try {
      const response = await fetch(`${API_URL}/verify-user-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: otp
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      toast.success('✓ Email verified successfully! 🎉', {
        position: "top-right",
        autoClose: 5000
      });

      return { success: true, data };

    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(error.message || 'Invalid OTP. Please try again.', {
        position: "top-right",
        autoClose: 5000
      });
      return { success: false, error };
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const resendOtp = async (email) => {
    try {
      const response = await fetch(`${API_URL}/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      toast.success('✓ New OTP sent to your email!', {
        position: "top-right",
        autoClose: 5000
      });

      return { success: true };

    } catch (error) {
      toast.error(error.message || 'Failed to resend OTP. Please try again.', {
        position: "top-right",
        autoClose: 5000
      });
      return { success: false, error };
    }
  };

  return {
    registerUser,
    verifyOtp,
    resendOtp,
    isLoading,
    isVerifyingOtp,
  };
};