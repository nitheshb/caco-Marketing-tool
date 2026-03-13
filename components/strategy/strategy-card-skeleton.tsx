'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function StrategyCardSkeleton() {
    return (
        <Card className="overflow-hidden rounded-xl border border-zinc-200 bg-white p-0 shadow-sm">
            {/* 16:9 thumbnail */}
            <Skeleton className="aspect-video w-full rounded-none" />
            <div className="flex gap-3 px-3 pt-2 pb-3">
                <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-[85%]" />
                    <Skeleton className="h-3 w-2/3" />
                </div>
                <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            </div>
            <div className="px-3 pb-3">
                <Skeleton className="h-9 w-full rounded-full" />
            </div>
        </Card>
    );
}
