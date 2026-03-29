'use client';

import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Email<span className="text-primary italic">Intelligence</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-primary transition-colors">How it Works</Link>
          <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
          <Link href="#contact" className="hover:text-primary transition-colors">Resources</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
            Sign In
          </Link>
          <Link href="/signup" className="btn-primary flex items-center gap-2 !px-5 !py-2.5">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
