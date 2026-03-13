'use client';

import { useRef, useState } from 'react';
import { SlidePanel } from '@/components/ui/slide-panel';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Upload } from 'lucide-react';
import { toast } from 'sonner';
import type { StrategyPost } from './edit-strategy-post-modal';

interface StrategyPostContentModalProps {
    post: StrategyPost | null;
    open: boolean;
    onClose: () => void;
    strategyId: string;
    onSuccess: () => void;
}

export function StrategyPostContentModal({
    post,
    open,
    onClose,
    strategyId,
    onSuccess,
}: StrategyPostContentModalProps) {
    const [activeTab, setActiveTab] = useState<'create' | 'upload'>('upload');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!post) return null;

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;
        e.target.value = '';

        const file = files[0];
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
            toast.error('Please upload an image or video');
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/media', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Upload failed');

            const mediaUrl = data.url;
            const patchRes = await fetch(`/api/strategy/${strategyId}/posts/${post.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    media_url: mediaUrl,
                    status: 'content_ready',
                }),
            });
            if (!patchRes.ok) throw new Error('Failed to link media to post');

            toast.success('Content uploaded');
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <SlidePanel
            open={open}
            onClose={onClose}
            title="Content for this post"
            subtitle={post.idea || 'Untitled'}
            size="md"
        >
            <div className="px-6 py-4 space-y-6">
                <div className="flex gap-2 p-1 rounded-lg bg-zinc-100">
                    <button
                        type="button"
                        onClick={() => setActiveTab('create')}
                        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                            activeTab === 'create'
                                ? 'bg-white text-zinc-900 shadow-sm'
                                : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                    >
                        Create with AI
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('upload')}
                        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                            activeTab === 'upload'
                                ? 'bg-white text-zinc-900 shadow-sm'
                                : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                    >
                        Upload
                    </button>
                </div>

                {activeTab === 'create' ? (
                    <div className="rounded-xl border border-zinc-200 border-dashed bg-zinc-50/50 p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                                <Sparkles className="h-6 w-6 text-amber-600" />
                            </div>
                        </div>
                        <h3 className="font-semibold text-zinc-900 mb-2">AI Content Creation</h3>
                        <p className="text-sm text-zinc-500 mb-4 max-w-sm mx-auto">
                            Create images or videos for this post using AI. This feature is coming soon.
                        </p>
                        <Button disabled className="rounded-full font-medium opacity-70">
                            Coming soon
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-8 cursor-pointer hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,video/*"
                                className="hidden"
                                onChange={handleUpload}
                                disabled={isUploading}
                            />
                            {isUploading ? (
                                <>
                                    <Loader2 className="h-10 w-10 animate-spin text-zinc-400" />
                                    <p className="text-sm font-medium text-zinc-600">Uploading...</p>
                                </>
                            ) : (
                                <>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-white">
                                        <Upload className="h-6 w-6" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-zinc-900">Upload your content</p>
                                        <p className="text-xs text-zinc-500 mt-0.5">
                                            Image or video for Day {post.day} • {post.platform}
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="rounded-full bg-[#f2d412] hover:bg-[#f2c112] text-zinc-900 font-medium"
                                    >
                                        Choose file
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </SlidePanel>
    );
}
