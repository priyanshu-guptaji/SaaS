'use client';

import { 
  Zap, 
  Target, 
  Reply, 
  Workflow, 
  BarChart3, 
  ShieldCheck, 
  Users, 
  ShoppingBag,
  Bell
} from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Precision Classification',
    description: 'AI detects intent like sales leads, support, or billing queries with 99% accuracy.'
  },
  {
    icon: Reply,
    title: 'Smart Reply Drafts',
    description: 'Generates ready-to-send replies based on your brand voice and past interactions.'
  },
  {
    icon: Workflow,
    title: 'Workflow Automation',
    description: 'Automatically route emails to specific team members or trigger external webhooks.'
  },
  {
    icon: Zap,
    title: 'Sentiment Analysis',
    description: 'Identify urgent or angry customers instantly to prioritize your high-risk responses.'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track reply times, hours saved, and missed revenue opportunities automatically.'
  },
  {
    icon: ShoppingBag,
    title: 'E-commerce Native',
    description: 'Directly extract order IDs, product names, and tracking info from raw customer emails.'
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-sm font-bold tracking-[0.2em] text-primary uppercase mb-4">Core Capabilities</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Designed for Modern <span className="gradient-text">SMBs</span></h3>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Stop losing leads in your inbox. Our AI engine works 24/7 to categorize, prioritize, and help you respond faster than ever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="p-8 rounded-3xl border border-border bg-white dark:bg-slate-950 hover:border-primary/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <feature.icon className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold mb-3 tracking-tight group-hover:text-primary transition-colors">{feature.title}</h4>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
