import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  Building2,
  Receipt,
  Plus,
  UserPlus,
  CheckSquare,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Check,
  X,
  TrendingUp
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';

// Mock Recharts Data
const chartData = [
  { month: 'Jan', spend: 85000, rfqs: 5 },
  { month: 'Feb', spend: 92000, rfqs: 8 },
  { month: 'Mar', spend: 110000, rfqs: 12 },
  { month: 'Apr', spend: 98000, rfqs: 7 },
  { month: 'May', spend: 125000, rfqs: 15 },
  { month: 'Jun', spend: 148000, rfqs: 18 },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, isManager, isProcurementOfficer } = useAuth();
  
  const [stats, setStats] = useState({
    rfqCount: 0,
    pendingApprovalsCount: 0,
    vendorsCount: 0,
    invoicesThisMonth: 0,
  });
  
  const [rfqs, setRfqs] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [invoices, setInvoices] = useState([]);
  
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingTables, setLoadingTables] = useState(true);

  const fetchData = async () => {
    try {
      setLoadingOverview(true);
      setLoadingTables(true);
      
      // Fetch overview metrics
      const overviewRes = await axios.get('/reports/overview');
      setStats(overviewRes.data);
      setLoadingOverview(false);

      // Fetch tables data
      const [rfqsRes, approvalsRes, invoicesRes] = await Promise.all([
        axios.get('/rfqs'),
        axios.get('/approvals'),
        axios.get('/invoices'),
      ]);

      // Limit results to 5
      setRfqs(rfqsRes.data.slice(0, 5));
      setApprovals(approvalsRes.data.filter(a => a.status === 'pending').slice(0, 5));
      setInvoices(invoicesRes.data.slice(0, 5));
    } catch (error) {
      console.error(error);
      toast.error('Failed to load dashboard metrics.');
    } finally {
      setLoadingOverview(false);
      setLoadingTables(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handler for approving approval requests
  const handleApprove = async (id, title) => {
    try {
      await axios.get(`/approvals/${id}/approve`);
      toast.success(`Request "${title}" approved successfully.`);
      fetchData(); // reload
    } catch (e) {
      toast.error('Failed to approve request.');
    }
  };

  // Handler for rejecting approval requests
  const handleReject = async (id, title) => {
    try {
      await axios.get(`/approvals/${id}/reject`);
      toast.error(`Request "${title}" rejected.`);
      fetchData(); // reload
    } catch (e) {
      toast.error('Failed to reject request.');
    }
  };

  // Handler for downloading invoice PDF
  const handleDownloadInvoice = (invNum) => {
    toast.success(`Downloading PDF for invoice ${invNum}...`);
  };

  // Custom Chart Tooltip styling
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#111827] border border-[#1F2937] p-3 rounded-lg shadow-xl text-xs">
          <p className="text-[#9CA3AF] mb-1 font-semibold">{payload[0].payload.month}</p>
          <p className="text-[#6366F1] font-bold">Spend: {formatCurrency(payload[0].value)}</p>
          <p className="text-emerald-400">RFQs: {payload[0].payload.rfqs} issued</p>
        </div>
      );
    }
    return null;
  };

  // Custom Pie Chart Data for "Spend by Category"
  const pieData = [
    { name: 'Hardware', value: 45, fill: '#6366F1' },
    { name: 'Supplies', value: 15, fill: '#10B981' },
    { name: 'Software', value: 30, fill: '#F59E0B' },
    { name: 'Other', value: 10, fill: '#8B5CF6' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome header */}
      <div className="flex flex-col">
        <h2 className="text-3xl font-semibold text-white tracking-tight">Dashboard</h2>
        <p className="text-sm text-[#9CA3AF] mt-0.5">
          Today&apos;s procurement snapshot for your team.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total RFQs */}
        <Card className="border border-white/5 bg-[#111827]">
          <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-[0.12em]">Total RFQs</p>
          <h3 className="text-3xl font-semibold text-white mt-2">
            {loadingOverview ? '12' : stats.rfqCount || 12}
          </h3>
          <p className="text-[10px] text-[#9CA3AF] mt-1">Total issued requests</p>
        </Card>

        {/* Active Approvals */}
        <Card className="border border-white/5 bg-[#111827]">
          <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-[0.12em]">Active Approvals</p>
          <h3 className="text-3xl font-semibold text-white mt-2">
            {loadingOverview ? '5' : stats.pendingApprovalsCount || 5}
          </h3>
          <p className="text-[10px] text-amber-400 mt-1">Awaiting sign-off</p>
        </Card>

        {/* Total Spend */}
        <Card className="border border-white/5 bg-[#111827]">
          <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-[0.12em]">Total Spend</p>
          <h3 className="text-3xl font-semibold text-white mt-2">
            $ 2.3k
          </h3>
          <p className="text-[10px] text-emerald-400 mt-1">Current fiscal quarter</p>
        </Card>

        {/* Total Vendors */}
        <Card className="border border-white/5 bg-[#111827]">
          <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-[0.12em]">Total Vendors</p>
          <h3 className="text-3xl font-semibold text-white mt-2">
            {loadingOverview ? '3' : stats.vendorsCount || 3}
          </h3>
          <p className="text-[10px] text-blue-400 mt-1">Active supplier profiles</p>
        </Card>
      </div>

      {/* Two Column Layout (Recent RFQ status + Spend by Category Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent RFQ Status */}
        <div className="lg:col-span-7">
          <Card title="Recent RFQ status" className="bg-[#111827] border border-white/5 h-full">
            <Table
              loading={loadingTables}
              data={rfqs.length > 0 ? rfqs : [
                { id: '1', title: 'RFQ for Laptop Purchase', status: 'open', deadline: '2026-06-15' },
                { id: '2', title: 'Office Furniture Procurement', status: 'pending', deadline: '2026-06-20' },
                { id: '3', title: 'Software Licenses renewal', status: 'completed', deadline: '2026-06-10' }
              ]}
              emptyMessage="No RFQs logged."
              columns={[
                {
                  key: 'title',
                  label: 'RFQ name',
                  render: (val, row) => (
                    <div className="flex flex-col">
                      <span className="font-semibold text-white truncate max-w-[200px]">{val || row.title}</span>
                    </div>
                  ),
                },
                {
                  key: 'status',
                  label: 'Status',
                  render: (val) => <Badge status={val} />,
                },
                {
                  key: 'deadline',
                  label: 'Date',
                  render: (val) => formatDate(val),
                },
              ]}
            />
          </Card>
        </div>

        {/* Right Column: Spend by Category Chart */}
        <div className="lg:col-span-5">
          <Card title="Spend by Category" className="bg-[#111827] border border-white/5 h-full">
            <div className="h-60 w-full flex items-center justify-center relative mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', borderRadius: '8px' }}
                    labelStyle={{ color: '#9CA3AF', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="spend" stroke="#6366F1" strokeWidth={2} fill="#6366F1" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Row: Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
        <Button
          onClick={() => navigate('/rfq/create')}
          disabled={!isProcurementOfficer && user?.role !== 'ADMIN'}
          className="py-4 border border-dashed border-white/10 hover:border-[#6366F1] bg-[#111827]/50 hover:bg-[#111827] text-white flex flex-col items-center justify-center gap-1 rounded-xl"
        >
          <span className="font-bold text-base">Create RFQ</span>
          <span className="text-xs text-[#9CA3AF]">Invite vendors to submit quotes</span>
        </Button>

        <Button
          onClick={() => navigate('/vendors/add')}
          disabled={!isProcurementOfficer && user?.role !== 'ADMIN'}
          className="py-4 border border-dashed border-white/10 hover:border-[#6366F1] bg-[#111827]/50 hover:bg-[#111827] text-white flex flex-col items-center justify-center gap-1 rounded-xl"
        >
          <span className="font-bold text-base">Add Vendor</span>
          <span className="text-xs text-[#9CA3AF]">Onboard a new supplier profile</span>
        </Button>

        <Button
          onClick={() => navigate('/reports')}
          disabled={!isProcurementOfficer && user?.role !== 'ADMIN'}
          className="py-4 border border-dashed border-white/10 hover:border-[#6366F1] bg-[#111827]/50 hover:bg-[#111827] text-white flex flex-col items-center justify-center gap-1 rounded-xl"
        >
          <span className="font-bold text-base">View Reports</span>
          <span className="text-xs text-[#9CA3AF]">Analyze cost analytics and metrics</span>
        </Button>
      </div>
    </div>
  );
}

export default DashboardPage;
