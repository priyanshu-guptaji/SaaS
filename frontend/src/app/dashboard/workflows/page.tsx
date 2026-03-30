'use client';

import React from 'react';
import { 
  Workflow, 
  Plus, 
  Mail, 
  Zap, 
  MessageSquare,
  Globe, 
  UserPlus, 
  ChevronRight,
  MoreVertical,
  Play,
  Settings,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const workflows = [
  {
    id: '1',
    name: 'Auto-route Sales Leads',
    trigger: 'Intent = SALES_LEAD',
    actions: ['Assign to Sales Team', 'Notify Slack #leads'],
    isActive: true,
    executions: 452
  },
  {
    id: '2',
    name: 'Urgent Refund Escalation',
    trigger: 'Sentiment = ANGRY AND Intent = REFUND',
    actions: ['Mark Urgent', 'Notify Manager via Email'],
    isActive: true,
    executions: 87
  },
  {
    id: '3',
    name: 'Shopify Sync',
    trigger: 'Data Extraction = ORDER_ID',
    actions: ['Update Shopify Order Note', 'Tag as E-commerce'],
    isActive: false,
    executions: 0
  }
];

export default function WorkflowsPage() {
  return (
    <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950/50 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
          <div>
              <h1 className="text-3xl font-extrabold tracking-tight underline decoration-primary/20 underline-offset-8">Workflow Builder</h1>
              <p className="text-muted-foreground mt-1.5 font-medium">Automate your inbox operations with intelligent IF-THEN rules.</p>
          </div>
          <button className="btn-primary flex items-center gap-2 !px-6 !py-3">
              <Plus className="w-5 h-5" /> Design New Workflow
          </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
          {workflows.map((workflow, i) => (
             <div key={i} className="p-8 rounded-[2rem] border border-border bg-white dark:bg-slate-950 hover:border-primary/30 transition-all flex items-center group">
                 <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-all">
                     <Workflow className="w-8 h-8" />
                 </div>
                 
                 <div className="ml-8 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-extrabold tracking-tight">{workflow.name}</h3>
                        {!workflow.isActive && <span className="px-2 py-0.5 rounded-lg bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-widest border border-border">Paused</span>}
                    </div>
                    <div className="text-sm text-primary font-bold uppercase tracking-widest flex items-center gap-2">
                        <Zap className="w-3 h-3" /> IF: <span className="underline decoration-primary/30">{workflow.trigger}</span>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 px-8 border-x border-border/60 mx-8">
                     {workflow.actions.map((act, idx) => (
                        <div key={idx} className="px-3 py-1.5 rounded-xl bg-muted/50 border border-border text-xs font-bold text-muted-foreground flex items-center gap-2">
                             {act.includes('Slack') ? <MessageSquare className="w-3.5 h-3.5" /> : act.includes('Assign') ? <UserPlus className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                            {act}
                        </div>
                     ))}
                 </div>

                 <div className="text-right px-8">
                    <div className="text-2xl font-bold tracking-tight">{workflow.executions}</div>
                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest italic">Total Runs</div>
                 </div>

                 <div className="flex items-center gap-2">
                    <button className="p-3 rounded-xl hover:bg-muted text-muted-foreground hover:text-primary transition-all"><Settings className="w-5 h-5" /></button>
                    <button className={cn(
                        "p-3 rounded-xl transition-all",
                        workflow.isActive ? "text-emerald-500 hover:bg-emerald-50" : "text-slate-400 hover:bg-muted"
                    )}>
                        {workflow.isActive ? <Play className="w-5 h-5 fill-emerald-500" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button className="p-3 rounded-xl hover:bg-muted text-muted-foreground transition-all"><MoreVertical className="w-5 h-5" /></button>
                 </div>
             </div>
          ))}
          
          {/* New Rule Placeholder */}
          <div className="p-12 border-2 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/50 transition-all hover:bg-primary/5">
             <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                <Plus className="w-8 h-8" />
             </div>
             <h4 className="text-xl font-bold mb-2">Create Custom Rule</h4>
             <p className="text-muted-foreground max-w-sm mb-6">Define multi-stage triggers using AI intent, sentiment, and metadata extraction.</p>
             <div className="flex items-center gap-4 text-xs font-bold text-primary uppercase tracking-widest group-hover:gap-6 transition-all">
                Try Rule Templates <ChevronRight className="w-4 h-4" />
             </div>
          </div>
      </div>

      {/* Suggested Workflows for E-commerce */}
      <div className="mt-12">
          <div className="flex items-center gap-2 mb-6 text-orange-500">
               <AlertCircle className="w-5 h-5" />
               <h2 className="text-sm font-bold uppercase tracking-[0.2em]">Suggested for E-commerce</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Negative Review Guard', desc: 'Auto-route 1-2 star sentiment to priority support.' },
                { title: 'Pre-order Lead Capture', desc: 'Detect "Pre-order" intent and send to sales rep.' },
                { title: 'Abandoned Cart Followup', desc: 'Sync customer data to CRM when cart mentioned.' },
              ].map((sug, i) => (
                <div key={i} className="p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100 hover:shadow-lg transition-all border-dashed shadow-inner">
                   <h5 className="font-bold mb-2 tracking-tight">{sug.title}</h5>
                   <p className="text-xs text-muted-foreground font-medium mb-4">{sug.desc}</p>
                   <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">+ Activate Now</button>
                </div>
              ))}
          </div>
      </div>
    </div>
  );
}
