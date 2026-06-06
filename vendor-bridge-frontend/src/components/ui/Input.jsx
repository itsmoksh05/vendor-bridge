import React from 'react';

export function Input({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  icon: Icon = null,
  register = {},
  className = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-[#9CA3AF]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-[#9CA3AF] pointer-events-none">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          className={`w-full bg-white/[0.035] hover:bg-white/[0.06] text-[#F9FAFB] rounded-xl border text-sm py-2.5 transition-all outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-400/25 focus:border-indigo-300/60 ${
            Icon ? 'pl-10 pr-4' : 'px-4'
          } ${
            error
              ? 'border-[#EF4444] focus:ring-[#EF4444] focus:border-[#EF4444]'
              : 'border-white/10 focus:border-[#6366F1]'
          }`}
          {...register}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-[#EF4444] mt-0.5 font-medium">{error.message || error}</p>
      )}
    </div>
  );
}

export default Input;
