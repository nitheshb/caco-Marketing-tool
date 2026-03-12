'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function StrategyCardSkeleton() {
    return (
        <Card className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm p-0 gap-0">
            <Skeleton className="h-28 w-full rounded-none" />
            <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <Skeleton className="h-5 flex-1 max-w-[80%]" />
                    <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[75%]" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="flex gap-2 pt-2">
                    <Skeleton className="h-9 w-28 rounded-full" />
                    <Skeleton className="h-9 w-20 rounded-lg" />
                </div>
            </div>
        </Card>
    );
}
