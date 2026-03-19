'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCheck, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

type Strategy = {
    id: string;
    name?: string;
    strategy_name?: string;
};

type StrategyPost = {
    id: string;
    title?: string;
    status: string;
    platform?: string | null;
};

type ApprovalItem = StrategyPost & {
    strategyId: string;
    strategyName: string;
};

export default function ApprovalsPage() {
    const [items, setItems] = useState<ApprovalItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setIsLoading(true);
                const strategiesRes = await fetch('/api/strategy');
                if (!strategiesRes.ok) throw new Error('Failed to load strategies');
                const strategies: Strategy[] = await strategiesRes.json();

                const details = await Promise.all(
                    (strategies || []).slice(0, 10).map(async (strategy) => {
                        const detailRes = await fetch(`/api/strategy/${strategy.id}`);
                        if (!detailRes.ok) return null;
                        const detail = await detailRes.json();
                        return { strategy, detail };
                    })
                );

                const pending = details
                    .filter(Boolean)
                    .flatMap((entry: any) =>
                        (entry.detail.posts || []).map((post: StrategyPost) => ({
                            ...post,
                            strategyId: entry.strategy.id,
                            strategyName: entry.strategy.name || entry.strategy.strategy_name || 'Strategy',
                        }))
                    )
                    .filter((post: ApprovalItem) => post.status === 'content_ready');

                setItems(pending);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load approvals');
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                <p className="text-zinc-500 font-medium">Loading approvals...</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-300">
            <div>
                <h1 className="text-2xl font-bold text-zinc-900">Approvals</h1>
                <p className="text-sm text-zinc-500 mt-1">
                    Review content that is ready before it gets scheduled or published.
                </p>
            </div>

            {items.length === 0 ? (
                <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center">
                    <div className="mx-auto h-14 w-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <CheckCheck className="h-7 w-7" />
                    </div>
                    <h2 className="mt-4 text-xl font-bold text-zinc-900">No approvals pending</h2>
                    <p className="mt-2 text-sm text-zinc-500 max-w-md mx-auto">
                        Content marked as ready for approval will appear here.
                    </p>
                    <div className="mt-6">
                        <Link href="/dashboard/strategy">
                            <Button variant="outline" className="rounded-xl font-bold">
                                Open Strategy Planner
                            </Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
                    <div className="px-5 py-4 border-b border-zinc-100 text-sm font-semibold text-zinc-500">
                        {items.length} content item{items.length === 1 ? '' : 's'} ready for approval
                    </div>
                    <div className="divide-y divide-zinc-100">
                        {items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between gap-4 px-5 py-4">
                                <div className="min-w-0">
                                    <div className="text-sm font-bold text-zinc-900 truncate">
                                        {item.title || 'Untitled post'}
                                    </div>
                                    <div className="text-xs text-zinc-500 mt-1">
                                        {item.strategyName} {item.platform ? `• ${item.platform}` : ''}
                                    </div>
                                </div>
                                <Link href={`/dashboard/strategy/${item.strategyId}`}>
                                    <Button variant="outline" className="rounded-xl font-bold shrink-0">
                                        Review
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
