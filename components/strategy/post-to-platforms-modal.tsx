'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { SlidePanel } from '@/components/ui/slide-panel';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, Instagram, Linkedin, Youtube, Facebook } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StrategyPost } from './edit-strategy-post-modal';

const CONTENT_TYPES = ['reel', 'carousel', 'image', 'video', 'text_post'] as const;

const formatLabel = (s: string) =>
    s.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

// Platform-specific content type options and defaults
const PLATFORM_CONTENT_OPTIONS: Record<string, string[]> = {
    youtube: ['video'],
    instagram: ['reel', 'carousel', 'image', 'video', 'text_post'],
    linkedin: ['video', 'image', 'carousel', 'text_post'],
    facebook: ['reel', 'video', 'image', 'carousel', 'text_post'],
};

function getDefaultContentType(platformId: string, sourceContentType: string): string {
    if (platformId === 'youtube') return 'video';
    if (platformId === 'linkedin') {
        return ['video', 'image'].includes(sourceContentType) ? sourceContentType : 'video';
    }
    return sourceContentType || 'image';
}

const PLATFORMS = [
    { id: 'instagram', label: 'Instagram', Icon: Instagram },
    { id: 'linkedin', label: 'LinkedIn', Icon: Linkedin },
    { id: 'youtube', label: 'YouTube', Icon: Youtube },
    { id: 'facebook', label: 'Facebook', Icon: Facebook },
] as const;

interface PostToPlatformsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    post: StrategyPost | null;
    strategyId: string;
    /** All posts in the strategy - used to exclude platforms that already have this content on the same day */
    allPosts: StrategyPost[];
    onSuccess: () => void;
}

export function PostToPlatformsModal({
    open,
    onOpenChange,
    post,
    strategyId,
    allPosts = [],
    onSuccess,
}: PostToPlatformsModalProps) {
    const [selected, setSelected] = useState<string[]>([]);
    const [contentTypeByPlatform, setContentTypeByPlatform] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sourceContentType = post?.content_type || 'image';
    const ideaKey = (post?.idea || '').trim().toLowerCase();
    const day = post?.day ?? 0;

    // Platforms that already have this same content (same day + same idea) on this day
    const platformsAlreadyUsed = new Set(
        allPosts
            .filter((p) => p.day === day && (p.idea || '').trim().toLowerCase() === ideaKey)
            .map((p) => p.platform?.toLowerCase())
            .filter(Boolean)
    );

    const availablePlatforms = PLATFORMS.filter(
        (p) => !platformsAlreadyUsed.has(p.id)
    );

    const togglePlatform = (id: string) => {
        setSelected((prev) => {
            const next = prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id];
            if (!prev.includes(id)) {
                setContentTypeByPlatform((ct) => ({
                    ...ct,
                    [id]: getDefaultContentType(id, sourceContentType),
                }));
            } else {
                setContentTypeByPlatform((ct) => {
                    const { [id]: _, ...rest } = ct;
                    return rest;
                });
            }
            return next;
        });
    };

    useEffect(() => {
        if (!open) {
            setSelected([]);
            setContentTypeByPlatform({});
        }
    }, [open]);

    const handleSubmit = async () => {
        if (!post || selected.length === 0) return;
        setIsSubmitting(true);
        try {
            for (const platform of selected) {
                const contentType = contentTypeByPlatform[platform] ?? getDefaultContentType(platform, sourceContentType);
                const res = await fetch(`/api/strategy/${strategyId}/posts`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        day: post.day,
                        platform,
                        content_type: contentType,
                        theme: post.theme,
                        idea: post.idea,
                        caption: post.caption,
                        description: post.description,
                        goal: post.goal,
                        status: post.status,
                        include_in_calendar: post.include_in_calendar,
                    }),
                });
                if (!res.ok) throw new Error((await res.json()).error);
            }
            onSuccess();
            onOpenChange(false);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Failed to add to more platforms';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SlidePanel
            open={open}
            onClose={() => onOpenChange(false)}
            title="Post to more platforms"
            subtitle="Add this content to more platforms. Each platform can have its own content type (e.g. Reel for Instagram, Video for YouTube)."
            size="half"
            footer={
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || selected.length === 0}
                        className="rounded-full font-medium text-[15px] bg-[#f2d412] hover:bg-[#f2c112] text-zinc-900"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            `Add to ${selected.length} platform${selected.length !== 1 ? 's' : ''}`
                        )}
                    </Button>
                </div>
            }
        >
            <div className="px-6 py-4 space-y-3">
                    {availablePlatforms.length === 0 ? (
                        <p className="text-sm text-zinc-500">
                            This post is already on all platforms.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {availablePlatforms.map(({ id, label, Icon }) => (
                                <div
                                    key={id}
                                    className={cn(
                                        'rounded-lg border p-3 transition-colors',
                                        selected.includes(id)
                                            ? 'border-indigo-300 bg-indigo-50'
                                            : 'border-zinc-200'
                                    )}
                                >
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <Checkbox
                                            checked={selected.includes(id)}
                                            onCheckedChange={() => togglePlatform(id)}
                                        />
                                        <Icon className={cn(
                                            'h-5 w-5 shrink-0',
                                            id === 'instagram' && 'text-pink-600',
                                            id === 'linkedin' && 'text-blue-600',
                                            id === 'youtube' && 'text-red-600',
                                            id === 'facebook' && 'text-blue-500'
                                        )} />
                                        <span className="font-medium">{label}</span>
                                    </label>
                                    {selected.includes(id) && (
                                        <div className="mt-3 pl-8">
                                            <label className="text-xs font-medium text-zinc-500 block mb-1.5">
                                                Content type
                                            </label>
                                            <Select
                                                value={contentTypeByPlatform[id] ?? getDefaultContentType(id, sourceContentType)}
                                                onValueChange={(v) =>
                                                    setContentTypeByPlatform((prev) => ({ ...prev, [id]: v }))
                                                }
                                            >
                                                <SelectTrigger className="h-9 text-sm rounded-lg border-zinc-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(PLATFORM_CONTENT_OPTIONS[id] ?? CONTENT_TYPES).map((ct) => (
                                                        <SelectItem key={ct} value={ct}>
                                                            {formatLabel(ct)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
            </div>
        </SlidePanel>
    );
}
