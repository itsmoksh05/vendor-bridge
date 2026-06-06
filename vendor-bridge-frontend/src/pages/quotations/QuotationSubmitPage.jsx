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
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-3xl font-bold text-white tracking-tight">Submit Quotations</h2>
        <p className="text-sm text-[#9CA3AF] mt-0.5">
          RFQ: {rfq?.title || 'Laptop Purchase'} — {rfq?.rfqNumber || 'RFQ-2026-001'} — deadline: {rfq ? formatDate(rfq.deadline) : '15 June 2026'}
        </p>
      </div>

      {/* Warning banner */}
      <div className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-xl p-4 text-[#10B981] text-xs md:text-sm font-medium">
        Please submit your best price and timeline details.
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <Card className="bg-[#111827] border border-white/5">
          {/* Custom Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-[#9CA3AF]">
                  <th className="p-3 font-semibold">Item Name</th>
                  <th className="p-3 font-semibold">Required Qty</th>
                  <th className="p-3 font-semibold w-40">Unit Price ($)</th>
                  <th className="p-3 font-semibold text-right">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((item, index) => {
                  const qty = Number(item.quantity) || 0;
                  const unitPrice = Number(watchedItems?.[index]?.unitPrice) || 0;
                  const lineTotal = qty * unitPrice;

                  return (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="p-3 text-white font-medium">{item.description}</td>
                      <td className="p-3 text-white">{qty} {item.unit || 'pcs'}</td>
                      <td className="p-3">
                        <input
                          type="number"
                          placeholder="0.00"
                          className={`w-full bg-[#0A0F1E] text-white border rounded-lg py-1.5 px-3 text-xs outline-none focus:ring-1 focus:ring-[#6366F1] ${
                            errors.items?.[index]?.unitPrice ? 'border-red-500' : 'border-white/10'
                          }`}
                          {...register(`items.${index}.unitPrice`)}
                        />
                      </td>
                      <td className="p-3 text-right text-white font-semibold">
                        {formatCurrency(lineTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Bidding terms row */}
        <Card className="bg-[#111827] border border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <Input
                label="Delivery Timeline (weeks)"
                name="deliveryDays"
                type="number"
                placeholder="2"
                error={errors.deliveryDays}
                register={register('deliveryDays')}
              />

              <Input
                label="Valid Until"
                name="validUntil"
                type="date"
                error={errors.validUntil}
                register={register('validUntil')}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="notes" className="text-sm font-medium text-[#9CA3AF]">
                Additional Comments
              </label>
              <textarea
                id="notes"
                rows={4}
                placeholder="Specify any remarks or comments..."
                className="w-full bg-[#0A0F1E] text-[#F9FAFB] rounded-lg border border-white/10 text-sm py-2.5 px-4 outline-none focus:ring-1 focus:ring-[#6366F1]"
                {...register('notes')}
              />
            </div>
          </div>
        </Card>

        {/* Grand Total panel & Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
          <div className="text-sm">
            <span className="text-[#9CA3AF]">Estimated Total (inc. 10% tax): </span>
            <span className="font-extrabold text-white text-lg ml-1">{formatCurrency(total)}</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate(`/rfq/${rfqId}`)}
              className="border border-white/10 text-[#9CA3AF] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="success"
              loading={submitting}
              className="bg-[#10B981] hover:bg-emerald-600 text-white rounded-lg px-6 font-bold"
            >
              Submit Quotation
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default QuotationSubmitPage;
