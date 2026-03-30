import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse bg-muted rounded-lg", className)} />
  );
}

export function EmailListSkeleton() {
  return (
    <div className="w-[450px] border-r border-border bg-white dark:bg-slate-950/80 flex flex-col">
      <div className="p-6 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-10 w-full rounded-2xl" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-16 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-12 ml-auto" />
            </div>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20 rounded-lg" />
              <Skeleton className="h-5 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EmailDetailSkeleton() {
  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-slate-950 overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-10 rounded-xl" />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-8 w-32 rounded-xl" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-8">
        <Skeleton className="h-32 w-full rounded-3xl mb-10" />
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-10 w-2/3 mb-8" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-12" />
        <Skeleton className="h-48 w-full rounded-[2rem]" />
      </div>
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-32 rounded-2xl" />
          <Skeleton className="h-10 w-32 rounded-2xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-8 rounded-[2rem] border border-border bg-white dark:bg-slate-950">
            <Skeleton className="h-12 w-12 rounded-2xl mb-6" />
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-10 w-24 mb-2" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 rounded-[2rem] border border-border bg-white dark:bg-slate-950 h-[450px]">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-64 mb-8" />
          <Skeleton className="h-[300px] w-full" />
        </div>
        <div className="p-8 rounded-[2rem] border border-border bg-white dark:bg-slate-950 h-[450px]">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-48 mb-8" />
          <Skeleton className="h-[200px] w-[200px] rounded-full mx-auto" />
        </div>
      </div>
    </div>
  );
}

export function WorkflowsSkeleton() {
  return (
    <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950/50 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <Skeleton className="h-12 w-44 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-8 rounded-[2rem] border border-border bg-white dark:bg-slate-950 flex items-center">
            <Skeleton className="h-16 w-16 rounded-2xl" />
            <div className="ml-8 flex-1">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-20 rounded-xl mx-8" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
