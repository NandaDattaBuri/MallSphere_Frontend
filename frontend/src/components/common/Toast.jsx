import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-medium transition-all ${
      toast.type === "error" ? "bg-rose-500 text-white" : "bg-stone-900 text-white"
    }`}>
      {toast.type === "error" ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
      {toast.msg}
    </div>
  );
};

export default Toast;