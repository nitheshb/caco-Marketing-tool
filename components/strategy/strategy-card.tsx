'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, ExternalLink, ImagePlus } from 'lucide-react';
import { format } from 'date-fns';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { toast } from 'sonner';

interface StrategyCardProps {
    id: string;
    name: string;
    platforms: string[];
    durationDays: number;
    createdAt: string;
    startDate?: string | null;
    imageUrl?: string | null;
    onDelete: (id: string) => Promise<void>;
    onImageUpdate?: () => void;
}

export function StrategyCard({
    id,
    name,
    platforms,
    durationDays,
    createdAt,
    startDate,
    imageUrl,
    onDelete,
    onImageUpdate,
}: StrategyCardProps) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [localImageUrl, setLocalImageUrl] = useState<string | null>(imageUrl ?? null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete(id);
            setDeleteOpen(false);
            toast.success('Strategy deleted');
        } catch {
            toast.error('Failed to delete');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith('image/')) return;
        e.target.value = '';
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch(`/api/strategy/${id}/image`, {
                method: 'POST',
                body: formData,
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || 'Upload failed');
            setLocalImageUrl(data.imageUrl);
            onImageUpdate?.();
            toast.success('Image uploaded');
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to upload image';
            toast.error(msg);
        } finally {
            setIsUploading(false);
        }
    };

    const displayImageUrl = localImageUrl ?? imageUrl;
    const platformLabels = platforms
        ?.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(', ') || '—';

    return (
        <>
            <Card className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm transition-shadow hover:shadow-md p-0 gap-0">
                <div
                    className="relative h-28 bg-zinc-100 flex items-center justify-center cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageSelect}
                        disabled={isUploading}
                    />
                    {displayImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={displayImageUrl}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-1.5 text-zinc-400">
                            <ImagePlus className="h-8 w-8" strokeWidth={1.5} />
                            <span className="text-sm font-medium">No image</span>
                            <span className="text-xs">Click to upload</span>
                        </div>
                    )}
                    {isUploading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                            <span className="text-sm font-medium text-zinc-600">Uploading...</span>
                        </div>
                    )}
                </div>
                <div className="p-4 space-y-3">
                    <h3 className="text-lg font-semibold tracking-tight text-zinc-900 line-clamp-2">{name}</h3>
                    <div className="space-y-1.5 text-sm text-zinc-500">
                        <p>
                            <span className="font-medium text-zinc-700">Platforms:</span> {platformLabels}
                        </p>
                        <p>
                            <span className="font-medium text-zinc-700">Duration:</span> {durationDays} days
                        </p>
                        <p>
                            <span className="font-medium text-zinc-700">Created:</span>{' '}
                            {format(new Date(createdAt), 'dd MMM yyyy')}
                        </p>
                        {startDate && (
                            <p>
                                <span className="font-medium text-zinc-700">Start:</span>{' '}
                                {format(new Date(startDate), 'dd MMM yyyy')}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2 pt-1">
                        <Link href={`/dashboard/strategy/${id}`}>
                            <Button
                                size="sm"
                                className="rounded-full bg-[#f2d412] hover:bg-[#f2c112] text-zinc-900 font-medium text-[15px] gap-1.5"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Open Strategy
                            </Button>
                        </Link>
                        <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg border-zinc-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={(e) => {
                                e.preventDefault();
                                setDeleteOpen(true);
                            }}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                        </Button>
                    </div>
                </div>
            </Card>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent className="rounded-xl border border-zinc-200">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete strategy?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this strategy and all its posts. This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 rounded-lg"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
