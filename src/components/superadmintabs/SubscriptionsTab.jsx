// components/tabs/SubscriptionsTab.jsx
import React, { useState } from 'react';
import { CreditCard, CheckCircle, Calendar, Eye, Edit, Trash2 } from 'lucide-react';

const SubscriptionsTab = () => {
  const [subscriptions] = useState([
    { id: 1, mall: 'Grand Central Plaza', plan: 'Enterprise', price: 499, status: 'active', renewal: '2026-02-15' },
    { id: 2, mall: 'Metro Shopping Hub', plan: 'Professional', price: 299, status: 'active', renewal: '2026-02-20' },
    { id: 3, mall: 'City Center Mall', plan: 'Business', price: 199, status: 'expiring', renewal: '2026-01-25' },
    { id: 4, mall: 'Ocean View Mall', plan: 'Enterprise', price: 499, status: 'active', renewal: '2026-03-10' },
    { id: 5, mall: 'Downtown Center', plan: 'Professional', price: 299, status: 'active', renewal: '2026-02-28' }
  ]);

  const [plans] = useState([
    { name: 'Business', price: 199, features: ['Up to 50 shops', 'Basic analytics', 'Email support'], color: 'from-blue-500 to-blue-600' },
    { name: 'Professional', price: 299, features: ['Up to 150 shops', 'Advanced analytics', 'Priority support', 'Custom branding'], color: 'from-purple-500 to-purple-600', popular: true },
    { name: 'Enterprise', price: 499, features: ['Unlimited shops', 'Full analytics suite', '24/7 support', 'Custom integrations', 'API access'], color: 'from-amber-500 to-amber-600' }
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <div key={i} className={`relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border ${plan.popular ? 'border-purple-500' : 'border-slate-700'} hover:shadow-2xl transition-all duration-300`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xs font-semibold">
                Most Popular
              </div>
            )}
            <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mb-4`}>
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold">${plan.price}</span>
              <span className="text-slate-400">/month</span>
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  {feature}
                </li>
              ))}
            </ul>
            <button className={`w-full py-3 bg-gradient-to-r ${plan.color} rounded-xl font-semibold hover:shadow-lg transition-all`}>
              View Details
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Active Subscriptions</h3>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:shadow-lg transition-all">
            + New Subscription
          </button>
        </div>
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="text-left p-4 font-semibold text-slate-300">Mall</th>
              <th className="text-left p-4 font-semibold text-slate-300">Plan</th>
              <th className="text-left p-4 font-semibold text-slate-300">Price</th>
              <th className="text-left p-4 font-semibold text-slate-300">Status</th>
              <th className="text-left p-4 font-semibold text-slate-300">Renewal Date</th>
              <th className="text-left p-4 font-semibold text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-medium">{sub.mall}</td>
                <td className="p-4 text-slate-400">{sub.plan}</td>
                <td className="p-4 text-emerald-400">${sub.price}/mo</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    sub.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="p-4 text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {sub.renewal}
                  </div>
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

export default SubscriptionsTab;