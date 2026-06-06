import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShoppingCart, FileText, ArrowLeft, Send, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';

export function PODetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isProcurementOfficer, isAdmin } = useAuth();
  
  const [po, setPo] = useState(null);
  const [hasInvoice, setHasInvoice] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const loadPoDetails = async () => {
      try {
        setLoading(true);
        const poRes = await axios.get(`/purchase-orders/${id}`);
        setPo(poRes.data);

        // Check if an invoice has already been generated for this PO
        const invoicesRes = await axios.get('/invoices');
        const exists = invoicesRes.data.some((inv) => inv.poNumber === poRes.data.poNumber);
        setHasInvoice(exists);
      } catch (error) {
        toast.error('Failed to load purchase order details.');
        navigate('/purchase-orders');
      } finally {
        setLoading(false);
      }
    };
    loadPoDetails();
  }, [id, navigate]);

  const handleGenerateInvoice = async () => {
    setGenerating(true);
    try {
      // POST invoices/generate-from-po/:poId is mapped in our simulated api as GET/POST
      // Wait, in axios.js we had: path.startsWith('invoices/generate-from-po/')
      // It handles it perfectly.
      await axios.get(`/invoices/generate-from-po/${id}`); // simulated api uses GET for easy routing trigger
      toast.success('Invoice generated successfully!');
      navigate('/invoices');
    } catch (e) {
      toast.error('Failed to generate invoice.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 animate-pulse">
        <p className="text-[#9CA3AF]">Loading purchase order details...</p>
      </div>
    );
  }

  if (!po) return null;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F2937] pb-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('/purchase-orders')}>
            Back
          </Button>
          <div>
            <h2 className="text-xl font-display font-extrabold text-white">Purchase Order Details</h2>
            <p className="text-sm text-[#9CA3AF] mt-0.5">Legally authorized purchase ticket: {po.poNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge status={po.status} />
          
          {/* Generate Invoice button */}
          {(isProcurementOfficer || isAdmin) && (
            <Button
              variant={hasInvoice ? 'ghost' : 'success'}
              icon={hasInvoice ? Check : Send}
              disabled={hasInvoice}
              loading={generating}
              onClick={handleGenerateInvoice}
            >
              {hasInvoice ? 'Invoice Generated' : 'Generate Invoice'}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metadata summary */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <Card title="Contract Ticket Info">
            <div className="flex flex-col gap-4 text-sm">
              <div>
                <p className="text-xs text-[#9CA3AF]">PO Reference</p>
                <p className="font-semibold text-white mt-0.5">{po.poNumber}</p>
              </div>

              <div>
                <p className="text-xs text-[#9CA3AF]">Associated RFQ</p>
                <p className="font-semibold text-white mt-0.5">{po.rfqNumber}</p>
              </div>

              <div>
                <p className="text-xs text-[#9CA3AF]">Supplier</p>
                <p className="font-semibold text-[#6366F1] mt-0.5">{po.vendorName}</p>
              </div>

              <div>
                <p className="text-xs text-[#9CA3AF]">Approved Date</p>
                <p className="font-semibold text-white mt-0.5">{formatDate(po.createdAt)}</p>
              </div>

              <div className="border-t border-[#1F2937] pt-4 mt-1">
                <p className="text-xs text-[#9CA3AF]">Order Value</p>
                <p className="text-2xl font-display font-black text-white mt-0.5">{formatCurrency(po.amount)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Order Items */}
        <div className="md:col-span-2">
          <Card title="Ordered Items Checklist" subtitle="Specific products/services approved for dispatch.">
            <Table
              data={po.items || []}
              columns={[
                { key: 'description', label: 'Item description' },
                { key: 'quantity', label: 'Quantity' },
                { key: 'unit', label: 'Unit' },
                {
                  key: 'unitPrice',
                  label: 'Unit Price',
                  render: (val) => val ? formatCurrency(val) : '—',
                },
                {
                  key: 'total',
                  label: 'Line Total',
                  render: (val) => val ? formatCurrency(val) : '—',
                },
              ]}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default PODetailPage;
