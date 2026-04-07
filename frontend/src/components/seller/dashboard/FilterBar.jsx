import React from 'react';
import { Search, X } from 'lucide-react';
import { FILTERS } from '../../utils/constants';

const FilterBar = ({ filter, onFilterChange, search, onSearchChange, stats }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div className="flex flex-wrap items-center gap-2">
        {/* Filter Tabs */}
        <div className="flex gap-1 bg-stone-100 p-1 rounded-xl">
          {FILTERS.map(fl => (
            <button 
              key={fl.key} 
              onClick={() => onFilterChange(fl.key)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === fl.key 
                  ? "bg-white text-stone-900 shadow-sm" 
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              {fl.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold transition-all ${
                filter === fl.key ? "bg-stone-900 text-white" : "bg-stone-200 text-stone-500"
              }`}>
                {stats[fl.key] || 0}
              </span>
            </button>
          ))}
        </div>
        
        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl px-3 py-2 focus-within:border-stone-400 transition-colors">
          <Search className="w-4 h-4 text-stone-400 flex-shrink-0" />
          <input 
            value={search} 
            onChange={e => onSearchChange(e.target.value)} 
            placeholder="Search offers by title or category…"
            className="bg-transparent text-sm outline-none w-56 placeholder:text-stone-400 text-stone-800"
          />
          {search && (
            <button onClick={() => onSearchChange("")} className="text-stone-400 hover:text-stone-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;