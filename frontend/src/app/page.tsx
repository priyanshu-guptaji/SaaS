import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background selection:bg-primary/30">
      <Header />
      <Hero />
      <Features />
      {/* Additional sections like How It Works, Pricing, etc. could go here */}
      <Footer />
    </main>
  );
}
