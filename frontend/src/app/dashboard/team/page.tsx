'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  Shield, 
  User, 
  Clock, 
  X, 
  Check,
  Mail,
  UserCheck
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { cn } from '@/lib/utils';

export default function TeamPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Invite member form state
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('MEMBER');

  // Fetch Team
  const { data: team = [], isLoading } = useQuery<any[]>({
    queryKey: ['team'],
    queryFn: async () => {
      const { data } = await apiService.getTeam();
      return data;
    }
  });

  // Invite Mutation
  const inviteMutation = useMutation({
    mutationFn: (data: any) => apiService.addTeamMember(data),
    onSuccess: () => {
      toast({
        title: "Invitation Sent",
        description: "A new team member has been successfully added.",
      });
      queryClient.invalidateQueries({ queryKey: ['team'] });
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to invite member.",
        variant: "destructive",
      });
    }
  });

  // Update Role Mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => 
      apiService.updateTeamMember(id, role),
    onSuccess: () => {
      toast({
        title: "Role Updated",
        description: "Member's workspace permissions updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['team'] });
    },
    onError: (err: any) => {
      toast({
        title: "Failed to Update Role",
        description: err.response?.data?.error || "Error updating role.",
        variant: "destructive",
      });
    }
  });

  // Delete/Remove Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteTeamMember(id),
    onSuccess: () => {
      toast({
        title: "Member Removed",
        description: "The user has been removed from this workspace.",
      });
      queryClient.invalidateQueries({ queryKey: ['team'] });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to remove member.",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setEmail('');
    setName('');
    setRole('MEMBER');
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    inviteMutation.mutate({ email, name, role });
  };

  const handleRoleChange = (id: string, newRole: string) => {
    updateRoleMutation.mutate({ id, role: newRole });
  };

  const handleRemove = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from this workspace?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-bold">Loading Workspace Team...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950/50 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight underline decoration-primary/20 underline-offset-8">Team Directory</h1>
          <p className="text-muted-foreground mt-1.5 font-medium">Manage members and configure roles for inbox access control.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 !px-6 !py-3 font-bold"
        >
          <Plus className="w-5 h-5" /> Add Member
        </button>
      </div>

      {/* Team Table card */}
      <div className="bg-white dark:bg-slate-950 rounded-[2rem] border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-extrabold text-sm uppercase tracking-wider">Active Workspace Users</span>
          </div>
          <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary rounded-full">
            {team.length} Members Total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-slate-50/20 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <th className="px-8 py-5">User</th>
                <th className="px-8 py-5">Email Address</th>
                <th className="px-8 py-5">Role Permission</th>
                <th className="px-8 py-5">Workspace Join Date</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {team.map((member) => {
                const isMe = member.id === currentUser?.id;
                
                return (
                  <tr key={member.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/20 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                          {member.name ? member.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                        </div>
                        <div>
                          <div className="font-bold tracking-tight flex items-center gap-2">
                            {member.name || 'Anonymous User'}
                            {isMe && (
                              <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-[8px] font-bold uppercase tracking-widest text-primary rounded-md">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">ID: {member.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-muted-foreground">
                      {member.email}
                    </td>
                    <td className="px-8 py-5">
                      {isMe ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
                          <Shield className="w-3.5 h-3.5" />
                          {member.role}
                        </div>
                      ) : (
                        <select 
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value)}
                          disabled={updateRoleMutation.isPending}
                          className="px-3 py-1.5 rounded-xl border border-border bg-slate-50 text-xs font-bold focus:border-primary/50 focus:bg-white outline-none transition-all cursor-pointer"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="MEMBER">MEMBER</option>
                          <option value="AGENT">AGENT</option>
                        </select>
                      )}
                    </td>
                    <td className="px-8 py-5 text-xs text-muted-foreground font-semibold flex items-center gap-1.5 mt-2">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(member.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-8 py-5 text-right">
                      {!isMe && (
                        <button
                          onClick={() => handleRemove(member.id, member.name)}
                          disabled={deleteMutation.isPending}
                          className="p-2.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all"
                          title="Remove Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] max-w-md w-full p-8 border border-border shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 p-2 rounded-xl hover:bg-muted text-muted-foreground transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-extrabold tracking-tight mb-6 flex items-center gap-2.5">
              <UserCheck className="w-6 h-6 text-primary" />
              Add Workspace Member
            </h2>

            <form onSubmit={handleInvite} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-transparent focus:border-primary/30 outline-none transition-all font-medium"
                    placeholder="Enter full name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-transparent focus:border-primary/30 outline-none transition-all font-medium"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Workspace Role</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-transparent focus:border-primary/30 outline-none transition-all font-bold text-xs"
                >
                  <option value="MEMBER">MEMBER (View and reply to emails)</option>
                  <option value="ADMIN">ADMIN (Configure integrations and workflows)</option>
                  <option value="AGENT">AGENT (Assigned ticket resolution)</option>
                </select>
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
                  disabled={inviteMutation.isPending}
                  className="w-1/2 btn-primary !py-4 text-sm flex items-center justify-center gap-2 group shadow-xl shadow-indigo-500/20 disabled:opacity-50 font-bold"
                >
                  {inviteMutation.isPending ? "Adding..." : "Add Member"} <Check className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
