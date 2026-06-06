import React from 'react';

export function Logo() {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <svg
        className="w-8 h-8 text-[#6366F1] flex-shrink-0 animate-pulse"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          d="M12 2L2 7v10l10 5 10-5V7L12 2z"
          className="fill-[#6366F1]/10"
        />
        <circle cx="12" cy="12" r="3" className="fill-[#6366F1]" />
      </svg>
      <span className="font-display font-bold text-lg text-white tracking-wider">
        Vendor<span className="text-[#6366F1]">Bridge</span>
      </span>
    </div>
  );
}

export default Logo;
