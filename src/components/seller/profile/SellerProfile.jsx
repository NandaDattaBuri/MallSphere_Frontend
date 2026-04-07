import React from 'react';
import { User } from 'lucide-react';

const inputCls = "w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-800 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-100 transition-all bg-white";

const SellerProfile = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="max-w-3xl">
      <div className="mb-7">
        <h1 className="df text-3xl font-semibold text-stone-900 tracking-tight">Profile Settings</h1>
        <p className="text-stone-400 text-sm mt-1">Manage your account and stall information</p>
      </div>
      <div className="bg-white border border-stone-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-br from-stone-900 to-stone-700 px-8 py-8 flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl">
            {profile.data?.profile ? (
              <img 
                src={profile.data.profile} 
                alt={profile.data.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-stone-600 flex items-center justify-center">
                <User className="w-8 h-8 text-stone-300" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-white text-xl font-semibold">{profile.data?.name}</h2>
            <p className="text-stone-300 text-sm mt-0.5">{profile.data?.shopName} · {profile.data?.category}</p>
          </div>
        </div>
        <div className="p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-5">Stall Information</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Shop Name</label>
              <input type="text" value={profile.data?.shopName || ''} readOnly className={`${inputCls} bg-stone-50`} />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Seller Name</label>
              <input type="text" value={profile.data?.name || ''} readOnly className={`${inputCls} bg-stone-50`} />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Email Address</label>
              <input type="email" value={profile.data?.email || ''} readOnly className={`${inputCls} bg-stone-50`} />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Contact Number</label>
              <input type="tel" value={profile.data?.Phone || ''} readOnly className={`${inputCls} bg-stone-50`} />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Category</label>
              <input type="text" value={profile.data?.category || ''} readOnly className={`${inputCls} bg-stone-50`} />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Location</label>
              <input type="text" value={profile.data?.location || ''} readOnly className={`${inputCls} bg-stone-50`} />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Floor Number</label>
              <input type="text" value={profile.data?.Floor || ''} readOnly className={`${inputCls} bg-stone-50`} />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Shop Address</label>
              <input type="text" value={profile.data?.Address || ''} readOnly className={`${inputCls} bg-stone-50`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;



