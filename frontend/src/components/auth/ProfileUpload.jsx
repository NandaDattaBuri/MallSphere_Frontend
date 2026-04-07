import React, { useRef, useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';

const ProfileUpload = ({ profilePicture, onFileChange }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, GIF)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      onFileChange(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeImage = () => {
    onFileChange(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mb-8">
      <label className="block text-slate-700 text-sm font-medium mb-4">
        Profile Picture (Optional)
      </label>
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div 
            onClick={triggerFileInput}
            className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-400 cursor-pointer transition-all duration-200 bg-white/50 flex items-center justify-center group"
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Profile preview"
                  className="w-full h-full rounded-2xl object-cover"
                />
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white cursor-pointer hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3 text-white" />
                </div>
              </>
            ) : (
              <div className="text-center p-4">
                <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:text-blue-500 transition-colors" />
                <span className="text-xs text-slate-500 group-hover:text-blue-600">Upload</span>
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-white">
              <Upload className="w-4 h-4 text-white" />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-600 mb-2">
            Upload a profile picture to personalize your account
          </p>
          <p className="text-xs text-slate-500">
            Recommended: Square image, max 5MB (JPG, PNG, GIF)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpload;