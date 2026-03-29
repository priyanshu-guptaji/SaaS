'use client';

import { motion } from 'framer-motion';
import { Mail, CheckCircle2, Zap, ArrowRight, Play, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-40 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs md:text-sm font-semibold mb-8"
          >
            <Star className="w-4 h-4 fill-primary" />
            <span>The Intelligence Layer for Your Inbox</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
          >
            Convert Emails into <span className="gradient-text">Revenue</span> with AI Intelligence
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Never miss a lead or customer inquiry. Our AI automatically parses, categorizes, and responds to emails so you can focus on growing your business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link href="/signup" className="btn-primary flex items-center gap-2 text-lg px-8 py-4 w-full sm:w-auto">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#demo" className="px-8 py-4 text-lg font-medium hover:text-primary transition-colors flex items-center gap-2 w-full sm:w-auto justify-center group">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                <Play className="w-4 h-4 text-primary fill-primary" />
              </div>
              Watch Demo
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
          >
             <span className="text-sm font-medium tracking-widest uppercase">Trusted by 500+ E-commerce Teams:</span>
             {/* Mock Partner Logos */}
             <div className="flex gap-10 items-center">
                 <div className="text-xl font-bold flex items-center gap-1"><Zap className="w-5 h-5" />ShopBoost</div>
                 <div className="text-xl font-bold flex items-center gap-1"><CheckCircle2 className="w-5 h-5 text-green-500" />E-Comm Flow</div>
                 <div className="text-xl font-bold italic">GlobalShip</div>
             </div>
          </motion.div>
        </div>

        {/* Dashboard Preview Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 relative max-w-5xl mx-auto rounded-3xl border border-border bg-white/50 dark:bg-slate-900/50 p-2 shadow-2xl backdrop-blur-sm"
        >
           <div className="rounded-2xl border border-border bg-white dark:bg-slate-950 overflow-hidden shadow-inner">
             {/* Simple Dashboard Mockup UI */}
             <div className="h-10 border-b border-border bg-muted/30 px-4 flex items-center gap-2">
                 <div className="flex gap-1.5">
                     <div className="w-3 h-3 rounded-full bg-red-400/30" />
                     <div className="w-3 h-3 rounded-full bg-amber-400/30" />
                     <div className="w-3 h-3 rounded-full bg-emerald-400/30" />
                 </div>
                 <div className="flex-1 text-center text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Analytics Dashboard — Overview</div>
             </div>
             <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                     { label: 'Emails Processed', value: '1,248', desc: '+12% this week', color: 'indigo' },
                     { label: 'AI Success Rate', value: '98.4%', desc: 'Highly confident', color: 'emerald' },
                     { label: 'Time Saved', value: '24.5h', desc: 'Focus on growth', color: 'amber' },
                 ].map((stat, i) => (
                     <div key={i} className="p-6 rounded-2xl border border-border bg-card/50 hover:border-primary/30 transition-colors">
                         <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                         <div className="text-3xl font-bold tracking-tight mb-2 underline decoration-primary/20 underline-offset-4">{stat.value}</div>
                         <div className={`text-xs font-medium text-${stat.color}-500 flex items-center gap-1`}>
                             <Zap className="w-3 h-3" /> {stat.desc}
                         </div>
                     </div>
                 ))}
             </div>
             <div className="px-8 pb-8">
                 <div className="h-40 rounded-2xl border border-border bg-muted/20 flex items-center justify-center">
                    <div className="text-muted-foreground font-medium flex items-center gap-3">
                         <Mail className="w-6 h-6 animate-bounce" />
                         Real-time Email Intelligence Processing...
                    </div>
                 </div>
             </div>
           </div>
        </motion.div>
      </div>
    </section>
  );
}
