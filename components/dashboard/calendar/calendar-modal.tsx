'use client';

import { useCalendar, CalendarEvent, SocialConnection } from './calendar-context';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
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
    
    // Video Library Selection States
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

    return (
        <>
            <Dialog open={isCreateOpen} onOpenChange={(open) => {
                if (!open) {
                    setIsCreateOpen(false);
                }
            }}>
                <DialogContent className={cn("rounded-[12px] border border-[#212121] bg-[#0e0e0e] p-0 overflow-hidden text-zinc-900 shadow-2xl flex flex-col transition-all duration-300", formType === 'post' ? "min-w-7xl w-[95vw] h-[85vh]" : "max-w-xl w-[95vw] h-auto max-h-[85vh]")}>
                    <DialogHeader className="px-6 py-4 border-b border-[#212121] bg-[#1a1919] flex-shrink-0">
                        <DialogTitle className="text-lg font-black text-zinc-900 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-5 w-5 text-[#612bd3]" />
                                {editingEvent ? 'Edit Item' : 'Create New'}
                            </div>
                            {editingEvent && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-black hover:text-red-400 rounded-full transition-colors" onClick={() => setDeleteConfirmOpen(true)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Editor Column */}
                        <div className={cn("p-6 overflow-y-auto no-scrollbar space-y-6", formType === 'post' ? "w-1/2 border-r border-[#212121]" : "w-full")}>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#9c9c9c]">Type</label>
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
                                                        ? 'border-[#612bd3] bg-[#291259] text-zinc-900'
                                                        : 'border-[#212121] bg-[#1a1919] text-[#9c9c9c] hover:border-[#454444] hover:bg-[#201f1f]'
                                                )}
                                            >
                                                <Icon className={cn('h-5 w-5', isSelected ? 'text-zinc-900' : 'text-[#9c9c9c]')} />
                                                <span className="text-xs font-bold">{t.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {formType === 'post' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#9c9c9c]">Select Connected Account</label>
                                    {socialConnections.length === 0 ? (
                                        <div className="text-sm text-[#9c9c9c] p-4 bg-[#1a1919] rounded-xl border border-[#212121]">
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
                                                            isSelected ? "border-[#fc69ff] scale-105" : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                                                        )}
                                                        title={account.profile_name}
                                                    >
                                                        {account.profile_image ? (
                                                            <img src={account.profile_image} alt={account.profile_name} className="w-12 h-12 rounded-full object-cover bg-zinc-800" />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-full bg-[#1a1919] flex items-center justify-center">
                                                                <PlatformIcon platform={account.platform} className="h-6 w-6" />
                                                            </div>
                                                        )}
                                                        <div className="absolute -bottom-1 -right-1 bg-[#1a1919] rounded-full p-0.5 border border-[#212121]">
                                                            <PlatformIcon platform={account.platform} className="h-3.5 w-3.5" />
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#9c9c9c]">Title *</label>
                                <Input
                                    placeholder={formType === 'post' ? 'e.g. Tips for growth...' : 'e.g. Team standup'}
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    className="rounded-xl h-11 bg-[#1a1919] border-[#212121] text-zinc-900 placeholder:text-[#454444] focus-visible:ring-[#612bd3]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#9c9c9c] flex items-center justify-between">
                                    Description
                                </label>
                                <Textarea
                                    placeholder="Add post caption or event details..."
                                    value={formDescription}
                                    onChange={(e) => setFormDescription(e.target.value)}
                                    className="rounded-xl resize-none bg-[#1a1919] border-[#212121] text-zinc-900 placeholder:text-[#454444] focus-visible:ring-[#612bd3] min-h-[120px]"
                                />
                            </div>

                            {formType === 'post' && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-[#9c9c9c]">Media URL (Optional)</label>
                                        <Dialog open={isVideoSelectorOpen} onOpenChange={(open) => {
                                            if (open && libraryVideos.length === 0) fetchLibraryVideos();
                                            setIsVideoSelectorOpen(open);
                                        }}>
                                            <DialogTrigger asChild>
                                                <Button type="button" variant="outline" size="sm" className="h-7 text-xs font-bold rounded-lg border-[#454444] text-[#9c9c9c] hover:bg-[#201f1f] hover:text-zinc-900 bg-[#1a1919]">
                                                    <FileVideo className="h-3.5 w-3.5 mr-1.5" />
                                                    Add from Library
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-4xl bg-[#0e0e0e] border-[#212121] text-zinc-900">
                                                <DialogHeader>
                                                    <DialogTitle className="text-xl font-black">Select Video from Library</DialogTitle>
                                                </DialogHeader>
                                                
                                                {isLoadingVideos ? (
                                                    <div className="flex h-64 items-center justify-center">
                                                        <Loader2 className="h-8 w-8 animate-spin text-[#612bd3]" />
                                                    </div>
                                                ) : libraryVideos.length === 0 ? (
                                                    <div className="flex h-64 flex-col items-center justify-center text-center p-6 border-2 border-dashed border-[#212121] rounded-2xl">
                                                        <Video className="h-10 w-10 text-[#454444] mb-3" />
                                                        <p className="text-[#9c9c9c] font-medium">No ready videos found in your library.</p>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-3 gap-4 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                                                        {libraryVideos.map((video) => (
                                                            <div 
                                                                key={video.id} 
                                                                className={cn(
                                                                    "group relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all",
                                                                    formMediaUrl === video.video_url ? "border-[#612bd3] ring-2 ring-[#612bd3]/50" : "border-[#212121] hover:border-[#454444]"
                                                                )}
                                                                onClick={() => {
                                                                    setFormMediaUrl(video.video_url);
                                                                    setIsVideoSelectorOpen(false);
                                                                }}
                                                            >
                                                                <div className="aspect-video relative bg-black">
                                                                     {video.images?.[0]?.url || video.series?.video_style_image ? (
                                                                        <Image src={video.images?.[0]?.url || video.series?.video_style_image} alt={video.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                                     ) : (
                                                                        <div className="flex items-center justify-center h-full text-[#454444]">
                                                                            <Video className="h-8 w-8" />
                                                                        </div>
                                                                     )}
                                                                </div>
                                                                <div className="p-3 bg-[#1a1919]">
                                                                    <p className="font-bold text-sm truncate">{video.title || "Untitled"}</p>
                                                                    <p className="text-xs text-[#9c9c9c] truncate">{video.series?.series_name || "Single Video"}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <Input
                                        placeholder="e.g. https://example.com/image.jpg"
                                        value={formMediaUrl}
                                        onChange={(e) => setFormMediaUrl(e.target.value)}
                                        className="rounded-xl h-11 bg-[#1a1919] border-[#212121] text-zinc-900 placeholder:text-[#454444] focus-visible:ring-[#612bd3]"
                                    />
                                    <p className="text-xs text-[#9c9c9c]">Paste a direct URL or pick from your Generated Videos.</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#9c9c9c]">Color</label>
                                <div className="flex items-center gap-2">
                                    {COLOR_OPTIONS.map(c => (
                                        <button
                                            key={c.value}
                                            onClick={() => setFormColor(c.value)}
                                            className={cn(
                                                'h-8 w-8 rounded-full transition-all border-2',
                                                c.swatch,
                                                formColor === c.value ? 'border-white scale-110' : 'border-transparent hover:scale-110 opacity-70 hover:opacity-100'
                                            )}
                                            title={c.label}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-[#9c9c9c]">Start Date *</label>
                                    <Input
                                        type="date"
                                        value={formDate}
                                        onChange={(e) => setFormDate(e.target.value)}
                                        className="rounded-xl h-11 bg-[#1a1919] border-[#212121] text-zinc-900 focus-visible:ring-[#612bd3] [color-scheme:dark]"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-[#9c9c9c]">Start Time</label>
                                    <Input
                                        type="time"
                                        value={formTime}
                                        onChange={(e) => setFormTime(e.target.value)}
                                        className="rounded-xl h-11 bg-[#1a1919] border-[#212121] text-zinc-900 focus-visible:ring-[#612bd3] [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            {(formType === 'event') && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-[#9c9c9c]">End Date</label>
                                        <Input
                                            type="date"
                                            value={formEndDate}
                                            onChange={(e) => setFormEndDate(e.target.value)}
                                            className="rounded-xl h-11 bg-[#1a1919] border-[#212121] text-zinc-900 focus-visible:ring-[#612bd3] [color-scheme:dark]"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-[#9c9c9c]">End Time</label>
                                        <Input
                                            type="time"
                                            value={formEndTime}
                                            onChange={(e) => setFormEndTime(e.target.value)}
                                            className="rounded-xl h-11 bg-[#1a1919] border-[#212121] text-zinc-900 focus-visible:ring-[#612bd3] [color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Preview Column */}
                        {formType === 'post' && (
                        <div className="w-1/2 bg-[#141313] p-6 flex flex-col relative overflow-hidden">
                            <h3 className="text-lg font-bold text-zinc-900 mb-6">Preview</h3>
                            
                            <div className="flex-1 flex items-center justify-center">
                                {!selectedAccount ? (
                                    <div className="text-[#9c9c9c] text-center max-w-xs">
                                        <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-30" />
                                        <p>Select a social account to see how your post will look on that specific platform.</p>
                                    </div>
                                ) : (
                                    <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden relative" style={{ color: '#000' }}>
                                        {/* Dynamic Platform Preview Headers */}
                                        <div className="p-3 border-b flex items-center gap-3">
                                            {selectedAccount.profile_image ? (
                                                <img src={selectedAccount.profile_image} className="w-10 h-10 rounded-full object-cover bg-zinc-200" alt="Profile" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center" />
                                            )}
                                            <div>
                                                <div className="font-bold text-sm leading-tight flex items-center gap-1">
                                                    {selectedAccount.profile_name}
                                                    {selectedAccount.platform.toLowerCase() === 'linkedin' && <Linkedin className="w-3 h-3 text-blue-600 ml-1" />}
                                                </div>
                                                <div className="text-xs text-zinc-500">
                                                    {format(new Date(`${formDate}T${formTime}`), 'MMM dd, h:mm a')} • {selectedAccount.platform}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mock Media Placeholder */}
                                        <div className="w-full aspect-video bg-zinc-100 flex flex-col items-center justify-center text-zinc-400 border-b relative overflow-hidden">
                                            {formMediaUrl ? (
                                                formMediaUrl.match(/\.(mp4|webm|ogg)$/i) || formMediaUrl.includes('youtube.com') || formMediaUrl.includes('vimeo.com') ? (
                                                    <div className="w-full h-full bg-black flex items-center justify-center">
                                                        <Video className="h-12 w-12 text-zinc-900 opacity-50 absolute" />
                                                        <video src={formMediaUrl} className="w-full h-full object-cover opacity-80" controls={false} />
                                                    </div>
                                                ) : (
                                                    <img src={formMediaUrl} alt="Post media" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display='none'; }}/>
                                                )
                                            ) : (
                                                <>
                                                    <ImageIcon className="h-10 w-10 mb-2 opacity-30" />
                                                    <span className="text-xs font-medium">Visual Media Placeholder</span>
                                                </>
                                            )}
                                        </div>

                                        {/* Dynamic Text Body */}
                                        <div className="p-4 space-y-2">
                                            {selectedAccount.platform.toLowerCase() === 'youtube' ? (
                                                <>
                                                    <h3 className="font-bold text-lg leading-tight">{formTitle || "Video Title Placeholder"}</h3>
                                                    <p className="text-sm text-zinc-600 line-clamp-2">{formDescription || "Description..."}</p>
                                                </>
                                            ) : (
                                                <>
                                                    {formTitle && <h3 className="font-bold text-sm mb-1">{formTitle}</h3>}
                                                    <p className="text-sm text-zinc-800 whitespace-pre-wrap">
                                                        {formDescription || "Write a caption for your post..."}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                        
                                        {/* Platform specific footers Mock */}
                                        {selectedAccount.platform.toLowerCase() === 'linkedin' && (
                                            <div className="px-4 pb-3 pt-1 border-t flex items-center gap-4 text-zinc-500 text-xs font-semibold">
                                                <span>👍 Like</span>
                                                <span>💬 Comment</span>
                                                <span>🔄 Repost</span>
                                            </div>
                                        )}
                                        {selectedAccount.platform.toLowerCase() === 'instagram' && (
                                            <div className="px-4 pb-3 pt-2 text-zinc-800 font-bold text-sm">
                                                ♡ 〇 ⩶
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="px-6 py-4 border-t border-[#212121] bg-[#1a1919] flex justify-end gap-3 flex-shrink-0">
                        <Button
                            variant="outline"
                            onClick={() => setIsCreateOpen(false)}
                            className="h-11 px-6 rounded-xl font-bold border-[#454444] text-[#9c9c9c] hover:bg-[#201f1f] hover:text-zinc-900 transition-all bg-transparent"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !formTitle.trim() || !formDate || (formType === 'post' && !formAccountId)}
                            className="h-11 px-8 rounded-xl font-bold bg-[#612bd3] hover:bg-[#7236f1] text-zinc-900 border-0 transition-all active:scale-95 disabled:opacity-50 disabled:bg-[#612bd3]"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
                            ) : editingEvent ? 'Save Changes' : (formType === 'post' ? 'Schedule Post' : 'Add to Calendar')}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialogContent className="rounded-2xl border border-[#212121] bg-[#0e0e0e] overflow-hidden text-zinc-900 shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this item?</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#9c9c9c]">
                            This will permanently remove this calendar item. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl font-bold bg-transparent border-[#454444] text-[#9c9c9c] hover:bg-[#1a1919] hover:text-zinc-900">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 rounded-xl font-bold text-zinc-900 transition-all active:scale-95 border-0"
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

