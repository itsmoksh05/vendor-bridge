import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, User, Settings, LogOut, FileText, Building2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import axios from '../../api/axios';

export function Topbar({ title = 'Dashboard' }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!searchOpen || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const [vendorsRes, rfqsRes, quotesRes] = await Promise.all([
          axios.get('/vendors'),
          axios.get('/rfqs'),
          axios.get('/quotations'),
        ]);
        const text = query.trim().toLowerCase();
        const results = [
          ...vendorsRes.data
            .filter((v) => [v.name, v.companyName, v.category, v.email].some((value) => String(value || '').toLowerCase().includes(text)))
            .slice(0, 4)
            .map((v) => ({ type: 'Vendor', icon: Building2, label: v.name || v.companyName, detail: v.category, path: `/vendors/${v.id}` })),
          ...rfqsRes.data
            .filter((r) => [r.title, r.rfqNumber, r.status].some((value) => String(value || '').toLowerCase().includes(text)))
            .slice(0, 4)
            .map((r) => ({ type: 'RFQ', icon: FileText, label: r.title, detail: r.rfqNumber, path: `/rfq/${r.id}` })),
          ...quotesRes.data
            .filter((q) => [q.vendorName, q.rfqNumber, q.status].some((value) => String(value || '').toLowerCase().includes(text)))
            .slice(0, 4)
            .map((q) => ({ type: 'Quotation', icon: CheckCircle, label: q.vendorName, detail: q.rfqNumber, path: `/rfq/${q.rfqId}/compare` })),
        ].slice(0, 8);
        setSearchResults(results);
      } catch (error) {
        setSearchResults([]);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [query, searchOpen]);

  const fetchNotifications = async () => {
    try {
      const [approvalsRes, logsRes] = await Promise.all([
        axios.get('/approvals'),
        axios.get('/activity'),
      ]);
      const pending = approvalsRes.data
        .filter((item) => item.status === 'pending')
        .map((item) => ({
          id: `approval-${item.id}`,
          title: item.title,
          subtitle: `${item.vendorName} | ${item.rfqNumber}`,
          path: `/approvals/${item.id}`,
        }));
      const logs = logsRes.data.slice(0, 3).map((item) => ({
        id: `log-${item.id}`,
        title: item.action?.replaceAll('_', ' ') || 'Activity update',
        subtitle: item.description,
        path: '/activity',
      }));
      setNotifications([...pending, ...logs].slice(0, 6));
    } catch (error) {
      setNotifications([]);
    }
  };

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
    <header className="h-16 bg-[#0B1120]/85 border-b border-white/10 px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl">
      <div>
        <h1 className="font-display text-xl font-semibold text-[#F9FAFB]">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={searchRef}>
          <button
            onClick={() => setSearchOpen((open) => !open)}
            className="p-2 text-[#9CA3AF] hover:text-white rounded-lg hover:bg-white/5 transition-all"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          {searchOpen && (
            <div className="absolute right-0 mt-2 w-[min(24rem,calc(100vw-2rem))] rounded-xl bg-[#0F172A] border border-white/10 shadow-2xl p-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9CA3AF]" />
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search RFQs, vendors, quotations..."
                  className="w-full bg-[#0A0F1E] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white outline-none focus:border-[#6366F1]"
                />
              </div>
              <div className="mt-3 max-h-80 overflow-y-auto">
                {query.trim().length < 2 ? (
                  <p className="text-xs text-[#9CA3AF] px-1 py-3">Type at least 2 characters.</p>
                ) : searchResults.length === 0 ? (
                  <p className="text-xs text-[#9CA3AF] px-1 py-3">No matching records found.</p>
                ) : (
                  searchResults.map((result) => (
                    <button
                      key={`${result.type}-${result.path}-${result.label}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setQuery('');
                        navigate(result.path);
                      }}
                      className="w-full flex items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-white/5"
                    >
                      <result.icon className="h-4 w-4 text-[#818CF8]" />
                      <span className="min-w-0">
                        <span className="block text-sm text-white truncate">{result.label}</span>
                        <span className="block text-[11px] text-[#9CA3AF] truncate">{result.type} | {result.detail}</span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => {
              setNotificationOpen((open) => !open);
              fetchNotifications();
            }}
            className="p-2 text-[#9CA3AF] hover:text-white rounded-lg hover:bg-white/5 transition-all"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#EF4444] ring-2 ring-[#111827]" />
            )}
          </button>
          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#0F172A] border border-white/10 shadow-2xl p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                <button
                  onClick={() => {
                    setNotifications([]);
                    toast.success('Notifications cleared.');
                  }}
                  className="text-[11px] text-[#818CF8] hover:text-white"
                >
                  Clear
                </button>
              </div>
              {notifications.length === 0 ? (
                <p className="text-xs text-[#9CA3AF] py-4">No new notifications.</p>
              ) : (
                <div className="flex flex-col gap-1">
                  {notifications.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setNotificationOpen(false);
                        navigate(item.path);
                      }}
                      className="rounded-lg px-3 py-2 text-left hover:bg-white/5"
                    >
                      <span className="block text-sm text-white truncate">{item.title}</span>
                      <span className="block text-[11px] text-[#9CA3AF] truncate">{item.subtitle}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-white/10" />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1 rounded-lg hover:bg-white/5 transition-all text-left"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-xs font-bold text-white shadow-md ring-1 ring-white/10">
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

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0F172A] border border-white/10 shadow-2xl py-1 text-sm text-[#F9FAFB] animate-in fade-in slide-in-from-top-2 duration-150">
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
