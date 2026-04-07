import React, { useRef, useState, useEffect } from 'react';
import { Key, AlertCircle } from 'lucide-react';

const OTPInput = ({ length = 6, onComplete, error }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = Array(length).fill(0).map(() => useRef(null));

  useEffect(() => {
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value !== '' && index < length - 1) {
        inputRefs[index + 1].current.focus();
      }
      
      // Check if OTP is complete
      if (newOtp.every(digit => digit !== '')) {
        onComplete(newOtp.join(''));
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, length);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split('').slice(0, length);
      while (newOtp.length < length) {
        newOtp.push('');
      }
      setOtp(newOtp);
      newOtp.forEach((digit, idx) => {
        if (inputRefs[idx].current) {
          inputRefs[idx].current.value = digit;
        }
      });
      if (inputRefs[length - 1].current) {
        inputRefs[length - 1].current.focus();
      }
      if (newOtp.every(digit => digit !== '')) {
        onComplete(newOtp.join(''));
      }
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const resetOtp = () => {
    setOtp(Array(length).fill(''));
    inputRefs.forEach(ref => {
      if (ref.current) ref.current.value = '';
    });
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  };

  return (
    <div className="w-full">
      <label className="block text-slate-700 text-sm font-medium mb-4 text-center">
        Enter {length}-digit OTP
      </label>
      
      <div className="flex justify-center space-x-3" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={inputRefs[index]}
            type="text"
            maxLength="1"
            className="w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 bg-white"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={handleFocus}
          />
        ))}
      </div>
      
      {error && (
        <div className="mt-3 text-center">
          <p className="text-red-500 text-sm flex items-center justify-center">
            <AlertCircle className="w-4 h-4 mr-1" /> {error}
          </p>
        </div>
      )}
      
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={resetOtp}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Clear OTP
        </button>
      </div>
    </div>
  );
};

export default OTPInput;