import Navbar from './components/landing/Navbar.jsx'
import Hero from './components/landing/Hero.jsx'
import Stats from './components/landing/Stats.jsx'
import Features from './components/landing/Features.jsx'
import HowItWorks from './components/landing/HowItWorks.jsx'
import Roles from './components/landing/Roles.jsx'
import CTA from './components/landing/CTA.jsx'
import Footer from './components/landing/Footer.jsx'

export default function App() {
  return (
    <main className="bg-[#0A0F1E] text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Roles />
      <CTA />
      <Footer />
    </main>
  )
}
