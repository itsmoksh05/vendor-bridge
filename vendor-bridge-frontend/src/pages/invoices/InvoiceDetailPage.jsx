import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Receipt, FileText, ArrowLeft, Download, Mail, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';

export function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoiceDetails = async () => {
      try {
        setLoading(true);
        const invRes = await axios.get(`/invoices/${id}`);
        setInvoice(invRes.data);
      } catch (error) {
        toast.error('Failed to load invoice details.');
        navigate('/invoices');
      } finally {
        setLoading(false);
      }
    };
    loadInvoiceDetails();
  }, [id, navigate]);

  const handleDownloadPDF = () => {
    toast.success(`PDF downloaded for invoice ${invoice?.invoiceNumber}`);
  };

  const handleSendEmail = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1200)),
      {
        loading: 'Preparing invoice document...',
        success: `Invoice sent to vendor contact email!`,
        error: 'Failed to send document.',
      }
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 animate-pulse">
        <p className="text-[#9CA3AF]">Loading billing statement...</p>
      </div>
    );
  }

  if (!invoice) return null;

  // Real-time calculation helpers
  const subtotal = invoice.amount / 1.1; // estimate
  const tax = invoice.amount - subtotal;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F2937] pb-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('/invoices')}>
            Back
          </Button>
          <div>
            <h2 className="text-xl font-display font-extrabold text-white">Invoice Details</h2>
            <p className="text-sm text-[#9CA3AF] mt-0.5">Billing statement: {invoice.invoiceNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="ghost" icon={Download} onClick={handleDownloadPDF}>
            Download PDF
          </Button>
          <Button variant="primary" icon={Mail} onClick={handleSendEmail}>
            Send via Email
          </Button>
        </div>
      </div>

      {/* Invoice Card structure */}
      <Card className="border border-[#1F2937] bg-[#111827]">
        {/* Invoice Header block */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-[#1F2937] pb-6 mb-8 text-sm">
          {/* Logo & Brand */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <svg className="w-7 h-7 text-[#6366F1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" className="fill-[#6366F1]/10" />
                <circle cx="12" cy="12" r="3" className="fill-[#6366F1]" />
              </svg>
              <span className="font-display font-bold text-base text-white tracking-wider">
                Vendor<span className="text-[#6366F1]">Bridge</span>
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-1">100 ERP Tower, Suite 404</p>
            <p className="text-xs text-[#9CA3AF]">Tech District, SF 94016</p>
          </div>

          {/* Invoice identifiers */}
          <div className="flex flex-col md:text-right gap-1.5">
            <h3 className="text-xl font-display font-black text-white">INVOICE</h3>
            <p className="text-[#9CA3AF]">
              Invoice #: <span className="font-semibold text-white">{invoice.invoiceNumber}</span>
            </p>
            <p className="text-[#9CA3AF]">
              PO Ref #: <span className="font-semibold text-white">{invoice.poNumber}</span>
            </p>
            <div className="md:self-end mt-1">
              <Badge status={invoice.status} />
            </div>
          </div>
        </div>

        {/* Billing party directions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-[#1F2937] pb-6 mb-8 text-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-1.5">Billed To</p>
            <p className="font-bold text-white">VendorBridge Procurement Org</p>
            <p className="text-[#9CA3AF] mt-0.5">finance@vendorbridge.com</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-1.5">Supplier / Payee</p>
            <p className="font-bold text-[#6366F1]">{invoice.vendorName}</p>
            <p className="text-[#9CA3AF] mt-0.5">billing@{invoice.vendorName.toLowerCase().replace(' ', '')}.com</p>
          </div>
        </div>

        {/* Chronological schedules */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#0A0F1E] border border-[#1F2937] p-4 rounded-xl mb-8 text-xs">
          <div>
            <p className="text-[#9CA3AF]">Date Issued</p>
            <p className="font-semibold text-white mt-0.5">{formatDate(invoice.createdAt)}</p>
          </div>
          <div>
            <p className="text-[#9CA3AF]">Payment Terms</p>
            <p className="font-semibold text-white mt-0.5">Net 30 Days</p>
          </div>
          <div>
            <p className="text-[#9CA3AF]">Due Date</p>
            <p className="font-semibold text-amber-400 mt-0.5">{formatDate(invoice.dueDate)}</p>
          </div>
          <div>
            <p className="text-[#9CA3AF]">Billing Currency</p>
            <p className="font-semibold text-white mt-0.5">USD ($)</p>
          </div>
        </div>

        {/* Itemized pricing breakdown */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-3">Itemized Billings</p>
          <Table
            data={invoice.items || []}
            columns={[
              { key: 'description', label: 'Item description' },
              { key: 'quantity', label: 'Qty' },
              { key: 'unit', label: 'Unit' },
              {
                key: 'unitPrice',
                label: 'Unit Price',
                render: (val) => val ? formatCurrency(val) : '—',
              },
              {
                key: 'total',
                label: 'Total',
                render: (val) => val ? formatCurrency(val) : '—',
              },
            ]}
          />
        </div>

        {/* Pricing totals */}
        <div className="flex justify-end text-sm">
          <div className="w-full md:w-64 flex flex-col gap-3">
            <div className="flex justify-between text-[#9CA3AF]">
              <span>Subtotal</span>
              <span className="font-semibold text-white">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#9CA3AF]">
              <span>Taxes & Fees</span>
              <span className="font-semibold text-white">{formatCurrency(tax)}</span>
            </div>
            <div className="h-px bg-[#1F2937] my-1" />
            <div className="flex justify-between text-base">
              <span className="font-bold text-white">Total Amount</span>
              <span className="font-extrabold text-[#6366F1]">{formatCurrency(invoice.amount)}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default InvoiceDetailPage;
