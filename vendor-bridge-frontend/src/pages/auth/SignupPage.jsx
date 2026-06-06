import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const signupSchema = z
  .object({
    name: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
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
      name: '',
      email: '',
      role: 'PROCUREMENT_OFFICER',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Exclude confirmPassword from request payload
      const { confirmPassword, ...registerData } = data;
      await axios.post('/auth/register', registerData);
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
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center p-4 md:p-8 font-body">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-[#1F2937] overflow-hidden bg-[#111827] shadow-2xl">
        {/* Left Side: Brand Panel */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-10 bg-gradient-to-br from-[#6366F1]/20 via-[#4F46E5]/10 to-[#0A0F1E] border-r border-[#1F2937] relative">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_70%)]" />

          {/* Logo */}
          <div className="flex items-center gap-3">
            <svg className="w-9 h-9 text-[#6366F1] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" className="fill-[#6366F1]/10" />
              <circle cx="12" cy="12" r="3" className="fill-[#6366F1]" />
            </svg>
            <span className="font-display font-bold text-xl text-white tracking-wider">
              Vendor<span className="text-[#6366F1]">Bridge</span>
            </span>
          </div>

          {/* Core messages */}
          <div className="my-auto py-12 flex flex-col gap-6 relative z-10">
            <h2 className="font-display text-3xl font-extrabold text-white leading-tight">
              Access the next generation <span className="text-gradient">procurement platform</span>.
            </h2>
            <p className="text-sm text-[#9CA3AF]">
              Connect with buyers, submit proposals, track workflows, and generate electronic invoicing in seconds.
            </p>

            <div className="mt-4 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
              <h4 className="text-sm font-semibold text-white mb-1">Choosing your role:</h4>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Choose **Procurement Officer** to distribute RFQs, **Vendor** to quote on active requests, or **Manager** to authorize workflows.
              </p>
            </div>
          </div>

          <div className="text-xs text-[#9CA3AF]">
            © 2026 VendorBridge ERP. All rights reserved.
          </div>
        </div>

        {/* Right Side: Register Form Card */}
        <div className="col-span-1 lg:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-[#111827]">
          <div className="max-w-md w-full mx-auto">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6366F1]/10 text-xs font-semibold text-[#6366F1] border border-[#6366F1]/20">
                <Sparkles className="h-3 w-3" />
                Join VendorBridge
              </span>
              <h1 className="font-display text-3xl font-bold text-white mt-4">
                Create account
              </h1>
              <p className="text-sm text-[#9CA3AF] mt-1">
                Get started with your collaborative ERP workflow workspace
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
              <Input
                label="Full Name"
                name="name"
                placeholder="John Doe"
                icon={User}
                error={errors.name}
                register={register('name')}
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="name@company.com"
                icon={Mail}
                error={errors.email}
                register={register('email')}
              />

              {/* Custom Role Dropdown */}
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="role" className="text-sm font-medium text-[#9CA3AF]">
                  Registering As
                </label>
                <select
                  id="role"
                  className={`w-full bg-[#111827] text-[#F9FAFB] rounded-lg border border-[#1F2937] text-sm py-2.5 px-4 outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] ${
                    errors.role ? 'border-[#EF4444]' : 'border-[#1F2937]'
                  }`}
                  {...register('role')}
                >
                  <option value="PROCUREMENT_OFFICER">Procurement Officer (Buyer)</option>
                  <option value="VENDOR">Vendor (Supplier)</option>
                  <option value="MANAGER">Manager (Approver)</option>
                </select>
                {errors.role && (
                  <p className="text-xs text-[#EF4444] mt-0.5 font-medium">{errors.role.message}</p>
                )}
              </div>

              {/* Password Fields */}
              <div className="relative">
                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  icon={Lock}
                  error={errors.password}
                  register={register('password')}
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
                  placeholder="Repeat your password"
                  icon={Lock}
                  error={errors.confirmPassword}
                  register={register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[38px] text-[#9CA3AF] hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full mt-4 py-2.5 rounded-lg"
              >
                Register Account
              </Button>
            </form>

            <p className="text-sm text-[#9CA3AF] mt-6 text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-[#6366F1] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
