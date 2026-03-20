'use client';

import { useCalendar } from './calendar-context';
import { format, startOfMonth, startOfWeek, addDays, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { PlatformPreview } from './platform-preview';

export function MonthView() {
    const { currentDate, setCurrentDate, events, openCreateDialog, openEditDialog, socialConnections } = useCalendar();

    const monthStart = startOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday start

    // Generate 42 days (6 weeks) for the calendar grid
    const calendarDays = Array.from({ length: 42 }).map((_, i) => addDays(startDate, i));

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        // Match Week view behavior: keep page header fixed by scrolling inside month grid.
        <div className="flex flex-col text-zinc-900 w-full overflow-y-auto max-h-[calc(100vh-260px)]">
            <div className="grid grid-cols-7 auto-rows-min gap-[3px] bg-zinc-50 p-[3px]">
                    
                    {/* Days of Week Headers */}
                    {daysOfWeek.map(day => (
                        <div
                            key={day}
                            className="z-30 px-2 py-1 bg-white border border-zinc-200 flex justify-center items-center flex-col h-[44px] rounded-[8px] sticky top-0 font-bold text-[12px] text-zinc-500 shadow-sm"
                        >
                            {day}
                        </div>
                    ))}

                    {/* Calendar Days */}
                    {calendarDays.map((day, index) => {
                        const isCurrentMonth = isSameMonth(day, currentDate);
                        const isToday = isSameDay(day, new Date());
                        
                        const dayEvents = events
                            .filter(e => isSameDay(parseISO(e.scheduled_at), day))
                            .sort((a, b) => parseISO(a.scheduled_at).getTime() - parseISO(b.scheduled_at).getTime());

                        return (
                            <div 
                                key={day.toString()}
                                onClick={() => {
                                    setCurrentDate(day);
                                    openCreateDialog(day);
                                }}
                                className={cn(
                                    "flex flex-col rounded-[8px] min-h-[90px] p-[5px] cursor-pointer group hover:border-amber-400 border border-transparent transition-all relative",
                                    isCurrentMonth ? "bg-white" : "bg-zinc-100 opacity-60"
                                )}
                            >
                                <div className={cn(
                                    "text-[14px] font-medium pt-[2px] px-[2px]",
                                    isToday ? "text-amber-700 font-bold" : "text-zinc-500"
                                )}>
                                    {format(day, 'd')}
                                </div>
                                
                                {/* Month cards: show full platform preview; day cell grows to fit all cards */}
                                <div className="flex flex-col gap-[6px] mt-1 z-10 w-full relative">
                                    {dayEvents.map(event => {
                                        const isNote = (event.type || '').toLowerCase() === 'note';
                                        const when = parseISO(event.scheduled_at);
                                        const whenLabel = format(when, 'h:mm a');
                                        const media = event.media_url?.split(',')[0]?.trim();
                                        const account = event.account_id
                                            ? socialConnections.find((c) => c.id === event.account_id)
                                            : undefined;
                                        const platformKey = ((account?.platform || event.platform) || '').toLowerCase();

                                        // Notes stay compact in month grid
                                        if (isNote) {
                                            return (
                                                <div
                                                    key={event.id}
                                                    onClick={(e) => { e.stopPropagation(); openEditDialog(event); }}
                                                    className="w-full rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 hover:border-amber-400 hover:bg-amber-100 transition-colors"
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="text-[10px] font-black text-amber-800 truncate">Note</span>
                                                        <span className="text-[9px] text-amber-500 font-semibold">{whenLabel}</span>
                                                    </div>
                                                    <div className="mt-1 text-[10px] text-amber-900 font-semibold whitespace-pre-wrap line-clamp-4 leading-snug">
                                                        {event.title}
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div
                                                key={event.id}
                                                onClick={(e) => { e.stopPropagation(); openEditDialog(event); }}
                                                className="w-full rounded-xl border border-zinc-200 bg-white shadow-sm hover:border-amber-300 hover:shadow-md transition-all overflow-hidden"
                                            >
                                                <PlatformPreview
                                                    platformKey={platformKey}
                                                    whenLabel={whenLabel}
                                                    accountName={account?.profile_name || undefined}
                                                    accountImage={account?.profile_image || null}
                                                    title={event.title}
                                                    description={event.description}
                                                    media={media}
                                                    density="compact"
                                                    onUpload={() => openEditDialog(event)}
                                                    mediaLayout="auto"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 rounded-[8px] z-0 pointer-events-none">
                                    <div className="h-8 w-8 rounded-lg bg-amber-400 text-zinc-900 flex items-center justify-center font-bold text-lg shadow-md">
                                        <Plus className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
        </div>
    );
}
