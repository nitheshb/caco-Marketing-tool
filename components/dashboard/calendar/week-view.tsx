'use client';

import { useCalendar } from './calendar-context';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Megaphone, Plus } from 'lucide-react';
import { useMemo } from 'react';

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

interface VBarProps {
    total: number;
    posted: number;
    color: string;
    height?: number;
}

function VBar({ total, posted, color, height = 64 }: VBarProps) {
    const pct = total === 0 ? 0 : Math.min(100, Math.round((posted / total) * 100));
    const fillH = total === 0 ? 0 : Math.max(6, Math.round((pct / 100) * height));
    return (
        <div
            className="w-[14px] rounded-full overflow-hidden bg-zinc-200 flex flex-col justify-end"
            style={{ height }}
        >
            <div
                className="w-full rounded-full transition-all duration-500"
                style={{ height: fillH, backgroundColor: color, opacity: total === 0 ? 0.2 : 1 }}
            />
        </div>
    );
}

export function WeekView() {
    const { currentDate, events, socialConnections, openCreateDialog, openEditDialog } = useCalendar();

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday start
    const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

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

    return (
        <div className="flex flex-col text-zinc-900 flex-1 h-[720px] overflow-hidden">
            <div className="flex-1 relative">
                <div className="absolute inset-0 overflow-auto scrollbar scrollbar-thumb-zinc-200 scrollbar-track-zinc-50 bg-zinc-50 p-[6px]">
                    {/* Analytics Row — vertical bar + numbers on the right */}
                    <div className="grid grid-cols-[140px_repeat(7,minmax(0,1fr))] gap-[6px] sticky top-0 z-20 bg-zinc-50 pb-[6px]">
                        {/* Week total */}
                        {(() => {
                            const weekTotal = events.length;
                            const weekPosted = events.filter(e => e.status === 'completed' || e.status === 'published').length;
                            return (
                                <div className="h-[90px] flex items-center justify-center gap-2">
                                    <VBar total={weekTotal} posted={weekPosted} color="#f59e0b" height={68} />
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[15px] font-black text-zinc-700 leading-tight">{weekTotal}</span>
                                        <span className="text-[15px] font-black leading-tight" style={{ color: '#f59e0b' }}>{weekPosted}</span>
                                    </div>
                                </div>
                            );
                        })()}

                        {days.map((day, dayIdx) => {
                            const key = format(day, 'yyyy-MM-dd');
                            const dayEvts = eventsByDay.get(key) || [];
                            const total = dayEvts.length;
                            const posted = dayEvts.filter(e => e.status === 'completed' || e.status === 'published').length;
                            const isToday = isSameDay(day, new Date());
                            const color = DAY_COLORS[dayIdx % 7];

                            return (
                                <div key={key} className="h-[90px] flex items-center justify-center gap-2">
                                    <VBar total={total} posted={posted} color={color} height={isToday ? 72 : 64} />
                                    <div className="flex flex-col gap-0.5">
                                        <span className={cn('text-[15px] font-black leading-tight', isToday ? 'text-zinc-900' : 'text-zinc-600')}>
                                            {total}
                                        </span>
                                        <span className="text-[15px] font-black leading-tight" style={{ color }}>
                                            {posted}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Week Columns */}
                    <div className="grid grid-cols-[140px_repeat(7,minmax(0,1fr))] gap-[6px] min-h-[600px]">
                        {/* Left rail (kept for alignment, like screenshot has empty space) */}
                        <div className="rounded-[10px] border border-zinc-200 bg-white p-3">
                            <div className="text-xs font-bold text-zinc-500 mb-2">Week</div>
                            <div className="text-sm font-black text-zinc-900">{format(weekStart, 'MMM d')}</div>
                            <div className="text-[11px] font-medium text-zinc-400">Drag/drop coming soon</div>
                        </div>

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
                                        'rounded-[10px] border border-zinc-200 bg-white overflow-hidden flex flex-col min-w-[260px]',
                                        isToday && 'border-amber-200 shadow-[0_0_0_2px_rgba(245,158,11,0.18)]'
                                    )}
                                >
                                    <div className="px-3 py-2 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
                                        <div className="min-w-0">
                                            <div className="text-xs font-bold text-zinc-500 truncate">{format(day, 'EEEE')}</div>
                                            <div className={cn('text-xs font-black', isToday ? 'text-amber-700' : 'text-zinc-900')}>
                                                {format(day, 'MMM d, yyyy')}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => openCreateDialog(defaultCreateDate)}
                                            className="h-8 px-2 rounded-[8px] border border-zinc-200 bg-white hover:bg-amber-50 transition-colors text-xs font-bold text-zinc-700 flex items-center gap-1"
                                        >
                                            <Plus className="h-4 w-4 text-amber-600" />
                                            Add
                                        </button>
                                    </div>

                                    <div
                                        onClick={() => openCreateDialog(defaultCreateDate)}
                                        className="flex-1 p-2 overflow-y-auto scrollbar-thin cursor-pointer"
                                    >
                                        {dayEvents.length === 0 ? (
                                            <div className="h-full min-h-[120px] rounded-[10px] border border-dashed border-zinc-200 bg-white flex flex-col items-center justify-center text-center p-6">
                                                <Megaphone className="h-6 w-6 text-zinc-300 mb-2" />
                                                <div className="text-xs font-bold text-zinc-500">No scheduled items</div>
                                                <div className="text-[11px] font-medium text-zinc-400">Click to add one</div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                {dayEvents.map((event) => {
                                                    const when = parseISO(event.scheduled_at);
                                                    const account = resolveAccount(event.account_id);
                                                    const media = event.media_url?.split(',')[0]?.trim();
                                                    const isPost = (event.type || '').toLowerCase() === 'post';

                                                    return (
                                                        <button
                                                            key={event.id}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openEditDialog(event);
                                                            }}
                                                            className={cn(
                                                                'w-full text-left rounded-[12px] border p-2.5 shadow-sm transition-colors hover:border-amber-300 hover:bg-amber-50',
                                                                event.status === 'cancelled' ? 'opacity-60 border-zinc-200 bg-zinc-50' : 'border-zinc-200 bg-white'
                                                            )}
                                                        >
                                                            <div className="flex items-start gap-2">
                                                                {media ? (
                                                                    <div className="h-12 w-12 rounded-[10px] overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                        <img src={media} alt="" className="h-full w-full object-cover" />
                                                                    </div>
                                                                ) : (
                                                                    <div className="h-12 w-12 rounded-[10px] bg-zinc-50 border border-zinc-200 shrink-0 flex items-center justify-center text-zinc-300">
                                                                        <Megaphone className="h-5 w-5" />
                                                                    </div>
                                                                )}

                                                                <div className="min-w-0 flex-1">
                                                                    <div className="flex items-center justify-between gap-2">
                                                                        <div className="text-[11px] font-bold text-zinc-500 truncate">
                                                                            {format(when, 'h:mm a')}
                                                                            {account?.platform ? ` • ${account.platform}` : ''}
                                                                        </div>
                                                                        <div className="text-[10px] font-black uppercase tracking-wide text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                                                                            {isPost ? 'post' : event.type || 'item'}
                                                                        </div>
                                                                    </div>

                                                                    <div className="mt-0.5 text-sm font-black text-zinc-900 truncate">
                                                                        {event.title}
                                                                    </div>

                                                                    {account?.profile_name && (
                                                                        <div className="mt-0.5 text-[11px] font-medium text-zinc-500 truncate">
                                                                            {account.profile_name}
                                                                        </div>
                                                                    )}

                                                                    {event.description && (
                                                                        <div className="mt-1 text-[11px] text-zinc-500 line-clamp-2 whitespace-pre-wrap">
                                                                            {event.description}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
