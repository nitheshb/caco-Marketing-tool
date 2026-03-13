'use client';

import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { SlidePanel } from '@/components/ui/slide-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Instagram, Linkedin, Youtube, Facebook } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { StrategyPost } from './edit-strategy-post-modal';

const PLATFORMS: { id: string; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'instagram', label: 'Instagram', Icon: Instagram },
    { id: 'linkedin', label: 'LinkedIn', Icon: Linkedin },
    { id: 'youtube', label: 'YouTube', Icon: Youtube },
    { id: 'facebook', label: 'Facebook', Icon: Facebook },
];

interface SocialConnection {
    id: string;
    platform: string;
    profile_name?: string;
}

interface ScheduleToCalendarModalProps {
    open: boolean;
    onClose: () => void;
    post: StrategyPost & { media_url?: string | null } | null;
    strategyId: string;
    startDate?: string | null;
    durationDays?: number;
    onSuccess?: () => void;
}

export function ScheduleToCalendarModal({
    open,
    onClose,
    post,
    strategyId,
    startDate,
    durationDays = 30,
    onSuccess,
}: ScheduleToCalendarModalProps) {
    const [connections, setConnections] = useState<SocialConnection[]>([]);
    const [formDate, setFormDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [formTime, setFormTime] = useState('09:00');
    const [formAccountId, setFormAccountId] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const defaultDate = post && startDate && post.day
        ? format(addDays(new Date(startDate), post.day - 1), 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd');

    useEffect(() => {
        if (!open) return;
        setFormDate(defaultDate);
        setFormAccountId('');
        getAuth(app)
            .currentUser?.getIdToken(true)
            .then((token) => {
                const headers: Record<string, string> = {};
                if (token) headers['Authorization'] = `Bearer ${token}`;
                return fetch('/api/settings/social', { headers });
            })
            .then((res) => res.json())
            .then((data) => setConnections(Array.isArray(data) ? data : []))
            .catch(() => setConnections([]));
    }, [open, defaultDate]);

    const platformConnections = post
        ? connections.filter((c) => c.platform?.toLowerCase() === post.platform?.toLowerCase())
        : [];
    const needsAccount = post && ['instagram', 'linkedin', 'youtube', 'facebook'].includes(post.platform?.toLowerCase() ?? '');
    const hasValidAccount = formAccountId && formAccountId !== '__none__';
    const canSchedule = !needsAccount || (needsAccount && hasValidAccount);

    const handleSubmit = async () => {
        if (!post) return;
        if (!post.media_url) {
            toast.error('Add content to this post first');
            return;
        }
        setSubmitting(true);
        try {
            const scheduled_at = new Date(`${formDate}T${formTime}:00`).toISOString();
            const token = await getAuth(app).currentUser?.getIdToken(true);
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const res = await fetch('/api/schedule', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    title: post.idea || 'Social post',
                    description: post.caption || null,
                    media_url: post.media_url,
                    type: 'post',
                    platform: post.platform,
                    account_id: (formAccountId && formAccountId !== '__none__') ? formAccountId : null,
                    scheduled_at,
                    status: 'scheduled',
                }),
            });
            if (!res.ok) throw new Error((await res.json()).error || 'Failed');
            toast.success('Scheduled to calendar');
            onSuccess?.();
            onClose();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (!post) return null;

    const PlatformIcon = PLATFORMS.find((p) => p.id === post.platform?.toLowerCase())?.Icon;

    return (
        <SlidePanel
            open={open}
            onClose={onClose}
            title="Schedule to calendar"
            subtitle={post.idea || 'Post'}
            size="md"
            footer={
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose} className="rounded-full">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting || !canSchedule}
                        className="rounded-full bg-[#f2d412] hover:bg-[#f2c112] text-zinc-900 font-medium gap-2"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Scheduling...
                            </>
                        ) : (
                            'Schedule'
                        )}
                    </Button>
                </div>
            }
        >
            <div className="px-6 py-4 space-y-4">
                {!post.media_url ? (
                    <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-4">
                        Add content to this post first (upload or create in Create Content, then add to strategy).
                    </p>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs font-semibold text-zinc-500">Date</Label>
                                <Input
                                    type="date"
                                    value={formDate}
                                    onChange={(e) => setFormDate(e.target.value)}
                                    className="mt-1 h-10 border-zinc-200"
                                />
                            </div>
                            <div>
                                <Label className="text-xs font-semibold text-zinc-500">Time</Label>
                                <Input
                                    type="time"
                                    value={formTime}
                                    onChange={(e) => setFormTime(e.target.value)}
                                    className="mt-1 h-10 border-zinc-200"
                                />
                            </div>
                        </div>
                        <div>
                            <Label className="text-xs font-semibold text-zinc-500">
                                Account to publish to {needsAccount ? '(required)' : '(optional)'} — from Settings
                            </Label>
                            {needsAccount && platformConnections.length === 0 ? (
                                <p className="mt-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                                    No {post.platform} account connected. Add one in{' '}
                                    <a href="/dashboard/settings" className="font-semibold underline hover:no-underline">Settings → Social</a>
                                    , then return here to schedule.
                                </p>
                            ) : (
                            <Select value={formAccountId || '__none__'} onValueChange={(v) => setFormAccountId(v === '__none__' ? '' : v)}>
                                <SelectTrigger className="mt-1 h-10 border-zinc-200">
                                    <SelectValue placeholder={needsAccount ? 'Select account to publish to' : 'Select account'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {!needsAccount && <SelectItem value="__none__">No account</SelectItem>}
                                    {platformConnections.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>
                                            <span className="flex items-center gap-2">
                                                {PlatformIcon && <PlatformIcon className="h-4 w-4" />}
                                                {c.profile_name || c.platform}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            )}
                        </div>
                    </>
                )}
            </div>
        </SlidePanel>
    );
}
