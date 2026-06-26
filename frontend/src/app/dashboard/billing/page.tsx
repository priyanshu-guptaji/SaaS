'use client';

import React from 'react';
import { 
  Check, 
  CreditCard, 
  Zap, 
  Sparkles, 
  HelpCircle, 
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const tiers = [
  {
    name: 'FREE',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for small side projects and workspace trial.',
    features: [
      '50 AI-analyzed emails / mo',
      '1 active integration connector',
      'Basic intent & sentiment detection',
      'Default template smart replies',
      'Email support (24h response)'
    ],
    buttonText: 'Current Plan',
    color: 'border-border bg-white text-slate-800'
  },
  {
    name: 'STARTER',
    price: '$29',
    period: 'per month',
    desc: 'Great for growing local businesses and indie developers.',
    features: [
      '1,000 AI-analyzed emails / mo',
      '2 active integration connectors',
      'Full intent & sentiment detection',
      'OpenAI Custom smart replies',
      'Up to 3 active workflows',
      'Priority email support'
    ],
    buttonText: 'Upgrade to Starter',
    color: 'border-border bg-white text-slate-800'
  },
  {
    name: 'PRO',
    price: '$79',
    period: 'per month',
    desc: 'The best option for professional e-commerce operations.',
    features: [
      '10,000 AI-analyzed emails / mo',
      'Unlimited integration connectors',
      '99.9% Confidence AI classifications',
      'Advanced contextual auto-replies',
      'Unlimited multi-step workflows',
      'Slack & webhook notification actions',
      'Dedicated analytics dashboard'
    ],
    buttonText: 'Upgrade to Pro',
    color: 'border-primary/50 ring-2 ring-primary/10 bg-white dark:bg-slate-950 text-slate-900',
    popular: true
  },
  {
    name: 'BUSINESS',
    price: '$249',
    period: 'per month',
    desc: 'Enterprise-grade intelligence for high-volume support centers.',
    features: [
      'Unlimited analyzed emails / mo',
      'Dedicated custom AI model tuning',
      'SLA tracking & monitoring features',
      'HubSpot & Salesforce automated sync',
      'Custom white-label branding',
      '24/7 dedicated support representative',
      '99.9% uptime SLA guarantee'
    ],
    buttonText: 'Contact Enterprise',
    color: 'border-border bg-slate-900 dark:bg-slate-900 text-white'
  }
];

export default function BillingPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current tier details
  const { data: settingsRes, isLoading } = useQuery<any>({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await apiService.getSettings();
      return data;
    }
  });

  const tenant = settingsRes?.tenant || {};
  const currentTier = tenant.tier || 'FREE';

  // Upgrade Mutation
  const upgradeMutation = useMutation({
    mutationFn: (tier: string) => apiService.upgradeBilling(tier),
    onSuccess: (data: any) => {
      toast({
        title: "Subscription Updated",
        description: data.data.message || `Successfully updated tier to ${data.data.tenant?.tier}`,
      });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (err: any) => {
      toast({
        title: "Upgrade Failed",
        description: err.response?.data?.error || "Failed to upgrade subscription plan.",
        variant: "destructive",
      });
    }
  });

  const handleUpgrade = (tierName: string) => {
    if (tierName === currentTier) return;
    
    if (tierName === 'BUSINESS') {
      alert("Please contact our sales team at enterprise@ecommflow.com to set up custom SLA agreements.");
      return;
    }

    upgradeMutation.mutate(tierName);
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-bold">Loading Billing Operations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950/50 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight underline decoration-primary/20 underline-offset-8">Billing & Subscriptions</h1>
          <p className="text-muted-foreground mt-1.5 font-medium">Select a plan to access custom AI nodes and sync integrations.</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-950 px-4 py-2 rounded-xl border border-border shadow-sm">
          <CreditCard className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Plan:</span>
          <span className="text-xs font-extrabold text-primary px-2.5 py-0.5 rounded-lg bg-primary/10 border border-primary/20">{currentTier}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {tiers.map((tier) => {
          const isActive = tier.name === currentTier;
          const isButtonDisabled = isActive || upgradeMutation.isPending;

          return (
            <div 
              key={tier.name}
              className={cn(
                "p-8 rounded-[2rem] border transition-all flex flex-col justify-between group overflow-hidden relative",
                tier.color,
                tier.popular ? "shadow-2xl shadow-indigo-500/10" : "shadow-sm hover:shadow-xl hover:shadow-indigo-500/5"
              )}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-bl-2xl shadow-lg flex items-center gap-1.5 z-10">
                  <Sparkles className="w-3 h-3 fill-white" /> Popular
                </div>
              )}

              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground mb-1">{tier.name}</div>
                <div className="flex items-baseline gap-1.5 mb-4">
                  <span className="text-5xl font-black tracking-tight">{tier.price}</span>
                  <span className="text-xs font-semibold text-muted-foreground">/{tier.period}</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium mb-8 leading-relaxed">
                  {tier.desc}
                </p>

                <div className="w-full h-px bg-border/60 mb-8" />

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-xs text-muted-foreground font-medium leading-normal">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => handleUpgrade(tier.name)}
                disabled={isButtonDisabled}
                className={cn(
                  "w-full py-4 rounded-2xl text-xs font-extrabold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2",
                  isActive 
                    ? "bg-slate-100 dark:bg-slate-800 text-muted-foreground cursor-default border border-transparent"
                    : tier.name === 'BUSINESS'
                      ? "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-lg active:scale-95"
                      : tier.popular
                        ? "bg-primary text-white shadow-xl shadow-indigo-500/25 hover:scale-105 active:scale-95"
                        : "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-primary/30 active:scale-95"
                )}
              >
                {isActive ? "Active Plan" : upgradeMutation.isPending ? "Upgrading..." : tier.buttonText}
              </button>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="p-8 rounded-[2.5rem] bg-indigo-50/50 border border-indigo-100 dark:bg-slate-950/20 dark:border-slate-800 flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-extrabold text-lg mb-1 tracking-tight">Real-time Usage Tracker</h4>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">Currently used <span className="font-bold text-primary">3</span> of 50 free email analyses for this cycle.</p>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-amber-50/50 border border-amber-100 dark:bg-slate-950/20 dark:border-slate-800 flex items-center gap-6 md:col-span-2 justify-between">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 border border-amber-500/20 shrink-0">
              <Zap className="w-7 h-7 fill-amber-500" />
            </div>
            <div>
              <h4 className="font-extrabold text-lg mb-1 tracking-tight">Need a custom enterprise integration?</h4>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">Unlock high-volume webhooks, custom endpoints, and dedicated team configurations.</p>
            </div>
          </div>
          <button className="px-6 py-3 rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
            Talk to Sales <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
