'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Building2, 
  Globe, 
  Briefcase, 
  Mail, 
  Check, 
  Loader2
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Profile Form State
  const [userName, setUserName] = useState('');
  
  // Organization Form State
  const [tenantName, setTenantName] = useState('');
  const [tenantDomain, setTenantDomain] = useState('');
  const [tenantIndustry, setTenantIndustry] = useState('');

  // Fetch Settings
  const { data: settingsRes, isLoading } = useQuery<any>({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await apiService.getSettings();
      return data;
    }
  });

  // Populate state when data loads
  useEffect(() => {
    if (settingsRes) {
      setUserName(settingsRes.user?.name || '');
      setTenantName(settingsRes.tenant?.name || '');
      setTenantDomain(settingsRes.tenant?.domain || '');
      setTenantIndustry(settingsRes.tenant?.industry || '');
    }
  }, [settingsRes]);

  // Update Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: { name: string }) => apiService.updateUserSettings(data),
    onSuccess: (data) => {
      toast({
        title: "Profile Updated",
        description: "Your user profile details have been saved.",
      });
      // Update local storage user details if needed
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const u = JSON.parse(userStr);
        localStorage.setItem('user', JSON.stringify({ ...u, name: data.data.name }));
      }
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (err: any) => {
      toast({
        title: "Failed to Update Profile",
        description: err.response?.data?.error || "An error occurred.",
        variant: "destructive",
      });
    }
  });

  // Update Tenant Mutation
  const updateTenantMutation = useMutation({
    mutationFn: (data: { name: string; domain?: string; industry?: string }) => 
      apiService.updateTenantSettings(data),
    onSuccess: () => {
      toast({
        title: "Organization Updated",
        description: "Your workspace settings have been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (err: any) => {
      toast({
        title: "Failed to Update Organization",
        description: err.response?.data?.error || "An error occurred.",
        variant: "destructive",
      });
    }
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;
    updateProfileMutation.mutate({ name: userName });
  };

  const handleTenantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantName.trim()) return;
    updateTenantMutation.mutate({
      name: tenantName,
      domain: tenantDomain || undefined,
      industry: tenantIndustry || undefined
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-bold">Loading Settings Configuration...</p>
        </div>
      </div>
    );
  }

  const user = settingsRes?.user || {};
  const tenant = settingsRes?.tenant || {};

  return (
    <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950/50 h-full overflow-y-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight underline decoration-primary/20 underline-offset-8">Workspace Settings</h1>
        <p className="text-muted-foreground mt-1.5 font-medium">Configure profile settings and organization metadata.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Profile Settings */}
        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-950 border border-border shadow-sm">
          <h2 className="text-xl font-extrabold tracking-tight mb-6 flex items-center gap-2.5">
            <User className="w-5 h-5 text-primary" />
            User Profile Settings
          </h2>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Account Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  value={user.email || ''} 
                  disabled 
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-100 border border-transparent outline-none font-medium text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-transparent focus:border-primary/30 outline-none transition-all font-medium"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={updateProfileMutation.isPending}
              className="w-full btn-primary !py-3.5 text-xs flex items-center justify-center gap-2 group shadow-lg shadow-indigo-500/20 font-bold disabled:opacity-50"
            >
              {updateProfileMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>Save Profile Details <Check className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>

        {/* Organization Settings */}
        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-950 border border-border shadow-sm">
          <h2 className="text-xl font-extrabold tracking-tight mb-6 flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-primary" />
            Workspace & Tenant Settings
          </h2>

          <form onSubmit={handleTenantSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Tenant ID</label>
              <input 
                type="text" 
                value={tenant.id || ''} 
                disabled 
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-100 border border-transparent outline-none font-medium text-slate-500 cursor-not-allowed text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Workspace Name</label>
              <div className="relative group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-transparent focus:border-primary/30 outline-none transition-all font-medium"
                  placeholder="Enter workspace name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Custom Domain</label>
                <div className="relative group">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    value={tenantDomain}
                    onChange={(e) => setTenantDomain(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-transparent focus:border-primary/30 outline-none transition-all font-medium text-xs"
                    placeholder="e.g. company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Industry Type</label>
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    value={tenantIndustry}
                    onChange={(e) => setTenantIndustry(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-transparent focus:border-primary/30 outline-none transition-all font-medium text-xs"
                    placeholder="e.g. E-commerce"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={updateTenantMutation.isPending}
              className="w-full btn-primary !py-3.5 text-xs flex items-center justify-center gap-2 group shadow-lg shadow-indigo-500/20 font-bold disabled:opacity-50"
            >
              {updateTenantMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>Save Organization Details <Check className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
