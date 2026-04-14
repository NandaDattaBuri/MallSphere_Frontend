import React, { useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { FILTERS } from '../../utils/constants';

const FilterBar = ({ 
  filter, 
  onFilterChange, 
  search, 
  onSearchChange, 
  stats,
  dealType = 'all',
  onDealTypeChange
}) => {
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const isFlashSelected = filter === 'flash';
  
  const dealTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'percentage', label: '📊 Percentage' },
    { value: 'flat', label: '💰 Flat Amount' },
  ];

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

        {/* Flash Deal Type Filter */}
        {isFlashSelected && (
          <div className="relative">
            <button
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              className="flex items-center gap-2 bg-white border border-amber-200 rounded-xl px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 transition-colors"
            >
              <span>
                {dealTypeOptions.find(opt => opt.value === dealType)?.label || 'All Types'}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showTypeDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowTypeDropdown(false)}
                />
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-stone-200 py-1 z-20">
                  {dealTypeOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onDealTypeChange(option.value);
                        setShowTypeDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-stone-50 transition-colors ${
                        dealType === option.value 
                          ? 'bg-amber-50 text-amber-700 font-medium' 
                          : 'text-stone-700'
                      }`}
                    >
                      {option.label}
                      {dealType === option.value && (
                        <span className="float-right text-amber-600">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Active Filters Display */}
        {(filter !== 'all' || (isFlashSelected && dealType !== 'all') || search) && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400">•</span>
            <div className="flex items-center gap-1.5">
              {filter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 rounded-lg text-xs text-stone-600">
                  Status: {FILTERS.find(f => f.key === filter)?.label}
                  <button 
                    onClick={() => onFilterChange('all')}
                    className="ml-1 hover:text-stone-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {isFlashSelected && dealType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                  Type: {dealTypeOptions.find(opt => opt.value === dealType)?.label}
                  <button 
                    onClick={() => onDealTypeChange('all')}
                    className="ml-1 hover:text-amber-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl px-3 py-2 focus-within:border-stone-400 transition-colors">
        <Search className="w-4 h-4 text-stone-400 flex-shrink-0" />
        <input 
          value={search} 
          onChange={e => onSearchChange(e.target.value)} 
          placeholder={`Search ${isFlashSelected ? 'flash deals' : 'offers'}...`}
          className="bg-transparent text-sm outline-none w-56 placeholder:text-stone-400 text-stone-800"
        />
        {search && (
          <button onClick={() => onSearchChange("")} className="text-stone-400 hover:text-stone-600">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;