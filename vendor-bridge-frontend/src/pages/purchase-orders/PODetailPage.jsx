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
  const [activeTab, setActiveTab] = useState('PO');

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

  const handleDownloadInvoice = () => {
    toast.success(`Downloading PDF for Purchase Order ${po.poNumber}...`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Purchase Order & Invoice</h2>
          <p className="text-sm text-[#9CA3AF] mt-0.5">
            {po.poNumber} generated after approval
          </p>
        </div>
        
        {/* Toggle buttons / actions */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('PO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'PO' ? 'bg-[#6366F1] text-white' : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            PO
          </button>
          <button
            onClick={() => setActiveTab('Invoice')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'Invoice' ? 'bg-[#6366F1] text-white' : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            Invoice
          </button>
          <button
            onClick={handleDownloadInvoice}
            className="px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10 text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-all"
          >
            PDF
          </button>
        </div>
      </div>

      {/* Split details panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Panel: PO Info */}
        <Card title="PO Info" className="bg-[#111827] border border-white/5">
          <div className="flex flex-col gap-4 text-xs md:text-sm">
            <div>
              <p className="text-[#9CA3AF] font-medium">PO Number</p>
              <p className="font-semibold text-white mt-0.5">{po.poNumber}</p>
            </div>
            <div>
              <p className="text-[#9CA3AF] font-medium">RFQ Number</p>
              <p className="font-semibold text-white mt-0.5">{po.rfqNumber || 'RFQ-2026-002'}</p>
            </div>
            <div>
              <p className="text-[#9CA3AF] font-medium">Vendor</p>
              <p className="font-semibold text-white mt-0.5">{po.vendorName}</p>
            </div>
            <div>
              <p className="text-[#9CA3AF] font-medium">Issue Date</p>
              <p className="font-semibold text-white mt-0.5">{formatDate(po.createdAt)}</p>
            </div>
          </div>
        </Card>

        {/* Right Panel: Invoice Status */}
        <Card title="Invoice status" className="bg-[#111827] border border-white/5">
          <div className="flex flex-col gap-4 text-xs md:text-sm">
            <div>
              <p className="text-[#9CA3AF] font-medium">Invoice Number</p>
              <p className="font-semibold text-white mt-0.5">
                INV-{po.poNumber ? po.poNumber.split('-')[1] : '2026-001'}
              </p>
            </div>
            <div>
              <p className="text-[#9CA3AF] font-medium">Payment Terms</p>
              <p className="font-semibold text-white mt-0.5">Net 30</p>
            </div>
            <div>
              <p className="text-[#9CA3AF] font-medium">Status</p>
              <div className="mt-1">
                <Badge status={hasInvoice ? 'completed' : 'pending'} />
              </div>
            </div>
            
            {/* Action button in invoice block */}
            {!hasInvoice && (isProcurementOfficer || isAdmin) && (
              <div className="mt-2">
                <Button
                  size="sm"
                  variant="success"
                  loading={generating}
                  onClick={handleGenerateInvoice}
                  className="bg-[#10B981] hover:bg-emerald-600 text-white font-bold w-full rounded-lg"
                >
                  Generate Invoice
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Items list table */}
      <Card className="bg-[#111827] border border-white/5">
        <Table
          data={po.items || []}
          emptyMessage="No items in this PO."
          columns={[
            {
              key: 'description',
              label: 'Item',
              render: (val) => <span className="font-semibold text-white">{val}</span>,
            },
            { key: 'quantity', label: 'Qty' },
            {
              key: 'unitPrice',
              label: 'Unit Price',
              render: (val) => val ? formatCurrency(val) : '—',
            },
            {
              key: 'total',
              label: 'Total',
              render: (val, row) => {
                const price = val || (row.unitPrice * row.quantity);
                return <span className="font-semibold text-white">{formatCurrency(price)}</span>;
              },
            },
          ]}
        />
      </Card>

      {/* Bottom link */}
      <div className="text-center mt-2">
        <button
          onClick={handleDownloadInvoice}
          className="text-xs text-[#6366F1] hover:underline font-bold"
        >
          Download Invoice Report
        </button>
      </div>
    </div>
  );
}

export default PODetailPage;
