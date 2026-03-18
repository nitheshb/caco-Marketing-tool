'use client';

import { useCalendar } from './calendar-context';
import { useAuth } from '@/lib/auth-context';
import { format, addDays, isSameDay, parseISO, startOfWeek, isFirstDayOfMonth } from 'date-fns';
import { cn } from '@/lib/utils';
import { List, PenSquare, SquarePlus, Tag, Copy, Eye, Pencil, StickyNote, Instagram, Linkedin, Youtube, Facebook, Clock, User } from 'lucide-react';
import { useMemo } from 'react';

const PLATFORM_CONFIG: Record<string, {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
}> = {
    instagram: { icon: Instagram, label: 'Instagram' },
    linkedin:  { icon: Linkedin,  label: 'LinkedIn' },
    youtube:   { icon: Youtube,   label: 'YouTube' },
    facebook:  { icon: Facebook,  label: 'Facebook' },
    tiktok:    { icon: Instagram, label: 'TikTok' },
};

export function ListView() {
    const { currentDate, events, setCurrentDate, openCreateDialog, openEditDialog, socialConnections } = useCalendar();
    const { user } = useAuth();

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    const days = Array.from({ length: 21 }).map((_, i) => addDays(weekStart, i));

    const eventsByDay = useMemo(() => {
        const map = new Map<string, typeof events>();
        for (const d of days) {
            map.set(format(d, 'yyyy-MM-dd'), []);
        }
        for (const e of events) {
            const key = format(parseISO(e.scheduled_at), 'yyyy-MM-dd');
            const arr = map.get(key);
            if (arr) arr.push(e);
        }
        return map;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [events, currentDate]);

    const resolveAccount = (id: string | null) =>
        id ? socialConnections.find((c) => c.id === id) : undefined;

    const getInitials = (name: string) =>
        name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?';

    return (
        <div className="w-full text-zinc-900">
            {/* Post Volume — horizontal date timeline */}
            <div className="mb-3">
                <div className="text-xs font-semibold text-zinc-500 mb-2">Post Volume</div>
                <div className="flex items-end overflow-x-auto pb-1">
                    {Array.from({ length: 3 }).map((_, weekIdx) => (
                        <div key={weekIdx} className={cn('flex items-end', weekIdx < 2 && 'mr-6')}>
                            {days.slice(weekIdx * 7, weekIdx * 7 + 7).map((day) => {
                                const key = format(day, 'yyyy-MM-dd');
                                const isSelected = isSameDay(day, currentDate);
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setCurrentDate(day)}
                                        className="flex flex-col items-center min-w-[32px] group shrink-0"
                                    >
                                        <div
                                            className={cn(
                                                'w-4 h-0.5 rounded-full mb-1 transition-colors',
                                                isSelected ? 'bg-blue-500' : 'bg-zinc-300 group-hover:bg-zinc-400'
                                            )}
                                        />
                                        <span
                                            className={cn(
                                                'text-[11px] font-medium',
                                                isSelected ? 'text-blue-600 font-semibold' : 'text-zinc-600'
                                            )}
                                        >
                                            {isFirstDayOfMonth(day) ? format(day, 'd MMM') : format(day, 'd')}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Selected date in blue */}
            <div className="text-sm font-medium text-blue-600 mb-4">
                {format(currentDate, 'EEE, MMM d, yyyy')}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => openCreateDialog(currentDate)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-medium text-sm transition-colors"
                >
                    <PenSquare className="h-4 w-4" />
                    Schedule Post
                </button>
                <button
                    onClick={() => openCreateDialog(currentDate)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-medium text-sm transition-colors"
                >
                    <SquarePlus className="h-4 w-4" />
                    Add Note
                </button>
            </div>

            {/* List of posts */}
            <div className="space-y-4">
                {(() => {
                    const key = format(currentDate, 'yyyy-MM-dd');
                    const dayEvents = (eventsByDay.get(key) || []).filter(
                        (e) => (e.type || '').toLowerCase() !== 'note'
                    );
                    const dayNotes = (eventsByDay.get(key) || []).filter(
                        (e) => (e.type || '').toLowerCase() === 'note'
                    );

                    if (dayEvents.length === 0 && dayNotes.length === 0) {
                        return (
                            <div
                                onClick={() => openCreateDialog(currentDate)}
                                className="flex flex-col items-center justify-center py-16 rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 cursor-pointer hover:border-amber-300 hover:bg-amber-50/40 transition-colors max-w-2xl mx-auto"
                            >
                                <p className="text-zinc-500 font-medium text-sm">No scheduled posts</p>
                                <p className="text-zinc-400 text-xs mt-1">Click to add a post</p>
                            </div>
                        );
                    }

                    return (
                        <>
                            {dayEvents.map((event) => {
                                const when = parseISO(event.scheduled_at);
                                const addedAt = event.created_at ? parseISO(event.created_at) : null;
                                const account = resolveAccount(event.account_id);
                                const platformKey = (account?.platform || event.platform || '').toLowerCase();
                                const cfg = PLATFORM_CONFIG[platformKey] || { icon: List, label: 'Post' };
                                const PlatformIcon = cfg.icon;
                                const media = event.media_url?.split(',')[0]?.trim();
                                const statusLabel = event.status === 'scheduled' ? 'Scheduled' : event.status === 'completed' ? 'Published' : event.status === 'cancelled' ? 'Cancelled' : 'Draft';
                                const addedByName = user?.displayName || user?.email?.split('@')[0] || 'You';

                                return (
                                    <div
                                        key={event.id}
                                        onClick={() => openEditDialog(event)}
                                        className="rounded-lg border border-zinc-200 bg-white hover:border-zinc-300 transition-colors overflow-hidden cursor-pointer max-w-2xl mx-auto"
                                    >
                                        {/* Card header — pale yellow */}
                                        <div className="flex items-start justify-between gap-3 px-4 py-3 bg-amber-50/40 border-b border-zinc-100">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-amber-900 font-semibold text-sm shrink-0">
                                                    {account?.profile_name ? getInitials(account.profile_name) : '?'}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <PlatformIcon className="h-4 w-4 text-zinc-600 shrink-0" />
                                                        <span className="font-semibold text-zinc-900 truncate">
                                                            {account?.profile_name || event.title}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-zinc-500 mt-0.5">
                                                        {cfg.label} {account?.platform ? '•' : ''} {statusLabel}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-xs text-zinc-500 shrink-0">
                                                {format(when, 'EEE, MMM d, yyyy h:mm a')}
                                            </div>
                                        </div>

                                        {/* Centered metadata — Added at, Added by */}
                                        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2 bg-zinc-50/80 border-b border-zinc-100 text-center">
                                            {addedAt && (
                                                <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    Added at {format(addedAt, 'h:mm a')} on {format(addedAt, 'MMM d, yyyy')}
                                                </span>
                                            )}
                                            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                                                <User className="h-3.5 w-3.5" />
                                                Added by {addedByName}
                                            </span>
                                            {event.series?.series_name && (
                                                <span className="text-xs text-zinc-500">
                                                    Series: {event.series.series_name}
                                                </span>
                                            )}
                                        </div>

                                        {/* Card body */}
                                        <div className="p-4">
                                            <div className="text-sm text-zinc-800 whitespace-pre-wrap">
                                                {event.title}
                                            </div>
                                            {event.description && (
                                                <div className="text-sm text-zinc-600 mt-1 whitespace-pre-wrap">{event.description}</div>
                                            )}
                                            {media && (
                                                <div className="mt-3 rounded-lg overflow-hidden bg-zinc-100 aspect-square max-w-[280px] mx-auto">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={media} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Card footer — toolbar */}
                                        <div className="flex items-center justify-end gap-1 px-4 py-2 border-t border-zinc-100" onClick={e => e.stopPropagation()}>
                                            <button
                                                onClick={() => openEditDialog(event)}
                                                className="p-2 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors" title="View">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors" title="Copy">
                                                <Copy className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors" title="Tag">
                                                <Tag className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            {dayNotes.map((event) => {
                                const noteAddedAt = event.created_at ? parseISO(event.created_at) : null;
                                const noteAddedByName = user?.displayName || user?.email?.split('@')[0] || 'You';
                                return (
                                    <div
                                        key={event.id}
                                        onClick={() => openEditDialog(event)}
                                        className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 cursor-pointer hover:border-amber-300 transition-colors max-w-2xl mx-auto"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <StickyNote className="h-4 w-4 text-amber-600" />
                                            <span className="text-xs font-semibold text-amber-700">Note</span>
                                        </div>
                                        <div className="font-medium text-amber-900 mt-1 text-center">{event.title}</div>
                                        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-2 text-center">
                                            {noteAddedAt && (
                                                <span className="inline-flex items-center gap-1.5 text-xs text-amber-600/80">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    Added at {format(noteAddedAt, 'h:mm a')} on {format(noteAddedAt, 'MMM d, yyyy')}
                                                </span>
                                            )}
                                            <span className="inline-flex items-center gap-1.5 text-xs text-amber-600/80">
                                                <User className="h-3.5 w-3.5" />
                                                Added by {noteAddedByName}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    );
                })()}
            </div>
        </div>
    );
}
