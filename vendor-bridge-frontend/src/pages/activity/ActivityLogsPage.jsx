import React, { useEffect, useState } from 'react';
import { Activity, Search, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import formatDate from '../../utils/formatDate';

export function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

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

  const filteredLogs = logs.filter((log) =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-display font-extrabold text-white">System Activity Logs</h2>
        <p className="text-sm text-[#9CA3AF] mt-0.5">Track modifications, sign-offs, and operational transactions.</p>
      </div>

      <Card>
        {/* Search header */}
        <div className="flex items-center gap-3 bg-[#0A0F1E] border border-[#1F2937] rounded-lg px-3 py-2 max-w-md mb-6">
          <Search className="h-5 w-5 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search action details, user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-[#F9FAFB] w-full placeholder-[#9CA3AF]"
          />
        </div>

        <Table
          loading={loading}
          data={filteredLogs}
          emptyMessage="No activity logs registered."
          columns={[
            {
              key: 'action',
              label: 'Action Performed',
              render: (val) => (
                <div className="flex items-center gap-2.5">
                  <Activity className="h-4 w-4 text-[#6366F1]" />
                  <span className="font-semibold text-white">{val}</span>
                </div>
              ),
            },
            {
              key: 'user',
              label: 'System User',
              render: (val) => <span className="font-medium text-[#F9FAFB]">{val}</span>,
            },
            {
              key: 'role',
              label: 'Assigned Role',
              render: (val) => {
                // Map role colors
                const normVal = (val || '').toLowerCase();
                let statusColor = 'pending';
                if (normVal.includes('admin')) statusColor = 'active';
                if (normVal.includes('officer')) statusColor = 'open';
                if (normVal.includes('vendor')) statusColor = 'awarded';
                if (normVal.includes('manager')) statusColor = 'approved';

                return <Badge status={statusColor} className="capitalize">{val?.replace('_', ' ')?.toLowerCase()}</Badge>;
              },
            },
            {
              key: 'timestamp',
              label: 'Timestamp (UTC)',
              render: (val) => {
                const date = new Date(val);
                return (
                  <span className="text-xs text-[#9CA3AF]">
                    {date.toLocaleDateString()} {date.toLocaleTimeString()}
                  </span>
                );
              },
            },
          ]}
        />
      </Card>
    </div>
  );
}

export default ActivityLogsPage;
