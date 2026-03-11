'use client';

import { addDays, format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pencil, Trash2, Copy, Share2, MoreVertical, Plus } from 'lucide-react';
import { Instagram, Linkedin, Youtube, Video, Facebook } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StrategyPost } from './edit-strategy-post-modal';

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
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

interface StrategyTableViewProps {
    posts: StrategyPost[];
    startDate?: string | null;
    onRowClick: (post: StrategyPost) => void;
    onEdit: (post: StrategyPost) => void;
    onClone: (post: StrategyPost) => void;
    onPostToPlatforms: (post: StrategyPost) => void;
    onDelete: (post: StrategyPost) => void;
    onIncludeChange: (post: StrategyPost, checked: boolean) => void;
    onAddPost: () => void;
}

export function StrategyTableView({
    posts,
    startDate,
    onRowClick,
    onEdit,
    onClone,
    onPostToPlatforms,
    onDelete,
    onIncludeChange,
    onAddPost,
}: StrategyTableViewProps) {
    let baseDate: Date | null = null;
    if (startDate) baseDate = new Date(startDate);

    const getDateLabel = (day: number) => {
        if (!baseDate) return `Day ${day}`;
        return format(addDays(baseDate, day - 1), 'MMMM d, yyyy');
    };

    const sortedPosts = [...posts].sort((a, b) => a.day - b.day || 0);

    return (
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 bg-zinc-50/50">
                <span className="text-sm font-medium text-zinc-700">All posts</span>
                <Button
                    size="sm"
                    onClick={onAddPost}
                    className="rounded-full bg-[#f2d412] hover:bg-[#f2c112] text-zinc-900 font-medium text-[15px] gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add post
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="border-zinc-200 hover:bg-transparent">
                        <TableHead className="w-10 px-3 py-3"></TableHead>
                        <TableHead className="px-3 py-3 font-semibold text-zinc-700">Idea</TableHead>
                        <TableHead className="px-3 py-3 font-semibold text-zinc-700">Day</TableHead>
                        <TableHead className="px-3 py-3 font-semibold text-zinc-700">Date</TableHead>
                        <TableHead className="px-3 py-3 font-semibold text-zinc-700">Platform</TableHead>
                        <TableHead className="px-3 py-3 font-semibold text-zinc-700">Content Type</TableHead>
                        <TableHead className="px-3 py-3 font-semibold text-zinc-700">Goal</TableHead>
                        <TableHead className="px-3 py-3 font-semibold text-zinc-700">Status</TableHead>
                        <TableHead className="w-10 px-3 py-3"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedPosts.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className="py-12 text-center text-zinc-500">
                                No posts yet. Click &quot;Add post&quot; to create one.
                            </TableCell>
                        </TableRow>
                    ) : (
                        sortedPosts.map((post) => {
                            const PlatformIcon = PLATFORM_ICONS[post.platform?.toLowerCase()] || Video;
                            const platformLabel = PLATFORM_LABELS[post.platform?.toLowerCase()] || formatLabel(post.platform || '');
                            const statusColor = STATUS_COLORS[post.status] || STATUS_COLORS.planned;

                            return (
                                <TableRow
                                    key={post.id}
                                    className="border-zinc-100 cursor-pointer group"
                                    onClick={() => onRowClick(post)}
                                >
                                    <TableCell className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                                        <Checkbox
                                            checked={post.include_in_calendar}
                                            onCheckedChange={(c) => onIncludeChange(post, c === true)}
                                        />
                                    </TableCell>
                                    <TableCell className="px-3 py-2 max-w-[200px]">
                                        <span className="font-medium text-zinc-900 line-clamp-2">
                                            {post.idea || 'Untitled'}
                                        </span>
                                        {post.caption && (
                                            <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{post.caption}</p>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-3 py-2 text-zinc-600">Day {post.day}</TableCell>
                                    <TableCell className="px-3 py-2">
                                        <span className="text-amber-700 font-medium">{getDateLabel(post.day)}</span>
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-zinc-800 text-white shrink-0">
                                                <PlatformIcon className="h-3.5 w-3.5" strokeWidth={2} />
                                            </div>
                                            <span className="text-zinc-700">{platformLabel}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        <span className="text-zinc-600">{formatLabel(post.content_type)}</span>
                                    </TableCell>
                                    <TableCell className="px-3 py-2 text-zinc-600">
                                        {post.goal ? formatLabel(post.goal) : '—'}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        <span
                                            className={cn(
                                                'inline-flex px-2 py-0.5 rounded text-xs font-medium',
                                                statusColor
                                            )}
                                        >
                                            {formatLabel(post.status)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 shrink-0 rounded-lg text-zinc-500 hover:text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-lg border border-zinc-200">
                                                <DropdownMenuItem
                                                    onClick={(e) => { e.stopPropagation(); onEdit(post); }}
                                                    className="gap-2 rounded-md"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={(e) => { e.stopPropagation(); onClone(post); }}
                                                    className="gap-2 rounded-md"
                                                >
                                                    <Copy className="h-3.5 w-3.5" />
                                                    Clone
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={(e) => { e.stopPropagation(); onPostToPlatforms(post); }}
                                                    className="gap-2 rounded-md"
                                                >
                                                    <Share2 className="h-3.5 w-3.5" />
                                                    Post to more
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={(e) => { e.stopPropagation(); onDelete(post); }}
                                                    className="gap-2 rounded-md text-red-600 focus:text-red-600"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
