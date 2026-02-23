// components/tabs/UsersTab.jsx
import React, { useState } from 'react';
import { Users, TrendingUp, Eye, Edit, Trash2, Mail, Phone, Globe } from 'lucide-react';

const UsersTab = () => {
  const [userList] = useState([
    { id: 1, name: 'John Smith', email: 'john@phoenixmall.com', phone: '+1 234-567-8901', role: 'Mall Admin', mall: 'Phoenix City Mall', date: '2025-06-15', status: 'active', avatar: 'JS' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@sunsetplaza.com', phone: '+1 234-567-8902', role: 'Mall Admin', mall: 'Sunset Plaza', date: '2025-08-22', status: 'active', avatar: 'SJ' },
    { id: 3, name: 'Michael Chen', email: 'michael@harborview.com', phone: '+1 234-567-8903', role: 'Mall Admin', mall: 'Harbor View Center', date: '2025-11-30', status: 'pending', avatar: 'MC' },
    { id: 4, name: 'Emma Wilson', email: 'emma@grandcentral.com', phone: '+1 234-567-8904', role: 'Shop Owner', mall: 'Grand Central Plaza', date: '2025-09-10', status: 'active', avatar: 'EW' },
    { id: 5, name: 'David Brown', email: 'david@metrohub.com', phone: '+1 234-567-8905', role: 'Mall Admin', mall: 'Metro Shopping Hub', date: '2025-07-18', status: 'inactive', avatar: 'DB' }
  ]);

  const [stats] = useState({
    totalUsers: '45,823',
    mallAdmins: '2,847',
    shopOwners: '42,976',
    activeRate: '98.2%'
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
          <div className="text-3xl font-bold text-white mb-2">{stats.totalUsers}</div>
          <div className="text-slate-400 text-sm">Total Users</div>
          <div className="flex items-center gap-1 text-emerald-400 text-sm mt-2">
            <TrendingUp className="w-4 h-4" />
            <span>+12.5% this month</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
          <div className="text-3xl font-bold text-white mb-2">{stats.mallAdmins}</div>
          <div className="text-slate-400 text-sm">Mall Admins</div>
          <div className="flex items-center gap-1 text-blue-400 text-sm mt-2">
            <Globe className="w-4 h-4" />
            <span>1247 malls</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
          <div className="text-3xl font-bold text-white mb-2">{stats.shopOwners}</div>
          <div className="text-slate-400 text-sm">Shop Owners</div>
          <div className="flex items-center gap-1 text-purple-400 text-sm mt-2">
            <TrendingUp className="w-4 h-4" />
            <span>+8.3% this month</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
          <div className="text-3xl font-bold text-white mb-2">{stats.activeRate}</div>
          <div className="text-slate-400 text-sm">Active Rate</div>
          <div className="flex items-center gap-1 text-emerald-400 text-sm mt-2">
            <TrendingUp className="w-4 h-4" />
            <span>+2.1% from last month</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold">User Management</h3>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
            <Users className="w-4 h-4" />
            Invite User
          </button>
        </div>
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="text-left p-4 font-semibold text-slate-300">User</th>
              <th className="text-left p-4 font-semibold text-slate-300">Contact</th>
              <th className="text-left p-4 font-semibold text-slate-300">Role</th>
              <th className="text-left p-4 font-semibold text-slate-300">Mall</th>
              <th className="text-left p-4 font-semibold text-slate-300">Join Date</th>
              <th className="text-left p-4 font-semibold text-slate-300">Status</th>
              <th className="text-left p-4 font-semibold text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr key={user.id} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center font-bold">
                      {user.avatar}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-slate-400">ID: USER-{user.id.toString().padStart(4, '0')}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-3 h-3" />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Phone className="w-3 h-3" />
                      {user.phone}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'Mall Admin' ? 'bg-blue-500/10 text-blue-400' : 
                    'bg-purple-500/10 text-purple-400'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 font-medium">{user.mall}</td>
                <td className="p-4 text-slate-400">{user.date}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                    user.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {user.status}
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

export default UsersTab;