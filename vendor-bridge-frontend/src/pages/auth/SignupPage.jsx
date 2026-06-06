import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const signupSchema = z
  .object({
    firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
    lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    role: z.enum(['PROCUREMENT_OFFICER', 'VENDOR', 'MANAGER'], {
      required_error: 'Please select an ERP role',
    }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'PROCUREMENT_OFFICER',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { confirmPassword, firstName, lastName, ...registerData } = data;
      const payload = {
        ...registerData,
        name: `${firstName} ${lastName}`.trim(),
      };
      await axios.post('/auth/register', payload);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl glass-strong rounded-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl border border-indigo-300/20 flex items-center justify-center text-white mb-4 bg-[#6366F1]/15">
            <span className="text-xl font-semibold">VB</span>
          </div>
          <h1 className="font-display text-2xl font-semibold text-white tracking-tight text-center">
            Create your VendorBridge account
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1 text-center">
            Create your new ERP account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              placeholder="First Name"
              error={errors.firstName}
              register={register('firstName', { required: 'First name is required' })}
            />
            <Input
              label="Last Name"
              name="lastName"
              placeholder="Last Name"
              error={errors.lastName}
              register={register('lastName', { required: 'Last name is required' })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="name@company.com"
              error={errors.email}
              register={register('email', { required: 'Email address is required' })}
            />
            <Input
              label="Phone Number"
              name="phone"
              placeholder="+1 555-0100"
              error={errors.phone}
              register={register('phone')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Address, State"
              name="addressState"
              placeholder="123 Tech Way, CA"
              error={errors.addressState}
              register={register('addressState')}
            />
            <Input
              label="Country"
              name="country"
              placeholder="United States"
              error={errors.country}
              register={register('country')}
            />
          </div>

          {/* Custom Role Dropdown */}
          <div className="flex flex-col gap-1.5 w-full">
            <label htmlFor="role" className="text-sm font-medium text-[#9CA3AF]">
              Registering As (Role)
            </label>
            <select
              id="role"
              className="w-full bg-[#111827] text-[#F9FAFB] rounded-lg border border-[#1F2937] text-sm py-2.5 px-4 outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1]"
              {...register('role')}
            >
              <option value="PROCUREMENT_OFFICER">Procurement Officer (Buyer)</option>
              <option value="VENDOR">Vendor (Supplier)</option>
              <option value="MANAGER">Manager (Approver)</option>
            </select>
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                error={errors.password}
                register={register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-[#9CA3AF] hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repeat password"
                error={errors.confirmPassword}
                register={register('confirmPassword', { required: 'Please confirm password' })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-[38px] text-[#9CA3AF] hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-1">
            <label htmlFor="additionalInfo" className="text-sm font-medium text-[#9CA3AF]">
              Additional Information
            </label>
            <textarea
              id="additionalInfo"
              rows={3}
              placeholder="Additional Information..."
              className="w-full bg-[#111827] text-[#F9FAFB] rounded-lg border border-[#1F2937] text-sm py-2.5 px-4 outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1]"
              {...register('additionalInfo')}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full mt-4 py-2.5 rounded-lg"
          >
            Register
          </Button>
        </form>

        <p className="text-sm text-[#9CA3AF] mt-5 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-[#818CF8] hover:text-white font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
