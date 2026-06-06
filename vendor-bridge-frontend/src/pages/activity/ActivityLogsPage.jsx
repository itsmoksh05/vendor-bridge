import React, { useEffect, useState } from 'react';
import { Activity, Search, ShieldCheck, User, Building2, FileText, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import formatDate from '../../utils/formatDate';

export function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/activity');
      setLogs(res.data);
    } catch (e) {
      toast.error('Failed to load activity logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs
    .filter((log) => {
      if (activeFilter === 'All') return true;
      if (activeFilter === 'User') return ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER'].includes(log.role);
      if (activeFilter === 'Vendor') return log.role === 'VENDOR';
      if (activeFilter === 'RFQ') return log.action.toLowerCase().includes('rfq');
      if (activeFilter === 'System') return !log.role || log.role === 'SYSTEM';
      return true;
    })
    .filter((log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Helper to choose timeline icon based on role/action
  const getLogIcon = (log) => {
    const action = log.action.toLowerCase();
    if (action.includes('rfq')) return <FileText className="h-4 w-4 text-blue-400" />;
    if (log.role === 'VENDOR') return <Building2 className="h-4 w-4 text-emerald-400" />;
    if (['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER'].includes(log.role)) {
      return <User className="h-4 w-4 text-purple-400" />;
    }
    return <Settings className="h-4 w-4 text-[#9CA3AF]" />;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-3xl font-bold text-white tracking-tight">Activity & Logs</h2>
        <p className="text-sm text-[#9CA3AF] mt-0.5">Procurement audit trail</p>
      </div>

      {/* Filter Tabs Row */}
      <div className="flex border-b border-white/10 gap-5 text-xs md:text-sm">
        {['All', 'User', 'Vendor', 'RFQ', 'System'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`pb-3 font-semibold transition-all relative ${
              activeFilter === filter ? 'text-[#6366F1]' : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            {filter}
            {activeFilter === filter && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6366F1]" />
            )}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-[#111827] border border-white/10 rounded-lg px-3 py-2 max-w-md">
        <Search className="h-4 w-4 text-[#9CA3AF]" />
        <input
          type="text"
          placeholder="Search activity description, user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none outline-none text-sm text-[#F9FAFB] w-full placeholder-[#9CA3AF]"
        />
      </div>

      {/* Vertical Timeline Card */}
      <Card className="bg-[#111827] border border-white/5 p-6">
        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredLogs.length === 0 ? (
          <p className="text-sm text-[#9CA3AF] text-center py-6">No matching logs registered.</p>
        ) : (
          <div className="flex flex-col gap-6 pl-4 border-l border-white/10 relative">
            {filteredLogs.map((log, index) => {
              const date = new Date(log.timestamp);
              const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              
              return (
                <div key={log.id || index} className="relative flex flex-col md:flex-row md:items-center justify-between gap-2">
                  {/* Timeline point indicator */}
                  <div className="absolute -left-[29px] top-1 h-6 w-6 rounded-full bg-[#0A0F1E] border border-white/10 flex items-center justify-center">
                    {getLogIcon(log)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white leading-relaxed">
                      {log.action}
                    </p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5 flex items-center gap-2">
                      <span>By {log.user}</span>
                      {log.role && (
                        <span className="text-[10px] bg-white/5 border border-white/10 text-[#9CA3AF] px-1.5 py-0.2 rounded capitalize">
                          {log.role.toLowerCase().replace('_', ' ')}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="text-xs text-[#9CA3AF] md:text-right flex-shrink-0">
                    <span>{date.toLocaleDateString()} {formattedTime}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

export default ActivityLogsPage;
