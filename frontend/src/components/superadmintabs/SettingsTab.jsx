// components/tabs/SettingsTab.jsx
import React, { useState } from 'react';
import { Save, X, Globe, Shield, Bell, CreditCard, Users, Database } from 'lucide-react';

const SettingsTab = () => {
  const [settings, setSettings] = useState({
    platformName: 'Mall Management Platform',
    supportEmail: 'support@mallplatform.com',
    description: 'A comprehensive platform for managing shopping malls, shops, and commercial spaces.',
    maintenanceMode: false,
    twoFactorAuth: true,
    sessionTimeout: true,
    ipWhitelisting: false,
    emailNotifications: true,
    pushNotifications: true,
    autoBackup: true
  });

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
    // In a real app, you would make an API call here
  };

  const handleReset = () => {
    setSettings({
      platformName: 'Mall Management Platform',
      supportEmail: 'support@mallplatform.com',
      description: 'A comprehensive platform for managing shopping malls, shops, and commercial spaces.',
      maintenanceMode: false,
      twoFactorAuth: true,
      sessionTimeout: true,
      ipWhitelisting: false,
      emailNotifications: true,
      pushNotifications: true,
      autoBackup: true
    });
  };

  const SettingToggle = ({ icon: Icon, title, description, field, value }) => (
    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-700 rounded-lg">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm text-slate-400">{description}</div>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={value}
          onChange={(e) => handleChange(field, e.target.checked)}
        />
        <div className="w-12 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
      </label>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-400" />
          General Settings
        </h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Platform Name</label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => handleChange('platformName', e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Platform Description</label>
            <textarea
              rows={3}
              value={settings.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <SettingToggle
            icon={Globe}
            title="Maintenance Mode"
            description="Enable to temporarily disable platform access"
            field="maintenanceMode"
            value={settings.maintenanceMode}
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          Security Settings
        </h3>
        <div className="space-y-4">
          <SettingToggle
            icon={Shield}
            title="Two-Factor Authentication"
            description="Require 2FA for all admin accounts"
            field="twoFactorAuth"
            value={settings.twoFactorAuth}
          />
          <SettingToggle
            icon={Users}
            title="Session Timeout"
            description="Auto-logout after 30 minutes of inactivity"
            field="sessionTimeout"
            value={settings.sessionTimeout}
          />
          <SettingToggle
            icon={Shield}
            title="IP Whitelisting"
            description="Restrict admin access to specific IP addresses"
            field="ipWhitelisting"
            value={settings.ipWhitelisting}
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-400" />
          Notification Settings
        </h3>
        <div className="space-y-4">
          <SettingToggle
            icon={Bell}
            title="Email Notifications"
            description="Receive important updates via email"
            field="emailNotifications"
            value={settings.emailNotifications}
          />
          <SettingToggle
            icon={Bell}
            title="Push Notifications"
            description="Get real-time notifications in the app"
            field="pushNotifications"
            value={settings.pushNotifications}
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Database className="w-5 h-5 text-purple-400" />
          System Settings
        </h3>
        <div className="space-y-4">
          <SettingToggle
            icon={Database}
            title="Auto Backup"
            description="Automatically backup data daily"
            field="autoBackup"
            value={settings.autoBackup}
          />
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <label className="block text-sm font-medium text-slate-300 mb-2">Backup Frequency</label>
            <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button 
          onClick={handleReset}
          className="px-6 py-3 border border-slate-700 rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Reset to Default
        </button>
        <button 
          onClick={handleSave}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsTab;