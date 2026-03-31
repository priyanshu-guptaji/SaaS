'use client';

import { LogOut } from 'lucide-react';
import { useAuth } from './AuthProvider';

export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-all group"
    >
      <div className="p-2 rounded-xl bg-muted group-hover:bg-red-100">
        <LogOut className="w-5 h-5" />
      </div>
      <span className="font-medium">Sign Out</span>
    </button>
  );
}
