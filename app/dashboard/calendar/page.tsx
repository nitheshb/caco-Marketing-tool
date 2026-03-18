'use client';

import { CalendarProvider, useCalendar } from '@/components/dashboard/calendar/calendar-context';
import { DayView } from '@/components/dashboard/calendar/day-view';
import { WeekView } from '@/components/dashboard/calendar/week-view';
import { MonthView } from '@/components/dashboard/calendar/month-view';
import { CalendarModal } from '@/components/dashboard/calendar/calendar-modal';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { addDays, addMonths, addWeeks, endOfWeek, format, startOfWeek, subDays, subMonths, subWeeks } from 'date-fns';

function CalendarContent() {
    const { isLoading, displayMode, setDisplayMode, openCreateDialog, currentDate, setCurrentDate } = useCalendar();

    const title = (() => {
        if (displayMode === 'day') return format(currentDate, 'EEEE, MMM d, yyyy');
        if (displayMode === 'month') return format(currentDate, 'MMMM yyyy');

        const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
        const sameMonth = format(weekStart, 'MMM yyyy') === format(weekEnd, 'MMM yyyy');
        return sameMonth
            ? `Week of ${format(weekStart, 'MMM d')} – ${format(weekEnd, 'd, yyyy')}`
            : `Week of ${format(weekStart, 'MMM d, yyyy')} – ${format(weekEnd, 'MMM d, yyyy')}`;
    })();

    const goToday = () => setCurrentDate(new Date());

    const goPrev = () => {
        if (displayMode === 'day') return setCurrentDate(subDays(currentDate, 1));
        if (displayMode === 'month') return setCurrentDate(subMonths(currentDate, 1));
        return setCurrentDate(subWeeks(currentDate, 1));
    };

    const goNext = () => {
        if (displayMode === 'day') return setCurrentDate(addDays(currentDate, 1));
        if (displayMode === 'month') return setCurrentDate(addMonths(currentDate, 1));
        return setCurrentDate(addWeeks(currentDate, 1));
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4 bg-white text-zinc-900 rounded-[10px] shadow-sm border border-zinc-200">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                <p className="text-zinc-500 font-medium">Loading your calendar...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* Header Area - centered, two groups with clear space between */}
            <div className="flex items-center justify-between gap-4 pt-0 pb-2 border-b border-zinc-200">
                {/* Left group: nav + title */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5 bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
                        <button
                            onClick={goPrev}
                            className="h-7 w-7 rounded-md hover:bg-white text-zinc-600 hover:text-zinc-900 transition-colors flex items-center justify-center"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={goToday}
                            className="px-2 h-7 rounded-md hover:bg-white text-zinc-700 hover:text-zinc-900 transition-colors text-xs font-bold"
                        >
                            Today
                        </button>
                        <button
                            onClick={goNext}
                            className="h-7 w-7 rounded-md hover:bg-white text-zinc-600 hover:text-zinc-900 transition-colors flex items-center justify-center"
                            aria-label="Next"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                    <h1 className="text-lg sm:text-xl font-black tracking-tight text-zinc-900">
                        {title}
                    </h1>
                </div>

                {/* Right group: view switcher + Add New */}
                <div className="flex items-center gap-3">
                    <div className="flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
                        {(['day', 'week', 'month'] as const).map(mode => (
                            <button
                                key={mode}
                                onClick={() => setDisplayMode(mode)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-bold rounded-md transition-all capitalize",
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
                        className="bg-amber-300 hover:bg-amber-400 text-zinc-900 font-bold h-8 px-4 shadow-sm transition-all active:scale-95 gap-1.5 rounded-lg border border-amber-200 text-sm"
                    >
                        <Plus className="h-4 w-4" />
                        Add New
                    </Button>
                </div>
            </div>

            {/* Calendar View Area */}
            <div className="w-full pt-3">
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
