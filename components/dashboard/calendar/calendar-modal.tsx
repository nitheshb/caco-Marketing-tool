'use client';

import { useCalendar, CalendarEvent, SocialConnection } from './calendar-context';
import { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { SlidePanel } from '@/components/ui/slide-panel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CalendarDays, Loader2, Youtube, Instagram, Video, Bell, Calendar as CalendarIcon, Flag, Megaphone, Trash2, Image as ImageIcon, Linkedin, Facebook, FileVideo } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const EVENT_TYPES = [
    { value: 'event', label: 'Event', icon: CalendarIcon },
    { value: 'post', label: 'Social Post', icon: Megaphone },
    { value: 'reminder', label: 'Reminder', icon: Bell },
    { value: 'deadline', label: 'Deadline', icon: Flag },
];

const COLOR_OPTIONS = [
    { value: 'indigo', label: 'Indigo', swatch: 'bg-indigo-500' },
    { value: 'emerald', label: 'Green', swatch: 'bg-emerald-500' },
    { value: 'rose', label: 'Rose', swatch: 'bg-rose-500' },
    { value: 'amber', label: 'Amber', swatch: 'bg-amber-500' },
    { value: 'violet', label: 'Violet', swatch: 'bg-violet-500' },
    { value: 'cyan', label: 'Cyan', swatch: 'bg-cyan-500' },
];

function PlatformIcon({ platform, className }: { platform: string, className?: string }) {
    switch(platform?.toLowerCase()) {
        case 'youtube': return <Youtube className={cn("text-red-500", className)} />;
        case 'instagram': return <Instagram className={cn("text-pink-500", className)} />;
        case 'tiktok': return <Video className={cn("text-black dark:text-zinc-900", className)} />;
        case 'linkedin': return <Linkedin className={cn("text-blue-600", className)} />;
        case 'facebook': return <Facebook className={cn("text-blue-500", className)} />;
        default: return <Megaphone className={className} />;
    }
}

