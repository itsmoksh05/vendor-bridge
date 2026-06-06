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

  const subtotalVal = (approval.amount || 19430) / 1.1;
  const vatVal = (approval.amount || 19430) - subtotalVal;
  const totalVal = approval.amount || 19430;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-3xl font-bold text-white tracking-tight">Approved Workflow</h2>
        <p className="text-sm text-[#9CA3AF] mt-0.5">
          RFQ: {approval.title} — Vendor: {approval.vendorName} — {formatCurrency(totalVal)}
        </p>
      </div>

      {/* Stepper Timeline */}
      <div className="flex items-center justify-between w-full max-w-xl mx-auto mb-6 relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
        
        {/* Step 1 */}
        <div className="flex flex-col items-center gap-2 relative z-10">
          <div className="w-8 h-8 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-sm">
            ✓
          </div>
          <span className="text-xs font-semibold text-white">Procurement Officer</span>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center gap-2 relative z-10">
          <div className="w-8 h-8 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-sm">
            2
          </div>
          <span className="text-xs font-semibold text-white">Department Head</span>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center gap-2 relative z-10">
          <div className="w-8 h-8 rounded-full bg-[#1F2937] border border-white/20 text-[#9CA3AF] flex items-center justify-center font-bold text-sm bg-[#0A0F1E]">
            3
          </div>
          <span className="text-xs font-semibold text-[#9CA3AF]">Finance Director</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Comments */}
        <div className="lg:col-span-8 flex flex-col gap-5 bg-[#111827] border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-1">Workflow Comments</h3>
          
          <div className="p-4 bg-[#0A0F1E] border border-white/10 rounded-xl">
            <p className="text-xs text-[#9CA3AF] font-semibold uppercase mb-1">Officer Comments</p>
            <p className="text-sm text-white leading-relaxed">
              {approval.notes || 'Astro Supplies has the best price and fastest delivery time.'}
            </p>
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <label htmlFor="comments" className="text-sm font-medium text-[#9CA3AF]">
              Your Review Comments
            </label>
            <textarea
              id="comments"
              rows={4}
              placeholder="Enter your approval/rejection notes here..."
              className="w-full bg-[#0A0F1E] text-[#F9FAFB] rounded-lg border border-white/10 text-sm py-2.5 px-4 outline-none focus:ring-1 focus:ring-[#6366F1]"
            />
          </div>
        </div>

        {/* Right Column: Cost summary */}
        <div className="lg:col-span-4 flex flex-col gap-5 bg-[#111827] border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-2">Summary</h3>
          
          <div className="flex flex-col gap-4 text-xs md:text-sm">
            <div className="flex items-center justify-between text-[#9CA3AF]">
              <span>Subtotal</span>
              <span className="font-semibold text-white">{formatCurrency(subtotalVal)}</span>
            </div>
            
            <div className="flex items-center justify-between text-[#9CA3AF]">
              <span>VAT (10%)</span>
              <span className="font-semibold text-white">{formatCurrency(vatVal)}</span>
            </div>

            <div className="h-px bg-white/10 my-1" />

            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-white">Grand Total</span>
              <span className="font-extrabold text-[#6366F1] text-base">{formatCurrency(totalVal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions Row */}
      {isPending && (isManager || isAdmin) && (
        <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
          <Button
            variant="danger"
            loading={actioning}
            onClick={handleReject}
            className="bg-[#EF4444] hover:bg-red-600 text-white rounded-lg px-6 font-bold"
          >
            Reject
          </Button>
          <Button
            variant="success"
            loading={actioning}
            onClick={handleApprove}
            className="bg-[#10B981] hover:bg-emerald-600 text-white rounded-lg px-6 font-bold"
          >
            Approve
          </Button>
        </div>
      )}
    </div>
  );
}

export default ApprovalDetailPage;
