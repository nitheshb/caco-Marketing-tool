'use client';

import { useCalendar } from './calendar-context';
import { format, isSameDay, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { Fragment } from 'react';

const convertTimeFormatBasedOnLocality = (time: number) => {
    return `${time === 12 ? 12 : time % 12}:00 ${time >= 12 ? 'PM' : 'AM'}`;
};

export function DayView() {
    const { currentDate, events, openCreateDialog, openEditDialog } = useCalendar();
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const isToday = isSameDay(currentDate, new Date());

    return (
        <div className="flex flex-col text-zinc-900 flex-1 h-[600px] bg-[#0e0e0e] rounded-[10px] overflow-hidden border border-[#212121]">
            <div className="flex-1 relative">
                <div className="grid grid-cols-[136px_1fr] gap-[4px] absolute h-full start-0 top-0 w-full overflow-auto scrollbar scrollbar-thumb-[#212121] scrollbar-track-[#0e0e0e] bg-[#0e0e0e] p-[4px]">
                    
                    {/* Top-Left Empty Header Cell */}
                    <div className="z-10 bg-[#1e1d1d] flex justify-center items-center flex-col h-[62px] rounded-[8px] sticky top-0"></div>
                    
                    {/* Day Header */}
                    <div className="p-2 text-center bg-[#1e1d1d] flex justify-center items-center flex-col h-[62px] rounded-[8px] sticky top-0 z-[20]">
                        <div className="text-[14px] font-[500] text-[#9c9c9c]">
                            {format(currentDate, 'EEEE')}
                        </div>
                        <div className={cn(
                            "text-[14px] font-[600] flex items-center justify-center gap-[6px]",
                            isToday ? "text-[#fc69ff]" : "text-zinc-900"
                        )}>
                            {isToday && <div className="w-[6px] h-[6px] bg-[#fc69ff] rounded-full" />}
                            {format(currentDate, 'MM/dd/yyyy')}
                        </div>
                    </div>

                    {/* Hour Rows */}
                    {hours.map(hour => {
                        const cellDate = new Date(currentDate);
                        cellDate.setHours(hour, 0, 0, 0);
                        const isPast = cellDate < new Date();
                        
                        const cellEvents = events.filter(e => {
                            const eventDate = parseISO(e.scheduled_at);
                            return isSameDay(eventDate, currentDate) && eventDate.getHours() === hour;
                        });

                        return (
                            <Fragment key={hour}>
                                {/* Time Label */}
                                <div className="p-2 pe-4 text-center items-center justify-center flex text-[14px] text-[#9c9c9c]">
                                    {convertTimeFormatBasedOnLocality(hour)}
                                </div>

                                {/* Hour Cell */}
                                <div 
                                    onClick={() => openCreateDialog(cellDate)}
                                    className={cn(
                                        "relative flex flex-col min-h-[80px] rounded-[8px] border border-transparent transition-colors cursor-pointer group",
                                        isPast ? "opacity-50 cursor-not-allowed bg-transparent striped-bg" : "bg-[#1a1919] hover:border-[#612BD3]",
                                    )}
                                    style={isPast ? { backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 20px)' } : {}}
                                >
                                    <div className="flex-1 w-full p-[10px] flex flex-col gap-2 z-10 w-full">
                                        {cellEvents.map(event => (
                                            <div 
                                                key={event.id}
                                                onClick={(e) => { e.stopPropagation(); openEditDialog(event); }}
                                                className="bg-[#2a2a2a] text-zinc-900 text-[13px] p-3 rounded-lg border border-[#454444] shadow-sm hover:border-[#612bd3] transition-colors flex items-center justify-between"
                                            >
                                                <div className="font-semibold">{event.title}</div>
                                                <div className="text-[11px] text-[#9c9c9c] uppercase bg-[#1e1d1d] px-2 py-0.5 rounded-md">{event.type}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {!isPast && (
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-[8px] z-0">
                                            <div className="h-10 w-10 rounded-xl bg-[#612bd3] text-zinc-900 flex items-center justify-center font-bold text-lg shadow-lg">
                                                <Plus className="h-6 w-6" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
