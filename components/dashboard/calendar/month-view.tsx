'use client';

import { useCalendar } from './calendar-context';
import { format, startOfMonth, startOfWeek, addDays, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

export function MonthView() {
    const { currentDate, setCurrentDate, events, openCreateDialog, openEditDialog } = useCalendar();

    const monthStart = startOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday start

    // Generate 42 days (6 weeks) for the calendar grid
    const calendarDays = Array.from({ length: 42 }).map((_, i) => addDays(startDate, i));

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <div className="flex flex-col text-zinc-900 flex-1 h-[700px] bg-white rounded-[10px] overflow-hidden border border-zinc-200 shadow-sm">
            <div className="flex-1 flex relative">
                <div className="grid grid-cols-7 grid-rows-[62px_repeat(6,_minmax(0,_1fr))] gap-[4px] absolute start-0 top-0 overflow-auto w-full h-full scrollbar scrollbar-thumb-zinc-200 scrollbar-track-zinc-50 bg-zinc-50 p-[4px]">
                    
                    {/* Days of Week Headers */}
                    {daysOfWeek.map(day => (
                        <div key={day} className="z-[20] p-2 bg-zinc-50 border-b border-zinc-200 flex justify-center items-center flex-col h-[62px] rounded-[8px] sticky top-0 font-bold text-[14px] text-zinc-500">
                            {day}
                        </div>
                    ))}

                    {/* Calendar Days */}
                    {calendarDays.map((day, index) => {
                        const isCurrentMonth = isSameMonth(day, currentDate);
                        const isToday = isSameDay(day, new Date());
                        
                        const dayEvents = events.filter(e => isSameDay(parseISO(e.scheduled_at), day));

                        return (
                            <div 
                                key={day.toString()}
                                onClick={() => {
                                    setCurrentDate(day);
                                    openCreateDialog(day);
                                }}
                                className={cn(
                                    "flex flex-col rounded-[8px] min-h-[90px] p-[5px] cursor-pointer group hover:border-indigo-600 border border-transparent transition-all overflow-hidden relative",
                                    isCurrentMonth ? "bg-white" : "bg-zinc-100 opacity-60"
                                )}
                            >
                                <div className={cn(
                                    "text-[14px] font-[500] pt-[2px] px-[2px]",
                                    isToday ? "text-indigo-600 font-bold" : "text-zinc-500"
                                )}>
                                    {format(day, 'd')}
                                </div>
                                
                                <div className="flex-1 flex flex-col gap-[2px] mt-1 overflow-y-auto no-scrollbar z-10 w-full relative">
                                    {dayEvents.map(event => (
                                        <div 
                                            key={event.id}
                                            onClick={(e) => { e.stopPropagation(); openEditDialog(event); }}
                                            className="bg-indigo-50 text-indigo-700 text-[11px] p-1.5 rounded-[4px] border border-indigo-100 shadow-sm hover:border-indigo-300 hover:bg-indigo-100 transition-colors truncate"
                                        >
                                            <span className="font-semibold">{event.title}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 rounded-[8px] z-0 pointer-events-none">
                                    <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                                        <Plus className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
