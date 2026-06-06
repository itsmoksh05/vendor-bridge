import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { MessageSquare, DollarSign, Calendar, Send, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import formatCurrency from '../../utils/formatCurrency';

const quotationSchema = z.object({
  deliveryDays: z.preprocess((val) => Number(val), z.number().min(1, { message: 'Specify delivery time' })),
  validUntil: z.string().min(1, { message: 'Select quotation validity date' }),
  notes: z.string().optional(),
  items: z.array(z.object({
    id: z.string(),
    description: z.string(),
    quantity: z.number(),
    unit: z.string(),
    unitPrice: z.preprocess((val) => Number(val), z.number().min(1, { message: 'Unit price must be >= 1' })),
  })),
});

export function QuotationSubmitPage() {
  const { rfqId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [rfq, setRfq] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      deliveryDays: 7,
      validUntil: '',
      notes: '',
      items: [],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: 'items',
  });

  // Watch items array to calculate pricing in real-time
  const watchedItems = watch('items');

  useEffect(() => {
    const loadInitData = async () => {
      try {
        setLoading(true);
        const [rfqRes, vendorsRes] = await Promise.all([
          axios.get(`/rfqs/${rfqId}`),
          axios.get('/vendors'),
        ]);

        const rfqData = rfqRes.data;
        setRfq(rfqData);

        // Find the vendor linked to the logged in user
        const matchingVendor = vendorsRes.data.find(v => v.email === user?.email);
        if (matchingVendor) {
          setVendor(matchingVendor);
        } else {
          toast.error('Your user account is not linked to any registered vendor.');
          navigate('/quotations');
          return;
        }

        // Initialize form fields for each item in the RFQ
        const defaultItems = rfqData.items.map(item => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: 0,
        }));
        setValue('items', defaultItems);
      } catch (error) {
        toast.error('Failed to load RFQ specifications.');
        navigate('/quotations');
      } finally {
        setLoading(false);
      }
    };
    loadInitData();
  }, [rfqId, user, setValue, navigate]);

  // Real-time calculation helpers
  const calculatePricing = () => {
    let subtotal = 0;
    if (watchedItems && watchedItems.length > 0) {
      watchedItems.forEach(item => {
        const price = Number(item.unitPrice) || 0;
        subtotal += item.quantity * price;
      });
    }
    const tax = subtotal * 0.1; // 10% tax rate
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculatePricing();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // Structure the items payload with totals
      const itemsPayload = data.items.map(item => ({
        ...item,
        total: item.quantity * Number(item.unitPrice),
      }));

      const payload = {
        rfqId: rfq.id,
        rfqNumber: rfq.rfqNumber,
        vendorId: vendor.id,
        vendorName: vendor.name,
        items: itemsPayload,
        subtotal,
        tax,
        totalAmount: total,
        deliveryDays: Number(data.deliveryDays),
        validUntil: data.validUntil,
        notes: data.notes || '',
      };

      await axios.post('/quotations', payload);
      toast.success('Your quotation has been submitted successfully!');
      navigate('/quotations');
    } catch (e) {
      toast.error('Failed to submit proposal.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 animate-pulse">
        <p className="text-[#9CA3AF]">Loading quotation form layout...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate(`/rfq/${rfqId}`)}>
          Back
        </Button>
        <div>
          <h2 className="text-xl font-display font-extrabold text-white">Submit Quotation Proposal</h2>
          <p className="text-sm text-[#9CA3AF] mt-0.5">Bidding on: <span className="text-white font-bold">{rfq?.rfqNumber} · {rfq?.title}</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pricing form items */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Card title="Quotation Line Items Pricing">
            <div className="flex flex-col gap-4">
              {fields.map((item, index) => (
                <div key={item.id} className="p-4 rounded-xl bg-[#0A0F1E] border border-[#1F2937] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-white">{item.description}</h4>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">Quantity: {item.quantity} {item.unit}</p>
                  </div>
                  
                  {/* Unit price input */}
                  <div className="w-full md:w-48">
                    <Input
                      type="number"
                      placeholder="Unit Price ($)"
                      name={`items.${index}.unitPrice`}
                      icon={DollarSign}
                      error={errors.items?.[index]?.unitPrice}
                      register={register(`items.${index}.unitPrice`)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Additional Bidding Terms">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Delivery Lead Time (Days)"
                name="deliveryDays"
                type="number"
                placeholder="10"
                error={errors.deliveryDays}
                register={register('deliveryDays')}
              />

              <Input
                label="Quote Validity Date"
                name="validUntil"
                type="date"
                icon={Calendar}
                error={errors.validUntil}
                register={register('validUntil')}
              />
            </div>

            <div className="flex flex-col gap-1.5 mt-4">
              <label htmlFor="notes" className="text-sm font-medium text-[#9CA3AF]">
                Cover Letter / Supplier Notes
              </label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Enter any additional warranties, discounts, or notes..."
                className="w-full bg-[#111827] text-[#F9FAFB] rounded-lg border border-[#1F2937] text-sm py-2.5 px-4 outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1]"
                {...register('notes')}
              />
            </div>
          </Card>
        </div>

        {/* Right Column: Pricing summary */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card title="Pricing Summary">
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex items-center justify-between text-[#9CA3AF]">
                <span>Bidding Company</span>
                <span className="font-semibold text-white">{vendor?.name}</span>
              </div>
              <div className="h-px bg-[#1F2937] my-1" />
              
              <div className="flex items-center justify-between text-[#9CA3AF]">
                <span>Subtotal</span>
                <span className="font-semibold text-white">{formatCurrency(subtotal)}</span>
              </div>
              
              <div className="flex items-center justify-between text-[#9CA3AF]">
                <span>Taxes & Duties (10%)</span>
                <span className="font-semibold text-white">{formatCurrency(tax)}</span>
              </div>

              <div className="h-px bg-[#1F2937] my-1" />

              <div className="flex items-center justify-between text-base">
                <span className="font-bold text-white">Grand Total</span>
                <span className="font-extrabold text-[#6366F1] text-lg">{formatCurrency(total)}</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              icon={Send}
              loading={submitting}
              className="w-full mt-6 py-2.5 rounded-lg"
            >
              Submit Quotation
            </Button>
          </Card>
        </div>
      </form>
    </div>
  );
}

export default QuotationSubmitPage;
