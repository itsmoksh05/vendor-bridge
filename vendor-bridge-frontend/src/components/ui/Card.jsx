import React from 'react';

export function Card({
  children,
  className = '',
  title = '',
  subtitle = '',
  action = null,
  ...props
}) {
  return (
    <div
      className={`glass rounded-xl p-6 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-white/15 ${className}`}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4 mb-5">
          <div>
            {title && (
              <h3 className="font-display text-lg font-bold text-[#F9FAFB]">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

export default Card;
