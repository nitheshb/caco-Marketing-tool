'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, ExternalLink } from 'lucide-react';
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
    onDelete: (id: string) => Promise<void>;
}

export function StrategyCard({
    id,
    name,
    platforms,
    durationDays,
    createdAt,
    onDelete,
}: StrategyCardProps) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const platformLabels = platforms
        ?.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(', ') || '—';

    return (
        <>
            <Card className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold tracking-tight text-zinc-900 line-clamp-2">{name}</h3>
                    <p className="text-sm text-zinc-500">
                        <span className="font-medium">Platforms:</span> {platformLabels}
                    </p>
                    <p className="text-sm text-zinc-500">
                        <span className="font-medium">Duration:</span> {durationDays} Days
                    </p>
                    <p className="text-xs text-zinc-400">
                        Created: {format(new Date(createdAt), 'MMMM yyyy')}
                    </p>
                    <div className="flex gap-2 pt-2">
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
                            onClick={() => setDeleteOpen(true)}
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
