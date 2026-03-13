'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Trash2, Copy, Share2, MoreVertical, ImagePlus } from 'lucide-react';
import { Instagram, Linkedin, Youtube, Video, Facebook } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { StrategyPost } from './edit-strategy-post-modal';

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube,
    facebook: Facebook,
};

const PLATFORM_LABELS: Record<string, string> = {
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    youtube: 'YouTube',
    facebook: 'Facebook',
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
    onPostToPlatforms: () => void;
    onContent: () => void;
    onDelete: () => void;
    onIncludeChange: (checked: boolean) => void;
}

export function StrategyPostCard({
    post,
    onEdit,
    onClone,
    onPostToPlatforms,
    onContent,
    onDelete,
    onIncludeChange,
}: StrategyPostCardProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const PlatformIcon = PLATFORM_ICONS[post.platform?.toLowerCase()] || Video;
    const platformLabel = PLATFORM_LABELS[post.platform?.toLowerCase()] || formatLabel(post.platform || '');
    const statusColor = STATUS_COLORS[post.status] || STATUS_COLORS.planned;

    return (
        <Card className="rounded-xl border border-zinc-200 p-0 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Platform logo header */}
            <div className="relative flex flex-col items-center pt-4 pb-2 px-3 bg-zinc-50/80">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800 text-white shrink-0">
                    <PlatformIcon className="h-6 w-6" />
                </div>
                <p className="mt-1.5 text-xs font-semibold text-zinc-700">{platformLabel}</p>
                <div className="absolute top-2 right-2 flex items-center gap-0.5">
                    <Checkbox
                        checked={post.include_in_calendar}
                        onCheckedChange={(c) => onIncludeChange(c === true)}
                        className="h-4 w-4 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 shrink-0 rounded-lg text-zinc-500 hover:text-zinc-700"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-lg border border-zinc-200">
                            <DropdownMenuItem onClick={() => { onEdit(); setMenuOpen(false); }} className="gap-2 rounded-md">
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { onClone(); setMenuOpen(false); }} className="gap-2 rounded-md">
                                <Copy className="h-3.5 w-3.5" />
                                Clone
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { onPostToPlatforms(); setMenuOpen(false); }} className="gap-2 rounded-md">
                                <Share2 className="h-3.5 w-3.5" />
                                Post to more
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { onContent(); setMenuOpen(false); }} className="gap-2 rounded-md">
                                <ImagePlus className="h-3.5 w-3.5" />
                                Create / Upload content
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => { onDelete(); setMenuOpen(false); }}
                                className="gap-2 rounded-md text-red-600 focus:text-red-600"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Details body */}
            <div className="p-3 space-y-2 border-t border-zinc-100">
                <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="text-[10px] font-medium bg-amber-100 text-amber-800">
                        {formatLabel(post.content_type)}
                    </Badge>
                    <Badge className={cn('text-[10px] font-medium', statusColor)}>
                        {formatLabel(post.status)}
                    </Badge>
                </div>
                <h4 className="font-semibold text-zinc-900 text-sm line-clamp-2">
                    {post.idea || 'Untitled'}
                </h4>
                {post.caption && (
                    <p className="text-xs text-zinc-500 line-clamp-2">{post.caption}</p>
                )}
                {(post.goal || post.theme) && (
                    <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-zinc-500">
                        {post.goal && <span>Goal: {formatLabel(post.goal)}</span>}
                        {post.theme && <span>• {formatLabel(post.theme)}</span>}
                    </div>
                )}
            </div>
        </Card>
    );
}
