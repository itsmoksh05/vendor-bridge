import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export function Topbar({ title = 'Dashboard' }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get User Initials (e.g. "Sarah Jenkins" -> "SJ")
  const getInitials = (name = 'Guest') => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Format Role name for UI
  const formatRole = (role = '') => {
    return role
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <header className="h-16 bg-[#111827] border-b border-[#1F2937] px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left Title */}
      <div>
        <h1 className="font-display text-xl font-bold text-[#F9FAFB]">
          {title}
        </h1>
      </div>

      {/* Right Content */}
      <div className="flex items-center gap-4">
        {/* Search Bar Button */}
        <button
          className="p-2 text-[#9CA3AF] hover:text-white rounded-lg hover:bg-white/5 transition-all"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Notifications Icon with Indicator */}
        <div className="relative">
          <button
            className="p-2 text-[#9CA3AF] hover:text-white rounded-lg hover:bg-white/5 transition-all"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#EF4444] ring-2 ring-[#111827]" />
          </button>
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-[#1F2937]" />

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1 rounded-lg hover:bg-white/5 transition-all text-left"
          >
            {/* Initials Avatar */}
            <div className="h-8 w-8 rounded-full bg-[#6366F1] flex items-center justify-center text-xs font-bold text-white shadow-md ring-1 ring-white/10">
              {getInitials(user?.name)}
            </div>

            {/* Profile Info */}
            <div className="hidden md:flex flex-col select-none">
              <span className="text-sm font-medium text-[#F9FAFB]">
                {user?.name || 'Guest User'}
              </span>
              <span className="text-[10px] text-[#9CA3AF] leading-none">
                {formatRole(user?.role)}
              </span>
            </div>

            <ChevronDown className="h-4 w-4 text-[#9CA3AF]" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#111827] border border-[#1F2937] shadow-2xl py-1 text-sm text-[#F9FAFB] animate-in fade-in slide-in-from-top-2 duration-150">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/profile');
                }}
                className="flex items-center gap-2.5 px-4 py-2 hover:bg-white/5 transition-all w-full text-left"
              >
                <User className="h-4 w-4 text-[#9CA3AF]" />
                Profile Settings
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/settings');
                }}
                className="flex items-center gap-2.5 px-4 py-2 hover:bg-white/5 transition-all w-full text-left"
              >
                <Settings className="h-4 w-4 text-[#9CA3AF]" />
                System Settings
              </button>
              <div className="h-px bg-[#1F2937] my-1" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-4 py-2 hover:bg-red-500/10 text-[#EF4444] transition-all w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
