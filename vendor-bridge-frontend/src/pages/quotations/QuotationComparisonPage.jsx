import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GitCompare, Award, Calendar, Clock, DollarSign, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';

export function QuotationComparisonPage() {
  const { rfqId } = useParams();
  const navigate = useNavigate();

  const [rfq, setRfq] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [awardingId, setAwardingId] = useState(null);

  useEffect(() => {
    const loadComparison = async () => {
      try {
        setLoading(true);
        const [rfqRes, quotesRes] = await Promise.all([
          axios.get(`/rfqs/${rfqId}`),
          axios.get(`/quotations/rfq/${rfqId}`),
        ]);
        setRfq(rfqRes.data);
        setQuotations(quotesRes.data);
      } catch (error) {
        toast.error('Failed to load comparison criteria.');
        navigate('/rfq');
      } finally {
        setLoading(false);
      }
    };
    loadComparison();
  }, [rfqId, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 animate-pulse">
        <p className="text-[#9CA3AF]">Loading quotation comparison charts...</p>
      </div>
    );
  }

  if (quotations.length === 0) {
    return (
      <div className="text-center py-20 bg-[#111827] border border-[#1F2937] rounded-xl max-w-lg mx-auto">
        <GitCompare className="h-10 w-10 text-[#9CA3AF] mx-auto mb-3" />
        <h3 className="text-white font-bold text-lg">No bids submitted yet</h3>
        <p className="text-sm text-[#9CA3AF] mt-2 px-6">
          Assigned vendors have not yet entered price quotes for this RFQ.
        </p>
        <Button onClick={() => navigate(`/rfq/${rfqId}`)} className="mt-4">
          Return to RFQ Details
        </Button>
      </div>
    );
  }

  // Find lowest price and shortest delivery time to highlight
  const lowestPrice = Math.min(...quotations.map(q => q.totalAmount));
  const fastestDelivery = Math.min(...quotations.map(q => q.deliveryDays));

  // Handler for awarding contract
  const handleAwardQuote = async (quoteId, vendorName) => {
    setAwardingId(quoteId);
    try {
      await axios.get(`/quotations/award/${quoteId}`); // wait, our simulated axios.js uses GET /quotations/award/:id
      toast.success(`Successfully awarded to ${vendorName}. Manager approval pending.`);
      navigate('/dashboard');
    } catch (e) {
      toast.error('Failed to award quote.');
    } finally {
      setAwardingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-3xl font-bold text-white tracking-tight">Quotation Comparison</h2>
        <p className="text-sm text-[#9CA3AF] mt-0.5">
          RFQ: {rfq?.title || 'Office Furniture Procurement'} — {rfq?.rfqNumber || 'RFQ-2026-002'} — {quotations.length} quotations received
        </p>
      </div>

      <Card className="bg-[#111827] border border-white/5 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <tbody>
              {/* Row 1: Vendor Name */}
              <tr className="border-b border-white/10">
                <td className="p-4 font-bold text-[#9CA3AF] bg-white/5 w-48 rounded-tl-xl">Items</td>
                {quotations.map((q) => {
                  const isBest = q.totalAmount === lowestPrice;
                  return (
                    <td
                      key={q.id}
                      className={`p-4 font-bold text-white text-base ${
                        isBest ? 'bg-[#10B981]/10 border-l border-r border-[#10B981]/30' : ''
                      }`}
                    >
                      {q.vendorName}
                      {isBest && (
                        <span className="block text-[10px] text-[#10B981] font-semibold uppercase tracking-wider mt-1">
                          Best Proposal
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Row 2: Price */}
              <tr className="border-b border-white/5">
                <td className="p-4 font-bold text-[#9CA3AF] bg-white/5">Price</td>
                {quotations.map((q) => {
                  const isBest = q.totalAmount === lowestPrice;
                  return (
                    <td
                      key={q.id}
                      className={`p-4 font-semibold text-white ${
                        isBest ? 'bg-[#10B981]/10 border-l border-r border-[#10B981]/30 text-[#10B981]' : ''
                      }`}
                    >
                      {formatCurrency(q.totalAmount)}
                    </td>
                  );
                })}
              </tr>

              {/* Row 3: Delivery */}
              <tr className="border-b border-white/5">
                <td className="p-4 font-bold text-[#9CA3AF] bg-white/5">Delivery</td>
                {quotations.map((q) => {
                  const isBest = q.totalAmount === lowestPrice;
                  return (
                    <td
                      key={q.id}
                      className={`p-4 text-[#F9FAFB] ${
                        isBest ? 'bg-[#10B981]/10 border-l border-r border-[#10B981]/30' : ''
                      }`}
                    >
                      {q.deliveryDays} Days
                    </td>
                  );
                })}
              </tr>

              {/* Row 4: Score / Rank */}
              <tr className="border-b border-white/10">
                <td className="p-4 font-bold text-[#9CA3AF] bg-white/5">Score / Rank</td>
                {quotations.map((q, idx) => {
                  const isBest = q.totalAmount === lowestPrice;
                  return (
                    <td
                      key={q.id}
                      className={`p-4 text-white font-semibold ${
                        isBest ? 'bg-[#10B981]/10 border-l border-r border-[#10B981]/30' : ''
                      }`}
                    >
                      {isBest ? (
                        <span className="text-[#10B981]">Rank 1 (Best)</span>
                      ) : (
                        `Rank ${idx + 2}`
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Row 5: Actions */}
              <tr>
                <td className="p-4 font-bold text-[#9CA3AF] bg-white/5 rounded-bl-xl">Actions</td>
                {quotations.map((q) => {
                  const isBest = q.totalAmount === lowestPrice;
                  const isAwarded = q.status === 'awarded';
                  return (
                    <td
                      key={q.id}
                      className={`p-4 ${
                        isBest ? 'bg-[#10B981]/10 border-l border-r border-b border-[#10B981]/30' : ''
                      }`}
                    >
                      <Button
                        variant={isBest ? 'success' : 'ghost'}
                        onClick={() => handleAwardQuote(q.id, q.vendorName)}
                        loading={awardingId === q.id}
                        disabled={rfq.status !== 'open'}
                        className="w-full text-xs font-bold py-2 rounded-lg"
                      >
                        {rfq.status !== 'open' ? (isAwarded ? 'Awarded' : 'RFQ Closed') : isBest ? 'Select Proposal' : 'Select'}
                      </Button>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Caption red warning */}
      <p className="text-xs text-red-500 font-semibold text-center mt-2">
        * Select proposal to trigger the workflow approval process
      </p>
    </div>
  );
}

export default QuotationComparisonPage;
