import React, { useEffect, useState } from 'react';
import { CheckCircle, Mail } from 'lucide-react';

const RegistrationSuccess = ({ email, onLogin }) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onLogin();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onLogin]);

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 mb-4">
        Email Verified Successfully! 🎉
      </h2>
      
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-6">
        <div className="flex items-start space-x-3">
          <Mail className="w-5 h-5 text-emerald-600 mt-0.5" />
          <div className="text-left">
            <h3 className="font-semibold text-emerald-900 mb-2">
              Welcome to MallSphere!
            </h3>
            <p className="text-emerald-700 text-sm">
              Your email <span className="font-medium">{email}</span> has been verified successfully.
            </p>
            <p className="text-emerald-600 text-xs mt-2">
              You can now log in to your account.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <p className="text-sm text-slate-500 mb-4">
          Redirecting to login page in {countdown} seconds...
        </p>
        <button
          onClick={onLogin}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
        >
          Go to Login Now
        </button>
      </div>
    </div>
  );
};

export default RegistrationSuccess;