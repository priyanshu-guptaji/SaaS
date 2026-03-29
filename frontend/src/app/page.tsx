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

// Simple Footer Component
function Footer() {
  return (
    <footer className="py-20 border-t border-border bg-muted/20">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-primary/20 p-2 rounded-lg">
             <div className="w-5 h-5 bg-primary rounded-sm" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Email<span className="text-primary italic">Intelligence</span>
          </span>
        </div>
        <p className="text-muted-foreground mb-8">&copy; 2026 AI Email Intelligence Platform. All rights reserved.</p>
        <div className="flex justify-center gap-8 text-sm font-medium text-muted-foreground uppercase tracking-widest">
           <a href="#" className="hover:text-primary">Terms</a>
           <a href="#" className="hover:text-primary">Privacy</a>
           <a href="#" className="hover:text-primary">Contact</a>
        </div>
      </div>
    </footer>
  );
}
