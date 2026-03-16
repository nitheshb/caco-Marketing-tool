'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { StrategyColumn } from '@/components/strategy/strategy-column';
import { StrategyPostCard } from '@/components/strategy/strategy-post-card';
import { StrategyTableView } from '@/components/strategy/strategy-table-view';
import { StrategyBoardSkeleton } from '@/components/strategy/strategy-board-skeleton';
import { StrategyPostDetailSidebar } from '@/components/strategy/strategy-post-detail-sidebar';
import { StrategyPostContentModal } from '@/components/strategy/strategy-post-content-modal';
import { EditStrategyPostModal } from '@/components/strategy/edit-strategy-post-modal';
import { PostToPlatformsModal } from '@/components/strategy/post-to-platforms-modal';
import { ScheduleToCalendarModal } from '@/components/strategy/schedule-to-calendar-modal';
import type { StrategyPost } from '@/components/strategy/edit-strategy-post-modal';
import { addDays, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

function formatLabel(s: string) {
    return s.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function StatRingCard({
    label,
    valueLabel,
    subtitle,
    progress,
    accentColor,
}: {
    label: string;
    valueLabel: string;
    subtitle: string;
    progress: number;
    accentColor: string;
}) {
    const radius = 32;
    const circumference = 2 * Math.PI * radius;
    const safeProgress = Math.min(Math.max(progress, 0), 1);
    const offset = circumference * (1 - safeProgress);

    return (
        <div className="flex items-center gap-4 rounded-2xl bg-white border border-zinc-200 px-4 py-3.5 shadow-sm">
            <div className="relative h-20 w-20 flex items-center justify-center">
                <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                    <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        className="stroke-zinc-200"
                        strokeWidth="8"
                        fill="none"
                    />
                    <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        stroke={accentColor}
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs font-medium text-zinc-600">
                        {Math.round(safeProgress * 100)}%
                    </span>
                </div>
            </div>
            <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                    {label}
                </div>
                <div className="text-[19px] font-semibold text-zinc-900 leading-tight">
                    {valueLabel}
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">{subtitle}</div>
            </div>
        </div>
    );
}

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
    const [postForSchedule, setPostForSchedule] = useState<StrategyPost | null>(null);
    const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
    const [sidebarPost, setSidebarPost] = useState<StrategyPost | null>(null);
    const [contentPost, setContentPost] = useState<StrategyPost | null>(null);
    const [filter, setFilter] = useState<string>('all');

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

    const handleScheduleToCalendar = (post: StrategyPost) => {
        setPostForSchedule(post);
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

    const posts = strategy?.posts ?? [];
    const duration = strategy?.duration_days ?? 30;

    const goalFilters = useMemo(() => {
        const goals = new Set(posts.map((p) => p.goal).filter(Boolean));
        return ['all', ...Array.from(goals)];
    }, [posts]);

    const filteredPosts = useMemo(() => {
        if (filter === 'all') return posts;
        return posts.filter((p) => p.goal === filter);
    }, [posts, filter]);

    const readyCount = useMemo(
        () => posts.filter((p) => p.status === 'content_ready').length,
        [posts]
    );

    const primaryGoal = useMemo(() => {
        const counts: Record<string, number> = {};
        posts.forEach((p) => {
            if (p.goal) counts[p.goal] = (counts[p.goal] || 0) + 1;
        });
        const entries = Object.entries(counts);
        if (entries.length === 0) return { goal: '—', count: 0 };
        const [goal, count] = entries.reduce((a, b) => (a[1] > b[1] ? a : b));
        return { goal: formatLabel(goal), count };
    }, [posts]);

    const platformCoverage = useMemo(() => {
        const platforms = new Set(posts.map((p) => p.platform?.toLowerCase()).filter(Boolean));
        return `${platforms.size} platform${platforms.size !== 1 ? 's' : ''}`;
    }, [posts]);

    const baseDate = strategy?.start_date ? new Date(strategy.start_date) : null;
    const todayDay = useMemo(() => {
        if (!baseDate) return 1;
        return Math.min(
            Math.max(1, Math.floor((Date.now() - baseDate.getTime()) / 86400000) + 1),
            duration
        );
    }, [baseDate, duration]);

    const remainingDays = Math.max(duration - todayDay, 0);

    const { postsByDay, dateLabels } = useMemo(() => {
        const byDay: Record<number, StrategyPost[]> = {};
        const labels: Record<number, string | null> = {};
        for (let d = 1; d <= duration; d++) {
            byDay[d] = filteredPosts.filter((p) => p.day === d);
            labels[d] = baseDate ? format(addDays(baseDate, d - 1), 'dd/MM/yy') : null;
        }
        return { postsByDay: byDay, dateLabels: labels };
    }, [duration, filteredPosts, baseDate]);

    if (isLoading) {
        return <StrategyBoardSkeleton />;
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

    return (
        <div className="min-h-screen bg-white text-zinc-900">
            <link
                href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@600&display=swap"
                rel="stylesheet"
            />

            {/* Header */}
            <div className="px-6  flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/strategy">
                        <button
                            type="button"
                            className="w-8 h-8 rounded-full border border-zinc-200 bg-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-zinc-200 transition-colors"
                            aria-label="Back"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onBlur={handleNameBlur}
                                className="text-lg font-semibold tracking-tight border-0 bg-transparent px-0 h-auto py-0.5 focus-visible:ring-0 rounded-none max-w-md"
                            />
                            {isSavingName && <Loader2 className="h-4 w-4 animate-spin text-zinc-400 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">AI-generated marketing strategy</p>
                    </div>
                    <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full bg-zinc-900 text-white text-[11px] font-medium">
                        {duration} days
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex bg-zinc-100 rounded-[20px] p-0.5 gap-0.5">
                        <button
                            type="button"
                            className={cn(
                                'text-xs font-medium py-1.5 px-3 rounded-2xl transition-colors',
                                viewMode === 'table'
                                    ? 'bg-zinc-900 text-white'
                                    : 'bg-transparent text-zinc-500 hover:text-zinc-700'
                            )}
                            onClick={() => setViewMode('table')}
                        >
                            Table
                        </button>
                        <button
                            type="button"
                            className={cn(
                                'text-xs font-medium py-1.5 px-3 rounded-2xl transition-colors',
                                viewMode === 'cards'
                                    ? 'bg-white text-zinc-900 border border-zinc-200'
                                    : 'bg-transparent text-zinc-500 hover:text-zinc-700'
                            )}
                            onClick={() => setViewMode('cards')}
                        >
                            Cards
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6 py-5">
                <StatRingCard
                    label="Total posts"
                    valueLabel={`${posts.length} of ${duration} days`}
                    subtitle="7-day plan overview"
                    progress={duration ? posts.length / duration : 0}
                    accentColor="#F5C842"
                />

                <div className="rounded-2xl bg-white border border-zinc-200 px-4 py-3.5 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                        Content ready
                    </div>
                    <div className="mt-1 text-[19px] font-semibold text-zinc-900 leading-tight">
                        {readyCount} of {posts.length || 1}
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                        {Math.max(posts.length - readyCount, 0)} still planned
                    </div>
                </div>

                <div className="rounded-2xl bg-white border border-zinc-200 px-4 py-3.5 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                        Platforms
                    </div>
                    <div className="mt-1 text-[19px] font-semibold text-zinc-900 leading-tight">
                        {platformCoverage}
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                        Channel coverage
                    </div>
                </div>

                <div className="rounded-2xl bg-white border border-zinc-200 px-4 py-3.5 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                        Campaign progress
                    </div>
                    <div className="mt-1 text-[19px] font-semibold text-zinc-900 leading-tight">
                        Day {todayDay} of {duration}
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                        {remainingDays > 0 ? `${remainingDays} days left` : 'Campaign completed'}
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="px-6 pb-1">
                <div className="text-[11px] text-zinc-400 mb-1.5">
                    Campaign progress — Day {todayDay} of {duration}
                </div>
                <div className="h-1 bg-zinc-100 rounded flex gap-0.5 overflow-hidden">
                    {Array.from({ length: duration }, (_, i) => {
                        const dayNum = i + 1;
                        let bg = 'bg-zinc-200';
                        if (dayNum < todayDay) bg = 'bg-zinc-900';
                        else if (dayNum === todayDay) bg = 'bg-[#F5C842]';
                        return <div key={i} className={cn('flex-1 rounded-sm', bg)} />;
                    })}
                </div>
            </div>

            {/* Toolbar: filters + add post */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 px-6 py-3">
                <div className="flex items-center gap-2 flex-wrap">
                    {goalFilters.map((f) => (
                        <button
                            key={f}
                            type="button"
                            className={cn(
                                'text-xs font-medium py-1.5 px-3 rounded-[20px] transition-colors',
                                filter === f
                                    ? 'bg-zinc-900 text-white'
                                    : 'bg-white text-zinc-500 border border-zinc-200 hover:text-zinc-700'
                            )}
                            onClick={() => setFilter(f)}
                        >
                            {f === 'all' ? 'All' : formatLabel(f)}
                        </button>
                    ))}
                </div>
                <Button
                    size="sm"
                    onClick={() => handleAddPost(1)}
                    className="rounded-[20px] bg-[#F5C842] hover:bg-[#f2c112] text-zinc-900 font-medium text-[13px] gap-1.5"
                >
                    <Plus className="h-4 w-4" />
                    Add post
                </Button>
            </div>

            <div className="w-full px-6 pb-6">
                {viewMode === 'cards' ? (
                    filteredPosts.length === 0 ? (
                        <div className="py-12 text-center text-zinc-400 text-[13px]">
                            No posts match this filter.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {[...filteredPosts].sort((a, b) => a.day - b.day).map((post) => (
                                <StrategyPostCard
                                    key={post.id}
                                    post={post}
                                    dateLabel={dateLabels[post.day] || undefined}
                                    onEdit={() => handleEditPost(post)}
                                    onClone={() => handleClonePost(post)}
                                    onPostToPlatforms={() => handlePostToPlatforms(post)}
                                    onScheduleToCalendar={() => handleScheduleToCalendar(post)}
                                    onContent={() => setContentPost(post)}
                                    onDelete={() => handleDeletePost(post)}
                                    onIncludeChange={(c) => handleIncludeChange(post, c)}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    <StrategyTableView
                        posts={filteredPosts}
                        startDate={strategy.start_date}
                        onRowClick={(post) => setSidebarPost(post)}
                        onEdit={handleEditPost}
                        onClone={handleClonePost}
                        onPostToPlatforms={handlePostToPlatforms}
                        onScheduleToCalendar={handleScheduleToCalendar}
                        onContent={(post) => setContentPost(post)}
                        onDelete={handleDeletePost}
                        onIncludeChange={handleIncludeChange}
                        onAddPost={() => handleAddPost(1)}
                    />
                )}
            </div>

            <ScheduleToCalendarModal
                open={!!postForSchedule}
                onClose={() => setPostForSchedule(null)}
                post={postForSchedule}
                strategyId={id}
                startDate={strategy?.start_date ?? null}
                durationDays={strategy?.duration_days ?? 30}
                onSuccess={() => { fetchStrategy(); setPostForSchedule(null); }}
            />

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

            <StrategyPostContentModal
                post={contentPost}
                open={!!contentPost}
                onClose={() => setContentPost(null)}
                strategyId={id}
                onSuccess={() => { fetchStrategy(); setContentPost(null); }}
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
                onContent={() => {
                    if (sidebarPost) {
                        setContentPost(sidebarPost);
                        setSidebarPost(null);
                    }
                }}
                onScheduleToCalendar={() => {
                    if (sidebarPost) {
                        handleScheduleToCalendar(sidebarPost);
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
