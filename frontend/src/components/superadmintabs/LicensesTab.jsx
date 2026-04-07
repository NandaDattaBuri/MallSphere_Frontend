// components/tabs/LicensesTab.jsx
import React, { useState } from 'react';
import { Shield, Eye, Edit, Trash2, CheckCircle } from 'lucide-react';

const LicensesTab = () => {
  const [licenses] = useState([
    { key: 'LIC-7894-AB2X', mall: 'Grand Central Plaza', plan: 'Enterprise', issued: '2025-10-15', expiry: '2026-04-15', status: 'active' },
    { key: 'LIC-4567-CD8Y', mall: 'Metro Shopping Hub', plan: 'Professional', issued: '2025-11-20', expiry: '2026-01-20', status: 'expiring' },
    { key: 'LIC-1234-EF6Z', mall: 'City Center Mall', plan: 'Business', issued: '2025-09-10', expiry: '2025-12-10', status: 'expired' },
    { key: 'LIC-5678-GH9A', mall: 'Phoenix City Mall', plan: 'Professional', issued: '2025-12-01', expiry: '2026-06-01', status: 'active' }
  ]);

  const [licenseTypes] = useState([
    { name: 'Trial', count: 156, color: 'bg-blue-500' },
    { name: 'Standard', count: 843, color: 'bg-emerald-500' },
    { name: 'Premium', count: 248, color: 'bg-purple-500' }
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            License Overview
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Active Licenses</span>
              <span className="text-xl font-bold text-white">1,247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Expiring Soon</span>
              <span className="text-xl font-bold text-amber-400">42</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Expired</span>
              <span className="text-xl font-bold text-red-400">18</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4">Generate New License</h3>
          <div className="space-y-4">
            <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Plan</option>
              <option value="business">Business</option>
              <option value="professional">Professional</option>
              <option value="enterprise">Enterprise</option>
            </select>
            <input
              type="text"
              placeholder="Mall ID"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Duration (months)"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="12"
            />
            <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:shadow-lg transition-all">
              Generate License Key
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4">License Types</h3>
          <div className="space-y-3">
            {licenseTypes.map((type, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                  <span>{type.name}</span>
                </div>
                <span className="font-semibold">{type.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold">License Management</h3>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:shadow-lg transition-all">
            + Add License
          </button>
        </div>
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="text-left p-4 font-semibold text-slate-300">License Key</th>
              <th className="text-left p-4 font-semibold text-slate-300">Mall</th>
              <th className="text-left p-4 font-semibold text-slate-300">Plan</th>
              <th className="text-left p-4 font-semibold text-slate-300">Issued Date</th>
              <th className="text-left p-4 font-semibold text-slate-300">Expiry Date</th>
              <th className="text-left p-4 font-semibold text-slate-300">Status</th>
              <th className="text-left p-4 font-semibold text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {licenses.map((license, i) => (
              <tr key={i} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-mono text-sm">{license.key}</td>
                <td className="p-4 font-medium">{license.mall}</td>
                <td className="p-4 text-slate-400">{license.plan}</td>
                <td className="p-4 text-slate-400">{license.issued}</td>
                <td className="p-4 text-slate-400">{license.expiry}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    license.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                    license.status === 'expiring' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {license.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LicensesTab;