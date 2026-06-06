import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Search, Check, X, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';

export function ApprovalListPage() {
  const navigate = useNavigate();
  const { isManager, isAdmin } = useAuth();
  
  const [approvals, setApprovals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/approvals');
      setApprovals(res.data);
    } catch (e) {
      toast.error('Failed to load approvals workflow data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApprove = async (id, title) => {
    try {
      await axios.get(`/approvals/${id}/approve`);
      toast.success(`Request "${title}" approved. PO created.`);
      fetchApprovals();
    } catch (err) {
      toast.error('Approve failed.');
    }
  };

  const handleReject = async (id, title) => {
    try {
      await axios.get(`/approvals/${id}/reject`);
      toast.error(`Request "${title}" rejected.`);
      fetchApprovals();
    } catch (err) {
      toast.error('Reject failed.');
    }
  };

  const filteredApprovals = approvals.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-display font-extrabold text-white">Workflow Approval Board</h2>
        <p className="text-sm text-[#9CA3AF] mt-0.5">Approve or reject procurement recommendations and track signing chains.</p>
      </div>

      <Card>
        {/* Search header */}
        <div className="flex items-center gap-3 bg-[#0A0F1E] border border-[#1F2937] rounded-lg px-3 py-2 max-w-md mb-6">
          <Search className="h-5 w-5 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search request title, vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-[#F9FAFB] w-full placeholder-[#9CA3AF]"
          />
        </div>

        <Table
          loading={loading}
          data={filteredApprovals}
          emptyMessage="No approvals requests found."
          columns={[
            {
              key: 'title',
              label: 'Approval Proposal',
              render: (val, row) => (
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="h-4 w-4 text-[#6366F1]" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-white truncate max-w-[250px]">{val}</span>
                    <span className="text-[10px] text-[#9CA3AF]">RFQ: {row.rfqNumber}</span>
                  </div>
                </div>
              ),
            },
            {
              key: 'vendorName',
              label: 'Vendor Supplier',
              render: (val) => <span className="font-semibold text-white">{val}</span>,
            },
            {
              key: 'amount',
              label: 'Contract Sum',
              render: (val) => <span className="text-[#6366F1] font-bold">{formatCurrency(val)}</span>,
            },
            { key: 'requestedBy', label: 'Requested By' },
            {
              key: 'createdAt',
              label: 'Date Opened',
              render: (val) => formatDate(val),
            },
            {
              key: 'status',
              label: 'Status',
              render: (val) => <Badge status={val} />,
            },
            {
              key: 'actions',
              label: '',
              render: (_, row) => {
                const isPending = row.status === 'pending';
                return (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/approvals/${row.id}`)}
                    >
                      Inspect
                    </Button>
                    {isPending && (isManager || isAdmin) && (
                      <>
                        <button
                          onClick={() => handleApprove(row.id, row.title)}
                          className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center"
                          title="Approve"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleReject(row.id, row.title)}
                          className="h-8 w-8 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                          title="Reject"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                );
              },
            },
          ]}
        />
      </Card>
    </div>
  );
}

export default ApprovalListPage;
