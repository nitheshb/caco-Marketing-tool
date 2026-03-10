'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Trash2, Copy } from 'lucide-react';
import { Instagram, Linkedin, Youtube, Video, Facebook } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StrategyPost } from './edit-strategy-post-modal';

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube,
    facebook: Facebook,
};

const STATUS_COLORS: Record<string, string> = {
    planned: 'bg-zinc-100 text-zinc-700',
    content_pending: 'bg-amber-100 text-amber-800',
    content_ready: 'bg-blue-100 text-blue-800',
    scheduled: 'bg-indigo-100 text-indigo-800',
    posted: 'bg-emerald-100 text-emerald-800',
};

function formatLabel(s: string) {
    return s.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

interface StrategyPostCardProps {
    post: StrategyPost;
    onEdit: () => void;
    onClone: () => void;
    onDelete: () => void;
    onIncludeChange: (checked: boolean) => void;
}

export function StrategyPostCard({
    post,
    onEdit,
    onClone,
    onDelete,
    onIncludeChange,
}: StrategyPostCardProps) {
    const PlatformIcon = PLATFORM_ICONS[post.platform?.toLowerCase()] || Video;
    const statusColor = STATUS_COLORS[post.status] || STATUS_COLORS.planned;

    return (
        <Card className="rounded-lg border border-zinc-200 p-3 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <Checkbox
                            checked={post.include_in_calendar}
                            onCheckedChange={(c) => onIncludeChange(c === true)}
                            className="shrink-0"
                        />
                        <span
                            className={cn(
                                'flex items-center justify-center w-7 h-7 rounded-md border shrink-0',
                                post.platform === 'instagram' && 'border-pink-200 text-pink-600',
                                post.platform === 'linkedin' && 'border-blue-200 text-blue-600',
                                post.platform === 'youtube' && 'border-red-200 text-red-600',
                                post.platform === 'facebook' && 'border-blue-200 text-blue-600',
                                (!post.platform || !PLATFORM_ICONS[post.platform?.toLowerCase()]) && 'border-zinc-200 text-zinc-600'
                            )}
                            title={formatLabel(post.platform)}
                        >
                            <PlatformIcon className="h-3.5 w-3.5" />
                        </span>
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 shrink-0"
                            onClick={onEdit}
                            title="Edit"
                        >
                            <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 shrink-0 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                            onClick={onClone}
                            title="Clone to another day"
                        >
                            <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 shrink-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={onDelete}
                            title="Delete"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                </div>

                <Badge variant="secondary" className="text-[10px] font-medium">
                    {formatLabel(post.content_type)}
                </Badge>

                <h4 className="font-semibold text-zinc-900 text-sm line-clamp-2">
                    {post.idea || 'Untitled'}
                </h4>
                {post.caption && (
                    <p className="text-xs text-zinc-500 line-clamp-2">{post.caption}</p>
                )}
                <div className="flex flex-wrap gap-1">
                    {post.goal && (
                        <span className="text-[10px] text-zinc-500">
                            Goal: {formatLabel(post.goal)}
                        </span>
                    )}
                    {post.theme && (
                        <span className="text-[10px] text-zinc-500">
                            • {post.theme}
                        </span>
                    )}
                </div>
                <Badge className={cn('text-[10px] font-medium', statusColor)}>
                    {formatLabel(post.status)}
                </Badge>
            </div>
        </Card>
    );
}
