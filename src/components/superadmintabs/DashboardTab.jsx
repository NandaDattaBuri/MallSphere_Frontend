// components/tabs/DashboardTab.jsx
import React from 'react';
import { TrendingUp, Activity } from 'lucide-react';
import StatCard from '../superadmin/StatCard';
import { Building2, Store, Users, DollarSign } from 'lucide-react';

const DashboardTab = ({ dashboardData }) => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Building2}
          title="Total Malls"
          value={dashboardData.totalMalls.toLocaleString()}
          change={12.5}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          icon={Store}
          title="Total Shops"
          value={dashboardData.totalShops.toLocaleString()}
          change={8.3}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          icon={Users}
          title="Active Users"
          value={dashboardData.activeUsers.toLocaleString()}
          change={dashboardData.monthlyGrowth}
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value={`$${(dashboardData.revenue / 1000000).toFixed(2)}M`}
          change={15.7}
          color="bg-gradient-to-br from-amber-500 to-amber-600"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Revenue Growth
          </h3>
          <div className="h-64 flex items-end justify-around gap-2">
            {[65, 85, 70, 90, 75, 95, 88].map((height, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-lg hover:opacity-80 transition-opacity" style={{ height: `${height}%` }}></div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              { action: 'New mall application', mall: 'Phoenix City Mall', time: '5 min ago' },
              { action: 'License approved', mall: 'Sunset Plaza', time: '1 hour ago' },
              { action: 'Subscription renewed', mall: 'Harbor View Center', time: '2 hours ago' },
              { action: 'New user registered', mall: 'Metro Shopping Hub', time: '3 hours ago' }
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-slate-400">{activity.mall}</p>
                </div>
                <span className="text-xs text-slate-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;