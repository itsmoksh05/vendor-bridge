import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FileText, Calendar, Building2, Eye, GitCompare, MessageSquare, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';

export function RFQDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isProcurementOfficer, isAdmin, isVendor } = useAuth();

  const [rfq, setRfq] = useState(null);
  const [invitedVendors, setInvitedVendors] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [hasSubmittedQuote, setHasSubmittedQuote] = useState(false);
  const [loggedVendorId, setLoggedVendorId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRfqDetails = async () => {
      try {
        setLoading(true);
        const [rfqRes, vendorsRes, quotesRes] = await Promise.all([
          axios.get(`/rfqs/${id}`),
          axios.get('/vendors'),
          axios.get(`/quotations/rfq/${id}`),
        ]);

        const rfqData = rfqRes.data;
        setRfq(rfqData);
        setQuotations(quotesRes.data);

        // Map invited vendor IDs to full vendor details
        const invited = vendorsRes.data.filter((v) => rfqData.assignedVendors?.includes(v.id));
        setInvitedVendors(invited);

        // If the logged in user is a Vendor, find their supplier ID and check if they quoted
        if (isVendor && user) {
          const matchingVendor = vendorsRes.data.find((v) => v.email === user.email);
          if (matchingVendor) {
            setLoggedVendorId(matchingVendor.id);
            const quoted = quotesRes.data.some((q) => q.vendorId === matchingVendor.id);
            setHasSubmittedQuote(quoted);
          }
        }
      } catch (error) {
        toast.error('Failed to load RFQ specifications.');
        navigate('/rfq');
      } finally {
        setLoading(false);
      }
    };
    loadRfqDetails();
  }, [id, user, isVendor, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 animate-pulse">
        <p className="text-[#9CA3AF]">Loading RFQ details...</p>
      </div>
    );
  }

  if (!rfq) {
    return (
      <div className="text-center py-20">
        <p className="text-[#9CA3AF]">RFQ details not found.</p>
        <Button onClick={() => navigate('/rfq')} className="mt-4">Back to List</Button>
      </div>
    );
  }

  const isBiddingOpen = rfq.status === 'open';

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F2937] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-[#6366F1] font-display uppercase tracking-widest">{rfq.rfqNumber}</span>
            <Badge status={rfq.status} />
          </div>
          <h2 className="text-2xl font-display font-extrabold text-white mt-1.5">{rfq.title}</h2>
          <p className="text-sm text-[#9CA3AF] mt-0.5">Category: {rfq.category} · Created {formatDate(rfq.createdAt)}</p>
        </div>

        {/* Dynamic Context Buttons */}
        <div className="flex items-center gap-3">
          {/* 1. Procurement Officer Actions: Compare Quotes */}
          {(isProcurementOfficer || isAdmin) && quotations.length > 0 && (
            <Button
              variant="primary"
              icon={GitCompare}
              onClick={() => navigate(`/rfq/${id}/compare`)}
            >
              Compare {quotations.length} Quotations
            </Button>
          )}

          {/* 2. Vendor Actions: Submit Quote */}
          {isVendor && isBiddingOpen && !hasSubmittedQuote && invitedVendors.some(v => v.id === loggedVendorId) && (
            <Button
              variant="primary"
              icon={MessageSquare}
              onClick={() => navigate(`/quotations/submit/${id}`)}
            >
              Submit Quotation Proposal
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scope & Items */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Card title="Scope & Specifications">
            <p className="text-sm text-[#9CA3AF] whitespace-pre-wrap leading-relaxed">{rfq.description}</p>
          </Card>

          <Card title="Line Items Checklist" subtitle="Verify product requirements and unit demands.">
            <Table
              data={rfq.items || []}
              columns={[
                { key: 'description', label: 'Item Specification' },
                { key: 'quantity', label: 'Required Quantity' },
                { key: 'unit', label: 'Unit' },
              ]}
            />
          </Card>
        </div>

        {/* Right Column: Deadlines, Vendors, Submissions count */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card title="Bidding Schedule">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/5 rounded-lg text-amber-400">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]">Bidding Deadline</p>
                  <p className="text-sm font-semibold text-white">{formatDate(rfq.deadline)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/5 rounded-lg text-indigo-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]">Status</p>
                  <div className="mt-0.5">
                    <Badge status={rfq.status} />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Invited Vendors list */}
          <Card title="Invited Suppliers" subtitle={`${invitedVendors.length} vendors invited to bid.`}>
            <div className="flex flex-col gap-3">
              {invitedVendors.map((vendor) => (
                <div key={vendor.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-2.5 truncate">
                    <Building2 className="h-4 w-4 text-[#6366F1]" />
                    <span className="font-semibold text-white truncate">{vendor.name}</span>
                  </div>
                  {/* Quoting Status indicator */}
                  {quotations.some(q => q.vendorId === vendor.id) ? (
                    <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/15">Quoted</span>
                  ) : (
                    <span className="text-xs text-[#9CA3AF] bg-white/5 px-2 py-0.5 rounded-full">Pending</span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Received Quotations (Only shown to Officers/Admins/Submitting vendor) */}
          {(isProcurementOfficer || isAdmin) && (
            <Card title="Received Proposals" subtitle={`${quotations.length} quotes submitted.`}>
              <div className="flex flex-col gap-3">
                {quotations.map((quote) => (
                  <div key={quote.id} className="p-3 bg-[#0A0F1E] border border-[#1F2937] rounded-xl flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{quote.vendorName}</p>
                      <p className="text-xs text-[#6366F1] font-bold mt-0.5">{formatCurrency(quote.totalAmount)}</p>
                    </div>
                    <Badge status={quote.status} />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default RFQDetailPage;
