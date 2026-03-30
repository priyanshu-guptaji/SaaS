'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { apiService } from '@/services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@ecommflow.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await apiService.signin({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-primary/20">
       <div className="absolute top-0 left-0 w-full h-1 bg-[var(--gradient-primary)]" />
       
       <Link href="/" className="flex items-center gap-2 mb-10 group">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-all">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            Email<span className="text-primary italic">Intelligence</span>
          </span>
       </Link>

       <div className="w-full max-w-md p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-border shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 opacity-5">
              <Mail className="w-60 h-60 text-primary" />
          </div>
          
          <div className="relative z-10">
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome Back</h1>
              <p className="text-muted-foreground font-medium mb-8">Ready to reclaim your inbox?</p>

              {error && (
                  <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold border border-red-100 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                      {error}
                  </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Business Email</label>
                      <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <input 
                              type="email" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-transparent focus:border-primary/50 focus:bg-white outline-none transition-all font-medium"
                              placeholder="name@company.com"
                              required
                          />
                      </div>
                  </div>

                  <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                      <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <input 
                              type="password" 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-transparent focus:border-primary/50 focus:bg-white outline-none transition-all font-medium"
                              placeholder="••••••••"
                              required
                          />
                      </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold">
                      <label className="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                          <span className="text-muted-foreground group-hover:text-primary transition-colors">Remember Me</span>
                      </label>
                      <Link href="#" className="text-primary hover:underline">Forgot Password?</Link>
                  </div>

                  <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full btn-primary !py-4 text-lg flex items-center justify-center gap-2 group shadow-xl shadow-indigo-500/30"
                  >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
                  </button>
              </form>
          </div>
       </div>

        <p className="mt-10 text-muted-foreground font-medium">
           Don&apos;t have an account? <Link href="/signup" className="text-primary font-bold hover:underline">Create a local workspace</Link>
        </p>
    </div>
  );
}
