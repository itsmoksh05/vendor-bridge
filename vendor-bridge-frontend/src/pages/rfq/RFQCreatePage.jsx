import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Trash2, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const rfqSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  category: z.string().min(2, { message: 'Please select category' }),
  deadline: z.string().min(1, { message: 'Bidding deadline date is required' }),
  items: z.array(z.object({
    description: z.string().min(2, { message: 'Description is required' }),
    quantity: z.preprocess((val) => Number(val), z.number().min(1, { message: 'Qty >= 1' })),
    unit: z.string().min(1, { message: 'Unit is required' }),
  })).min(1, { message: 'Add at least one item' }),
  assignedVendors: z.array(z.coerce.string()).min(1, { message: 'Select at least one supplier' }),
});

export function RFQCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(true);

  // Local state for inline item creation matching Screen 5
  const [tempItemName, setTempItemName] = useState('');
  const [tempItemQty, setTempItemQty] = useState('');
  const [tempItemUom, setTempItemUom] = useState('pcs');

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'IT Hardware',
      deadline: '',
      items: [],
      assignedVendors: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoadingVendors(true);
        const res = await axios.get('/vendors');
        const activeVendors = res.data.filter(v => v.status === 'active');
        setVendors(activeVendors);
        setValue('assignedVendors', activeVendors.map(v => String(v.id)), { shouldValidate: true });
      } catch (error) {
        toast.error('Failed to load active vendors list.');
      } finally {
        setLoadingVendors(false);
      }
    };
    fetchVendors();
  }, [setValue]);

  const handleAddLineItem = () => {
    if (!tempItemName.trim()) {
      toast.error('Item name is required');
      return;
    }
    const qty = Number(tempItemQty) || 1;
    append({
      description: tempItemName.trim(),
      quantity: qty,
      unit: tempItemUom.trim() || 'pcs'
    });
    setTempItemName('');
    setTempItemQty('');
    setTempItemUom('pcs');
    toast.success('Item added to draft checklist.');
  };

  const onSubmit = async (data) => {
    if (data.items.length === 0) {
      toast.error('Please add at least one line item to the RFQ.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...data,
        assignedVendorIds: data.assignedVendors.map((id) => Number(id)).filter(Boolean),
      };
      await axios.post('/rfqs', payload);
      toast.success('RFQ published successfully!');
      navigate('/rfq');
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Failed to submit RFQ.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-3xl font-bold text-white tracking-tight">Create RFQ's</h2>
        <p className="text-sm text-[#9CA3AF] mt-0.5">open request for quotation</p>
      </div>

      {/* Timeline Stepper */}
      <div className="flex items-center justify-between w-full max-w-xl mx-auto mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
        
        {/* Step 1 */}
        <div className="flex flex-col items-center gap-2 relative z-10">
          <div className="w-8 h-8 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-sm">
            1
          </div>
          <span className="text-xs font-semibold text-white">RFQ Details</span>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center gap-2 relative z-10">
          <div className="w-8 h-8 rounded-full bg-[#1F2937] border border-white/20 text-[#9CA3AF] flex items-center justify-center font-bold text-sm bg-[#0A0F1E]">
            2
          </div>
          <span className="text-xs font-semibold text-[#9CA3AF]">Items & specs</span>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center gap-2 relative z-10">
          <div className="w-8 h-8 rounded-full bg-[#1F2937] border border-white/20 text-[#9CA3AF] flex items-center justify-center font-bold text-sm bg-[#0A0F1E]">
            3
          </div>
          <span className="text-xs font-semibold text-[#9CA3AF]">Review & Publish</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: RFQ Details */}
          <div className="lg:col-span-6 flex flex-col gap-4 bg-[#111827] border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">RFQ Details</h3>
            
            <Input
              label="RFQ Title"
              name="title"
              placeholder="e.g. Office Furniture Procurement"
              error={errors.title}
              register={register('title')}
            />
            
            <div className="flex flex-col gap-1.5 w-full">
              <label htmlFor="category" className="text-sm font-medium text-[#9CA3AF]">
                Category
              </label>
              <select
                id="category"
                className="w-full bg-[#0A0F1E] text-[#F9FAFB] rounded-lg border border-white/10 text-sm py-2.5 px-4 outline-none focus:ring-1 focus:ring-[#6366F1]"
                {...register('category')}
              >
                <option value="IT Hardware">IT Hardware</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Software Licensing">Software Licensing</option>
                <option value="Lab Equipment">Lab Equipment</option>
              </select>
            </div>

            <Input
              label="Target Delivery Date"
              name="deadline"
              type="date"
              error={errors.deadline}
              register={register('deadline')}
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-sm font-medium text-[#9CA3AF]">
                Description / Instructions
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Describe project details, specifications..."
                className="w-full bg-[#0A0F1E] text-[#F9FAFB] rounded-lg border border-white/10 text-sm py-2.5 px-4 outline-none focus:ring-1 focus:ring-[#6366F1]"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-xs text-[#EF4444] mt-0.5 font-medium">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Right Column: Items Specifications Builder */}
          <div className="lg:col-span-6 flex flex-col gap-4 bg-[#111827] border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">Items</h3>
            
            {/* Inline Add Item Form Section */}
            <div className="flex flex-col gap-3 p-4 bg-[#0A0F1E] border border-white/10 rounded-xl">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-6">
                  <label className="text-xs font-semibold text-[#9CA3AF]">Item Name</label>
                  <input
                    type="text"
                    value={tempItemName}
                    onChange={(e) => setTempItemName(e.target.value)}
                    placeholder="e.g. Ergonomic Desk Chairs"
                    className="w-full bg-[#111827] text-white border border-white/10 rounded-lg py-2 px-3 text-xs outline-none"
                  />
                </div>
                <div className="col-span-3">
                  <label className="text-xs font-semibold text-[#9CA3AF]">Qty</label>
                  <input
                    type="number"
                    value={tempItemQty}
                    onChange={(e) => setTempItemQty(e.target.value)}
                    placeholder="20"
                    className="w-full bg-[#111827] text-white border border-white/10 rounded-lg py-2 px-3 text-xs outline-none"
                  />
                </div>
                <div className="col-span-3">
                  <label className="text-xs font-semibold text-[#9CA3AF]">UOM</label>
                  <input
                    type="text"
                    value={tempItemUom}
                    onChange={(e) => setTempItemUom(e.target.value)}
                    placeholder="pcs"
                    className="w-full bg-[#111827] text-white border border-white/10 rounded-lg py-2 px-3 text-xs outline-none"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddLineItem}
                className="w-full py-2 bg-[#10B981] hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 mt-1"
              >
                <span>+ Add Item</span>
              </button>
            </div>

            {/* List Table of Items Added */}
            <div className="overflow-x-auto border border-white/10 rounded-xl bg-[#0A0F1E]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-[#9CA3AF]">
                    <th className="p-3 font-semibold">Item name</th>
                    <th className="p-3 font-semibold">Qty</th>
                    <th className="p-3 font-semibold">UOM</th>
                    <th className="p-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, idx) => (
                    <tr key={field.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="p-3 font-semibold text-white">{field.description}</td>
                      <td className="p-3 text-white">{field.quantity}</td>
                      <td className="p-3 text-white">{field.unit}</td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => remove(idx)}
                          className="text-[#EF4444] hover:underline"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  {fields.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-[#9CA3AF]">No items added yet. Use form above to add lines.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {errors.items && (
              <p className="text-xs text-[#EF4444] mt-1 font-semibold">{errors.items.message}</p>
            )}
          </div>

          <div className="lg:col-span-12 flex flex-col gap-3 bg-[#111827] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white">Invite Suppliers</h3>
                <p className="text-xs text-[#9CA3AF] mt-0.5">Selected vendors will be linked to this RFQ.</p>
              </div>
              <span className="text-xs text-[#9CA3AF]">
                {watch('assignedVendors').length} selected
              </span>
            </div>

            {loadingVendors ? (
              <div className="text-sm text-[#9CA3AF] py-4">Loading active vendors...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {vendors.map((vendor) => (
                  <label
                    key={vendor.id}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#0A0F1E] p-3 hover:border-[#6366F1]/50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={String(vendor.id)}
                      className="mt-1 h-4 w-4 accent-[#6366F1]"
                      {...register('assignedVendors')}
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-white truncate">{vendor.name || vendor.companyName}</span>
                      <span className="block text-xs text-[#9CA3AF] truncate">{vendor.category} | {vendor.email}</span>
                    </span>
                  </label>
                ))}
              </div>
            )}
            {errors.assignedVendors && (
              <p className="text-xs text-[#EF4444] mt-1 font-semibold">{errors.assignedVendors.message}</p>
            )}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
          <Button variant="ghost" onClick={() => navigate('/rfq')} className="border border-white/10">
            Save Draft
          </Button>
          <Button type="submit" variant="primary" loading={loading} className="bg-[#6366F1] hover:bg-[#4F46E5] text-white">
            Publish RFQ
          </Button>
        </div>
      </form>
    </div>
  );
}

export default RFQCreatePage;
