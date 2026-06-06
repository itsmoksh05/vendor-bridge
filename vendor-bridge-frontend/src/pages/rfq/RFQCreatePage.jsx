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
  assignedVendors: z.array(z.string()).min(1, { message: 'Select at least one supplier' }),
});

export function RFQCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(true);

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
      items: [{ description: '', quantity: 1, unit: 'pcs' }],
      assignedVendors: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  // Watch invited vendors list for selection checks
  const selectedVendors = watch('assignedVendors');

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoadingVendors(true);
        const res = await axios.get('/vendors');
        setVendors(res.data.filter(v => v.status === 'active'));
      } catch (error) {
        toast.error('Failed to load active vendors list.');
      } finally {
        setLoadingVendors(false);
      }
    };
    fetchVendors();
  }, []);

  const handleVendorToggle = (vendorId) => {
    const currentList = [...selectedVendors];
    const index = currentList.indexOf(vendorId);
    if (index > -1) {
      currentList.splice(index, 1);
    } else {
      currentList.push(vendorId);
    }
    setValue('assignedVendors', currentList, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post('/rfqs', data);
      toast.success('RFQ distributed successfully!');
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
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('/rfq')}>
          Back
        </Button>
        <div>
          <h2 className="text-xl font-display font-extrabold text-white">Create Request for Quotation (RFQ)</h2>
          <p className="text-sm text-[#9CA3AF] mt-0.5">Define project requirements, specify items, and select suppliers.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <Card title="RFQ General Information">
          <div className="flex flex-col gap-5">
            <Input
              label="RFQ Project Title"
              name="title"
              placeholder="e.g. Procurement of high-end engineering laptops"
              icon={FileText}
              error={errors.title}
              register={register('title')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="category" className="text-sm font-medium text-[#9CA3AF]">
                  Procurement Category
                </label>
                <select
                  id="category"
                  className="w-full bg-[#111827] text-[#F9FAFB] rounded-lg border border-[#1F2937] text-sm py-2.5 px-4 outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1]"
                  {...register('category')}
                >
                  <option value="IT Hardware">IT Hardware</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Software Licensing">Software Licensing</option>
                  <option value="Lab Equipment">Lab Equipment</option>
                  <option value="Industrial Machinery">Industrial Machinery</option>
                </select>
              </div>

              <Input
                label="Bidding Close Date"
                name="deadline"
                type="date"
                error={errors.deadline}
                register={register('deadline')}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-sm font-medium text-[#9CA3AF]">
                Scope of Work & Requirements description
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Describe project details, specifications, deadlines and criteria..."
                className={`w-full bg-[#111827] text-[#F9FAFB] rounded-lg border border-[#1F2937] text-sm py-2.5 px-4 outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] ${
                  errors.description ? 'border-[#EF4444]' : 'border-[#1F2937]'
                }`}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-xs text-[#EF4444] mt-0.5 font-medium">{errors.description.message}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Dynamic Items list */}
        <Card
          title="Line Items"
          subtitle="Specific products or services requested in this RFQ."
          action={
            <Button
              size="sm"
              variant="ghost"
              icon={Plus}
              onClick={() => append({ description: '', quantity: 1, unit: 'pcs' })}
            >
              Add Item
            </Button>
          }
        >
          <div className="flex flex-col gap-3">
            {fields.map((item, index) => (
              <div key={item.id} className="flex items-start gap-4 p-4 rounded-xl bg-[#0A0F1E] border border-[#1F2937]">
                <div className="flex-1 grid grid-cols-12 gap-3">
                  <div className="col-span-12 md:col-span-7">
                    <Input
                      placeholder="Item description / specification"
                      name={`items.${index}.description`}
                      error={errors.items?.[index]?.description}
                      register={register(`items.${index}.description`)}
                    />
                  </div>
                  <div className="col-span-6 md:col-span-2">
                    <Input
                      type="number"
                      placeholder="Qty"
                      name={`items.${index}.quantity`}
                      error={errors.items?.[index]?.quantity}
                      register={register(`items.${index}.quantity`)}
                    />
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <Input
                      placeholder="Unit (pcs, hr, box)"
                      name={`items.${index}.unit`}
                      error={errors.items?.[index]?.unit}
                      register={register(`items.${index}.unit`)}
                    />
                  </div>
                </div>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-[#EF4444] hover:bg-red-500/10 rounded-lg self-center"
                    title="Remove item"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                )}
              </div>
            ))}
            {errors.items?.root && (
              <p className="text-xs text-[#EF4444] mt-1 font-semibold">{errors.items.root.message}</p>
            )}
          </div>
        </Card>

        {/* Vendors Selection */}
        <Card title="Assign Vendors" subtitle="Select matching suppliers from the directory to invite to bid.">
          {loadingVendors ? (
            <div className="h-10 bg-[#1F2937] rounded animate-pulse" />
          ) : vendors.length === 0 ? (
            <p className="text-sm text-[#9CA3AF]">No active suppliers found in this category.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
              {vendors.map((vendor) => {
                const isSelected = selectedVendors.includes(vendor.id);
                return (
                  <div
                    key={vendor.id}
                    onClick={() => handleVendorToggle(vendor.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-[#6366F1]/10 border-[#6366F1] text-white'
                        : 'bg-[#111827] border-[#1F2937] hover:border-[#6366F1]/40 text-[#9CA3AF]'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{vendor.name}</h4>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">{vendor.category}</p>
                    </div>
                    <div
                      className={`h-5 w-5 rounded border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-[#6366F1] border-[#6366F1] text-white'
                          : 'border-[#1F2937]'
                      }`}
                    >
                      {isSelected && <span className="text-xs">✓</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {errors.assignedVendors && (
            <p className="text-xs text-[#EF4444] mt-2 font-semibold">{errors.assignedVendors.message}</p>
          )}
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 mt-2">
          <Button variant="ghost" onClick={() => navigate('/rfq')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={Send} loading={loading}>
            Publish and Send Invitations
          </Button>
        </div>
      </form>
    </div>
  );
}

export default RFQCreatePage;
