import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Sparkles, FileText, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import useAuthStore from '../../store/authStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post('/auth/login', data);
      const { user, token } = response.data;
      
      login(user, token);
      toast.success(`Welcome back, ${user.name}!`);

      // Role-based routing redirection
      if (user.role === 'ADMIN' || user.role === 'PROCUREMENT_OFFICER') {
        navigate('/dashboard');
      } else if (user.role === 'VENDOR') {
        navigate('/quotations');
      } else if (user.role === 'MANAGER') {
        navigate('/approvals');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo account fill-in handler
  const handleQuickLogin = (email, password) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
    handleSubmit(onSubmit)();
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
              Digitizing the entire <span className="text-gradient">procurement cycle</span> in one dashboard.
            </h2>
            <p className="text-sm text-[#9CA3AF]">
              Say goodbye to fragmented email threads and manual spreadsheets. Accelerate workflows from RFQ to final billing.
            </p>
            
            {/* Bullets */}
            <ul className="flex flex-col gap-4 text-sm text-[#F9FAFB] mt-4">
              <li className="flex items-center gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#10B981]/20 text-[#10B981]">
                  ✓
                </span>
                Centralized RFQ distribution
              </li>
              <li className="flex items-center gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#10B981]/20 text-[#10B981]">
                  ✓
                </span>
                Automated multi-quote comparisons
              </li>
              <li className="flex items-center gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#10B981]/20 text-[#10B981]">
                  ✓
                </span>
                Role-based approval hierarchies
              </li>
            </ul>
          </div>

          {/* Footer branding */}
          <div className="text-xs text-[#9CA3AF]">
            © 2026 VendorBridge ERP. All rights reserved.
          </div>
        </div>

        {/* Right Side: Login Form Card */}
        <div className="col-span-1 lg:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-[#111827]">
          <div className="max-w-md w-full mx-auto">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6366F1]/10 text-xs font-semibold text-[#6366F1] border border-[#6366F1]/20">
                <Sparkles className="h-3 w-3" />
                Hackathon Mode Active
              </span>
              <h1 className="font-display text-3xl font-bold text-white mt-4">
                Welcome back
              </h1>
              <p className="text-sm text-[#9CA3AF] mt-1">
                Enter your credentials to access the VendorBridge portal
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-5">
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="name@company.com"
                icon={Mail}
                error={errors.email}
                register={register('email')}
              />

              <div className="relative">
                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
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

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-[#9CA3AF] cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-[#1F2937] bg-[#0A0F1E] text-[#6366F1] focus:ring-[#6366F1] h-4 w-4"
                  />
                  <span>Remember me</span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    toast('Forgot password mock triggered!', { icon: '🔑' });
                  }}
                  className="text-[#6366F1] hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full mt-2 py-2.5 rounded-lg"
              >
                Sign In
              </Button>
            </form>

            <p className="text-sm text-[#9CA3AF] mt-6 text-center">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#6366F1] hover:underline font-medium">
                Sign up
              </Link>
            </p>

            {/* Quick Demo Logins Section */}
            <div className="mt-8 pt-8 border-t border-[#1F2937]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-3 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#6366F1]" />
                Judge Quick Login (No Setup Required)
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleQuickLogin('admin@vendorbridge.com', 'admin123')}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-[#1F2937] hover:border-[#6366F1] transition-all hover:bg-white/[0.08]"
                >
                  <span>Admin</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#9CA3AF]" />
                </button>
                <button
                  onClick={() => handleQuickLogin('procurement@vendorbridge.com', 'procurement123')}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-[#1F2937] hover:border-[#6366F1] transition-all hover:bg-white/[0.08]"
                >
                  <span>Procurement Officer</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#9CA3AF]" />
                </button>
                <button
                  onClick={() => handleQuickLogin('vendor@vendorbridge.com', 'vendor123')}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-[#1F2937] hover:border-[#6366F1] transition-all hover:bg-white/[0.08]"
                >
                  <span>Vendor (Acme Corp)</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#9CA3AF]" />
                </button>
                <button
                  onClick={() => handleQuickLogin('manager@vendorbridge.com', 'manager123')}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-[#1F2937] hover:border-[#6366F1] transition-all hover:bg-white/[0.08]"
                >
                  <span>Manager (Approver)</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#9CA3AF]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
