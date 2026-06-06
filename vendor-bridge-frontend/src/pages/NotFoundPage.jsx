import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center p-6 text-center font-body">
      <div className="max-w-md flex flex-col items-center gap-6 p-8 rounded-2xl border border-[#1F2937] bg-[#111827] shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-[#EF4444]/10 blur-3xl" />
        
        {/* Logo */}
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-[#EF4444] z-10">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="z-10">
          <h1 className="font-display text-4xl font-extrabold text-white">404</h1>
          <h2 className="text-lg font-bold text-white mt-2">Page Not Found</h2>
          <p className="text-sm text-[#9CA3AF] mt-3 leading-relaxed">
            The link you followed may be broken, or the page may have been removed. Let's get you back on track.
          </p>
        </div>

        <Button
          variant="primary"
          icon={ArrowLeft}
          onClick={() => navigate('/')}
          className="w-full mt-2 rounded-lg"
        >
          Back to Safety
        </Button>
      </div>
    </div>
  );
}

export default NotFoundPage;
