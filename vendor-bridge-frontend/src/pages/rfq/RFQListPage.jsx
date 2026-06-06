import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileText, Calendar, Building2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import formatDate from '../../utils/formatDate';

export function RFQListPage() {
  const navigate = useNavigate();
  const { isProcurementOfficer, isAdmin, isVendor, user } = useAuth();
  
  const [rfqs, setRfqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchRfqs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/rfqs');
      
      // If the logged in user is a Vendor, only show RFQs they are assigned to
      if (isVendor && user) {
        // Find the vendor ID corresponding to this user's email
        const vendorsRes = await axios.get('/vendors');
        const loggedVendor = vendorsRes.data.find(v => v.email === user.email);
        
        if (loggedVendor) {
          const filtered = res.data.filter(r => r.assignedVendors?.includes(loggedVendor.id));
          setRfqs(filtered);
        } else {
          setRfqs([]);
        }
      } else {
        setRfqs(res.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load RFQ records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRfqs();
  }, [user]);

  const filteredRfqs = rfqs.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.rfqNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-extrabold text-white">Requests for Quotations (RFQs)</h2>
          <p className="text-sm text-[#9CA3AF] mt-0.5">Invite suppliers, track bid deadlines, and compare quotes.</p>
        </div>
        {(isProcurementOfficer || isAdmin) && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/rfq/create')}
            className="rounded-lg self-start sm:self-auto"
          >
            Create New RFQ
          </Button>
        )}
      </div>

      <Card>
        {/* Search header */}
        <div className="flex items-center gap-3 bg-[#0A0F1E] border border-[#1F2937] rounded-lg px-3 py-2 max-w-md mb-6">
          <Search className="h-5 w-5 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search RFQ #, title, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-[#F9FAFB] w-full placeholder-[#9CA3AF]"
          />
        </div>

        <Table
          loading={loading}
          data={filteredRfqs}
          emptyMessage="No RFQs matched your search query."
          columns={[
            {
              key: 'rfqNumber',
              label: 'RFQ Number',
              render: (val) => <span className="font-semibold text-white">{val}</span>,
            },
            {
              key: 'title',
              label: 'Title',
              render: (val, row) => (
                <div className="flex flex-col">
                  <span className="font-semibold text-white max-w-[250px] truncate">{val}</span>
                  <span className="text-[10px] text-[#9CA3AF]">{row.category}</span>
                </div>
              ),
            },
            {
              key: 'assignedVendors',
              label: 'Vendors Invited',
              render: (val) => (
                <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                  <Building2 className="h-4 w-4 text-[#6366F1]" />
                  <span>{val ? val.length : 0} Invited</span>
                </div>
              ),
            },
            {
              key: 'deadline',
              label: 'Bidding Deadline',
              render: (val) => (
                <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                  <Calendar className="h-4 w-4 text-[#6366F1]" />
                  <span>{formatDate(val)}</span>
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
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Eye}
                  onClick={() => navigate(`/rfq/${row.id}`)}
                >
                  Inspect RFQ
                </Button>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}

export default RFQListPage;
