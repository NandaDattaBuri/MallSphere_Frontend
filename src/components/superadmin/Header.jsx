// components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Settings, LogOut, Shield, Mail, Phone, Building, Calendar } from 'lucide-react';
import { superAdminAuth } from '../../hooks/superAdminAuth';
import ProfileSettingsModal from '../superadmin/ProfileSettingsModal';

const Header = ({ activeTab, notifications }) => {
  // Get super admin data
  const superAdminData = superAdminAuth.getSuperAdminData();
  const userName = superAdminData?.name || 'Super Admin';
  const userEmail = superAdminData?.email || 'admin@example.com';
  const userPhone = superAdminData?.phone || 'Not provided';
  const userInitials = superAdminData?.name 
    ? superAdminData.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'SA';

  // State for modals
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getTitle = () => {
    const titles = {
      dashboard: 'Dashboard Overview',
      applications: 'Mall Applications',
      licenses: 'License Management',
      subscriptions: 'Subscription Management',
      users: 'User Management',
      analytics: 'Platform Analytics',
      settings: 'Settings'
    };
    return titles[activeTab] || 'Dashboard';
  };

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await superAdminAuth.getProfile();
      if (response.success && response.superAdmin) {
        setProfileData(response.superAdmin);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Open profile modal
  const handleProfileClick = () => {
    fetchProfile();
    setShowProfileModal(true);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await superAdminAuth.logout();
      window.location.href = '/superadmin/login';
    } catch (error) {
      console.error('Logout failed:', error);
    } 
  };

  // Handle password change
  const handlePasswordChange = async (oldPassword, newPassword, confirmPassword) => {
    try {
      const response = await superAdminAuth.changePassword(oldPassword, newPassword, confirmPassword);
      if (response.success) {
        return { success: true, message: 'Password changed successfully' };
      }
      return { success: false, message: response.message || 'Failed to change password' };
    } catch (error) {
      return { success: false, message: error.message || 'Failed to change password' };
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (updatedData) => {
    try {
      const response = await superAdminAuth.updateProfile(updatedData);
      if (response.success) {
        // Update local data
        const currentData = superAdminAuth.getSuperAdminData();
        const newData = { ...currentData, ...updatedData };
        localStorage.setItem('superAdminData', JSON.stringify(newData));
        
        // Trigger a re-render
        window.location.reload();
        return { success: true, message: 'Profile updated successfully' };
      }
      return { success: false, message: response.message || 'Failed to update profile' };
    } catch (error) {
      return { success: false, message: error.message || 'Failed to update profile' };
    }
  };

  return (
    <>
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">{getTitle()}</h1>
            <p className="text-slate-400 text-sm">Welcome back, {userName}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>

            <button className="relative p-2 hover:bg-slate-800 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs flex items-center justify-center rounded-full">
                  {notifications}
                </span>
              )}
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="relative group">
                <div 
                  className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={handleProfileClick}
                >
                  {userInitials}
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 border-b border-slate-800">
                    <div className="font-semibold text-white">{userName}</div>
                    <div className="text-sm text-slate-400">{userEmail}</div>
                    <div className="text-xs text-blue-400 mt-1 flex items-center">
                      <Shield className="w-3 h-3 mr-1" />
                      Super Admin
                    </div>
                  </div>
                  <div className="p-2">
                    <button 
                      className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg text-sm flex items-center"
                      onClick={handleProfileClick}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile Settings
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg text-sm flex items-center"
                      onClick={() => {<ProfileSettingsModal />}}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      System Settings
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 text-red-300 hover:bg-red-900/20 rounded-lg text-sm flex items-center mt-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="font-medium text-white">{userName}</div>
                <div className="text-xs text-slate-400">Super Admin</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Settings Modal */}
      <ProfileSettingsModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profileData={profileData}
        loading={loading}
        onPasswordChange={handlePasswordChange}
        onProfileUpdate={handleProfileUpdate}
      />
    </>
  );
};

export default Header;