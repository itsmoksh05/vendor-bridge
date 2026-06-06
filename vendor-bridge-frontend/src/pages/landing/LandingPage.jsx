import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import landing components
import { Navbar } from '../../components/landing/Navbar';
import { Hero } from '../../components/landing/Hero';
import { Features } from '../../components/landing/Features';
import { HowItWorks } from '../../components/landing/HowItWorks';
import { Roles } from '../../components/landing/Roles';
import { CTA } from '../../components/landing/CTA';
import { Footer } from '../../components/landing/Footer';

const statsData = [
  { value: '500+', label: 'Vendors Onboarded' },
  { value: '98%', label: 'Approval Rate' },
  { value: '3x', label: 'Faster Procurement' },
  { value: '0', label: 'Manual Errors' },
];

function Stats() {
  return (
    <section className="relative border-y border-white/10 bg-white/[0.02] py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
        {statsData.map((s) => (
          <div key={s.label} className="text-center md:text-left">
            <p className="font-display text-4xl font-bold text-gradient md:text-5xl">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function LandingPage() {
  const navigate = useNavigate();

  // Attach dynamic routing to landing page buttons without modifying pre-built components
  useEffect(() => {
    const handleLandingClicks = (e) => {
      const targetText = e.target.textContent?.trim();
      
      if (targetText === 'Login') {
        e.preventDefault();
        navigate('/login');
      } else if (
        targetText === 'Request Demo' || 
        targetText === 'Get Started Free' || 
        targetText === 'Sign up'
      ) {
        e.preventDefault();
        navigate('/signup');
      }
    };

    document.addEventListener('click', handleLandingClicks);
    return () => {
      document.removeEventListener('click', handleLandingClicks);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Roles />
      <Stats />
      <CTA />
      <Footer />
    </div>
  );
}

export default LandingPage;
