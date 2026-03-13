'use client';

import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { SlidePanel } from '@/components/ui/slide-panel';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Strategy {
    id: string;
    name: string;
    start_date?: string | null;
    duration_days?: number;
}

interface StrategyPost {
    id: string;
    day: number;
    platform: string;
    idea: string | null;
    media_url?: string | null;
}

interface AddToStrategyModalProps {
    open: boolean;
    onClose: () => void;
    mediaUrl: string;
    onSuccess?: () => void;
}

export function AddToStrategyModal({
    open,
    onClose,
    mediaUrl,
    onSuccess,
}: AddToStrategyModalProps) {
    const [strategies, setStrategies] = useState<Strategy[]>([]);
    const [posts, setPosts] = useState<StrategyPost[]>([]);
    const [selectedStrategyId, setSelectedStrategyId] = useState<string>('');
    const [selectedPostId, setSelectedPostId] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!open) return;
        setLoading(true);
        getAuth(app)
            .currentUser?.getIdToken(true)
            .then((token) => {
                const headers: Record<string, string> = {};
                if (token) headers['Authorization'] = `Bearer ${token}`;
                return fetch('/api/strategy', { headers });
            })
            .then((res) => res.json())
            .then((data) => {
                setStrategies(Array.isArray(data) ? data : []);
                setSelectedStrategyId('');
                setSelectedPostId('');
                setPosts([]);
            })
            .catch(() => setStrategies([]))
            .finally(() => setLoading(false));
    }, [open]);

    useEffect(() => {
        if (!selectedStrategyId) {
            setPosts([]);
            setSelectedPostId('');
            return;
        }
        setLoading(true);
        getAuth(app)
            .currentUser?.getIdToken(true)
            .then((token) => {
                const headers: Record<string, string> = {};
                if (token) headers['Authorization'] = `Bearer ${token}`;
                return fetch(`/api/strategy/${selectedStrategyId}`, { headers });
            })
            .then((res) => res.json())
            .then((data) => {
                setPosts(data?.posts ?? []);
                setSelectedPostId('');
            })
            .catch(() => setPosts([]))
            .finally(() => setLoading(false));
    }, [selectedStrategyId]);

    const handleSubmit = async () => {
        if (!selectedPostId) {
            toast.error('Select a post');
            return;
        }
        setSubmitting(true);
        try {
            const token = await getAuth(app).currentUser?.getIdToken(true);
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const res = await fetch(
                `/api/strategy/${selectedStrategyId}/posts/${selectedPostId}`,
                {
                    method: 'PATCH',
                    headers,
                    body: JSON.stringify({ media_url: mediaUrl, status: 'content_ready' }),
                }
            );
            if (!res.ok) throw new Error((await res.json()).error || 'Failed');
            toast.success('Content added to strategy');
            onSuccess?.();
            onClose();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SlidePanel
            open={open}
            onClose={onClose}
            title="Add to strategy"
            subtitle="Attach this content to a strategy post for scheduling"
            size="md"
            footer={
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose} className="rounded-full">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedPostId || submitting}
                        className="rounded-full bg-[#f2d412] hover:bg-[#f2c112] text-zinc-900 font-medium gap-2"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            'Add to post'
                        )}
                    </Button>
                </div>
            }
        >
            <div className="px-6 py-4 space-y-4">
                {loading && !strategies.length ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                    </div>
                ) : strategies.length === 0 ? (
                    <p className="text-sm text-zinc-500 py-6 text-center">
                        No strategies yet. Create a strategy first in Strategy Planner.
                    </p>
                ) : (
                    <>
                        <div>
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                                Strategy
                            </label>
                            <Select value={selectedStrategyId} onValueChange={setSelectedStrategyId}>
                                <SelectTrigger className="h-10 border-zinc-200">
                                    <SelectValue placeholder="Select strategy" />
                                </SelectTrigger>
                                <SelectContent>
                                    {strategies.map((s) => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {selectedStrategyId && (
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                                    Post to attach content to
                                </label>
                                {loading && !posts.length ? (
                                    <div className="flex justify-center py-4">
                                        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                                    </div>
                                ) : posts.length === 0 ? (
                                    <p className="text-sm text-zinc-500 py-4">
                                        No posts in this strategy.
                                    </p>
                                ) : (
                                    <Select value={selectedPostId} onValueChange={setSelectedPostId}>
                                        <SelectTrigger className="h-10 border-zinc-200">
                                            <SelectValue placeholder="Select post" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {posts.map((p) => (
                                                <SelectItem key={p.id} value={p.id}>
                                                    Day {p.day} • {p.platform} • {p.idea || 'Untitled'}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </SlidePanel>
    );
}
