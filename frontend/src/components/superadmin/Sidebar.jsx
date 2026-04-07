// components/superadmin/Sidebar.jsx
import React from 'react';
import { 
  BarChart3, Users, Store, FileText, Shield, 
  CreditCard, Activity, Settings, LogOut, 
  Menu, X, Home, Building, Key, DollarSign, 
  PieChart, Cog 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  activeTab, 
  setActiveTab, 
  handleLogout 
}) => {
  const navigate = useNavigate();

  // Enhanced menu items with better icons
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'applications', icon: Building, label: 'Mall Applications' },
    { id: 'licenses', icon: Key, label: 'License Management' },
    { id: 'subscriptions', icon: DollarSign, label: 'Subscriptions' },
    { id: 'users', icon: Users, label: 'User Management' },
    { id: 'analytics', icon: PieChart, label: 'Analytics' },
    { id: 'settings', icon: Cog, label: 'Settings' }
  ];

  const handleTabClick = (tabId) => {
    console.log('Switching to tab:', tabId);
    setActiveTab(tabId);
  };

  // Handle logout with confirmation and proper navigation
  const handleLogoutClick = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        // Call the logout function from parent
        await handleLogout();
        
        // Clear any local storage items (just to be safe)
        localStorage.removeItem('superAdminUser');
        sessionStorage.clear();
        
        // Navigate to login page
        navigate('/superadmin/login', { replace: true });
      } catch (error) {
        console.error('Logout error:', error);
        // Even if logout API fails, redirect to login
        navigate('/superadmin/login', { replace: true });
      }
    }
  };

  return (
    <aside className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
      {/* Logo/Header Section */}
      <div className="flex items-center justify-between p-6 border-b border-slate-800">
        {sidebarOpen && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              SuperAdmin
            </h2>
          </div>
        )}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Section */}
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white shadow-lg'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
              title={sidebarOpen ? '' : item.label}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${
                activeTab === item.id ? 'text-white' : 'group-hover:text-blue-400'
              }`} />
              {sidebarOpen && (
                <span className="font-medium whitespace-nowrap">{item.label}</span>
              )}
              
              {/* Active indicator dot (shown when sidebar is collapsed) */}
              {!sidebarOpen && activeTab === item.id && (
                <div className="absolute right-2 w-2 h-2 bg-blue-400 rounded-full"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-xl transition-all group"
          title={sidebarOpen ? '' : 'Logout'}
        >
          <LogOut className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
          {sidebarOpen && <span className="font-medium whitespace-nowrap">Logout</span>}
          
          {/* Logout indicator dot (shown when sidebar is collapsed) */}
          {!sidebarOpen && (
            <div className="absolute right-2 w-2 h-2 bg-red-400 rounded-full"></div>
          )}
        </button>
        
        {/* Version info (optional) */}
        {sidebarOpen && (
          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="text-xs text-slate-500 text-center">
              v1.0.0 • Super Admin Panel
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;