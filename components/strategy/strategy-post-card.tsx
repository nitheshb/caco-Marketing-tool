'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Trash2 } from 'lucide-react';
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
    onDelete: () => void;
    onIncludeChange: (checked: boolean) => void;
}

export function StrategyPostCard({
    post,
    onEdit,
    onDelete,
    onIncludeChange,
}: StrategyPostCardProps) {
    const PlatformIcon = PLATFORM_ICONS[post.platform?.toLowerCase()] || Video;
    const statusColor = STATUS_COLORS[post.status] || STATUS_COLORS.planned;

    return (
        <Card className="rounded-lg border border-zinc-200 p-3 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 shrink-0">
                        <Checkbox
                            checked={post.include_in_calendar}
                            onCheckedChange={(c) => onIncludeChange(c === true)}
                        />
                        <Badge
                            variant="outline"
                            className={cn(
                                'text-[10px] font-bold gap-1 capitalize',
                                post.platform === 'instagram' && 'border-pink-200 text-pink-700',
                                post.platform === 'linkedin' && 'border-blue-200 text-blue-700',
                                post.platform === 'youtube' && 'border-red-200 text-red-700'
                            )}
                        >
                            <PlatformIcon className="h-3 w-3" />
                            {formatLabel(post.platform)}
                        </Badge>
                    </div>
                    <div className="flex gap-1">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={onEdit}
                        >
                            <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={onDelete}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
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
