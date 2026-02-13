'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, Video as VideoIcon, Calendar, Film, PlayCircle, Clock, Download } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

function VideosList() {
    const searchParams = useSearchParams();
    const seriesId = searchParams.get('seriesId');
    const [videos, setVideos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchVideos = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/videos');
            if (response.ok) {
                let data = await response.json();
                if (seriesId) {
                    data = data.filter((v: any) => v.series_id === seriesId);
                }
                setVideos(data);
            }
        } catch (error) {
            console.error("Error fetching videos:", error);
            toast.error("Failed to load videos");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
        // Polling for updates if there are processing videos
        const interval = setInterval(() => {
            const hasProcessing = videos.some(v => v.status === 'processing');
            if (hasProcessing) {
                fetchVideos();
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [seriesId, videos.some(v => v.status === 'processing')]);

    if (isLoading && videos.length === 0) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                <p className="text-zinc-500 font-medium">Loading your videos...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900">Generated Videos</h1>
                    <p className="text-zinc-500 font-medium">
                        {seriesId ? "Showing videos for selected series." : "Manage and view all your generated content."}
                    </p>
                </div>
            </div>

            {videos.length === 0 ? (
                <div className="flex h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/50 space-y-4 text-center p-8">
                    <div className="h-16 w-16 rounded-2xl bg-zinc-50 flex items-center justify-center border border-zinc-100">
                        <VideoIcon className="h-8 w-8 text-zinc-300" />
                    </div>
                    <div className="space-y-1 max-w-sm">
                        <h3 className="text-lg font-bold text-zinc-900">No videos generated yet</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            Once you start generating videos from your series, they will appear here.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </div>
            )}
        </div>
    );
}

function VideoCard({ video }: { video: any }) {
    const thumbnail = video.images?.[0]?.url || video.series?.video_style_image || '/placeholder-thumb.png';
    const isProcessing = video.status === 'processing';
    const isReady = video.status === 'ready';

    return (
        <Card className="group overflow-hidden rounded-3xl border-zinc-200 bg-white transition-all hover:shadow-2xl hover:shadow-indigo-100/50 border-0 shadow-sm ring-1 ring-zinc-200/50">
            <CardContent className="p-0">
                {/* Thumbnail Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
                    <Image
                        src={thumbnail}
                        alt={video.title || "Video thumbnail"}
                        fill
                        className={cn(
                            "object-cover transition-transform duration-500 group-hover:scale-105",
                            isProcessing && "blur-sm grayscale opacity-50"
                        )}
                    />

                    {/* Overlay for status */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        {isProcessing ? (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="h-10 w-10 animate-spin text-white drop-shadow-lg" />
                                <span className="text-white font-bold text-sm bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
                                    Generating...
                                </span>
                            </div>
                        ) : (
                            isReady && video.video_url && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                                            <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xl hover:bg-white/40 transition-colors">
                                                <PlayCircle className="h-8 w-8 text-white fill-white/10" />
                                            </div>
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl border-0 p-0 overflow-hidden rounded-2xl bg-zinc-950">
                                        <DialogHeader className="p-4 bg-zinc-900 border-b border-zinc-800">
                                            <DialogTitle className="text-white flex items-center gap-2">
                                                <VideoIcon className="h-5 w-5 text-indigo-400" />
                                                {video.title}
                                            </DialogTitle>
                                        </DialogHeader>
                                        <div className="aspect-video w-full">
                                            <video
                                                src={video.video_url}
                                                controls
                                                autoPlay
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )
                        )}
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                        <Badge
                            variant={isReady ? 'default' : 'secondary'}
                            className={cn(
                                "font-bold px-3 py-1 rounded-lg uppercase tracking-wider text-[10px]",
                                isReady ? "bg-emerald-500 text-white" : "bg-indigo-500 text-white"
                            )}
                        >
                            {video.status}
                        </Badge>
                    </div>

                    {/* Download Button */}
                    {isReady && video.video_url && (
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <a
                                href={video.video_url}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all active:scale-95"
                            >
                                <Download className="h-5 w-5 text-white" />
                            </a>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <h3 className="font-black text-lg text-zinc-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                            {video.title || "Untitled Video"}
                        </h3>
                        <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
                            <Film className="h-4 w-4 text-indigo-500" />
                            <span className="truncate">{video.series?.series_name || "Unknown Series"}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-50">
                        <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-tight">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(new Date(video.created_at), 'MMM dd, yyyy')}
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-tight">
                            <Clock className="h-3.5 w-3.5" />
                            {format(new Date(video.created_at), 'hh:mm a')}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function VideosPage() {
    return (
        <Suspense fallback={
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                <p className="text-zinc-500 font-medium">Loading your videos...</p>
            </div>
        }>
            <VideosList />
        </Suspense>
    );
}
