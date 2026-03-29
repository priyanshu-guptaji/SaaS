'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Mail, 
  Inbox as InboxIcon, 
  UserPlus, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  AlertCircle,
  Clock,
  Send,
  MoreVertical,
  Paperclip,
  Share2,
  Trash2,
  Reply,
  ReplyAll,
  Check,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';

export default function InboxPage() {
  const queryClient = useQueryClient();
  const { data: emails = [], isLoading } = useQuery({
    queryKey: ['emails'],
    queryFn: async () => {
      const { data } = await apiService.getEmails();
      return data;
    }
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedEmail = emails.find((e: any) => e.id === (selectedId || emails[0]?.id)) || emails[0];

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950/50">
          <div className="flex flex-col items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary animate-bounce shadow-xl shadow-indigo-500/10">
                  <Mail className="w-8 h-8" />
              </div>
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em] animate-pulse">Syncing Intelligence...</div>
          </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-slate-50 dark:bg-slate-950/50">
      {/* Email List Column */}
      <div className="w-[450px] border-r border-border bg-white dark:bg-slate-950/80 flex flex-col">
        <div className="p-6 border-b border-border space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Inbox</h2>
                <div className="flex items-center gap-1 bg-muted px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                   <Clock className="w-3 h-3" /> Real-time
                </div>
            </div>
            
            <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search emails, intent, or sentiment..." 
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-muted/50 border border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-sm"
                />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <button className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-semibold shadow-md shadow-indigo-500/20 whitespace-nowrap">All Items</button>
                <button className="px-4 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground text-xs font-semibold transition-all whitespace-nowrap">High Priority</button>
                <button className="px-4 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground text-xs font-semibold transition-all whitespace-nowrap">Sales Leads</button>
                <button className="px-4 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground text-xs font-semibold transition-all whitespace-nowrap">Urgent Support</button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
            {emails.map((email: any) => (
                <div 
                    key={email.id} 
                    onClick={() => setSelectedId(email.id)}
                    className={cn(
                        "p-5 cursor-pointer border-b border-border/60 transition-all hover:bg-primary/5 group relative",
                        (selectedId || emails[0]?.id) === email.id ? "bg-primary/5 border-l-4 border-l-primary" : "border-l-4 border-l-transparent",
                        !email.isRead && "font-semibold"
                    )}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                                (email.intelligence?.sentiment || 'NEUTRAL') === 'ANGRY' ? "bg-red-100 text-red-600" : 
                                (email.intelligence?.sentiment || 'NEUTRAL') === 'POSITIVE' ? "bg-emerald-100 text-emerald-600" : 
                                "bg-indigo-100 text-primary"
                            )}>
                                {email.from.charAt(0)}
                            </div>
                            <span className="text-sm tracking-tight">{email.from.split('<')[0]}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{new Date(email.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div className="text-sm font-bold mb-1 line-clamp-1 group-hover:text-primary transition-colors">{email.subject}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">{email.body}</div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className={cn(
                            "px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-1",
                            email.intelligence?.intent === 'REFUND_REQUEST' ? "bg-red-50 text-red-600 border border-red-100" :
                            email.intelligence?.intent === 'SALES_LEAD' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                            "bg-indigo-50 text-primary border border-indigo-100"
                        )}>
                            <Zap className="w-2.5 h-2.5" />
                            {email.intelligence?.intent || 'OTHER'}
                        </span>
                        
                        {email.intelligence?.priority === 'HIGH' && (
                             <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1">
                                <AlertCircle className="w-2.5 h-2.5" />
                                HIGH PRIORITY
                             </span>
                        )}

                        {!email.isRead && <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse shadow-glow shadow-primary/50" />}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Email Detail Column */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-950 overflow-hidden relative">
          {/* Header Action Bar */}
          <div className="p-6 border-b border-border flex items-center justify-between bg-white dark:bg-slate-950 z-10">
              <div className="flex items-center gap-2">
                  <button className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-all"><Reply className="w-5 h-5" /></button>
                  <button className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-all"><ReplyAll className="w-5 h-5" /></button>
                  <div className="w-px h-6 bg-border mx-1" />
                  <button className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-all"><Trash2 className="w-5 h-5" /></button>
                  <button className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-all"><MoreVertical className="w-5 h-5" /></button>
              </div>
              
              <div className="flex items-center gap-3">
                  <button className="px-4 py-2 rounded-xl bg-orange-100 text-orange-600 text-xs font-bold hover:bg-orange-200 transition-all flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Escalated
                  </button>
                  <button className="btn-primary !px-5 !py-2.5 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Resolve Case
                  </button>
              </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
              {/* Intent Analysis Floating Card */}
              <div className="mb-10 p-6 rounded-3xl border border-primary/20 bg-primary/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Zap className="w-20 h-20 text-primary" />
                  </div>
                  <div className="relative z-10 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                          <Zap className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                          <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">AI Intelligence Analysis</div>
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <span className="text-xl font-bold tracking-tight">Detected Intent: <span className="text-primary italic">{selectedEmail.intelligence?.intent || 'OTHER'}</span></span>
                              <div className="px-3 py-1 rounded-xl bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary">
                                 {Math.round((selectedEmail.intelligence?.confidence || 0) * 100)}% Confidence
                              </div>
                          </div>
                          <div className="text-sm text-primary/70 font-medium max-w-2xl leading-relaxed">
                              Analysis: This customer is expressing <span className="font-bold text-primary">{(selectedEmail.intelligence?.sentiment || 'neutral').toLowerCase()}</span> sentiment regarding {(selectedEmail.intelligence?.intent || 'general query').toLowerCase().replace('_', ' ')}. 
                              {selectedEmail.intelligence?.priority === 'HIGH' ? 'High priority due to sentiment and intent detection.' : 'Standard priority processing.'}
                          </div>
                      </div>
                  </div>
              </div>

              <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-xl text-primary border-4 border-white shadow-xl">
                          {selectedEmail.from.charAt(0)}
                      </div>
                      <div>
                          <div className="text-xl font-extrabold tracking-tight">{selectedEmail.from.split('<')[0]}</div>
                          <div className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                              {selectedEmail.from} 
                              <span className="w-1 h-1 rounded-full bg-border" />
                              To: {selectedEmail.to}
                          </div>
                      </div>
                  </div>
                  <div className="text-right">
                      <div className="text-sm font-bold tracking-tight mb-1">{new Date(selectedEmail.receivedAt).toLocaleDateString()}</div>
                      <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground font-medium">
                          <Clock className="w-3 h-3" /> {new Date(selectedEmail.receivedAt).toLocaleTimeString()}
                      </div>
                  </div>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight mb-8 underline decoration-primary/20 underline-offset-8 decoration-4">{selectedEmail.subject}</h1>

              <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed text-lg mb-12">
                  <p>{selectedEmail.body}</p>
              </div>

              {/* AI Draft Section */}
              <div className="mt-12 group">
                  <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[var(--gradient-primary)] flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                              <Reply className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-bold tracking-tight uppercase tracking-widest text-primary">Smart Reply Draft</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-medium mr-2">Mode:</span>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-border text-xs font-bold hover:border-primary/30 transition-all">
                             Suggest <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                  </div>

                  <div className="p-8 rounded-[2rem] border-2 border-primary/20 bg-[var(--gradient-soft)] relative shadow-2xl shadow-indigo-500/5 group-focus-within:border-primary/50 transition-all border-dashed">
                      <textarea 
                          className="w-full bg-transparent border-none outline-none text-muted-foreground leading-relaxed text-lg font-medium min-h-[150px] resize-none selection:bg-primary/20"
                          defaultValue={selectedEmail.intelligence?.suggestedReply || 'Generating smart reply...'}
                          spellCheck={false}
                      />
                      
                      <div className="mt-6 pt-6 border-t border-border/30 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                              <button className="p-2 rounded-xl hover:bg-primary/10 text-primary transition-all"><Paperclip className="w-4 h-4" /></button>
                              <button className="p-2 rounded-xl hover:bg-primary/10 text-primary transition-all"><Zap className="w-4 h-4" /></button>
                              <button className="p-2 rounded-xl hover:bg-primary/10 text-primary transition-all font-bold text-xs uppercase tracking-widest">Regenerate</button>
                          </div>
                          
                          <div className="flex items-center gap-3">
                              <button className="px-6 py-3 rounded-2xl bg-muted text-muted-foreground text-sm font-bold hover:bg-muted/80 transition-all">
                                  Save Draft
                              </button>
                              <button className="btn-primary !px-8 !py-3 text-sm flex items-center gap-2 group-hover:scale-105 transition-transform duration-300">
                                  Approve & Send <Send className="w-4 h-4" />
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Workflow Automation Sidebar (Right Sticky) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-4 space-y-3 z-20">
              {[
                { icon: UserPlus, color: 'bg-emerald-500', title: 'Route to Support' },
                { icon: Share2, color: 'bg-indigo-500', title: 'Sync to HubSpot' },
                { icon: AlertCircle, color: 'bg-orange-500', title: 'Mark Urgent' },
              ].map((act, i) => (
                <div key={i} className="group relative">
                    <button className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-black/10 transition-all hover:scale-110", act.color)}>
                        <act.icon className="w-6 h-6" />
                    </button>
                    <div className="absolute right-16 top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 pointer-events-none after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-full after:border-8 after:border-transparent after:border-l-slate-900">
                        {act.title}
                    </div>
                </div>
              ))}
          </div>
      </div>
    </div>
  );
}
