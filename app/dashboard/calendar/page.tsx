'use client';

import { CalendarProvider, useCalendar } from '@/components/dashboard/calendar/calendar-context';
import { DayView } from '@/components/dashboard/calendar/day-view';
import { WeekView } from '@/components/dashboard/calendar/week-view';
import { MonthView } from '@/components/dashboard/calendar/month-view';
import { CalendarModal } from '@/components/dashboard/calendar/calendar-modal';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Image from 'next/image';

function CalendarContent() {
    const { isLoading, displayMode, setDisplayMode, openCreateDialog, currentDate } = useCalendar();

    if (isLoading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4 bg-white text-zinc-900 rounded-[10px] shadow-sm border border-zinc-200">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                <p className="text-zinc-500 font-medium">Loading your calendar...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[10px] border border-zinc-200 shadow-sm">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900 mb-1">
                        {format(currentDate, 'MMMM yyyy')}
                    </h1>
                    <p className="text-zinc-500 font-medium text-sm">Schedule posts, events, reminders & deadlines.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    {/* View Switcher */}
                    <div className="flex bg-zinc-100 p-1 rounded-[8px] border border-zinc-200">
                        {(['day', 'week', 'month'] as const).map(mode => (
                            <button
                                key={mode}
                                onClick={() => setDisplayMode(mode)}
                                className={cn(
                                    "px-5 py-2 text-sm font-bold rounded-[6px] transition-all capitalize",
                                    displayMode === mode 
                                        ? "bg-white text-zinc-900 shadow-sm" 
                                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50"
                                )}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>

                    <Button
                        onClick={() => openCreateDialog()}
                        className="bg-white hover:bg-zinc-50 text-zinc-700 font-bold h-11 px-6 shadow-sm transition-all active:scale-95 gap-2 rounded-[8px] border border-zinc-200"
                    >
                        <Image src="/images/sidebare-icons/+add-new.png" alt="Add New" width={20} height={20} className="object-contain" />
                        Add New
                    </Button>
                </div>
            </div>

            {/* Calendar View Area */}
            <div className="w-full">
                {displayMode === 'day' && <DayView />}
                {displayMode === 'week' && <WeekView />}
                {displayMode === 'month' && <MonthView />}
            </div>

            <CalendarModal />
        </div>
    );
}

export default function CalendarPage() {
    return (
        <CalendarProvider>
            <CalendarContent />
        </CalendarProvider>
    );
}
