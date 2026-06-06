import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
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

  const handleQuickLogin = (email, password) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
    handleSubmit(onSubmit)();
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md glass-strong rounded-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl border border-indigo-300/20 flex items-center justify-center text-white mb-4 bg-[#6366F1]/15">
            <span className="text-xl font-semibold">VB</span>
          </div>
          <h1 className="font-display text-2xl font-semibold text-white tracking-tight text-center">
            Welcome back
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1 text-center">
            Sign in to the procurement portal
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="name@company.com"
            error={errors.email}
            register={register('email')}
          />

          <div className="relative">
            <Input
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              error={errors.password}
              register={register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-[#9CA3AF] hover:text-white"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full mt-2 py-2.5"
          >
            Log in
          </Button>
        </form>

        <p className="text-sm text-[#9CA3AF] mt-5 text-center">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-[#818CF8] hover:text-white font-medium">
            Sign up
          </Link>
        </p>

        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9CA3AF] mb-3 flex items-center gap-1.5 justify-center">
            <ShieldCheck className="h-4 w-4 text-[#818CF8]" />
            Judge Quick Login
          </h3>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {[
              ['Admin', 'admin@vendorbridge.com', 'admin123'],
              ['Proc. Officer', 'procurement@vendorbridge.com', 'procurement123'],
              ['Vendor', 'vendor@vendorbridge.com', 'vendor123'],
              ['Manager', 'manager@vendorbridge.com', 'manager123'],
            ].map(([label, email, password]) => (
              <button
                key={email}
                type="button"
                onClick={() => handleQuickLogin(email, password)}
                className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#6366F1] transition-all hover:bg-white/[0.08]"
              >
                <span>{label}</span>
                <ArrowRight className="h-3 w-3 text-[#9CA3AF]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
