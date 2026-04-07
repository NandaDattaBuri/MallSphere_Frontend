import React from 'react';
import { Tag, User } from 'lucide-react';

const SellerTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { key: "offers", icon: <Tag className="w-4 h-4" />, label: "Offers" },
    { key: "profile", icon: <User className="w-4 h-4" />, label: "Profile" }
  ];

  return (
    <div className="flex gap-1 p-1 bg-stone-100 rounded-xl w-fit mb-8">
      {tabs.map(t => (
        <button 
          key={t.key} 
          onClick={() => onTabChange(t.key)}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === t.key 
              ? "bg-white text-stone-900 shadow-sm" 
              : "text-stone-500 hover:text-stone-700"
          }`}
        >
          {t.icon} {t.label}
        </button>
      ))}
    </div>
  );
};

export default SellerTabs;