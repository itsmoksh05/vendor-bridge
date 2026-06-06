import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Search, FileText, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';

export function QuotationListPage() {
  const navigate = useNavigate();
  const { user, isVendor } = useAuth();
  
  const [quotations, setQuotations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/quotations');

      if (isVendor && user) {
        // Find vendor id
        const vendorsRes = await axios.get('/vendors');
        const loggedVendor = vendorsRes.data.find(v => v.email === user.email);
        
        if (loggedVendor) {
          const filtered = res.data.filter(q => q.vendorId === loggedVendor.id);
          setQuotations(filtered);
        } else {
          setQuotations([]);
        }
      } else {
        setQuotations(res.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load quotation lists.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [user]);

  const filteredQuotes = quotations.filter((q) =>
    q.rfqNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-display font-extrabold text-white">Quotation Board</h2>
        <p className="text-sm text-[#9CA3AF] mt-0.5">Evaluate proposals, check financial pricing, and monitor status updates.</p>
      </div>

      <Card>
        {/* Search header */}
        <div className="flex items-center gap-3 bg-[#0A0F1E] border border-[#1F2937] rounded-lg px-3 py-2 max-w-md mb-6">
          <Search className="h-5 w-5 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search RFQ # or vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-[#F9FAFB] w-full placeholder-[#9CA3AF]"
          />
        </div>

        <Table
          loading={loading}
          data={filteredQuotes}
          emptyMessage="No quotations matched your query."
          columns={[
            {
              key: 'rfqNumber',
              label: 'RFQ Number',
              render: (val, row) => (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#6366F1]" />
                  <span className="font-semibold text-white">{val}</span>
                </div>
              ),
            },
            {
              key: 'vendorName',
              label: 'Vendor Supplier',
              render: (val) => <span className="font-semibold text-white">{val}</span>,
            },
            {
              key: 'totalAmount',
              label: 'Total Value',
              render: (val) => <span className="text-[#6366F1] font-bold">{formatCurrency(val)}</span>,
            },
            {
              key: 'deliveryDays',
              label: 'Delivery Days',
              render: (val) => <span>{val} Days</span>,
            },
            {
              key: 'status',
              label: 'Status',
              render: (val) => <Badge status={val} />,
            },
            {
              key: 'createdAt',
              label: 'Submitted On',
              render: (val) => formatDate(val),
            },
            {
              key: 'actions',
              label: '',
              render: (_, row) => (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/rfq/${row.rfqId}`)}
                >
                  View Details
                </Button>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}

export default QuotationListPage;
