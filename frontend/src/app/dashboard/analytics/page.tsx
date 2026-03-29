'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  Zap, 
  Mail, 
  AlertCircle,
  TrendingDown,
  ExternalLink,
  ChevronRight,
  Target,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const timeData = [
  { name: 'Mon', hours: 4.5 },
  { name: 'Tue', hours: 5.2 },
  { name: 'Wed', hours: 6.8 },
  { name: 'Thu', hours: 4.1 },
  { name: 'Fri', hours: 3.9 },
  { name: 'Sat', hours: 0.5 },
  { name: 'Sun', hours: 0.2 },
];

const volumeData = [
  { name: '9am', volume: 45 },
  { name: '10am', volume: 82 },
  { name: '11am', volume: 110 },
  { name: '12pm', volume: 95 },
  { name: '1pm', volume: 154 },
  { name: '2pm', volume: 130 },
  { name: '3pm', volume: 180 },
  { name: '4pm', volume: 160 },
  { name: '5pm', volume: 120 },
];

const intentData = [
  { name: 'Support', value: 452, color: '#6366f1' },
  { name: 'Sales', value: 310, color: '#10b981' },
  { name: 'Billing', value: 124, color: '#f59e0b' },
  { name: 'Refunds', value: 87, color: '#ef4444' },
];

const stats = [
  { label: 'Emails Processed', value: '1,248', desc: '+15.2%', icon: Mail, color: 'text-indigo-600', trend: 'up' },
  { label: 'Avg. Response Time', value: '14m', desc: '-42.1%', icon: Clock, color: 'text-emerald-600', trend: 'down' },
  { label: 'AI Confidence Score', value: '98.4%', desc: 'Highly Reliable', icon: Target, color: 'text-amber-600', trend: 'up' },
  { label: 'Hours Saved', value: '24.5h', desc: 'Auto-pilot', icon: Zap, color: 'text-primary', trend: 'up' },
];

export default function AnalyticsPage() {
  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-950/50">
      <div className="flex items-center justify-between">
          <div>
              <h1 className="text-3xl font-extrabold tracking-tight underline decoration-primary/20 underline-offset-8">Analytics Dashboard</h1>
              <p className="text-muted-foreground mt-1.5 font-medium">Real-time performance tracking for your inbox operations.</p>
          </div>
          <div className="flex items-center gap-3">
              <button className="px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-border text-sm font-bold flex items-center gap-2 hover:border-primary/30 transition-all">
                  Last 7 Days <ChevronRight className="w-4 h-4 rotate-90" />
              </button>
              <button className="btn-primary !px-6 !py-2.5 text-sm flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Export Report
              </button>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
              <div key={i} className="p-8 rounded-[2rem] border border-border bg-white dark:bg-slate-950 hover:border-primary/30 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group overflow-hidden relative">
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all">
                      <stat.icon className="w-24 h-24 text-slate-900 dark:text-white" />
                  </div>
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", stat.color.replace('text', 'bg').concat('/10'))}>
                      <stat.icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                  <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1.5">{stat.label}</div>
                  <div className="text-4xl font-extrabold tracking-tight mb-2 flex items-baseline gap-2">
                      {stat.value}
                      <span className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded-lg",
                          stat.trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                      )}>
                          {stat.desc}
                      </span>
                  </div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em]">Updated 3m ago</div>
              </div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 p-8 rounded-[2rem] border border-border bg-white dark:bg-slate-950 shadow-sm overflow-hidden flex flex-col h-[450px]">
              <div className="flex items-center justify-between mb-8">
                  <div>
                      <h3 className="text-xl font-extrabold tracking-tight">AI Time Savings</h3>
                      <p className="text-sm text-muted-foreground font-medium">Estimated hours saved by AI automation per day.</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-bold">
                    <TrendingUp className="w-4 h-4" /> 28% Improvement
                  </div>
              </div>
              <div className="flex-1 -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={timeData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                          <XAxis 
                              dataKey="name" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{fontSize: 12, fontWeight: 600, fill: '#64748B'}} 
                              dy={10}
                          />
                          <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{fontSize: 12, fontWeight: 600, fill: '#64748B'}} 
                          />
                          <Tooltip 
                              cursor={{fill: 'rgba(99, 102, 241, 0.05)'}}
                              contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                          />
                          <Bar 
                              dataKey="hours" 
                              fill="url(#primaryGradient)" 
                              radius={[8, 8, 0, 0]} 
                              barSize={40}
                          />
                          <defs>
                              <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#6366f1" />
                                  <stop offset="100%" stopColor="#8b5cf6" />
                              </linearGradient>
                          </defs>
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>

          <div className="p-8 rounded-[2rem] border border-border bg-white dark:bg-slate-950 shadow-sm flex flex-col h-[450px]">
              <div>
                  <h3 className="text-xl font-extrabold tracking-tight">Intent Distribution</h3>
                  <p className="text-sm text-muted-foreground font-medium mb-8">Classification breakdown of incoming items.</p>
              </div>
              <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie
                              data={intentData}
                              cx="50%"
                              cy="50%"
                              innerRadius={70}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                          >
                              {intentData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                          </Pie>
                          <Tooltip 
                               contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                          />
                      </PieChart>
                  </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                  {intentData.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}} />
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{item.name}</span>
                          <span className="text-xs font-extrabold ml-auto">{item.value}</span>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      <div className="p-8 rounded-[2rem] border border-border bg-white dark:bg-slate-950 shadow-sm">
           <div className="flex items-center justify-between mb-10">
                <div>
                   <h3 className="text-xl font-extrabold tracking-tight">Real-time Volume Monitoring</h3>
                   <p className="text-sm text-muted-foreground font-medium">Monitoring peak email activity hours for staff scheduling.</p>
                </div>
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-100/50 text-orange-600 text-[10px] font-bold uppercase tracking-widest">
                       <Zap className="w-3 h-3" /> Peak Active Now
                   </div>
                </div>
           </div>
           <div className="h-[200px] -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={volumeData}>
                      <defs>
                          <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94A3B8'}} />
                      <Tooltip />
                      <Area 
                          type="monotone" 
                          dataKey="volume" 
                          stroke="#6366f1" 
                          strokeWidth={4} 
                          fillOpacity={1} 
                          fill="url(#colorVolume)" 
                      />
                  </AreaChart>
              </ResponsiveContainer>
           </div>
      </div>
    </div>
  );
}
