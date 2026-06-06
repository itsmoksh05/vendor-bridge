import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Building2 } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('active');
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

  const counts = {
    active: vendors.filter((v) => v.status === 'active').length,
    pending: vendors.filter((v) => v.status === 'pending').length,
    declined: vendors.filter((v) => v.status === 'declined').length,
  };

  const filteredVendors = vendors
    .filter((v) => v.status === activeTab)
    .filter((v) =>
      (v.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.contact || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="flex flex-col gap-6">
      {/* Header with title, subtitle, and add button */}
      <div className="flex flex-row items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-3xl font-semibold text-white tracking-tight">Vendors</h2>
          <p className="text-sm text-[#9CA3AF] mt-0.5">Manage supplier profiles and registrations</p>
        </div>
        {(isProcurementOfficer || isAdmin) && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/vendors/add')}
            className="rounded-lg self-center"
          >
            Add vendor
          </Button>
        )}
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-white/10 gap-6 text-sm">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 font-semibold transition-all relative ${
            activeTab === 'active' ? 'text-[#10B981]' : 'text-[#9CA3AF] hover:text-white'
          }`}
        >
          Active Vendors ({counts.active})
          {activeTab === 'active' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B981]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 font-semibold transition-all relative ${
            activeTab === 'pending' ? 'text-amber-400' : 'text-[#9CA3AF] hover:text-white'
          }`}
        >
          Pending ({counts.pending})
          {activeTab === 'pending' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('declined')}
          className={`pb-3 font-semibold transition-all relative ${
            activeTab === 'declined' ? 'text-red-400' : 'text-[#9CA3AF] hover:text-white'
          }`}
        >
          Declined ({counts.declined})
          {activeTab === 'declined' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-400" />
          )}
        </button>
      </div>

      <Card className="bg-[#111827] border border-white/5">
        {/* Search header */}
        <div className="flex items-center gap-3 bg-[#0A0F1E] border border-white/10 rounded-lg px-3 py-2 max-w-md mb-6">
          <Search className="h-4 w-4 text-[#9CA3AF]" />
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
          emptyMessage={`No ${activeTab} suppliers found.`}
          columns={[
            {
              key: 'name',
              label: 'Vendor Name',
              render: (val, row) => (
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-[#9CA3AF]">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">{val}</span>
                  </div>
                </div>
              ),
            },
            { key: 'category', label: 'Category' },
            { key: 'contact', label: 'Contact Person' },
            { key: 'phone', label: 'Phone' },
            {
              key: 'status',
              label: 'Status',
              render: (val) => <Badge status={val} />,
            },
            {
              key: 'actions',
              label: 'Actions',
              render: (_, row) => (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate(`/vendors/${row.id}`)}
                  >
                    View
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
