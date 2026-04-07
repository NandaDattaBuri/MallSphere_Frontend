import React from 'react';

const ViewToggle = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onViewModeChange("grid")}
        className={`p-2 rounded-lg border transition-all ${
          viewMode === "grid" 
            ? "bg-stone-900 text-white border-stone-900" 
            : "border-stone-200 text-stone-400 hover:text-stone-600"
        }`}
      >
        <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
          <div className="bg-current rounded-sm"></div>
          <div className="bg-current rounded-sm"></div>
          <div className="bg-current rounded-sm"></div>
          <div className="bg-current rounded-sm"></div>
        </div>
      </button>
      <button
        onClick={() => onViewModeChange("list")}
        className={`p-2 rounded-lg border transition-all ${
          viewMode === "list" 
            ? "bg-stone-900 text-white border-stone-900" 
            : "border-stone-200 text-stone-400 hover:text-stone-600"
        }`}
      >
        <div className="w-4 h-4 flex flex-col gap-0.5">
          <div className="h-0.5 bg-current rounded-full"></div>
          <div className="h-0.5 bg-current rounded-full"></div>
          <div className="h-0.5 bg-current rounded-full"></div>
        </div>
      </button>
    </div>
  );
};

export default ViewToggle;