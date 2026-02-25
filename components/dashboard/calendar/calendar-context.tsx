'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export interface CalendarEvent {
    id: string;
    title: string;
    description: string | null;
    type: string;
    platform: string | null;
    account_id: string | null;
    media_url: string | null;
    color: string;
    scheduled_at: string;
    end_at: string | null;
    status: string;
    created_at: string;
    video_id: string | null;
    series_id: string | null;
    video?: { id: string; title: string; video_url: string; status: string } | null;
    series?: { id: string; series_name: string } | null;
}

export interface SocialConnection {
    id: string;
    platform: string;
    profile_name: string;
    platform_user_id: string;
    profile_image: string | null;
}

interface CalendarContextType {
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    displayMode: 'day' | 'week' | 'month';
    setDisplayMode: (mode: 'day' | 'week' | 'month') => void;
    events: CalendarEvent[];
    socialConnections: SocialConnection[];
    isLoading: boolean;
    fetchEvents: () => Promise<void>;
    handleStatusToggle: (event: CalendarEvent) => Promise<void>;
    handleMarkComplete: (event: CalendarEvent) => Promise<void>;
    handleDelete: (id: string) => Promise<void>;
    // Modal states
    isCreateOpen: boolean;
    setIsCreateOpen: (open: boolean) => void;
    editingEvent: CalendarEvent | null;
    openCreateDialog: (date?: Date) => void;
    openEditDialog: (event: CalendarEvent) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: ReactNode }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [displayMode, setDisplayMode] = useState<'day' | 'week' | 'month'>('week');
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [socialConnections, setSocialConnections] = useState<SocialConnection[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [eventsRes, socialRes] = await Promise.all([
                fetch('/api/schedule'),
                fetch('/api/settings/social')
            ]);
            
            if (eventsRes.ok) {
                const data = await eventsRes.json();
                setEvents(data);
            }
            if (socialRes.ok) {
                const data = await socialRes.json();
                setSocialConnections(data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleStatusToggle = async (event: CalendarEvent) => {
        const nextStatus = event.status === 'scheduled' ? 'cancelled'
            : event.status === 'cancelled' ? 'scheduled'
            : event.status;
        try {
            const res = await fetch(`/api/schedule/${event.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: nextStatus }),
            });
            if (res.ok) {
                toast.success(`Marked as ${nextStatus}`);
                fetchData();
            }
        } catch {
            toast.error('Failed to update');
        }
    };

    const handleMarkComplete = async (event: CalendarEvent) => {
        try {
            const res = await fetch(`/api/schedule/${event.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'completed' }),
            });
            if (res.ok) {
                toast.success('Marked as completed');
                fetchData();
            }
        } catch {
            toast.error('Failed to update');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/schedule/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Deleted');
                setEvents((prev) => prev.filter((e) => e.id !== id));
            } else {
                toast.error('Failed to delete');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const openCreateDialog = (date?: Date) => {
        setEditingEvent(null);
        if (date) {
            setCurrentDate(date);
        }
        setIsCreateOpen(true);
    };

    const openEditDialog = (event: CalendarEvent) => {
        setEditingEvent(event);
        setIsCreateOpen(true);
    };

    return (
        <CalendarContext.Provider
            value={{
                currentDate,
                setCurrentDate,
                displayMode,
                setDisplayMode,
                events,
                socialConnections,
                isLoading,
                fetchEvents: fetchData,
                handleStatusToggle,
                handleMarkComplete,
                handleDelete,
                isCreateOpen,
                setIsCreateOpen,
                editingEvent,
                openCreateDialog,
                openEditDialog,
            }}
        >
            {children}
        </CalendarContext.Provider>
    );
}

export function useCalendar() {
    const context = useContext(CalendarContext);
    if (context === undefined) {
        throw new Error('useCalendar must be used within a CalendarProvider');
    }
    return context;
}
