import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Building2, Star, Mail, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';

export function VendorListPage() {
  const navigate = useNavigate();
  const { isProcurementOfficer, isAdmin } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/vendors');
      setVendors(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to retrieve vendors list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const filteredVendors = vendors.filter((v) =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-extrabold text-white">Vendors Directory</h2>
          <p className="text-sm text-[#9CA3AF] mt-0.5">Manage corporate suppliers, ratings, and classifications.</p>
        </div>
        {(isProcurementOfficer || isAdmin) && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/vendors/add')}
            className="rounded-lg self-start sm:self-auto"
          >
            Add New Vendor
          </Button>
        )}
      </div>

      <Card>
        {/* Search header */}
        <div className="flex items-center gap-3 bg-[#0A0F1E] border border-[#1F2937] rounded-lg px-3 py-2 max-w-md mb-6">
          <Search className="h-5 w-5 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search vendor name, category, or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-[#F9FAFB] w-full placeholder-[#9CA3AF]"
          />
        </div>

        <Table
          loading={loading}
          data={filteredVendors}
          emptyMessage="No suppliers matched your query."
          columns={[
            {
              key: 'name',
              label: 'Vendor Supplier',
              render: (val, row) => (
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center text-[#6366F1]">
                    <Building2 className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">{val}</span>
                    <span className="text-[10px] text-[#9CA3AF]">{row.category}</span>
                  </div>
                </div>
              ),
            },
            { key: 'contact', label: 'Contact Person' },
            {
              key: 'email',
              label: 'Contact Info',
              render: (val, row) => (
                <div className="flex flex-col text-xs text-[#9CA3AF]">
                  <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {val}</span>
                  <span className="flex items-center gap-1.5 mt-0.5"><Phone className="h-3.5 w-3.5" /> {row.phone}</span>
                </div>
              ),
            },
            {
              key: 'rating',
              label: 'Rating',
              render: (val) => (
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-semibold">{val}</span>
                </div>
              ),
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
                    onClick={() => navigate(`/vendors/${row.id}`)}
                  >
                    View Profile
                  </Button>
                  {(isProcurementOfficer || isAdmin) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/vendors/${row.id}/edit`)}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}

export default VendorListPage;
