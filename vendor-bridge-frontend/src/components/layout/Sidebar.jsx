import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  CheckCircle,
  ShoppingCart,
  Receipt,
  Building2,
  BarChart3,
  Activity,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Logo from '../landing/Logo';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuGroups = [
    {
      title: 'MAIN',
      items: [
        {
          label: 'Dashboard',
          icon: LayoutDashboard,
          path: '/dashboard',
          roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER'],
        },
      ],
    },
    {
      title: 'PROCUREMENT',
      items: [
        {
          label: 'RFQs',
          icon: FileText,
          path: '/rfq',
          roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'],
        },
        {
          label: 'Quotations',
          icon: MessageSquare,
          path: '/quotations',
          roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'VENDOR'],
        },
        {
          label: 'Approvals',
          icon: CheckCircle,
          path: '/approvals',
          roles: ['ADMIN', 'MANAGER'],
        },
        {
          label: 'Purchase Orders',
          icon: ShoppingCart,
          path: '/purchase-orders',
          roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'],
        },
        {
          label: 'Invoices',
          icon: Receipt,
          path: '/invoices',
          roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER'],
        },
      ],
    },
    {
      title: 'MASTER DATA',
      items: [
        {
          label: 'Vendors',
          icon: Building2,
          path: '/vendors',
          roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER'],
        },
        {
          label: 'Reports',
          icon: BarChart3,
          path: '/reports',
          roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER'],
        },
        {
          label: 'Activity',
          icon: Activity,
          path: '/activity',
          roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER'],
        },
      ],
    },
    {
      title: 'ADMIN ONLY',
      items: [
        {
          label: 'User Management',
          icon: Users,
          path: '/users', // mapped to dashboard / users, let's keep it placeholder for admin
          roles: ['ADMIN'],
        },
      ],
    },
  ];

  const userRole = user?.role || 'VENDOR';

  // Filter items and groups that the user has permission to see
  const filteredGroups = menuGroups
    .map((group) => {
      const items = group.items.filter((item) => item.roles.includes(userRole));
      return { ...group, items };
    })
    .filter((group) => group.items.length > 0);

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 glass border-y-0 border-l-0 flex flex-col justify-between transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top Section */}
      <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar">
        {/* Logo */}
        <div className={`flex items-center h-16 px-4 border-b border-white/10 ${collapsed ? 'justify-center' : 'gap-3'}`}>
          {collapsed ? (
            <svg className="w-8 h-8 text-[#6366F1] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" className="fill-[#6366F1]/10" />
              <circle cx="12" cy="12" r="3" className="fill-[#6366F1]" />
            </svg>
          ) : (
            <Logo />
          )}
        </div>

        {/* Menu Items */}
        <div className="p-3 flex flex-col gap-6">
          {filteredGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="flex flex-col gap-1">
              {!collapsed && (
                <span className="text-[10px] font-semibold text-[#94A3B8] px-3 mb-1 tracking-[0.16em] uppercase">
                  {group.title}
                </span>
              )}
              {group.items.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${isActive
                      ? 'bg-[#6366F1]/15 text-white border border-[#6366F1]/25 shadow-[0_10px_24px_rgba(99,102,241,0.16)] font-semibold'
                      : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.06] hover:translate-x-0.5'
                    }`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="p-3 border-t border-white/10 flex flex-col gap-1.5 bg-slate-950/25">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#EF4444] hover:bg-red-500/10 transition-all w-full"
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center p-2 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-all mt-1"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="h-5 w-5" />
              <span className="text-xs">Collapse Sidebar</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
