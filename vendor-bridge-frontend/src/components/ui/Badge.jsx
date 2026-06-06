import React from 'react';

export function Badge({ status, className = '', ...props }) {
  const normStatus = (status || '').toLowerCase().trim();

  // Color mapping: pending=amber, active=indigo, approved/completed=green, rejected=red, draft=gray, open=blue, closed=gray, awarded=purple
  const colorMap = {
    pending: 'bg-amber-400/10 text-amber-400 border border-amber-400/20',
    active: 'bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20',
    approved: 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20',
    completed: 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20',
    rejected: 'bg-red-400/10 text-red-400 border border-red-400/20',
    draft: 'bg-gray-400/10 text-gray-400 border border-gray-400/20',
    open: 'bg-blue-400/10 text-blue-400 border border-blue-400/20',
    closed: 'bg-gray-400/10 text-gray-400 border border-gray-400/20',
    awarded: 'bg-purple-400/10 text-purple-400 border border-purple-400/20',
  };

  const currentStyles = colorMap[normStatus] || 'bg-gray-400/10 text-gray-400 border border-gray-400/20';

  // Format display text (e.g. pending -> Pending, co-operating -> Co-Operating)
  const displayName = normStatus
    ? normStatus.charAt(0).toUpperCase() + normStatus.slice(1)
    : '';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentStyles} ${className}`}
      {...props}
    >
      {displayName}
    </span>
  );
}

export default Badge;
