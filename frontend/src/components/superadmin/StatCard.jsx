// components/StatCard.jsx
import React from 'react';
import { TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, change, color }) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-2">{title}</p>
        <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
        {change && (
          <div className={`flex items-center gap-1 text-sm ${change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            <TrendingUp className="w-4 h-4" />
            <span>{Math.abs(change)}% from last month</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default StatCard;