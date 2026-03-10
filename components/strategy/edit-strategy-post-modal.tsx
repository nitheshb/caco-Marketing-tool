'use client';

import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const PLATFORMS = ['instagram', 'linkedin', 'facebook', 'youtube'];
const CONTENT_TYPES = ['reel', 'carousel', 'image', 'video', 'text_post'];
const GOALS = ['increase_followers', 'increase_sales', 'brand_awareness', 'engagement'];

const formatLabel = (s: string) =>
    s.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export interface StrategyPost {
    id: string;
    day: number;
    platform: string;
    content_type: string;
    theme: string;
    idea: string;
    caption: string;
    description?: string;
    goal: string;
    status: string;
    include_in_calendar: boolean;
}

interface EditStrategyPostModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    post: StrategyPost | null;
    strategyId: string;
    durationDays: number;
    onSave: () => void;
    isCreate?: boolean;
    initialDay?: number;
}

export function EditStrategyPostModal({
    open,
    onOpenChange,
    post,
    strategyId,
    durationDays,
    onSave,
    isCreate = false,
    initialDay = 1,
}: EditStrategyPostModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [day, setDay] = useState(1);
    const [platform, setPlatform] = useState('instagram');
    const [contentType, setContentType] = useState('image');
    const [idea, setIdea] = useState('');
    const [description, setDescription] = useState('');
    const [caption, setCaption] = useState('');
    const [goal, setGoal] = useState('engagement');
    const [theme, setTheme] = useState('');

    useEffect(() => {
        if (post) {
            setDay(post.day);
            setPlatform(post.platform);
            setContentType(post.content_type);
            setIdea(post.idea || '');
            setDescription(post.description || '');
            setCaption(post.caption || '');
            setGoal(post.goal);
            setTheme(post.theme || '');
        } else if (isCreate) {
            setDay(initialDay);
            setPlatform('instagram');
            setContentType('image');
            setIdea('');
            setDescription('');
            setCaption('');
            setGoal('engagement');
            setTheme('');
        }
    }, [post, isCreate, open, initialDay]);

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            if (isCreate) {
                const res = await fetch(`/api/strategy/${strategyId}/posts`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        day,
                        platform,
                        content_type: contentType,
                        idea: idea.trim(),
                        description: description.trim(),
                        caption: caption.trim(),
                        goal,
                        theme: theme.trim() || undefined,
                    }),
                });
                if (!res.ok) throw new Error((await res.json()).error);
            } else if (post) {
                const res = await fetch(`/api/strategy/${strategyId}/posts/${post.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        day,
                        platform,
                        content_type: contentType,
                        idea: idea.trim(),
                        description: description.trim(),
                        caption: caption.trim(),
                        goal,
                        theme: theme.trim() || undefined,
                    }),
                });
                if (!res.ok) throw new Error((await res.json()).error);
            }
            onSave();
            onOpenChange(false);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg rounded-xl border border-zinc-200 bg-white p-0 text-zinc-900 shadow-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b border-zinc-200 px-6 py-4">
                    <DialogTitle className="text-lg font-black">
                        {isCreate ? 'Add Post' : 'Edit Post'}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 px-6 py-4">
                    <div>
                        <Label className="text-sm font-bold text-zinc-600">Day</Label>
                        <Select value={String(day)} onValueChange={(v) => setDay(Number(v))}>
                            <SelectTrigger className="mt-1.5 h-11 rounded-xl border-zinc-200">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: durationDays }, (_, i) => i + 1).map((d) => (
                                    <SelectItem key={d} value={String(d)}>
                                        Day {d}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="text-sm font-bold text-zinc-600">Platform</Label>
                        <Select value={platform} onValueChange={setPlatform}>
                            <SelectTrigger className="mt-1.5 h-11 rounded-xl border-zinc-200">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {PLATFORMS.map((p) => (
                                    <SelectItem key={p} value={p}>
                                        {formatLabel(p)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="text-sm font-bold text-zinc-600">Content Type</Label>
                        <Select value={contentType} onValueChange={setContentType}>
                            <SelectTrigger className="mt-1.5 h-11 rounded-xl border-zinc-200">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {CONTENT_TYPES.map((c) => (
                                    <SelectItem key={c} value={c}>
                                        {formatLabel(c)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="text-sm font-bold text-zinc-600">Idea Title</Label>
                        <Input
                            value={idea}
                            onChange={(e) => setIdea(e.target.value)}
                            placeholder="e.g. Behind the scenes of product creation"
                            className="mt-1.5 h-11 rounded-xl border-zinc-200"
                        />
                    </div>

                    <div>
                        <Label className="text-sm font-bold text-zinc-600">Description</Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Post description..."
                            className="mt-1.5 min-h-[80px] rounded-xl border-zinc-200 resize-none"
                        />
                    </div>

                    <div>
                        <Label className="text-sm font-bold text-zinc-600">Caption Suggestion</Label>
                        <Textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Short caption suggestion..."
                            className="mt-1.5 min-h-[60px] rounded-xl border-zinc-200 resize-none"
                        />
                    </div>

                    <div>
                        <Label className="text-sm font-bold text-zinc-600">Goal</Label>
                        <Select value={goal} onValueChange={setGoal}>
                            <SelectTrigger className="mt-1.5 h-11 rounded-xl border-zinc-200">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {GOALS.map((g) => (
                                    <SelectItem key={g} value={g}>
                                        {formatLabel(g)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="text-sm font-bold text-zinc-600">Theme</Label>
                        <Input
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            placeholder="e.g. Festival, Educational, Promotion"
                            className="mt-1.5 h-11 rounded-xl border-zinc-200"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-zinc-200 px-6 py-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="rounded-xl bg-indigo-600 hover:bg-indigo-700"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
                        ) : (
                            'Save'
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
