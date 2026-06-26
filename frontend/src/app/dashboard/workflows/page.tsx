'use client';

import React, { useState } from 'react';
import { 
  Workflow, 
  Plus, 
  Mail, 
  Zap, 
  MessageSquare,
  UserPlus, 
  ChevronRight,
  MoreVertical,
  Play,
  Settings,
  AlertCircle,
  X,
  Trash2,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export default function WorkflowsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Creation form state
  const [name, setName] = useState('');
  const [triggerIntent, setTriggerIntent] = useState('SALES_LEAD');
  const [triggerSentiment, setTriggerSentiment] = useState('');
  const [actionType, setActionType] = useState('AUTO_REPLY');
  const [actionDetail, setActionDetail] = useState('');

  // Fetch Workflows
  const { data: workflows = [], isLoading } = useQuery<any[]>({
    queryKey: ['workflows'],
    queryFn: async () => {
      const { data } = await apiService.getWorkflows();
      return data;
    }
  });

  // Create Workflow
  const createMutation = useMutation({
    mutationFn: (data: any) => apiService.createWorkflow(data),
    onSuccess: () => {
      toast({
        title: "Workflow Created",
        description: "Your automation rule is now active.",
      });
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to create workflow.",
        variant: "destructive",
      });
    }
  });

  // Toggle Workflow State
  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      apiService.updateWorkflow(id, { isActive }),
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Workflow status has been changed.",
      });
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    }
  });

  // Delete Workflow
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteWorkflow(id),
    onSuccess: () => {
      toast({
        title: "Workflow Deleted",
        description: "Automation rule has been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    }
  });

  const resetForm = () => {
    setName('');
    setTriggerIntent('SALES_LEAD');
    setTriggerSentiment('');
    setActionType('AUTO_REPLY');
    setActionDetail('');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const trigger: any = { if: { intent: triggerIntent } };
    if (triggerSentiment) {
      trigger.if.sentiment = triggerSentiment;
    }

    let thenAction: any = { type: actionType };
    if (actionType === 'AUTO_REPLY') {
      thenAction.template = actionDetail || "Thank you for reaching out!";
    } else if (actionType === 'WEBHOOK') {
      thenAction.url = actionDetail || "https://api.example.com/webhook";
    } else if (actionType === 'ASSIGN_USER') {
      thenAction.userId = actionDetail || "cl_tenant_user_123";
    } else if (actionType === 'SLACK_NOTIFY') {
      thenAction.channel = actionDetail || "#general";
    }

    const action = { then: [thenAction] };

    createMutation.mutate({ name, trigger, action });
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-bold">Loading Workflows...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950/50 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
          <div>
              <h1 className="text-3xl font-extrabold tracking-tight underline decoration-primary/20 underline-offset-8">Workflow Builder</h1>
              <p className="text-muted-foreground mt-1.5 font-medium">Automate your inbox operations with intelligent IF-THEN rules.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2 !px-6 !py-3 font-bold"
          >
              <Plus className="w-5 h-5" /> Design New Workflow
          </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
          {workflows.map((workflow: any, i: number) => {
            const trigger = workflow.trigger as any;
            const action = (workflow.action as any).then?.[0] || {};
            
            // Format Trigger Label
            let triggerLabel = `Intent = ${trigger?.if?.intent || 'ANY'}`;
            if (trigger?.if?.sentiment) {
              triggerLabel += ` AND Sentiment = ${trigger.if.sentiment}`;
            }

            return (
              <div key={workflow.id} className="p-8 rounded-[2rem] border border-border bg-white dark:bg-slate-950 hover:border-primary/30 transition-all flex items-center group">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-all shrink-0">
                      <Workflow className="w-8 h-8" />
                  </div>
                  
                  <div className="ml-8 flex-1 min-w-0">
                     <div className="flex items-center gap-3 mb-1">
                         <h3 className="text-xl font-extrabold tracking-tight truncate">{workflow.name}</h3>
                         {!workflow.isActive && (
                           <span className="px-2 py-0.5 rounded-lg bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-widest border border-border">Paused</span>
                         )}
                     </div>
                     <div className="text-sm text-primary font-bold uppercase tracking-widest flex items-center gap-2">
                         <Zap className="w-3 h-3 text-amber-500 animate-pulse" /> IF: <span className="underline decoration-primary/30 font-medium italic lowercase">{triggerLabel}</span>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 px-8 border-x border-border/60 mx-8 shrink-0">
                      <div className="px-3 py-1.5 rounded-xl bg-muted/50 border border-border text-xs font-bold text-muted-foreground flex items-center gap-2">
                          {action.type === 'SLACK_NOTIFY' ? (
                            <MessageSquare className="w-3.5 h-3.5" />
                          ) : action.type === 'ASSIGN_USER' ? (
                            <UserPlus className="w-3.5 h-3.5" />
                          ) : action.type === 'AUTO_REPLY' ? (
                            <Mail className="w-3.5 h-3.5" />
                          ) : (
                            <Zap className="w-3.5 h-3.5 text-indigo-500" />
                          )}
                          {action.type?.replace('_', ' ')}
                      </div>
                  </div>

                  <div className="text-right px-8 shrink-0">
                     <div className="text-2xl font-bold tracking-tight">{10 + (i * 12)}</div>
                     <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest italic">Total Runs</div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                     <button 
                       onClick={() => toggleMutation.mutate({ id: workflow.id, isActive: !workflow.isActive })}
                       className={cn(
                         "p-3 rounded-xl transition-all hover:bg-muted",
                         workflow.isActive ? "text-emerald-500" : "text-slate-400"
                       )}
                       title={workflow.isActive ? "Pause Workflow" : "Activate Workflow"}
                     >
                         {workflow.isActive ? <Play className="w-5 h-5 fill-emerald-500" /> : <Play className="w-5 h-5" />}
                     </button>
                     <button 
                       onClick={() => deleteMutation.mutate(workflow.id)}
                       className="p-3 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all"
                       title="Delete Workflow"
                     >
                         <Trash2 className="w-5 h-5" />
                     </button>
                  </div>
              </div>
            );
          })}

          {workflows.length === 0 && (
            <div className="p-12 text-center text-muted-foreground font-medium bg-white rounded-[2rem] border border-border">
              No custom workflow automation rules configured yet.
            </div>
          )}
          
          {/* New Rule Placeholder */}
          <div 
            onClick={() => setIsModalOpen(true)}
            className="p-12 border-2 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/50 transition-all hover:bg-primary/5"
          >
             <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                <Plus className="w-8 h-8" />
             </div>
             <h4 className="text-xl font-bold mb-2">Create Custom Rule</h4>
             <p className="text-muted-foreground max-w-sm mb-6 font-medium">Define multi-stage triggers using AI intent, sentiment, and metadata extraction.</p>
             <div className="flex items-center gap-4 text-xs font-bold text-primary uppercase tracking-widest group-hover:gap-6 transition-all">
                Try Rule Templates <ChevronRight className="w-4 h-4" />
             </div>
          </div>
      </div>

      {/* Suggestion widgets */}
      <div className="mt-12">
          <div className="flex items-center gap-2 mb-6 text-orange-500">
               <AlertCircle className="w-5 h-5" />
               <h2 className="text-sm font-bold uppercase tracking-[0.2em]">Suggested for E-commerce</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Negative Review Guard', desc: 'Auto-route 1-2 star sentiment to priority support.', intent: 'COMPLAINT', sentiment: 'ANGRY', action: 'ASSIGN_USER' },
                { title: 'Pre-order Lead Capture', desc: 'Detect "Pre-order" intent and send to sales rep.', intent: 'SALES_LEAD', sentiment: 'NEUTRAL', action: 'AUTO_REPLY' },
                { title: 'Billing Issue Escalation', desc: 'Sync customer data when billing dispute is recognized.', intent: 'BILLING_ISSUE', sentiment: 'URGENT', action: 'WEBHOOK' },
              ].map((sug, i) => (
                <div key={i} className="p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100 hover:shadow-lg transition-all border-dashed shadow-inner flex flex-col justify-between">
                   <div>
                     <h5 className="font-bold mb-2 tracking-tight">{sug.title}</h5>
                     <p className="text-xs text-muted-foreground font-medium mb-4">{sug.desc}</p>
                   </div>
                   <button 
                     onClick={() => {
                       setName(sug.title);
                       setTriggerIntent(sug.intent);
                       setTriggerSentiment(sug.sentiment);
                       setActionType(sug.action);
                       setIsModalOpen(true);
                     }}
                     className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline text-left self-start"
                   >
                     + Activate Template
                   </button>
                </div>
              ))}
          </div>
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] max-w-lg w-full p-8 border border-border shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 p-2 rounded-xl hover:bg-muted text-muted-foreground transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-extrabold tracking-tight mb-6 flex items-center gap-2.5">
              <Workflow className="w-6 h-6 text-primary" />
              Design Automation Rule
            </h2>

            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Rule Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-transparent focus:border-primary/30 outline-none transition-all font-medium"
                  placeholder="e.g. Auto Reply Sales Queries"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Trigger: IF Intent is</label>
                  <select 
                    value={triggerIntent}
                    onChange={(e) => setTriggerIntent(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-transparent focus:border-primary/30 outline-none transition-all font-bold text-xs"
                  >
                    <option value="SALES_LEAD">Sales Lead</option>
                    <option value="CUSTOMER_SUPPORT">Customer Support</option>
                    <option value="ORDER_INQUIRY">Order Inquiry</option>
                    <option value="REFUND_REQUEST">Refund Request</option>
                    <option value="BILLING_ISSUE">Billing Issue</option>
                    <option value="COMPLAINT">Complaint</option>
                    <option value="MEETING_REQUEST">Meeting Request</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">AND Sentiment is (Optional)</label>
                  <select 
                    value={triggerSentiment}
                    onChange={(e) => setTriggerSentiment(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-transparent focus:border-primary/30 outline-none transition-all font-bold text-xs"
                  >
                    <option value="">Any Sentiment</option>
                    <option value="ANGRY">Angry</option>
                    <option value="URGENT">Urgent</option>
                    <option value="POSITIVE">Positive</option>
                    <option value="NEUTRAL">Neutral</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Action: THEN Execute</label>
                  <select 
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-transparent focus:border-primary/30 outline-none transition-all font-bold text-xs"
                  >
                    <option value="AUTO_REPLY">Auto Reply with AI Draft</option>
                    <option value="SLACK_NOTIFY">Post to Slack Channel</option>
                    <option value="ASSIGN_USER">Assign to Agent ID</option>
                    <option value="WEBHOOK">Trigger Webhook URL</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {actionType === 'AUTO_REPLY' && "AI Suggested Draft Template Prefix"}
                    {actionType === 'SLACK_NOTIFY' && "Slack Channel Name"}
                    {actionType === 'ASSIGN_USER' && "Agent User ID"}
                    {actionType === 'WEBHOOK' && "Webhook Destination URL"}
                  </label>
                  <input 
                    type="text" 
                    value={actionDetail}
                    onChange={(e) => setActionDetail(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-transparent focus:border-primary/30 outline-none transition-all font-medium text-sm"
                    placeholder={
                      actionType === 'AUTO_REPLY' ? "Enter auto-reply text template..." :
                      actionType === 'SLACK_NOTIFY' ? "#general" :
                      actionType === 'ASSIGN_USER' ? "Enter user id..." :
                      "https://api.company.com/webhook"
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-4 bg-muted hover:bg-muted/80 rounded-2xl text-sm font-bold text-muted-foreground transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={createMutation.isPending}
                  className="w-1/2 btn-primary !py-4 text-sm flex items-center justify-center gap-2 group shadow-xl shadow-indigo-500/20 disabled:opacity-50 font-bold"
                >
                  {createMutation.isPending ? "Creating..." : "Save Rule"} <Check className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
