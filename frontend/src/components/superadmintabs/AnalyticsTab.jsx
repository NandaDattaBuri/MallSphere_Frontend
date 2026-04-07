// components/tabs/AnalyticsTab.jsx
import React from 'react';
import { TrendingUp, Activity, Globe, BarChart } from 'lucide-react';

const AnalyticsTab = () => {
  const topMalls = [
    { name: 'Grand Central Plaza', revenue: '$1.2M', growth: '+24%' },
    { name: 'Metro Shopping Hub', revenue: '$890K', growth: '+18%' },
    { name: 'City Center Mall', revenue: '$760K', growth: '+12%' },
    { name: 'Phoenix City Mall', revenue: '$680K', growth: '+32%' },
    { name: 'Harbor View Center', revenue: '$540K', growth: '+8%' }
  ];

  const platformHealth = [
    { metric: 'API Response Time', value: '98ms', percentage: 98, color: 'from-emerald-500 to-emerald-600' },
    { metric: 'Uptime', value: '99.9%', percentage: 99.9, color: 'from-blue-500 to-blue-600' },
    { metric: 'Error Rate', value: '0.2%', percentage: 99.8, color: 'from-purple-500 to-purple-600' },
    { metric: 'Server Load', value: '42%', percentage: 42, color: 'from-amber-500 to-amber-600' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart className="w-5 h-5 text-blue-400" />
              Platform Usage Analytics
            </h3>
            <select className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-72">
            <div className="flex items-end h-48 gap-1 mt-6">
              {[40, 65, 80, 60, 75, 90, 85, 70, 95, 88, 92, 78].map((h, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-gradient-to-t from-blue-500 to-purple-600 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity cursor-pointer" 
                  style={{ height: `${h}%` }}
                  title={`Month ${i + 1}: ${h}%`}
                ></div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-slate-400">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
                <span key={i}>{month}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Top Performing Malls
          </h3>
          <div className="space-y-4">
            {topMalls.map((mall, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-medium">{mall.name}</div>
                    <div className="text-sm text-slate-400">{mall.revenue} revenue</div>
                  </div>
                </div>
                <div className="text-emerald-400 font-semibold">{mall.growth}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-400" />
            Geographic Distribution
          </h3>
          <div className="flex items-center justify-center h-48">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20"></div>
              <div className="absolute inset-4 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full opacity-30"></div>
              <div className="absolute inset-8 bg-gradient-to-br from-blue-700 to-purple-800 rounded-full opacity-40 flex items-center justify-center">
                <span className="text-white text-lg font-bold">1247</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">42%</div>
              <div className="text-sm text-slate-400">North America</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">28%</div>
              <div className="text-sm text-slate-400">Europe</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">18%</div>
              <div className="text-sm text-slate-400">Asia Pacific</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">12%</div>
              <div className="text-sm text-slate-400">Other Regions</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            Platform Health
          </h3>
          <div className="space-y-6">
            {platformHealth.map((health, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span>{health.metric}</span>
                  <span className="text-emerald-400">{health.value}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${health.color}`} 
                    style={{ width: `${health.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-slate-800/50 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Overall Health Score</div>
                <div className="text-sm text-slate-400">Based on all metrics</div>
              </div>
              <div className="text-3xl font-bold text-emerald-400">94.7</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;