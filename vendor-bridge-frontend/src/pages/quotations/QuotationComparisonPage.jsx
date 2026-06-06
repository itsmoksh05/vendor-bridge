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
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate(`/rfq/${rfqId}`)}>
          Back
        </Button>
        <div>
          <h2 className="text-xl font-display font-extrabold text-white">Compare Quotations</h2>
          <p className="text-sm text-[#9CA3AF] mt-0.5">RFQ: <span className="text-white font-bold">{rfq?.rfqNumber} · {rfq?.title}</span></p>
        </div>
      </div>

      {/* Grid comparison list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quotations.map((quote) => {
          const isCheapest = quote.totalAmount === lowestPrice;
          const isFastest = quote.deliveryDays === fastestDelivery;
          const isAwarded = quote.status === 'awarded';

          return (
            <div
              key={quote.id}
              className={`rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isCheapest
                  ? 'border-emerald-500/50 bg-[#111827] shadow-[0_4px_20px_rgba(16,185,129,0.15)]'
                  : 'border-[#1F2937] bg-[#111827]'
              }`}
            >
              {/* Badges indicators */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                {isCheapest && (
                  <span className="text-[10px] font-bold text-white bg-emerald-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Lowest Cost
                  </span>
                )}
                {isFastest && (
                  <span className="text-[10px] font-bold text-white bg-blue-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Fastest
                  </span>
                )}
                {isAwarded && (
                  <span className="text-[10px] font-bold text-white bg-purple-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Awarded
                  </span>
                )}
              </div>

              {/* Vendor Info */}
              <div className="p-6 border-b border-[#1F2937]">
                <h3 className="font-display font-bold text-lg text-white pr-20 truncate">{quote.vendorName}</h3>
                <p className="text-xs text-[#9CA3AF] mt-1">Submitted on {formatDate(quote.createdAt)}</p>
                
                <div className="mt-5 text-3xl font-display font-black text-[#6366F1] flex items-baseline">
                  {formatCurrency(quote.totalAmount)}
                  <span className="text-xs text-[#9CA3AF] font-normal font-body ml-2">incl. tax</span>
                </div>
              </div>

              {/* Bidding Items unit pricing breakdown */}
              <div className="p-6 flex-1 flex flex-col gap-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">Pricing Breakdown</h4>
                <div className="flex flex-col gap-2.5">
                  {quote.items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs text-[#9CA3AF] border-b border-[#1F2937]/50 pb-2">
                      <span className="truncate max-w-[150px]">{item.description} (x{item.quantity})</span>
                      <span className="font-semibold text-white">{formatCurrency(item.unitPrice)}/unit</span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-[#1F2937] my-2" />

                {/* Additional metrics */}
                <div className="flex flex-col gap-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">Lead Time:</span>
                    <span className="font-semibold text-white flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-blue-400" />
                      {quote.deliveryDays} Business Days
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">Valid Until:</span>
                    <span className="font-semibold text-white flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-amber-400" />
                      {formatDate(quote.validUntil)}
                    </span>
                  </div>
                </div>

                {quote.notes && (
                  <div className="mt-4 p-3 bg-[#0A0F1E] rounded-lg border border-[#1F2937] text-[11px] text-[#9CA3AF] leading-relaxed">
                    <strong>Notes:</strong> {quote.notes}
                  </div>
                )}
              </div>

              {/* Action Board */}
              <div className="p-6 border-t border-[#1F2937] bg-[#0D1529]/30">
                <Button
                  variant={isCheapest ? 'success' : 'primary'}
                  icon={Award}
                  onClick={() => handleAwardQuote(quote.id, quote.vendorName)}
                  loading={awardingId === quote.id}
                  disabled={rfq.status !== 'open'}
                  className="w-full rounded-lg"
                >
                  {rfq.status === 'open' ? 'Award Contract' : isAwarded ? 'Awarded' : 'RFQ Closed'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QuotationComparisonPage;
