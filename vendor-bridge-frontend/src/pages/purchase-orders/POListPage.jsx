import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';

export function POListPage() {
  const navigate = useNavigate();
  const { user, isVendor } = useAuth();
  
  const [pos, setPos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPOs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/purchase-orders');

      if (isVendor && user) {
        // Find vendor id
        const vendorsRes = await axios.get('/vendors');
        const loggedVendor = vendorsRes.data.find(v => v.email === user.email);
        
        if (loggedVendor) {
          const filtered = res.data.filter(p => p.vendorId === loggedVendor.id);
          setPos(filtered);
        } else {
          setPos([]);
        }
      } else {
        setPos(res.data);
      }
    } catch (e) {
      toast.error('Failed to retrieve purchase orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPOs();
  }, [user]);

  const filteredPOs = pos.filter((p) =>
    (p.poNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.vendorName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.rfqNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-semibold text-white tracking-tight">Purchase Orders</h2>
        <p className="text-sm text-[#9CA3AF] mt-0.5">Track legally binding purchase instructions and order fulfillment.</p>
      </div>

      <Card>
        {/* Search header */}
        <div className="flex items-center gap-3 bg-[#0A0F1E] border border-[#1F2937] rounded-lg px-3 py-2 max-w-md mb-6">
          <Search className="h-5 w-5 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search PO #, RFQ #, or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-[#F9FAFB] w-full placeholder-[#9CA3AF]"
          />
        </div>

        <Table
          loading={loading}
          data={filteredPOs}
          emptyMessage="No Purchase Orders logged."
          columns={[
            {
              key: 'poNumber',
              label: 'PO Number',
              render: (val) => (
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-[#6366F1]" />
                  <span className="font-semibold text-white">{val}</span>
                </div>
              ),
            },
            {
              key: 'rfqNumber',
              label: 'RFQ Source',
              render: (val, row) => (
                <Link to={`/rfq/${row.rfqId}`} className="text-[#6366F1] hover:underline font-semibold">
                  {val}
                </Link>
              ),
            },
            {
              key: 'vendorName',
              label: 'Vendor Supplier',
              render: (val) => <span className="font-semibold text-white">{val}</span>,
            },
            {
              key: 'amount',
              label: 'Total Value',
              render: (val) => <span className="text-[#6366F1] font-bold">{formatCurrency(val)}</span>,
            },
            {
              key: 'createdAt',
              label: 'Date Issued',
              render: (val) => formatDate(val),
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
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Eye}
                  onClick={() => navigate(`/purchase-orders/${row.id}`)}
                >
                  Inspect PO
                </Button>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}

export default POListPage;
