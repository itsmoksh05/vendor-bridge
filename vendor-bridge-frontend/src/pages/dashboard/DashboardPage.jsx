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

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-white">
            Welcome Back, {user?.name || 'User'}
          </h2>
          <p className="text-sm text-[#9CA3AF] mt-0.5">
            Here is what is happening in your procurement board today.
          </p>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-[#9CA3AF] bg-[#111827] border border-[#1F2937] px-3.5 py-2 rounded-lg self-start">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span>System Status: Online & Integrated</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Active RFQs */}
        <Card className="hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Active RFQs</p>
              {loadingOverview ? (
                <div className="h-9 bg-[#1F2937] rounded w-16 animate-pulse mt-2" />
              ) : (
                <h3 className="text-3xl font-display font-black text-white mt-1.5">{stats.rfqCount}</h3>
              )}
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-4 font-semibold">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+12.4%</span>
            <span className="text-[#9CA3AF] font-normal">from last month</span>
          </div>
        </Card>

        {/* Pending Approvals */}
        <Card className="hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Pending Approvals</p>
              {loadingOverview ? (
                <div className="h-9 bg-[#1F2937] rounded w-16 animate-pulse mt-2" />
              ) : (
                <h3 className="text-3xl font-display font-black text-white mt-1.5">{stats.pendingApprovalsCount}</h3>
              )}
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-400 mt-4 font-semibold">
            <span>4 Awaiting</span>
            <span className="text-[#9CA3AF] font-normal">requires attention</span>
          </div>
        </Card>

        {/* Total Vendors */}
        <Card className="hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Total Vendors</p>
              {loadingOverview ? (
                <div className="h-9 bg-[#1F2937] rounded w-16 animate-pulse mt-2" />
              ) : (
                <h3 className="text-3xl font-display font-black text-white mt-1.5">{stats.vendorsCount}</h3>
              )}
            </div>
            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-4 font-semibold">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+3 new</span>
            <span className="text-[#9CA3AF] font-normal">registered this week</span>
          </div>
        </Card>

        {/* Invoices This Month */}
        <Card className="hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Invoices This Month</p>
              {loadingOverview ? (
                <div className="h-9 bg-[#1F2937] rounded w-16 animate-pulse mt-2" />
              ) : (
                <h3 className="text-3xl font-display font-black text-white mt-1.5">{stats.invoicesThisMonth}</h3>
              )}
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
              <Receipt className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF] mt-4">
            <span>Month-to-date operations</span>
          </div>
        </Card>
      </div>

      {/* Quick Actions Row */}
      <Card title="Quick Procurement Actions" subtitle="Expedite actions across common operational pipelines.">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="ghost"
            icon={Plus}
            onClick={() => navigate('/rfq/create')}
            disabled={!isProcurementOfficer && user?.role !== 'ADMIN'}
            className="flex items-center justify-between text-left border border-dashed border-[#1F2937] hover:border-[#6366F1] py-4 px-5 group"
          >
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-white group-hover:text-[#6366F1] transition-colors">Create RFQ</span>
              <span className="text-[10px] text-[#9CA3AF] font-normal">Invite vendors for quotes</span>
            </div>
          </Button>

          <Button
            variant="ghost"
            icon={UserPlus}
            onClick={() => navigate('/vendors/add')}
            disabled={!isProcurementOfficer && user?.role !== 'ADMIN'}
            className="flex items-center justify-between text-left border border-dashed border-[#1F2937] hover:border-[#6366F1] py-4 px-5 group"
          >
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-white group-hover:text-[#6366F1] transition-colors">Add Vendor</span>
              <span className="text-[10px] text-[#9CA3AF] font-normal">Onboard a new supplier</span>
            </div>
          </Button>

          <Button
            variant="ghost"
            icon={CheckSquare}
            onClick={() => navigate('/approvals')}
            disabled={!isManager && user?.role !== 'ADMIN'}
            className="flex items-center justify-between text-left border border-dashed border-[#1F2937] hover:border-[#6366F1] py-4 px-5 group"
          >
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-white group-hover:text-[#6366F1] transition-colors">View Approvals</span>
              <span className="text-[10px] text-[#9CA3AF] font-normal">Verify pending awards</span>
            </div>
          </Button>

          <Button
            variant="ghost"
            icon={FileSpreadsheet}
            onClick={() => navigate('/invoices')}
            disabled={!isProcurementOfficer && user?.role !== 'ADMIN'}
            className="flex items-center justify-between text-left border border-dashed border-[#1F2937] hover:border-[#6366F1] py-4 px-5 group"
          >
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-white group-hover:text-[#6366F1] transition-colors">Generate Invoice</span>
              <span className="text-[10px] text-[#9CA3AF] font-normal">Close purchase loops</span>
            </div>
          </Button>
        </div>
      </Card>

      {/* Two Column Layout (RFQs Table + Approvals Board) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent RFQs */}
        <div className="lg:col-span-7 flex flex-col">
          <Card
            title="Recent RFQ Requests"
            subtitle="Current active Request for Quotations bidding boards."
            action={
              <Button size="sm" variant="ghost" onClick={() => navigate('/rfq')}>
                View All
              </Button>
            }
            className="flex-1 flex flex-col justify-between"
          >
            <Table
              loading={loadingTables}
              data={rfqs}
              emptyMessage="No RFQs logged."
              columns={[
                { key: 'rfqNumber', label: 'RFQ #' },
                {
                  key: 'title',
                  label: 'Project Title',
                  render: (val, row) => (
                    <div className="flex flex-col">
                      <span className="font-semibold text-white truncate max-w-[180px]">{val}</span>
                      <span className="text-[10px] text-[#9CA3AF]">{row.category}</span>
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
                  label: 'Deadline',
                  render: (val) => formatDate(val),
                },
                {
                  key: 'actions',
                  label: '',
                  render: (_, row) => (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/rfq/${row.id}`)}
                    >
                      Inspect
                    </Button>
                  ),
                },
              ]}
            />
          </Card>
        </div>

        {/* Right Column: Pending Approvals list */}
        <div className="lg:col-span-5 flex flex-col">
          <Card
            title="Pending Approvals"
            subtitle="Award recommendations needing managerial authorization."
            action={
              <Button size="sm" variant="ghost" onClick={() => navigate('/approvals')}>
                View Panel
              </Button>
            }
            className="flex-1"
          >
            {loadingTables ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="h-16 bg-[#1F2937] rounded-xl animate-pulse" />
                ))}
              </div>
            ) : approvals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                <div className="p-3 bg-white/5 rounded-full text-[#9CA3AF]">
                  <CheckSquare className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-[#9CA3AF]">All caught up!</p>
                <p className="text-xs text-[#9CA3AF]">No pending RFQ awards require approval.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {approvals.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl bg-[#0A0F1E] border border-[#1F2937] hover:border-[#6366F1]/50 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{app.title}</h4>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">
                        Supplier: <span className="font-semibold text-white">{app.vendorName}</span>
                      </p>
                      <p className="text-[11px] text-[#6366F1] font-bold mt-1">
                        Amount: {formatCurrency(app.amount)}
                      </p>
                    </div>

                    {/* Quick Buttons for Manager */}
                    {isManager || user?.role === 'ADMIN' ? (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => handleApprove(app.id, app.title)}
                          className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center"
                          title="Approve Recommendation"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleReject(app.id, app.title)}
                          className="h-8 w-8 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                          title="Reject Recommendation"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <Badge status="pending" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Spend Analytics Chart Row */}
      <Card title="Procurement Spend Trends" subtitle="Overview of contract spend distributions and active listings.">
        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} tickLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="spend" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorSpend)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Invoices Table */}
      <Card
        title="Recent Invoices & Transactions"
        subtitle="Verification states of transaction closure receipts."
        action={
          <Button size="sm" variant="ghost" onClick={() => navigate('/invoices')}>
            Open Billing
          </Button>
        }
      >
        <Table
          loading={loadingTables}
          data={invoices}
          emptyMessage="No invoices generated."
          columns={[
            { key: 'invoiceNumber', label: 'Invoice #' },
            {
              key: 'vendorName',
              label: 'Vendor Supplier',
              render: (val) => <span className="font-semibold text-white">{val}</span>,
            },
            {
              key: 'amount',
              label: 'Total Billing',
              render: (val) => <span className="text-[#6366F1] font-bold">{formatCurrency(val)}</span>,
            },
            {
              key: 'status',
              label: 'Status',
              render: (val) => <Badge status={val} />,
            },
            {
              key: 'createdAt',
              label: 'Date Issued',
              render: (val) => formatDate(val),
            },
            {
              key: 'actions',
              label: '',
              render: (_, row) => (
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Download}
                  onClick={() => handleDownloadInvoice(row.invoiceNumber)}
                >
                  PDF
                </Button>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}

export default DashboardPage;
