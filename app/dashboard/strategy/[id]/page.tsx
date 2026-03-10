'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { StrategyColumn } from '@/components/strategy/strategy-column';
import { EditStrategyPostModal } from '@/components/strategy/edit-strategy-post-modal';
import type { StrategyPost } from '@/components/strategy/edit-strategy-post-modal';
import { toast } from 'sonner';

interface Strategy {
    id: string;
    name: string;
    duration_days: number;
    posts: StrategyPost[];
}

export default function StrategyBoardPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [strategy, setStrategy] = useState<Strategy | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState('');
    const [isSavingName, setIsSavingName] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<StrategyPost | null>(null);
    const [addDay, setAddDay] = useState<number | null>(null);

    const fetchStrategy = useCallback(async () => {
        try {
            const res = await fetch(`/api/strategy/${id}`);
            if (!res.ok) {
                if (res.status === 404) router.replace('/dashboard/strategy');
                return;
            }
            const data = await res.json();
            setStrategy(data);
            setName(data.name);
        } catch {
            setStrategy(null);
        } finally {
            setIsLoading(false);
        }
    }, [id, router]);

    useEffect(() => {
        if (id) fetchStrategy();
    }, [id, fetchStrategy]);

    const handleNameBlur = async () => {
        if (!strategy || name === strategy.name) return;
        setIsSavingName(true);
        try {
            const res = await fetch(`/api/strategy/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim() || strategy.name }),
            });
            if (res.ok) {
                setStrategy((s) => (s ? { ...s, name: name.trim() || s.name } : null));
            }
        } catch {
            setName(strategy.name);
        } finally {
            setIsSavingName(false);
        }
    };

    const handleAddPost = (day: number) => {
        setAddDay(day);
        setEditingPost(null);
        setEditModalOpen(true);
    };

    const handleEditPost = (post: StrategyPost) => {
        setEditingPost(post);
        setAddDay(null);
        setEditModalOpen(true);
    };

    const handleDeletePost = async (post: StrategyPost) => {
        try {
            const res = await fetch(`/api/strategy/${id}/posts/${post.id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setStrategy((s) =>
                    s ? { ...s, posts: s.posts.filter((p) => p.id !== post.id) } : null
                );
                toast.success('Post removed');
            } else throw new Error();
        } catch {
            toast.error('Failed to delete');
        }
    };

    const handleIncludeChange = async (post: StrategyPost, checked: boolean) => {
        try {
            const res = await fetch(`/api/strategy/${id}/posts/${post.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ include_in_calendar: checked }),
            });
            if (res.ok) {
                setStrategy((s) =>
                    s
                        ? {
                              ...s,
                              posts: s.posts.map((p) =>
                                  p.id === post.id ? { ...p, include_in_calendar: checked } : p
                              ),
                          }
                        : null
                );
            } else throw new Error();
        } catch {
            toast.error('Failed to update');
        }
    };

    const handleModalSave = () => {
        fetchStrategy();
    };

    const getDefaultDay = () => addDay ?? 1;

    if (isLoading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                <p className="text-zinc-500 font-medium">Loading strategy...</p>
            </div>
        );
    }

    if (!strategy) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
                <p className="text-zinc-500">Strategy not found.</p>
                <Link href="/dashboard/strategy">
                    <Button variant="outline" className="rounded-xl">
                        Back to Strategies
                    </Button>
                </Link>
            </div>
        );
    }

    const duration = strategy.duration_days || 30;
    const postsByDay: Record<number, StrategyPost[]> = {};
    for (let d = 1; d <= duration; d++) {
        postsByDay[d] = (strategy.posts || []).filter((p) => p.day === d);
    }

    return (
        <div className="space-y-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/strategy">
                        <Button variant="ghost" size="icon" className="rounded-lg">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={handleNameBlur}
                            className="text-xl font-black border-0 border-b-2 border-transparent hover:border-zinc-200 focus:border-indigo-500 bg-transparent px-0 h-auto py-1 focus-visible:ring-0 rounded-none max-w-md"
                        />
                        {isSavingName && (
                            <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                        )}
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-max">
                    {Array.from({ length: duration }, (_, i) => i + 1).map((day) => (
                        <StrategyColumn
                            key={day}
                            day={day}
                            posts={postsByDay[day] || []}
                            onAddPost={() => handleAddPost(day)}
                            onEditPost={handleEditPost}
                            onDeletePost={handleDeletePost}
                            onIncludeChange={handleIncludeChange}
                        />
                    ))}
                </div>
            </div>

            <EditStrategyPostModal
                open={editModalOpen}
                onOpenChange={(open) => {
                    setEditModalOpen(open);
                    if (!open) setAddDay(null);
                }}
                post={editingPost}
                strategyId={id}
                durationDays={duration}
                onSave={handleModalSave}
                isCreate={!!addDay}
                initialDay={addDay ?? 1}
            />
        </div>
    );
}
