import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../../components/ui/Card';

const monthlySpendData = [
  { month: 'Jan', spend: 85000 },
  { month: 'Feb', spend: 92000 },
  { month: 'Mar', spend: 110000 },
  { month: 'Apr', spend: 98000 },
  { month: 'May', spend: 125000 },
];

export function ReportsPage() {
  const [activeFilter, setActiveFilter] = useState('Spend');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-3xl font-semibold text-white tracking-tight">Reports & analytics</h2>
          <p className="text-sm text-[#9CA3AF] mt-0.5 font-medium">Procurement statistics</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-1 rounded-xl">
          {['Spend', 'RFQ', 'Vendor'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === filter ? 'bg-[#6366F1] text-white' : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="bg-[#111827] border border-white/5">
          <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-[0.12em]">Spend growth</p>
          <h3 className="text-3xl font-semibold text-white mt-2">12.4%</h3>
          <p className="text-[10px] text-emerald-400 mt-1">Increase from last month</p>
        </Card>

        <Card className="bg-[#111827] border border-white/5">
          <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-[0.12em]">Active suppliers</p>
          <h3 className="text-3xl font-semibold text-white mt-2">28</h3>
          <p className="text-[10px] text-blue-400 mt-1">Verified partner accounts</p>
        </Card>

        <Card className="bg-[#111827] border border-white/5">
          <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-[0.12em]">Success rate</p>
          <h3 className="text-3xl font-semibold text-white mt-2">94%</h3>
          <p className="text-[10px] text-emerald-400 mt-1">On-time fulfillment rate</p>
        </Card>

        <Card className="bg-[#111827] border border-white/5">
          <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-[0.12em]">Total alerts</p>
          <h3 className="text-3xl font-semibold text-white mt-2">3</h3>
          <p className="text-[10px] text-red-400 mt-1">Require immediate resolution</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <Card title="Spend by Category" className="bg-[#111827] border border-white/5 h-full">
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-1 text-xs">
                <div className="flex justify-between font-semibold text-white">
                  <span>IT Equipment</span>
                  <span>35.2%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#6366F1] h-full rounded-full" style={{ width: '35.2%' }} />
                </div>
              </div>

              <div className="flex flex-col gap-1 text-xs">
                <div className="flex justify-between font-semibold text-white">
                  <span>Furniture</span>
                  <span>43.1%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#10B981] h-full rounded-full" style={{ width: '43.1%' }} />
                </div>
              </div>

              <div className="flex flex-col gap-1 text-xs">
                <div className="flex justify-between font-semibold text-white">
                  <span>Stationery</span>
                  <span>12.5%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#F59E0B] h-full rounded-full" style={{ width: '12.5%' }} />
                </div>
              </div>

              <div className="flex flex-col gap-1 text-xs">
                <div className="flex justify-between font-semibold text-white">
                  <span>Software Licenses</span>
                  <span>9.2%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#EF4444] h-full rounded-full" style={{ width: '9.2%' }} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-6">
          <Card title="Top Vendors" className="bg-[#111827] border border-white/5 h-full">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-[#9CA3AF]">
                    <th className="p-3 font-semibold">Vendor</th>
                    <th className="p-3 font-semibold">Spend ($)</th>
                    <th className="p-3 font-semibold text-right">POs</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="p-3 font-semibold text-white">Astro Supplies</td>
                    <td className="p-3 text-white">$ 25,000</td>
                    <td className="p-3 text-white text-right">6</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="p-3 font-semibold text-white">Initech</td>
                    <td className="p-3 text-white">$ 18,000</td>
                    <td className="p-3 text-white text-right">4</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="p-3 font-semibold text-white">Acme Corp</td>
                    <td className="p-3 text-white">$ 15,000</td>
                    <td className="p-3 text-white text-right">3</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      <Card title="Monthly Spend Trends" className="bg-[#111827] border border-white/5">
        <div className="h-64 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlySpendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', borderRadius: '8px' }}
                labelStyle={{ color: '#9CA3AF', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="spend" stroke="#6366F1" strokeWidth={2} fill="#6366F1" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

export default ReportsPage;
