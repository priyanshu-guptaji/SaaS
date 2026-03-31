'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Inbox, 
  BarChart3, 
  Workflow, 
  Settings, 
  Users, 
  Zap, 
  Plug, 
  CreditCard,
  Mail,
  Menu,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthProvider';
import { LogoutButton } from '@/components/auth/LogoutButton';

const sidebarItems = [
  { label: 'Inbox', icon: Inbox, href: '/dashboard/inbox' },
  { label: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' },
  { label: 'Workflows', icon: Workflow, href: '/dashboard/workflows' },
  { label: 'Integrations', icon: Plug, href: '/dashboard/integrations' },
  { label: 'Team', icon: Users, href: '/dashboard/team' },
  { label: 'Billing', icon: CreditCard, href: '/dashboard/billing' },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'ADMIN': return 'Admin';
      case 'MEMBER': return 'Team Member';
      case 'AGENT': return 'Agent';
      default: return 'User';
    }
  };

  return (
    <aside className="w-80 h-full border-r border-border bg-white dark:bg-slate-950 flex flex-col pt-8 selection:bg-primary/20">
      <div className="px-10 mb-12 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="bg-primary/15 p-2 rounded-xl group-hover:bg-primary/25 transition-all">
                <Mail className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">AI<span className="text-primary italic">Intelligence</span></span>
          </Link>
          <button className="lg:hidden p-2 rounded-lg hover:bg-muted"><Menu className="w-5 h-5" /></button>
      </div>

      <nav className="flex-1 px-6 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium",
                isActive 
                  ? "bg-primary text-white shadow-xl shadow-indigo-500/30" 
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              )}
            >
              <div className={cn(
                  "p-2 rounded-xl transition-all",
                  isActive ? "bg-white/20" : "bg-muted group-hover:bg-primary/15"
              )}>
                 <item.icon className="w-5 h-5" />
              </div>
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
            </Link>
          );
        })}
      </nav>

      <div className="mx-6 mb-8 mt-auto">
          <div className="p-6 rounded-3xl bg-[var(--gradient-primary)] text-white shadow-xl overflow-hidden relative">
              <Zap className="absolute -right-2 -bottom-2 w-20 h-20 text-white/10 rotate-12" />
              <div className="relative z-10">
                  <div className="text-xs font-semibold opacity-80 uppercase tracking-widest mb-1.5">Weekly Savings</div>
                  <div className="text-3xl font-bold mb-4 tracking-tight">24.5h</div>
                  <Link href="/dashboard/analytics" className="w-full py-2.5 px-4 bg-white/20 backdrop-blur-md rounded-xl text-sm font-semibold hover:bg-white/30 transition-all active:scale-95 block text-center">
                      Explore AI Performance
                  </Link>
              </div>
          </div>
      </div>

      <div className="p-6 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-primary">
              {getUserInitials()}
            </div>
            <div>
                <div className="text-sm font-bold truncate max-w-[100px]">{user?.name || 'User'}</div>
                <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{getRoleLabel()}</div>
            </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/settings" className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-primary transition-all">
              <Settings className="w-5 h-5" />
          </Link>
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
