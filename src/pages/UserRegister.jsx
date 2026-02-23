import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import RegistrationForm from '../components/auth/RegistrationForm';
import OtpVerification from '../components/auth/OtpVerification';
import RegistrationSuccess from '../components/auth/RegistrationSuccess';
import { useAuth } from '../hooks/useAuth';

const UserRegister = () => {
  const navigate = useNavigate();
  const [verificationStep, setVerificationStep] = useState('registration');
  const [userData, setUserData] = useState({
    email: '',
    username: ''
  });
  
  const {
    registerUser,
    verifyOtp,
    resendOtp,
    isLoading,
    isVerifyingOtp
  } = useAuth();

  const handleRegistrationSubmit = async (formData) => {
    const result = await registerUser(formData);
    if (result.success) {
      setUserData({
        email: formData.email,
        username: formData.username
      });
      setVerificationStep('verify-otp');
    }
  };

  const handleOtpVerify = async (email, otp) => {
    const result = await verifyOtp(email, otp);
    if (result.success) {
      setVerificationStep('success');
    }
  };

  const handleOtpResend = async (email) => {
    await resendOtp(email);
  };

  const handleBackToRegistration = () => {
    setVerificationStep('registration');
  };

  const handleLoginRedirect = () => {
    navigate('/user/login');
  };

  return (
    <AuthLayout type="register" role="user" backLink="/user/login">
      {verificationStep === 'registration' && (
        <RegistrationForm
          onSubmit={handleRegistrationSubmit}
          isLoading={isLoading}
        />
      )}
      
      {verificationStep === 'verify-otp' && (
        <OtpVerification
          email={userData.email}
          onVerify={handleOtpVerify}
          onResend={handleOtpResend}
          onBack={handleBackToRegistration}
          isLoading={isVerifyingOtp}
        />
      )}
      
      {verificationStep === 'success' && (
        <RegistrationSuccess
          email={userData.email}
          onLogin={handleLoginRedirect}
        />
      )}
    </AuthLayout>
  );
};

export default UserRegister;