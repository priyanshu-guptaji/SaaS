'use client';

import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        if (!toast.open) return null

        const isDestructive = toast.variant === 'destructive'

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between p-4 rounded-xl shadow-lg border transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-5 ${
              isDestructive
                ? 'bg-destructive border-destructive-foreground/10 text-destructive-foreground'
                : 'bg-card border-border text-card-foreground dark:bg-slate-900'
            }`}
          >
            <div className="grid gap-1">
              {toast.title && <div className="font-semibold text-sm">{toast.title}</div>}
              {toast.description && (
                <div className={`text-xs ${isDestructive ? 'text-destructive-foreground/90' : 'text-muted-foreground'}`}>
                  {toast.description}
                </div>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className={`p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
                isDestructive ? 'text-destructive-foreground/80 hover:text-destructive-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
