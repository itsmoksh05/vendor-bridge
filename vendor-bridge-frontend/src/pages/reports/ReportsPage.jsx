import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { BarChart3, TrendingUp, DollarSign, Calendar, RefreshCcw } from 'lucide-react';
import axios from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import formatCurrency from '../../utils/formatCurrency';

// Data for Category breakdown
const categoryData = [
  { name: 'IT Hardware', value: 75000, color: '#6366F1' },
  { name: 'Office Supplies', value: 12000, color: '#10B981' },
  { name: 'Software Licensing', value: 48000, color: '#F59E0B' },
  { name: 'Lab Equipment', value: 18000, color: '#EF4444' },
  { name: 'Machinery', value: 35000, color: '#8B5CF6' },
];

export function ReportsPage() {
  const [loading, setLoading] = useState(false);
  const [rfqCount, setRfqCount] = useState(12);
  const [vendorsCount, setVendorsCount] = useState(127);
  const [totalSpend, setTotalSpend] = useState(188000);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/reports/overview');
      // Update values if mock returned data
      setRfqCount(res.data.rfqCount || 12);
      setVendorsCount(res.data.vendorsCount || 127);
    } catch (e) {
      console.warn('Backend unavailable. Using report defaults.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-extrabold text-white">Procurement Reports & Analytics</h2>
          <p className="text-sm text-[#9CA3AF] mt-0.5">Audit cost profiles, categorical distributions, and operational efficiencies.</p>
        </div>
        <Button variant="ghost" icon={RefreshCcw} onClick={fetchSummary} loading={loading}>
          Sync Data
        </Button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card>
          <div className="flex items-center gap-3 text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider">
            <DollarSign className="h-4 w-4 text-[#6366F1]" />
            <span>Cumulative Spend</span>
          </div>
          <h3 className="text-2xl font-display font-black text-white mt-3">
            {formatCurrency(totalSpend)}
          </h3>
          <p className="text-[11px] text-[#9CA3AF] mt-2 leading-relaxed">Total authorized invoice disbursements during this fiscal quarter.</p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider">
            <BarChart3 className="h-4 w-4 text-emerald-400" />
            <span>Bids Efficiency</span>
          </div>
          <h3 className="text-2xl font-display font-black text-white mt-3">4.2 Bids / RFQ</h3>
          <p className="text-[11px] text-[#9CA3AF] mt-2 leading-relaxed">Average quantity of proposals received per published request.</p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider">
            <Calendar className="h-4 w-4 text-amber-400" />
            <span>Avg. Turnaround Time</span>
          </div>
          <h3 className="text-2xl font-display font-black text-white mt-3">8.4 Business Days</h3>
          <p className="text-[11px] text-[#9CA3AF] mt-2 leading-relaxed">Average duration elapsed from publishing RFQs to Manager approval.</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Budget Share */}
        <Card title="Spend breakdown by Category" subtitle="Overview of funds distributed across core procurement lines.">
          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', borderRadius: '8px' }}
                  labelStyle={{ color: '#9CA3AF', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Suppliers Category distribution */}
        <Card title="Active Vendors Categorization" subtitle="Categorical breakdown of suppliers onboarded in the directory.">
          <div className="h-72 w-full mt-4 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'IT Hardware', value: 45 },
                    { name: 'Office Supplies', value: 20 },
                    { name: 'Software Licensing', value: 30 },
                    { name: 'Lab Equipment', value: 12 },
                    { name: 'Machinery', value: 20 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center legends details */}
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-display font-black text-white">{vendorsCount}</span>
              <span className="text-[10px] text-[#9CA3AF] uppercase font-semibold">Total Suppliers</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ReportsPage;
