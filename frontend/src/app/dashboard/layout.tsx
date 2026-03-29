import { DashboardSidebar } from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto relative">
        {/* Top Navbar */}
        <header className="h-20 border-b border-border bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
                <div className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                    E-Commerce Platform
                </div>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border border-transparent focus-within:border-primary/30 focus-within:bg-white transition-all">
                    <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Search Control</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-bold text-muted-foreground border border-border">⌘K</kbd>
                </div>
                
                <div className="flex items-center gap-3 border-l border-border pl-6">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center cursor-pointer hover:bg-primary/10 hover:text-primary transition-all">
                        <div className="w-2 h-2 rounded-full bg-primary absolute -top-1 -right-1 ring-2 ring-white" />
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    </div>
                </div>
            </div>
        </header>
        
        <div className="relative">
            {children}
        </div>
      </main>
    </div>
  );
}
