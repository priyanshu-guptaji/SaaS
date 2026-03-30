'use client';

import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  Mail, 
  MessageSquare, 
  Grid, 
  CheckCircle2, 
  Plus, 
  ChevronRight, 
  ExternalLink,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiService } from '@/services/api';

const colorMap: Record<string, { bg: string; text: string }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
};

const apps = [
  { 
    name: 'Gmail', 
    category: 'Communication', 
    icon: Mail, 
    color: 'emerald', 
    connected: false, // Default to false for demo connecting
    desc: 'Reading and responding to customer emails.'
  },
  { 
    name: 'Shopify', 
    category: 'E-commerce', 
    icon: ShoppingBag, 
    color: 'indigo', 
    connected: true, 
    desc: 'Sync order status and customer purchase history.'
  },
  { 
    name: 'HubSpot', 
    category: 'CRM', 
    icon: Grid, 
    color: 'orange', 
    connected: false, 
    desc: 'Automatically sync leads and engagement data.'
  },
  { 
    name: 'Slack', 
    category: 'Notifications', 
    icon: MessageSquare, 
    color: 'emerald', 
    connected: false, 
    desc: 'Real-time alerts for high-priority emails.'
  },
  { 
    name: 'Zoho CRM', 
    category: 'CRM', 
    icon: Grid, 
    color: 'blue', 
    connected: false, 
    desc: 'Sync customer tickets and resolution performance.'
  },
  { 
    name: 'WooCommerce', 
    category: 'E-commerce', 
    icon: ShoppingBag, 
    color: 'purple', 
    connected: false, 
    desc: 'Extract shipping and refund details from orders.'
  }
];

export default function IntegrationsPage() {
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  const handleConnect = async (appName: string) => {
    if (appName === 'Gmail') {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user) return alert('Please sign in first');
      
      const { data } = await apiService.getGoogleAuthUrl(user.tenantId);
      setRedirectUrl(data.url);
    } else {
      alert(`Integration with ${appName} is coming soon in the Professional tier!`);
    }
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950/50 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
          <div>
              <h1 className="text-3xl font-extrabold tracking-tight underline decoration-primary/20 underline-offset-8">Integrations Marketplace</h1>
              <p className="text-muted-foreground mt-1.5 font-medium">Connect your favorite business tools to boost AI intelligence.</p>
          </div>
          <button className="px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-border text-sm font-bold flex items-center gap-2 hover:border-primary/30 transition-all">
              Request Connector <ExternalLink className="w-4 h-4" />
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {apps.map((app, i) => (
             <div key={i} className={cn(
               "p-8 rounded-[2rem] border bg-white dark:bg-slate-950 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group overflow-hidden relative",
               app.connected ? "border-primary/30" : "border-border"
             )}>
                 {app.connected && (
                    <div className="absolute -top-1 -right-1 bg-emerald-500 text-white p-2 rounded-bl-3xl shadow-lg">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                 )}
                 
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", colorMap[app.color]?.bg, colorMap[app.color]?.text)}>
                      <app.icon className="w-7 h-7" />
                  </div>
                 
                 <div className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">{app.category}</div>
                 <h3 className="text-2xl font-extrabold tracking-tight mb-3 group-hover:text-primary transition-colors">{app.name}</h3>
                 <p className="text-sm text-muted-foreground font-medium mb-8 leading-relaxed">
                     {app.desc}
                 </p>

                 <div className="flex items-center justify-between pt-6 border-t border-border/60">
                     <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", app.connected ? "bg-emerald-500" : "bg-slate-300")} />
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{app.connected ? 'Connected' : 'Disconnected'}</span>
                     </div>
                     <button 
                        onClick={() => handleConnect(app.name)}
                        className={cn(
                        "px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
                        app.connected ? "bg-muted text-muted-foreground hover:bg-muted/80" : "bg-primary text-white shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95"
                     )}>
                        {app.connected ? 'Configuration' : <><Plus className="w-4 h-4" /> Connect App</>}
                     </button>
                 </div>
             </div>
          ))}
      </div>

      <div className="mt-12 p-10 rounded-[2.5rem] bg-[var(--gradient-primary)] text-white relative overflow-hidden shadow-2xl">
          <Zap className="absolute -right-8 -bottom-8 w-60 h-60 text-white/10 rotate-12" />
          <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl font-extrabold tracking-tight mb-4">Unlock Automated Sales Syncing</h2>
              <p className="text-white/80 font-medium mb-8 leading-relaxed">
                  Join 1,000+ e-commerce businesses that use our HubSpot and Salesforce connectors to automatically update customer records from inbox intelligence.
              </p>
              <div className="flex items-center gap-4">
                  <button className="px-8 py-3.5 bg-white text-primary rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-xl shadow-black/10">Explore Enterprise Partners</button>
                  <button className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-[0.2em] px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                      Documentation <ChevronRight className="w-4 h-4" />
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
}