export function CalendarModal() {
    const { isCreateOpen, setIsCreateOpen, editingEvent, fetchEvents, handleDelete, currentDate, socialConnections } = useCalendar();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    const [formTitle, setFormTitle] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formType, setFormType] = useState('event');
    const [formAccountId, setFormAccountId] = useState('');
    const [formColor, setFormColor] = useState('indigo');
    const [formDate, setFormDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [formTime, setFormTime] = useState('09:00');
    const [formEndDate, setFormEndDate] = useState('');
    const [formEndTime, setFormEndTime] = useState('');
    const [formMediaUrl, setFormMediaUrl] = useState('');
    
    const [isVideoSelectorOpen, setIsVideoSelectorOpen] = useState(false);
    const [libraryVideos, setLibraryVideos] = useState<any[]>([]);
    const [isLoadingVideos, setIsLoadingVideos] = useState(false);

    const selectedAccount = socialConnections.find(c => c.id === formAccountId);

    const fetchLibraryVideos = async () => {
        try {
            setIsLoadingVideos(true);
            const res = await fetch('/api/videos');
            if (res.ok) {
                const data = await res.json();
                setLibraryVideos(data.filter((v: any) => v.status === 'ready' && v.video_url));
            }
        } catch (error) {
            console.error("Failed to fetch library videos", error);
        } finally {
            setIsLoadingVideos(false);
        }
    };

    const resetForm = () => {
        setFormTitle('');
        setFormDescription('');
        setFormType('event');
        setFormAccountId('');
        setFormColor('indigo');
        setFormDate(format(currentDate, 'yyyy-MM-dd'));
        setFormTime('09:00');
        setFormEndDate('');
        setFormEndTime('');
        setFormMediaUrl('');
    };

    useEffect(() => {
        if (isCreateOpen) {
            if (editingEvent) {
                setFormTitle(editingEvent.title);
                setFormDescription(editingEvent.description || '');
                setFormType(editingEvent.type || 'event');
                setFormAccountId(editingEvent.account_id || '');
                setFormColor(editingEvent.color || 'indigo');
                setFormMediaUrl(editingEvent.media_url || '');
                const scheduled = parseISO(editingEvent.scheduled_at);
                setFormDate(format(scheduled, 'yyyy-MM-dd'));
                setFormTime(format(scheduled, 'HH:mm'));
                if (editingEvent.end_at) {
                    const end = parseISO(editingEvent.end_at);
                    setFormEndDate(format(end, 'yyyy-MM-dd'));
                    setFormEndTime(format(end, 'HH:mm'));
                }
            } else {
                resetForm();
                if (currentDate) {
                    setFormDate(format(currentDate, 'yyyy-MM-dd'));
                }
            }
        }
    }, [isCreateOpen, editingEvent, currentDate]);

    const handleSubmit = async () => {
        if (!formTitle.trim() || !formDate) {
            toast.error('Title and selected date are required');
            return;
        }

        setIsSubmitting(true);
        const scheduled_at = new Date(`${formDate}T${formTime}:00`).toISOString();
        const end_at = formEndDate && formEndTime
            ? new Date(`${formEndDate}T${formEndTime}:00`).toISOString()
            : null;

        const payload = {
            title: formTitle.trim(),
            description: formDescription.trim() || null,
            media_url: formMediaUrl.trim() || null,
            type: formType,
            account_id: formType === 'post' ? (formAccountId || null) : null,
            platform: formType === 'post' && selectedAccount ? selectedAccount.platform : null,
            color: formColor,
            scheduled_at,
            end_at,
        };

        try {
            if (editingEvent) {
                const res = await fetch(`/api/schedule/${editingEvent.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    toast.success('Event updated');
                    setIsCreateOpen(false);
                    fetchEvents();
                } else {
                    toast.error('Failed to update');
                }
            } else {
                const res = await fetch('/api/schedule', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    toast.success(formType === 'post' ? 'Post scheduled!' : 'Event added!');
                    setIsCreateOpen(false);
                    fetchEvents();
                } else {
                    toast.error('Failed to create');
                }
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (editingEvent) {
            await handleDelete(editingEvent.id);
            setDeleteConfirmOpen(false);
            setIsCreateOpen(false);
        }
    };

    const Footer = (
        <div className="flex items-center justify-between">
            {editingEvent && (
                <Button
                    variant="ghost"
                    onClick={() => setDeleteConfirmOpen(true)}
                    className="h-10 px-4 text-red-500 hover:bg-red-50 hover:text-red-600 font-semibold gap-2"
                >
                    <Trash2 className="h-4 w-4" /> Delete
                </Button>
            )}
            <div className="flex items-center gap-3 ml-auto">
                <Button
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                    className="h-10 px-5 font-semibold border-zinc-200"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formTitle.trim() || !formDate || (formType === 'post' && !formAccountId)}
                    className="h-10 px-6 font-bold bg-[#612bd3] hover:bg-[#7236f1] text-white disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
                    ) : editingEvent ? 'Save Changes' : (formType === 'post' ? 'Schedule Post' : 'Add to Calendar')}
                </Button>
            </div>
        </div>
    );

    return (
        <>
            <SlidePanel
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title={editingEvent ? 'Edit Item' : 'Create New'}
                subtitle={formType === 'post' ? 'Schedule a social post' : 'Add a calendar event'}
                size={formType === 'post' ? 'xl' : 'md'}
                footer={Footer}
            >
                <div className={cn("flex overflow-hidden h-full", formType === 'post' ? 'flex-row' : 'flex-col')}>
                    {/* Editor Column */}
                    <div className={cn("overflow-y-auto space-y-6 p-6", formType === 'post' ? "w-1/2 border-r border-zinc-100" : "w-full")}>
                        {/* Header icon */}
                        <div className="flex items-center gap-2 mb-2">
                            <CalendarDays className="h-5 w-5 text-[#612bd3]" />
                            <span className="text-sm font-bold text-zinc-500">Event details</span>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-600">Type</label>
                            <div className="grid grid-cols-4 gap-2">
                                {EVENT_TYPES.map(t => {
                                    const Icon = t.icon;
                                    const isSelected = formType === t.value;
                                    return (
                                        <button
                                            key={t.value}
                                            onClick={() => setFormType(t.value)}
                                            className={cn(
                                                'flex flex-col items-center gap-1.5 rounded-xl p-3 border-2 transition-all text-center',
                                                isSelected
                                                    ? 'border-[#612bd3] bg-indigo-50 text-indigo-700'
                                                    : 'border-zinc-200 bg-zinc-50 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-100'
                                            )}
                                        >
                                            <Icon className={cn('h-5 w-5', isSelected ? 'text-[#612bd3]' : 'text-zinc-400')} />
                                            <span className="text-xs font-bold">{t.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {formType === 'post' && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-600">Select Connected Account</label>
                                {socialConnections.length === 0 ? (
                                    <div className="text-sm text-zinc-500 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                                        No social accounts connected. Connect an account in Settings first.
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-3">
                                        {socialConnections.map(account => {
                                            const isSelected = formAccountId === account.id;
                                            return (
                                                <button
                                                    key={account.id}
                                                    onClick={() => setFormAccountId(account.id)}
                                                    className={cn(
                                                        "relative flex items-center justify-center p-1 rounded-full border-2 transition-all",
                                                        isSelected ? "border-[#612bd3] scale-105" : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                                                    )}
                                                    title={account.profile_name}
                                                >
                                                    {account.profile_image ? (
                                                        <img src={account.profile_image} alt={account.profile_name} className="w-12 h-12 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
                                                            <PlatformIcon platform={account.platform} className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-zinc-200">
                                                        <PlatformIcon platform={account.platform} className="h-3.5 w-3.5" />
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-600">Title *</label>
                            <Input
                                placeholder={formType === 'post' ? 'e.g. Tips for growth...' : 'e.g. Team standup'}
                                value={formTitle}
                                onChange={(e) => setFormTitle(e.target.value)}
                                className="h-10 border-zinc-200 focus-visible:ring-[#612bd3]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-600">Description</label>
                            <Textarea
                                placeholder="Add post caption or event details..."
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value)}
                                className="resize-none border-zinc-200 focus-visible:ring-[#612bd3] min-h-[100px]"
                            />
                        </div>

                        {formType === 'post' && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-zinc-600">Media URL (Optional)</label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs font-bold border-zinc-200"
                                        onClick={() => {
                                            if (libraryVideos.length === 0) fetchLibraryVideos();
                                            setIsVideoSelectorOpen(true);
                                        }}
                                    >
                                        <FileVideo className="h-3.5 w-3.5 mr-1.5" />
                                        Add from Library
                                    </Button>
                                </div>
                                <Input
                                    placeholder="e.g. https://example.com/image.jpg"
                                    value={formMediaUrl}
                                    onChange={(e) => setFormMediaUrl(e.target.value)}
                                    className="h-10 border-zinc-200 focus-visible:ring-[#612bd3]"
                                />
                                <p className="text-xs text-zinc-400">Paste a direct URL or pick from your Generated Videos.</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-600">Color</label>
                            <div className="flex items-center gap-2">
                                {COLOR_OPTIONS.map(c => (
                                    <button
                                        key={c.value}
                                        onClick={() => setFormColor(c.value)}
                                        className={cn(
                                            'h-8 w-8 rounded-full transition-all border-2',
                                            c.swatch,
                                            formColor === c.value ? 'border-zinc-900 scale-110' : 'border-transparent hover:scale-110 opacity-70 hover:opacity-100'
                                        )}
                                        title={c.label}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-zinc-600">Start Date *</label>
                                <Input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="h-10 border-zinc-200 focus-visible:ring-[#612bd3]" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-zinc-600">Start Time</label>
                                <Input type="time" value={formTime} onChange={(e) => setFormTime(e.target.value)} className="h-10 border-zinc-200 focus-visible:ring-[#612bd3]" />
                            </div>
                        </div>

                        {(formType === 'event') && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-zinc-600">End Date</label>
                                    <Input type="date" value={formEndDate} onChange={(e) => setFormEndDate(e.target.value)} className="h-10 border-zinc-200 focus-visible:ring-[#612bd3]" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-zinc-600">End Time</label>
                                    <Input type="time" value={formEndTime} onChange={(e) => setFormEndTime(e.target.value)} className="h-10 border-zinc-200 focus-visible:ring-[#612bd3]" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Preview Column (only for Social Post) */}
                    {formType === 'post' && (
                        <div className="w-1/2 bg-zinc-50 p-6 flex flex-col overflow-y-auto">
                            <h3 className="text-sm font-bold text-zinc-700 mb-4">Preview</h3>
                            <div className="flex-1 flex items-center justify-center">
                                {!selectedAccount ? (
                                    <div className="text-zinc-400 text-center max-w-xs">
                                        <Megaphone className="h-10 w-10 mx-auto mb-3 opacity-30" />
                                        <p className="text-sm">Select a social account to see a preview</p>
                                    </div>
                                ) : (
                                    <div className="w-full max-w-xs bg-white rounded-xl shadow-lg overflow-hidden">
                                        <div className="p-3 border-b flex items-center gap-2.5">
                                            {selectedAccount.profile_image ? (
                                                <img src={selectedAccount.profile_image} className="w-8 h-8 rounded-full object-cover" alt="Profile" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center" />
                                            )}
                                            <div>
                                                <div className="font-bold text-xs leading-tight">{selectedAccount.profile_name}</div>
                                                <div className="text-[10px] text-zinc-500">{format(new Date(`${formDate}T${formTime}`), 'MMM dd, h:mm a')} · {selectedAccount.platform}</div>
                                            </div>
                                        </div>
                                        <div className="w-full aspect-video bg-zinc-100 flex flex-col items-center justify-center text-zinc-400 border-b relative overflow-hidden">
                                            {formMediaUrl ? (
                                                <img src={formMediaUrl} alt="Post media" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display='none'; }} />
                                            ) : (
                                                <><ImageIcon className="h-8 w-8 mb-1 opacity-30" /><span className="text-xs">Media Placeholder</span></>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            {formTitle && <p className="font-bold text-sm mb-1">{formTitle}</p>}
                                            <p className="text-xs text-zinc-600 whitespace-pre-wrap line-clamp-4">{formDescription || 'Caption...'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </SlidePanel>

            {/* Video Library Selector – keep as a secondary SlidePanel */}
            <SlidePanel
                open={isVideoSelectorOpen}
                onClose={() => setIsVideoSelectorOpen(false)}
                title="Select Video from Library"
                size="lg"
            >
                <div className="p-6">
                    {isLoadingVideos ? (
                        <div className="flex h-64 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-[#612bd3]" />
                        </div>
                    ) : libraryVideos.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center text-center p-6 border-2 border-dashed border-zinc-200 rounded-2xl">
                            <Video className="h-10 w-10 text-zinc-300 mb-3" />
                            <p className="text-zinc-500 font-medium">No ready videos found in your library.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {libraryVideos.map((video) => (
                                <div
                                    key={video.id}
                                    className={cn(
                                        "group relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all",
                                        formMediaUrl === video.video_url ? "border-[#612bd3] ring-2 ring-[#612bd3]/30" : "border-zinc-200 hover:border-zinc-400"
                                    )}
                                    onClick={() => {
                                        setFormMediaUrl(video.video_url);
                                        setIsVideoSelectorOpen(false);
                                    }}
                                >
                                    <div className="aspect-video relative bg-zinc-100">
                                        {video.images?.[0]?.url || video.series?.video_style_image ? (
                                            <Image src={video.images?.[0]?.url || video.series?.video_style_image} alt={video.title} fill className="object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-zinc-300"><Video className="h-8 w-8" /></div>
                                        )}
                                    </div>
                                    <div className="p-3 bg-white">
                                        <p className="font-bold text-sm truncate text-zinc-900">{video.title || "Untitled"}</p>
                                        <p className="text-xs text-zinc-400 truncate">{video.series?.series_name || "Single Video"}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </SlidePanel>

            {/* Delete confirmation stays as AlertDialog (it's a destructive action prompt, not a detail panel) */}
            <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialogContent className="rounded-2xl border border-zinc-200 bg-white max-w-sm shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-zinc-900">Delete this item?</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-500">
                            This will permanently remove this calendar item. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-zinc-200 font-semibold">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700 font-bold text-white border-0"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
