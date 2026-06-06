import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Building2, Star, Mail, Phone, MapPin, ArrowLeft, ShieldAlert, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';

export function VendorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isProcurementOfficer, isAdmin } = useAuth();
  
  const [vendor, setVendor] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        const [vendorRes, quotesRes] = await Promise.all([
          axios.get(`/vendors/${id}`),
          axios.get('/quotations'),
        ]);
        
        setVendor(vendorRes.data);
        // Filter quotes submitted by this vendor
        const vendorQuotes = quotesRes.data.filter((q) => q.vendorId === id);
        setQuotations(vendorQuotes);
      } catch (error) {
        toast.error('Failed to load supplier details.');
        navigate('/vendors');
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 animate-pulse">
        <p className="text-[#9CA3AF]">Loading supplier profile details...</p>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-[#9CA3AF] gap-4">
        <ShieldAlert className="h-10 w-10 text-[#EF4444]" />
        <p>Supplier record not found.</p>
        <Button onClick={() => navigate('/vendors')}>Return to Directory</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('/vendors')}>
            Back
          </Button>
          <div>
            <h2 className="text-xl font-display font-extrabold text-white">{vendor.name}</h2>
            <p className="text-sm text-[#9CA3AF] mt-0.5">{vendor.category} Supplier Profile</p>
          </div>
        </div>
        {(isProcurementOfficer || isAdmin) && (
          <Button
            variant="ghost"
            onClick={() => navigate(`/vendors/${id}/edit`)}
            className="rounded-lg self-start sm:self-auto"
          >
            Edit Profile
          </Button>
        )}
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Vendor info */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <Card title="Business Details">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/5 rounded-lg text-[#9CA3AF]">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]">Business Category</p>
                  <p className="text-sm font-semibold text-white">{vendor.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/5 rounded-lg text-[#9CA3AF]">
                  <Star className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]">Quality Rating</p>
                  <p className="text-sm font-semibold text-white">{vendor.rating} / 5.0</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/5 rounded-lg text-[#9CA3AF]">
                  <Award className="h-5 w-5 text-[#6366F1]" />
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]">Directory Status</p>
                  <div className="mt-0.5">
                    <Badge status={vendor.status} />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Contact Information">
            <div className="flex flex-col gap-4 text-sm">
              <div>
                <p className="text-xs text-[#9CA3AF]">Account Manager</p>
                <p className="font-semibold text-white mt-0.5">{vendor.contact}</p>
              </div>

              <div className="flex items-center gap-2 text-[#9CA3AF]">
                <Mail className="h-4.5 w-4.5 text-[#6366F1] flex-shrink-0" />
                <span className="truncate">{vendor.email}</span>
              </div>

              <div className="flex items-center gap-2 text-[#9CA3AF]">
                <Phone className="h-4.5 w-4.5 text-[#6366F1] flex-shrink-0" />
                <span>{vendor.phone}</span>
              </div>

              <div className="flex items-start gap-2 text-[#9CA3AF] mt-1.5 border-t border-[#1F2937] pt-3">
                <MapPin className="h-4.5 w-4.5 text-[#6366F1] flex-shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">{vendor.address || 'No address logged.'}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Quotes History */}
        <div className="md:col-span-2">
          <Card title="Quotations History" subtitle="List of proposals and quotations received from this supplier.">
            <Table
              data={quotations}
              emptyMessage="No bids or quotations received from this supplier."
              columns={[
                { key: 'rfqNumber', label: 'RFQ #' },
                {
                  key: 'totalAmount',
                  label: 'Proposed Total',
                  render: (val) => <span className="text-[#6366F1] font-bold">{formatCurrency(val)}</span>,
                },
                {
                  key: 'deliveryDays',
                  label: 'Lead Time',
                  render: (val) => <span>{val} Days</span>,
                },
                {
                  key: 'status',
                  label: 'Status',
                  render: (val) => <Badge status={val} />,
                },
                {
                  key: 'createdAt',
                  label: 'Date Submitted',
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
                      View RFQ
                    </Button>
                  ),
                },
              ]}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default VendorDetailPage;
