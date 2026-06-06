import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, AlertTriangle, ArrowLeft, Check, X, ShieldAlert, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';

export function ApprovalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isManager, isAdmin } = useAuth();
  
  const [approval, setApproval] = useState(null);
  const [rfq, setRfq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        const appRes = await axios.get('/approvals');
        const match = appRes.data.find((a) => a.id === id);
        
        if (match) {
          setApproval(match);
          // Load associated RFQ items
          const rfqRes = await axios.get(`/rfqs/${match.rfqId}`);
          setRfq(rfqRes.data);
        } else {
          toast.error('Approval request details not found.');
          navigate('/approvals');
        }
      } catch (e) {
        toast.error('Failed to load approval details.');
        navigate('/approvals');
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [id, navigate]);

  const handleApprove = async () => {
    setActioning(true);
    try {
      await axios.get(`/approvals/${id}/approve`);
      toast.success('Recommendation approved successfully. PO generated.');
      navigate('/approvals');
    } catch (e) {
      toast.error('Failed to authorize proposal.');
    } finally {
      setActioning(false);
    }
  };

  const handleReject = async () => {
    setActioning(true);
    try {
      await axios.get(`/approvals/${id}/reject`);
      toast.error('Recommendation rejected.');
      navigate('/approvals');
    } catch (e) {
      toast.error('Failed to reject proposal.');
    } finally {
      setActioning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 animate-pulse">
        <p className="text-[#9CA3AF]">Loading approval specs...</p>
      </div>
    );
  }

  if (!approval) return null;

  const isPending = approval.status === 'pending';

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-4 border-b border-[#1F2937] pb-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('/approvals')}>
            Back
          </Button>
          <div>
            <h2 className="text-xl font-display font-extrabold text-white">RFQ Award Approval</h2>
            <p className="text-sm text-[#9CA3AF] mt-0.5">Authorization chain logs for {approval.rfqNumber}</p>
          </div>
        </div>
        <Badge status={approval.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Metadata overview */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <Card title="Award Summary">
            <div className="flex flex-col gap-4 text-sm">
              <div>
                <p className="text-xs text-[#9CA3AF]">Contract Title</p>
                <p className="font-semibold text-white mt-0.5">{approval.title}</p>
              </div>

              <div>
                <p className="text-xs text-[#9CA3AF]">Awarded Supplier</p>
                <p className="font-semibold text-[#6366F1] mt-0.5">{approval.vendorName}</p>
              </div>

              <div>
                <p className="text-xs text-[#9CA3AF]">Contract Sum</p>
                <p className="text-lg font-extrabold text-white mt-0.5">{formatCurrency(approval.amount)}</p>
              </div>

              <div className="border-t border-[#1F2937] pt-4 mt-1">
                <p className="text-xs text-[#9CA3AF]">Requested By</p>
                <p className="font-semibold text-white mt-0.5">{approval.requestedBy}</p>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5">Opened: {formatDate(approval.createdAt)}</p>
              </div>
            </div>
          </Card>

          {/* Action Trigger */}
          {isPending && (isManager || isAdmin) && (
            <Card title="Authorize Decision">
              <div className="flex flex-col gap-3">
                <Button
                  variant="success"
                  icon={Check}
                  loading={actioning}
                  onClick={handleApprove}
                  className="w-full rounded-lg"
                >
                  Approve Contract
                </Button>
                <Button
                  variant="danger"
                  icon={X}
                  loading={actioning}
                  onClick={handleReject}
                  className="w-full rounded-lg"
                >
                  Reject Award
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Line items details */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card title="RFQ Specifications & Items" subtitle="Line items requested under the parent contract template.">
            {rfq ? (
              <Table
                data={rfq.items || []}
                columns={[
                  { key: 'description', label: 'Item description' },
                  { key: 'quantity', label: 'Quantity' },
                  { key: 'unit', label: 'Unit' },
                ]}
              />
            ) : (
              <p className="text-xs text-[#9CA3AF]">Failed to load parent item checklist.</p>
            )}
          </Card>

          {approval.notes && (
            <Card title="Award Recommendation Notes">
              <p className="text-sm text-[#9CA3AF] whitespace-pre-wrap leading-relaxed">{approval.notes}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApprovalDetailPage;
