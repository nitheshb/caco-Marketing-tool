'use client';

import { useCalendar } from './calendar-context';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { Fragment } from 'react';

const convertTimeFormatBasedOnLocality = (time: number) => {
    return `${time === 12 ? 12 : time % 12}:00 ${time >= 12 ? 'PM' : 'AM'}`;
};

export function WeekView() {
    const { currentDate, events, openCreateDialog, openEditDialog } = useCalendar();

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday start
    const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
        <div className="flex flex-col text-zinc-900 flex-1 h-[600px] bg-white rounded-[10px] overflow-hidden border border-zinc-200 shadow-sm">
            <div className="flex-1 relative">
                <div className="grid [grid-template-columns:136px_repeat(7,_minmax(0,_1fr))] gap-[4px] absolute h-full start-0 top-0 w-full overflow-auto scrollbar scrollbar-thumb-zinc-200 scrollbar-track-zinc-50 bg-zinc-50 p-[4px]">
                    
                    {/* Top-Left Empty Header Cell */}
                    <div className="z-10 bg-zinc-50 border-b border-zinc-200 flex justify-center items-center flex-col h-[62px] rounded-[8px] sticky top-0"></div>
                    
                    {/* Day Headers */}
                    {days.map(day => {
                        const isToday = isSameDay(day, new Date());
                        return (
                            <div key={day.toString()} className="p-2 text-center bg-zinc-50 border-b border-zinc-200 flex justify-center items-center flex-col h-[62px] rounded-[8px] sticky top-0 z-[20]">
                                <div className="text-[14px] font-bold text-zinc-500">
                                    {format(day, 'EEEE')}
                                </div>
                                <div className={cn(
                                    "text-[14px] font-[600] flex items-center justify-center gap-[6px]",
                                    isToday ? "text-indigo-600" : "text-zinc-900"
                                )}>
                                    {isToday && <div className="w-[6px] h-[6px] bg-indigo-600 rounded-full" />}
                                    {format(day, 'MM/dd/yyyy')}
                                </div>
                            </div>
                        );
                    })}

                    {/* Hour Rows */}
                    {hours.map(hour => (
                        <Fragment key={hour}>
                            {/* Time Label */}
                            <div className="p-2 pe-4 text-center items-center justify-center flex text-[14px] font-medium text-zinc-500 border-r border-zinc-200/50">
                                {convertTimeFormatBasedOnLocality(hour)}
                            </div>

                            {/* Hour Cells for each day */}
                            {days.map(day => {
                                const cellDate = new Date(day);
                                cellDate.setHours(hour, 0, 0, 0);
                                const isPast = cellDate < new Date();
                                
                                const cellEvents = events.filter(e => {
                                    const eventDate = parseISO(e.scheduled_at);
                                    return isSameDay(eventDate, day) && eventDate.getHours() === hour;
                                });

                                return (
                                    <div 
                                        key={cellDate.toString()}
                                        onClick={() => openCreateDialog(cellDate)}
                                        className={cn(
                                            "relative flex flex-col min-h-[70px] rounded-[8px] border border-transparent transition-colors cursor-pointer group",
                                            isPast ? "opacity-50 cursor-not-allowed bg-transparent striped-bg" : "bg-white hover:border-indigo-600",
                                        )}
                                        style={isPast ? { backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)' } : {}}
                                    >
                                        <div className="flex-1 w-full p-[5px] flex flex-col gap-1 z-10">
                                            {cellEvents.map(event => (
                                                <div 
                                                    key={event.id}
                                                    onClick={(e) => { e.stopPropagation(); openEditDialog(event); }}
                                                    className="bg-indigo-50 text-indigo-700 text-[12px] p-1.5 rounded-md border border-indigo-100 shadow-sm hover:border-indigo-300 hover:bg-indigo-100 transition-colors"
                                                >
                                                    <div className="font-semibold truncate">{event.title}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {!isPast && (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 rounded-[8px] z-0">
                                                <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                                                    <Plus className="h-5 w-5" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}
