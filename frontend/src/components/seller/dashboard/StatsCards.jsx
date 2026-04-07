import React from 'react';
import { Gift, ShieldCheck, Clock, AlertCircle } from 'lucide-react';

const STAT_CARDS = [
  { label: "Total Offers",  key: "all", icon: <Gift className="w-4 h-4" />, top: "border-t-violet-400", num: "text-violet-600", bg: "bg-violet-50" },
  { label: "Active Now",    key: "active", icon: <ShieldCheck className="w-4 h-4" />, top: "border-t-emerald-400", num: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Scheduled",     key: "scheduled", icon: <Clock className="w-4 h-4" />, top: "border-t-amber-400", num: "text-amber-600", bg: "bg-amber-50" },
  { label: "Expired",       key: "expired", icon: <AlertCircle className="w-4 h-4" />, top: "border-t-rose-400", num: "text-rose-600", bg: "bg-rose-50" },
];

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {STAT_CARDS.map(s => (
        <div key={s.label} className={`bg-white border border-stone-200 rounded-2xl p-5 border-t-4 ${s.top} shadow-sm hover:shadow-md transition-shadow`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.bg} ${s.num}`}>{s.icon}</span>
            <span className={`df text-3xl font-semibold ${s.num}`}>{stats[s.key] || 0}</span>
          </div>
          <p className="text-stone-500 text-xs font-medium uppercase tracking-widest">{s.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;