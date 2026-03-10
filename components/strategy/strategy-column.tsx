'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { StrategyPostCard } from './strategy-post-card';
import type { StrategyPost } from './edit-strategy-post-modal';

interface StrategyColumnProps {
    day: number;
    posts: StrategyPost[];
    onAddPost: () => void;
    onEditPost: (post: StrategyPost) => void;
    onClonePost: (post: StrategyPost) => void;
    onDeletePost: (post: StrategyPost) => void;
    onIncludeChange: (post: StrategyPost, checked: boolean) => void;
}

export function StrategyColumn({
    day,
    posts,
    onAddPost,
    onEditPost,
    onClonePost,
    onDeletePost,
    onIncludeChange,
}: StrategyColumnProps) {
    return (
        <div className="flex flex-col min-w-0 w-full rounded-xl border border-zinc-200 bg-zinc-50/50">
            <div className="flex items-center justify-between gap-2 p-3 border-b border-zinc-200 bg-white rounded-t-xl">
                <h3 className="font-bold text-zinc-900">Day {day}</h3>
                <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 rounded-lg hover:bg-indigo-100 hover:text-indigo-700"
                    onClick={onAddPost}
                    title="Add post"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex-1 p-3 space-y-3 min-h-[120px] overflow-y-auto">
                {posts.map((post) => (
                    <StrategyPostCard
                        key={post.id}
                        post={post}
                        onEdit={() => onEditPost(post)}
                        onClone={() => onClonePost(post)}
                        onDelete={() => onDeletePost(post)}
                        onIncludeChange={(c) => onIncludeChange(post, c)}
                    />
                ))}
            </div>
        </div>
    );
}
