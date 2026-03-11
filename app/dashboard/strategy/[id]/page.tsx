'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft, LayoutGrid, Table2 } from 'lucide-react';
import Link from 'next/link';
import { StrategyColumn } from '@/components/strategy/strategy-column';
import { StrategyTableView } from '@/components/strategy/strategy-table-view';
import { StrategyPostDetailSidebar } from '@/components/strategy/strategy-post-detail-sidebar';
import { EditStrategyPostModal } from '@/components/strategy/edit-strategy-post-modal';
import { PostToPlatformsModal } from '@/components/strategy/post-to-platforms-modal';
import type { StrategyPost } from '@/components/strategy/edit-strategy-post-modal';
import { addDays, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Strategy {
    id: string;
    name: string;
    duration_days: number;
    start_date?: string | null;
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
    const [cloneFrom, setCloneFrom] = useState<StrategyPost | null>(null);
    const [postToPlatformsOpen, setPostToPlatformsOpen] = useState(false);
    const [postForPlatforms, setPostForPlatforms] = useState<StrategyPost | null>(null);
    const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
    const [sidebarPost, setSidebarPost] = useState<StrategyPost | null>(null);

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
        setCloneFrom(null);
        setEditModalOpen(true);
    };

    const handleEditPost = (post: StrategyPost) => {
        setEditingPost(post);
        setAddDay(null);
        setCloneFrom(null);
        setEditModalOpen(true);
    };

    const handleClonePost = (post: StrategyPost) => {
        setCloneFrom(post);
        setEditingPost(null);
        setAddDay(post.day);
        setEditModalOpen(true);
    };

    const handlePostToPlatforms = (post: StrategyPost) => {
        setPostForPlatforms(post);
        setPostToPlatformsOpen(true);
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
                <p className="text-base text-zinc-500">Loading strategy...</p>
            </div>
        );
    }

    if (!strategy) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
                <p className="text-base text-zinc-500">Strategy not found.</p>
                <Link href="/dashboard/strategy">
                    <Button variant="outline" className="rounded-full font-medium text-[15px]">
                        Back to Strategies
                    </Button>
                </Link>
            </div>
        );
    }

    const duration = strategy.duration_days || 30;
    const postsByDay: Record<number, StrategyPost[]> = {};
    const dateLabels: Record<number, string | null> = {};

    let baseDate: Date | null = null;
    if (strategy.start_date) {
        baseDate = new Date(strategy.start_date);
    }

    for (let d = 1; d <= duration; d++) {
        postsByDay[d] = (strategy.posts || []).filter((p) => p.day === d);
        if (baseDate) {
            const date = addDays(baseDate, d - 1);
            dateLabels[d] = format(date, 'dd/MM/yy');
        } else {
            dateLabels[d] = null;
        }
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
                            className="text-xl font-semibold tracking-tight border-0 border-b-2 border-transparent hover:border-zinc-200 focus:border-zinc-400 bg-transparent px-0 h-auto py-1 focus-visible:ring-0 rounded-none max-w-md"
                        />
                        {isSavingName && (
                            <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50/50 p-1">
                    <Button
                        variant={viewMode === 'cards' ? 'secondary' : 'ghost'}
                        size="sm"
                        className={cn(
                            'rounded-md gap-1.5 font-medium text-[13px]',
                            viewMode === 'cards' ? 'bg-white shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
                        )}
                        onClick={() => setViewMode('cards')}
                    >
                        <LayoutGrid className="h-4 w-4" />
                        Cards
                    </Button>
                    <Button
                        variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                        size="sm"
                        className={cn(
                            'rounded-md gap-1.5 font-medium text-[13px]',
                            viewMode === 'table' ? 'bg-white shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
                        )}
                        onClick={() => setViewMode('table')}
                    >
                        <Table2 className="h-4 w-4" />
                        Table
                    </Button>
                </div>
            </div>

            <div className="w-full">
                {viewMode === 'cards' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {Array.from({ length: duration }, (_, i) => i + 1).map((day) => (
                            <StrategyColumn
                                key={day}
                                day={day}
                                posts={postsByDay[day] || []}
                                dateLabel={dateLabels[day] || undefined}
                                onAddPost={() => handleAddPost(day)}
                                onEditPost={handleEditPost}
                                onClonePost={handleClonePost}
                                onPostToPlatforms={handlePostToPlatforms}
                                onDeletePost={handleDeletePost}
                                onIncludeChange={handleIncludeChange}
                            />
                        ))}
                    </div>
                ) : (
                    <StrategyTableView
                        posts={strategy.posts}
                        startDate={strategy.start_date}
                        onRowClick={(post) => setSidebarPost(post)}
                        onEdit={handleEditPost}
                        onClone={handleClonePost}
                        onPostToPlatforms={handlePostToPlatforms}
                        onDelete={handleDeletePost}
                        onIncludeChange={handleIncludeChange}
                        onAddPost={() => handleAddPost(1)}
                    />
                )}
            </div>

            <PostToPlatformsModal
                open={postToPlatformsOpen}
                onOpenChange={setPostToPlatformsOpen}
                post={postForPlatforms}
                strategyId={id}
                allPosts={strategy?.posts ?? []}
                onSuccess={() => {
                    fetchStrategy();
                    toast.success('Added to more platforms');
                }}
            />

            <StrategyPostDetailSidebar
                post={sidebarPost}
                open={!!sidebarPost}
                onClose={() => setSidebarPost(null)}
                startDate={strategy.start_date ?? null}
                onEdit={() => {
                    if (sidebarPost) {
                        handleEditPost(sidebarPost);
                        setSidebarPost(null);
                    }
                }}
            />

            <EditStrategyPostModal
                open={editModalOpen}
                onOpenChange={(open) => {
                    setEditModalOpen(open);
                    if (!open) {
                        setAddDay(null);
                        setCloneFrom(null);
                    }
                }}
                post={editingPost}
                strategyId={id}
                durationDays={duration}
                startDate={strategy.start_date ?? null}
                onSave={handleModalSave}
                isCreate={!!addDay || !!cloneFrom}
                initialDay={cloneFrom ? cloneFrom.day : (addDay ?? 1)}
                cloneFrom={cloneFrom}
            />
        </div>
    );
}
