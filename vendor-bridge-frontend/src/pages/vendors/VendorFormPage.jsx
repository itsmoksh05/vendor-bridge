import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Building2, Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const vendorSchema = z.object({
  name: z.string().min(3, { message: 'Vendor name must be at least 3 characters' }),
  category: z.string().min(2, { message: 'Please specify category field' }),
  contact: z.string().min(2, { message: 'Contact person name is required' }),
  email: z.string().email({ message: 'Enter a valid contact email' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  address: z.string().min(5, { message: 'Address is required' }),
});

export function VendorFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const isEditMode = !!id;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: '',
      category: '',
      contact: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  useEffect(() => {
    if (isEditMode) {
      const loadVendor = async () => {
        try {
          setFetching(true);
          const res = await axios.get(`/vendors/${id}`);
          const vendor = res.data;
          // Populate form fields
          setValue('name', vendor.name);
          setValue('category', vendor.category);
          setValue('contact', vendor.contact);
          setValue('email', vendor.email);
          setValue('phone', vendor.phone);
          setValue('address', vendor.address || '');
        } catch (error) {
          toast.error('Failed to load vendor profile.');
          navigate('/vendors');
        } finally {
          setFetching(false);
        }
      };
      loadVendor();
    }
  }, [id, isEditMode, setValue, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEditMode) {
        await axios.put(`/vendors/${id}`, data);
        toast.success('Vendor profile updated successfully!');
      } else {
        await axios.post('/vendors', data);
        toast.success('New vendor onboarded successfully!');
      }
      navigate('/vendors');
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Failed to save vendor details.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20 animate-pulse">
        <p className="text-[#9CA3AF]">Loading vendor profile form...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('/vendors')}>
          Back
        </Button>
        <div>
          <h2 className="text-xl font-display font-extrabold text-white">
            {isEditMode ? 'Edit Vendor Profile' : 'Onboard New Vendor'}
          </h2>
          <p className="text-sm text-[#9CA3AF] mt-0.5">
            {isEditMode ? 'Update supplier information and access controls.' : 'Register a new supplier under the organization directory.'}
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Vendor Company Name"
              name="name"
              placeholder="e.g. Acme Corp"
              icon={Building2}
              error={errors.name}
              register={register('name')}
            />

            <Input
              label="Business Category"
              name="category"
              placeholder="e.g. IT Hardware, Office Supplies"
              error={errors.category}
              register={register('category')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Input
              label="Contact Person Name"
              name="contact"
              placeholder="John Doe"
              error={errors.contact}
              register={register('contact')}
            />

            <Input
              label="Contact Email"
              name="email"
              type="email"
              placeholder="contact@supplier.com"
              error={errors.email}
              register={register('email')}
            />

            <Input
              label="Contact Phone"
              name="phone"
              placeholder="+1 555-0199"
              error={errors.phone}
              register={register('phone')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="address" className="text-sm font-medium text-[#9CA3AF]">
              Physical Address
            </label>
            <textarea
              id="address"
              rows={3}
              placeholder="Enter complete office location/warehouse address"
              className={`w-full bg-[#111827] text-[#F9FAFB] rounded-lg border border-[#1F2937] text-sm py-2.5 px-4 outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] ${
                errors.address ? 'border-[#EF4444]' : 'border-[#1F2937]'
              }`}
              {...register('address')}
            />
            {errors.address && (
              <p className="text-xs text-[#EF4444] mt-0.5 font-medium">{errors.address.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 mt-4 border-t border-[#1F2937] pt-5">
            <Button variant="ghost" onClick={() => navigate('/vendors')}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Save} loading={loading}>
              Save Vendor Profile
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default VendorFormPage;
