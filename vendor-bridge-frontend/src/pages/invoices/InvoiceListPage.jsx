import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, Search, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';

export function InvoiceListPage() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/invoices');
      setInvoices(res.data);
    } catch (e) {
      toast.error('Failed to load invoices records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDownloadInvoice = (invNum) => {
    toast.success(`Downloading PDF for invoice ${invNum}...`);
  };

  const filteredInvoices = invoices.filter((i) =>
    i.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.poNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-display font-extrabold text-white">Invoices & Billing</h2>
        <p className="text-sm text-[#9CA3AF] mt-0.5">Track financial payouts, verify billing terms, and download PDF receipts.</p>
      </div>

      <Card>
        {/* Search header */}
        <div className="flex items-center gap-3 bg-[#0A0F1E] border border-[#1F2937] rounded-lg px-3 py-2 max-w-md mb-6">
          <Search className="h-5 w-5 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search Invoice #, PO #, or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-[#F9FAFB] w-full placeholder-[#9CA3AF]"
          />
        </div>

        <Table
          loading={loading}
          data={filteredInvoices}
          emptyMessage="No invoices logged."
          columns={[
            {
              key: 'invoiceNumber',
              label: 'Invoice Number',
              render: (val) => (
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-[#6366F1]" />
                  <span className="font-semibold text-white">{val}</span>
                </div>
              ),
            },
            { key: 'poNumber', label: 'PO Reference' },
            {
              key: 'vendorName',
              label: 'Vendor Supplier',
              render: (val) => <span className="font-semibold text-white">{val}</span>,
            },
            {
              key: 'amount',
              label: 'Grand Total',
              render: (val) => <span className="text-[#6366F1] font-bold">{formatCurrency(val)}</span>,
            },
            {
              key: 'createdAt',
              label: 'Date Issued',
              render: (val) => formatDate(val),
            },
            {
              key: 'dueDate',
              label: 'Due Date',
              render: (val) => <span className="text-amber-400 font-semibold">{formatDate(val)}</span>,
            },
            {
              key: 'status',
              label: 'Status',
              render: (val) => <Badge status={val} />,
            },
            {
              key: 'actions',
              label: '',
              render: (_, row) => (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate(`/invoices/${row.id}`)}
                  >
                    View Billing
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={Download}
                    onClick={() => handleDownloadInvoice(row.invoiceNumber)}
                  >
                    PDF
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}

export default InvoiceListPage;
