'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, Loader2 } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SeriesCard } from '@/components/dashboard/series-card';
import { toast } from 'sonner';
import { usePlanLimits } from '@/hooks/use-plan-limits';
import { UpgradeModal } from '@/components/dashboard/upgrade-modal';

export default function DashboardPage() {
    const router = useRouter();
    const [series, setSeries] = useState<any[]>([]);
    const [videoCount, setVideoCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    const { currentPlan, limits, canCreateVideo, canExecuteWorkflow } = usePlanLimits();

    const fetchData = async () => {
        try {
            setIsLoading(true);

            // Fetch Series
            const seriesRes = await fetch('/api/series');
            if (seriesRes.ok) {
                const data = await seriesRes.json();
                setSeries(data);
            }

            // Fetch Videos to count total
            const videosRes = await fetch('/api/videos');
            if (videosRes.ok) {
                const data = await videosRes.json();
                setVideoCount(data.length);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this series?")) return;

        try {
            const response = await fetch(`/api/series/${id}`, { method: 'DELETE' });
            if (response.ok) {
                toast.success("Series deleted");
                setSeries(prev => prev.filter(s => s.id !== id));
            }
        } catch (error) {
            toast.error("Failed to delete series");
        }
    };

    const handleTogglePause = async (id: string) => {
        const item = series.find(s => s.id === id);
        const newStatus = item.status === 'paused' ? 'active' : 'paused';

        try {
            const response = await fetch(`/api/series/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                toast.success(`Series ${newStatus === 'paused' ? 'paused' : 'resumed'}`);
                setSeries(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                <p className="text-zinc-500 font-medium">Fetching your series...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900">Your Series</h1>
                    <p className="text-zinc-500 font-medium">Manage and monitor your automated video series.</p>
                </div>
                <Link href="/dashboard/create">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 px-6 shadow-lg shadow-indigo-200 transition-all active:scale-95 gap-2 rounded-xl">
                        <Plus className="h-5 w-5" />
                        New Series
                    </Button>
                </Link>
            </div>

            {series.length === 0 ? (
                <div className="flex h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/50 space-y-4 text-center p-8">
                    <div className="h-16 w-16 rounded-2xl bg-zinc-50 flex items-center justify-center border border-zinc-100">
                        <LayoutGrid className="h-8 w-8 text-zinc-300" />
                    </div>
                    <div className="space-y-1 max-w-sm">
                        <h3 className="text-lg font-bold text-zinc-900">No series created yet</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            Start your content journey by creating your first automated video series.
                            It only takes a few minutes to setup!
                        </p>
                    </div>
                    <Link href="/dashboard/create">
                        <Button className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 px-8 rounded-xl shadow-md transition-all active:scale-95">
                            Create Now
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {series.map((item) => (
                        <SeriesCard
                            key={item.id}
                            series={item}
                            onDelete={handleDelete}
                            onTogglePause={handleTogglePause}
                            onEdit={(id) => router.push(`/dashboard/create?id=${id}`)}
                            canExecuteWorkflow={canExecuteWorkflow}
                            onGenerateNow={async (id, testMode = false) => {
                                // Check video limits
                                if (!canCreateVideo(videoCount)) {
                                    toast.error(`You've reached the video limit for the ${limits.name} plan.`);
                                    setIsUpgradeModalOpen(true);
                                    return;
                                }

                                try {
                                    const response = await fetch('/api/video/generate', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ seriesId: id, testMode })
                                    });
                                    if (response.ok) {
                                        toast.success(testMode ? "Test workflow started (4 min total delay)!" : "Video generation started!");
                                        router.push('/dashboard/videos');
                                    } else {
                                        toast.error("Failed to start generation");
                                    }
                                } catch (error) {
                                    toast.error("Error starting generation");
                                }
                            }}
                            onViewVideos={(id) => router.push(`/dashboard/videos?seriesId=${id}`)}
                        />
                    ))}
                </div>
            )}

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                title="Upgrade to Generate More Videos"
                description={`You've reached the ${limits.maxVideos} video limit on the ${limits.name} plan. Upgrade to Basic or Unlimited to unlock more generations!`}
            />
        </div>
    );
}
