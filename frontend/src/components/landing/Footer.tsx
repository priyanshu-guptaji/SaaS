'use client';

import { Mail } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-20 border-t border-border bg-slate-50 dark:bg-slate-950/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="flex flex-col items-center md:items-start gap-4">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  Email<span className="text-primary italic">Intelligence</span>
                </span>
              </Link>
              <p className="text-sm text-muted-foreground font-medium max-w-xs text-center md:text-left">
                The smart intelligence layer for SMB email operations. Built to convert every inbox interaction into growth.
              </p>
           </div>

           <nav className="flex flex-wrap justify-center gap-10 text-sm font-bold text-muted-foreground uppercase tracking-widest">
             <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
             <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
             <Link href="#docs" className="hover:text-primary transition-colors">Documentation</Link>
             <Link href="#support" className="hover:text-primary transition-colors">Help Center</Link>
           </nav>

           <div className="flex flex-col items-center md:items-end gap-3 text-xs font-bold text-muted-foreground">
              <div className="flex gap-4">
                 <Link href="#" className="hover:text-primary">Twitter</Link>
                 <Link href="#" className="hover:text-primary">LinkedIn</Link>
              </div>
              <p>&copy; 2026 AI Email Intelligence Platform. All rights reserved.</p>
           </div>
        </div>
      </div>
    </footer>
  );
}
