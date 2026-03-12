'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export function StrategyBoardSkeleton() {
    return (
        <div className="space-y-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-7 w-20 rounded-full" />
                    </div>
                </div>
                <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50/50 p-1">
                    <Skeleton className="h-8 w-20 rounded-md" />
                    <Skeleton className="h-8 w-20 rounded-md" />
                </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 bg-zinc-50/50">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-9 w-28 rounded-full" />
                </div>
                <div className="p-4">
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4 py-3 border-b border-zinc-100 last:border-0">
                                <Skeleton className="h-4 w-4 rounded" />
                                <Skeleton className="h-4 flex-1 max-w-[200px]" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-7 w-7 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
