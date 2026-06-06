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
      className={`glass rounded-2xl p-6 relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300/25 hover:shadow-[0_22px_70px_rgba(15,23,42,0.45)] ${className}`}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 mb-5">
          <div>
            {title && (
              <h3 className="font-display text-lg font-semibold text-[#F9FAFB]">
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
