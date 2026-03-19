'use client';

import { useCalendar } from './calendar-context';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import {
    Megaphone,
    Plus,
    StickyNote,
    X,
    Check,
    Loader2,
    Linkedin,
    Youtube,
    Heart,
    MessageCircle,
    Send,
    Bookmark,
    ThumbsUp,
    Repeat2,
    Share2,
    MoreHorizontal,
} from 'lucide-react';
import { useMemo, useState, useRef } from 'react';
import { toast } from 'sonner';

// Platform rendering is handled by PlatformPreview below.

// One distinct color per day of the week (Sun → Sat)
const DAY_COLORS = [
    '#f43f5e', // Sun – rose
    '#8b5cf6', // Mon – violet
    '#3b82f6', // Tue – blue
    '#10b981', // Wed – emerald
    '#f59e0b', // Thu – amber
    '#f97316', // Fri – orange
    '#06b6d4', // Sat – cyan
];

function getInitials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || '?';
}

function PlatformPreview({
    platformKey,
    whenLabel,
    accountName,
    accountImage,
    title,
    description,
    media,
}: {
    platformKey: string;
    whenLabel: string;
    accountName?: string;
    accountImage?: string | null;
    title: string;
    description?: string | null;
    media?: string;
}) {
    const name = accountName || 'Account';
    const initials = getInitials(name);
    const text = (description || title || '').trim();

    if (platformKey === 'youtube') {
        return (
            <div className="p-2">
                {/* YouTube-style video card */}
                <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1 text-[9px] font-bold text-zinc-500">
                        <Youtube className="h-3 w-3 text-red-600" />
                        <span className="uppercase tracking-wide">YouTube</span>
                    </div>
                    <span className="text-[10px] font-black text-zinc-500">{whenLabel}</span>
                </div>

                <div className="mt-2 relative w-full aspect-video rounded-lg overflow-hidden bg-zinc-100">
                    {media ? (
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={media} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400 font-semibold">
                            Thumbnail
                        </div>
                    )}
                    {/* Duration badge (placeholder for realism) */}
                    <div className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[9px] font-bold text-white">
                        10:40
                    </div>
                </div>

                <div className="mt-2 flex items-start gap-2">
                    {accountImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={accountImage} alt="" className="h-7 w-7 rounded-full object-cover bg-zinc-100 shrink-0" />
                    ) : (
                        <div className="h-7 w-7 rounded-full bg-zinc-200 flex items-center justify-center text-[10px] font-black text-zinc-700 shrink-0">
                            {initials}
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <div className="text-[11px] font-black text-zinc-900 line-clamp-2 leading-snug">
                                    {title}
                                </div>
                                <div className="text-[10px] text-zinc-500 truncate">{name}</div>
                                <div className="text-[9px] text-zinc-400 mt-0.5">Scheduled • {whenLabel}</div>
                            </div>
                            <MoreHorizontal className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (platformKey === 'linkedin') {
        return (
            <div className="p-2">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-zinc-500">{whenLabel}</span>
                    <div className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[9px] font-bold text-sky-800 border border-sky-200">
                        <Linkedin className="h-3 w-3" />
                        LinkedIn
                    </div>
                </div>

                <div className="mt-2 flex items-start gap-2">
                    {accountImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={accountImage} alt="" className="h-7 w-7 rounded-full object-cover bg-zinc-100 shrink-0" />
                    ) : (
                        <div className="h-7 w-7 rounded-full bg-sky-100 text-sky-900 flex items-center justify-center text-[10px] font-black shrink-0">
                            {initials}
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                                <div className="text-[11px] font-black text-zinc-900 truncate">{name}</div>
                                <div className="text-[9px] text-zinc-500 truncate">Scheduled post</div>
                            </div>
                            <MoreHorizontal className="h-4 w-4 text-zinc-400 shrink-0" />
                        </div>
                    </div>
                </div>

                <div className="mt-2 text-[11px] text-zinc-800 whitespace-pre-wrap line-clamp-4 leading-snug">
                    {text || title}
                </div>

                {media && (
                    <div className="mt-2 w-full rounded-lg overflow-hidden bg-zinc-100">
                        <div className="w-full aspect-video">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={media} alt="" className="w-full h-full object-cover" />
                        </div>
                    </div>
                )}

                <div className="mt-2 grid grid-cols-4 gap-1 text-[9px] font-semibold text-zinc-500">
                    <div className="flex items-center justify-center gap-1 rounded-md py-1 hover:bg-zinc-50">
                        <ThumbsUp className="h-3 w-3" /> Like
                    </div>
                    <div className="flex items-center justify-center gap-1 rounded-md py-1 hover:bg-zinc-50">
                        <MessageCircle className="h-3 w-3" /> Comment
                    </div>
                    <div className="flex items-center justify-center gap-1 rounded-md py-1 hover:bg-zinc-50">
                        <Repeat2 className="h-3 w-3" /> Repost
                    </div>
                    <div className="flex items-center justify-center gap-1 rounded-md py-1 hover:bg-zinc-50">
                        <Send className="h-3 w-3" /> Send
                    </div>
                </div>
            </div>
        );
    }

    if (platformKey === 'instagram') {
        return (
            <div className="p-2">
                {/* Instagram feed-like card */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                        {accountImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={accountImage} alt="" className="h-7 w-7 rounded-full object-cover bg-zinc-100 shrink-0" />
                        ) : (
                            <div className="h-7 w-7 rounded-full bg-linear-to-br from-rose-500 via-fuchsia-500 to-blue-500 p-px shrink-0">
                                <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-[10px] font-black text-zinc-900">
                                    {initials}
                                </div>
                            </div>
                        )}
                        <div className="min-w-0">
                            <div className="text-[11px] font-black text-zinc-900 truncate">{name}</div>
                            <div className="text-[9px] text-zinc-500 truncate">Scheduled • {whenLabel}</div>
                        </div>
                    </div>
                    <MoreHorizontal className="h-4 w-4 text-zinc-400 shrink-0" />
                </div>

                <div className="mt-2 w-full aspect-square rounded-lg overflow-hidden bg-zinc-100">
                    {media ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={media} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400 font-semibold">
                            Media
                        </div>
                    )}
                </div>

                <div className="mt-2 flex items-center justify-between text-zinc-700">
                    <div className="flex items-center gap-3">
                        <Heart className="h-4 w-4" />
                        <MessageCircle className="h-4 w-4" />
                        <Send className="h-4 w-4" />
                    </div>
                    <Bookmark className="h-4 w-4" />
                </div>

                <div className="mt-2 text-[10px] text-zinc-700 whitespace-pre-wrap line-clamp-3 leading-snug">
                    <span className="font-black">{name}</span> {text || title}
                </div>
            </div>
        );
    }

    if (platformKey === 'facebook') {
        return (
            <div className="p-2">
                {/* Facebook feed-like card */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                        {accountImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={accountImage} alt="" className="h-7 w-7 rounded-full object-cover bg-zinc-100 shrink-0" />
                        ) : (
                            <div className="h-7 w-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                                {initials}
                            </div>
                        )}
                        <div className="min-w-0">
                            <div className="text-[11px] font-black text-zinc-900 truncate">{name}</div>
                            <div className="text-[9px] text-zinc-500 truncate">Scheduled • {whenLabel}</div>
                        </div>
                    </div>
                    <MoreHorizontal className="h-4 w-4 text-zinc-400 shrink-0" />
                </div>

                <div className="mt-2 text-[11px] text-zinc-800 whitespace-pre-wrap line-clamp-3 leading-snug">
                    {text || title}
                </div>

                {media && (
                    <div className="mt-2 w-full aspect-video rounded-lg overflow-hidden bg-zinc-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={media} alt="" className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="mt-2 grid grid-cols-3 gap-1 text-[9px] font-semibold text-zinc-500">
                    <div className="flex items-center justify-center gap-1 rounded-md py-1 hover:bg-zinc-50">
                        <ThumbsUp className="h-3 w-3" /> Like
                    </div>
                    <div className="flex items-center justify-center gap-1 rounded-md py-1 hover:bg-zinc-50">
                        <MessageCircle className="h-3 w-3" /> Comment
                    </div>
                    <div className="flex items-center justify-center gap-1 rounded-md py-1 hover:bg-zinc-50">
                        <Share2 className="h-3 w-3" /> Share
                    </div>
                </div>
            </div>
        );
    }

    if (platformKey === 'tiktok') {
        return (
            <div className="p-2">
                {/* TikTok-style vertical preview */}
                <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1 text-[9px] font-bold text-zinc-500">
                        <span className="h-2 w-2 rounded-full bg-zinc-900" />
                        <span className="uppercase tracking-wide">TikTok</span>
                    </div>
                    <span className="text-[10px] font-black text-zinc-500">{whenLabel}</span>
                </div>

                <div className="mt-2 relative w-full aspect-9/16 rounded-xl overflow-hidden bg-zinc-100">
                    {media ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={media} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400 font-semibold">
                            Video
                        </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent" />

                    {/* Right-side actions (visual only) */}
                    <div className="absolute right-2 bottom-10 flex flex-col items-center gap-3 text-white">
                        <div className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center border border-white/20">
                            <Heart className="h-4 w-4" />
                        </div>
                        <div className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center border border-white/20">
                            <MessageCircle className="h-4 w-4" />
                        </div>
                        <div className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center border border-white/20">
                            <Share2 className="h-4 w-4" />
                        </div>
                    </div>

                    {/* Bottom caption */}
                    <div className="absolute left-2 right-12 bottom-2 text-white">
                        <div className="text-[10px] font-black truncate">@{name.replace(/\s+/g, '').toLowerCase()}</div>
                        <div className="text-[9px] leading-snug line-clamp-2 opacity-95">{text || title}</div>
                        <div className="mt-1 text-[9px] opacity-80 truncate">♪ Original audio • Scheduled</div>
                    </div>
                </div>
            </div>
        );
    }

    // Fallback (unknown platform)
    return (
        <div className="p-2">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-zinc-500">{whenLabel}</span>
                <div className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[9px] font-bold text-zinc-700 border border-zinc-200">
                    <Share2 className="h-3 w-3" />
                    Post
                </div>
            </div>
            <div className="mt-2 text-[11px] font-black text-zinc-900 line-clamp-2 leading-snug">{title}</div>
            {description && <div className="mt-1 text-[10px] text-zinc-500 line-clamp-3">{description}</div>}
            {media && (
                <div className="mt-2 w-full aspect-video rounded-lg overflow-hidden bg-zinc-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={media} alt="" className="w-full h-full object-cover" />
                </div>
            )}
        </div>
    );
}

interface HBarProps {
    total: number;
    posted: number;
    color: string;
}

function HBar({ total, posted, color }: HBarProps) {
    const pct = total === 0 ? 0 : Math.min(100, Math.round((posted / total) * 100));
    return (
        <div className="w-full h-[15px] rounded-full overflow-hidden bg-zinc-200">
            <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                    width: total === 0 ? '100%' : `${Math.max(4, pct)}%`,
                    backgroundColor: color,
                    opacity: total === 0 ? 0.15 : 1,
                }}
            />
        </div>
    );
}

export function WeekView() {
    const { currentDate, events, socialConnections, openCreateDialog, openEditDialog, fetchEvents } = useCalendar();

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday start
    const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

    // Note input state: key = 'yyyy-MM-dd', value = draft text
    const [noteOpen, setNoteOpen] = useState<string | null>(null);
    const [noteText, setNoteText] = useState('');
    const [noteSaving, setNoteSaving] = useState(false);
    const noteRef = useRef<HTMLTextAreaElement>(null);

    const eventsByDay = useMemo(() => {
        const map = new Map<string, typeof events>();
        for (const day of days) {
            map.set(format(day, 'yyyy-MM-dd'), []);
        }
        for (const e of events) {
            const d = parseISO(e.scheduled_at);
            const key = format(d, 'yyyy-MM-dd');
            const arr = map.get(key);
            if (arr) arr.push(e);
        }
        for (const [key, arr] of map.entries()) {
            map.set(
                key,
                [...arr].sort((a, b) => parseISO(a.scheduled_at).getTime() - parseISO(b.scheduled_at).getTime())
            );
        }
        return map;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [events, currentDate]);

    const resolveAccount = (accountId: string | null) =>
        accountId ? socialConnections.find((c) => c.id === accountId) : undefined;

    const openNote = (key: string) => {
        setNoteOpen(key);
        setNoteText('');
        setTimeout(() => noteRef.current?.focus(), 50);
    };

    const cancelNote = () => {
        setNoteOpen(null);
        setNoteText('');
    };

    const saveNote = async (day: Date) => {
        if (!noteText.trim()) { cancelNote(); return; }
        setNoteSaving(true);
        try {
            const scheduled_at = new Date(day);
            scheduled_at.setHours(0, 0, 0, 0);
            const res = await fetch('/api/schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: noteText.trim(),
                    type: 'note',
                    color: 'amber',
                    scheduled_at: scheduled_at.toISOString(),
                }),
            });
            if (res.ok) {
                toast.success('Note added');
                fetchEvents();
                cancelNote();
            } else {
                toast.error('Failed to save note');
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setNoteSaving(false);
        }
    };

    return (
        <div className="w-full text-zinc-900">
            {/* Analytics Row */}
            <div className="grid grid-cols-7 gap-[5px] mb-[5px]">
                {days.map((day, dayIdx) => {
                    const key = format(day, 'yyyy-MM-dd');
                    const dayEvts = eventsByDay.get(key) || [];
                    const total = dayEvts.length;
                    const posted = dayEvts.filter(e => e.status === 'completed' || e.status === 'published').length;
                    const color = DAY_COLORS[dayIdx % 7];
                    return (
                        <div key={key} className="flex items-center justify-center px-2 py-2">
                            <div className="w-full max-w-[120px]">
                                <HBar total={total} posted={posted} color={color} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Week Columns — 7 equal columns, vertical scroll only */}
            <div className="grid grid-cols-7 gap-[5px] items-start overflow-y-auto max-h-[calc(100vh-260px)]">
                {days.map((day) => {
                    const isToday = isSameDay(day, new Date());
                    const key = format(day, 'yyyy-MM-dd');
                    const dayEvents = eventsByDay.get(key) || [];
                    const defaultCreateDate = new Date(day);
                    defaultCreateDate.setHours(9, 0, 0, 0);

                    return (
                        <div
                            key={key}
                            className={cn(
                                'rounded-xl border bg-white overflow-hidden flex flex-col',
                                isToday ? 'border-amber-300 shadow-md' : 'border-zinc-200 shadow-sm'
                            )}
                        >
                            {/* Column header */}
                            <div className={cn(
                                'px-2 pt-2 pb-1.5 border-b flex flex-col gap-1.5',
                                isToday ? 'bg-amber-50 border-amber-200' : 'bg-zinc-50 border-zinc-200'
                            )}>
                                {/* Row 1: date + add post */}
                                <div className="flex items-center justify-between gap-1">
                                    <div className="min-w-0">
                                        <div className={cn('text-[11px] font-bold truncate', isToday ? 'text-amber-600' : 'text-zinc-500')}>
                                            {format(day, 'EEE')}
                                        </div>
                                        <div className={cn('text-[12px] font-black truncate', isToday ? 'text-amber-800' : 'text-zinc-900')}>
                                            {format(day, 'MMM d, yyyy')}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => openCreateDialog(defaultCreateDate)}
                                        title="Add post"
                                        className={cn(
                                            'h-6 w-6 rounded-lg flex items-center justify-center transition-colors shrink-0',
                                            isToday ? 'bg-amber-300 hover:bg-amber-400 text-zinc-900' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
                                        )}
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                {/* Row 2: Add Note button */}
                                <button
                                    onClick={() => openNote(key)}
                                    className="w-full flex items-center justify-center gap-1 h-6 rounded-lg bg-violet-100 hover:bg-violet-200 text-violet-700 hover:text-violet-800 transition-colors text-[10px] font-bold border border-violet-200"
                                >
                                    <StickyNote className="h-3 w-3" />
                                    Add Note
                                </button>
                            </div>

                            {/* Inline note input */}
                            {noteOpen === key && (
                                <div className="mx-[6px] mt-[6px] rounded-xl border border-amber-300 bg-amber-50 shadow-sm overflow-hidden">
                                    <textarea
                                        ref={noteRef}
                                        value={noteText}
                                        onChange={e => setNoteText(e.target.value)}
                                        placeholder="Write a note for this day..."
                                        rows={3}
                                        className="w-full bg-transparent px-3 pt-2 pb-1 text-[12px] text-zinc-800 placeholder:text-amber-400 resize-none focus:outline-none font-medium"
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) saveNote(day);
                                            if (e.key === 'Escape') cancelNote();
                                        }}
                                    />
                                    <div className="flex items-center justify-end gap-1 px-2 pb-2">
                                        <button onClick={cancelNote} className="h-6 w-6 rounded-lg flex items-center justify-center bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-500 transition-colors">
                                            <X className="h-3 w-3" />
                                        </button>
                                        <button
                                            onClick={() => saveNote(day)}
                                            disabled={noteSaving || !noteText.trim()}
                                            className="h-6 w-6 rounded-lg flex items-center justify-center bg-amber-400 hover:bg-amber-500 text-zinc-900 transition-colors disabled:opacity-50"
                                        >
                                            {noteSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Cards */}
                            <div className="flex flex-col gap-[6px] p-[6px]">
                                {dayEvents.length === 0 && noteOpen !== key ? (
                                    <button
                                        onClick={() => openCreateDialog(defaultCreateDate)}
                                        className="w-full min-h-[100px] rounded-lg border border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center text-center p-3 hover:border-amber-300 hover:bg-amber-50/40 transition-colors"
                                    >
                                        <Megaphone className="h-5 w-5 text-zinc-300 mb-1" />
                                        <div className="text-[10px] font-bold text-zinc-400">No posts</div>
                                    </button>
                                ) : (
                                    dayEvents.map((event) => {
                                        const isNote = (event.type || '').toLowerCase() === 'note';
                                        const when = parseISO(event.scheduled_at);
                                        const account = resolveAccount(event.account_id);
                                        const media = event.media_url?.split(',')[0]?.trim();

                                        // Note card — amber sticky style
                                        if (isNote) {
                                            return (
                                                <button
                                                    key={event.id}
                                                    onClick={() => openEditDialog(event)}
                                                    className="w-full text-left rounded-xl border border-amber-200 bg-amber-50 shadow-sm px-3 py-2 hover:border-amber-400 hover:bg-amber-100 transition-all"
                                                >
                                                    <div className="flex items-center gap-1 mb-1">
                                                        <StickyNote className="h-3 w-3 text-amber-500 shrink-0" />
                                                        <span className="text-[9px] font-black uppercase tracking-wide text-amber-600">Note</span>
                                                        <span className="ml-auto text-[9px] text-amber-400 font-medium">{format(when, 'h:mm a')}</span>
                                                    </div>
                                                    <div className="text-[11px] font-semibold text-amber-900 line-clamp-3 leading-snug whitespace-pre-wrap">
                                                        {event.title}
                                                    </div>
                                                </button>
                                            );
                                        }

                                        // Post / event card
                                        const platformKey = (account?.platform || event.platform || '').toLowerCase();
                                        const whenLabel = format(when, 'h:mm a');

                                        return (
                                            <button
                                                key={event.id}
                                                onClick={() => openEditDialog(event)}
                                                className={cn(
                                                    'w-full text-left rounded-xl border bg-white shadow-sm transition-all hover:shadow-md hover:border-amber-300 overflow-hidden',
                                                    event.status === 'cancelled' ? 'opacity-50 border-zinc-200' : 'border-zinc-200'
                                                )}
                                            >
                                                <PlatformPreview
                                                    platformKey={platformKey}
                                                    whenLabel={whenLabel}
                                                    accountName={account?.profile_name || undefined}
                                                    accountImage={account?.profile_image}
                                                    title={event.title}
                                                    description={event.description}
                                                    media={media}
                                                />
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
