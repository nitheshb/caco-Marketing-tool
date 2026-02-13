'use client';

import { useState, useRef } from 'react';
import { BackgroundMusic } from '@/lib/constants';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Play, Pause, Music } from "lucide-react";

interface BackgroundMusicSelectionProps {
    data: any;
    updateData: (updates: any) => void;
}

export function BackgroundMusicSelection({ data, updateData }: BackgroundMusicSelectionProps) {
    const [playingPreview, setPlayingPreview] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const selectedMusic = data.backgroundMusic || [];

    const handleTogglePreview = (url: string) => {
        if (playingPreview === url) {
            audioRef.current?.pause();
            setPlayingPreview(null);
        } else {
            if (audioRef.current) {
                audioRef.current.src = url;
                audioRef.current.play();
            } else {
                const audio = new Audio(url);
                audio.play();
                audio.onended = () => setPlayingPreview(null);
                audioRef.current = audio;
            }
            setPlayingPreview(url);
        }
    };

    const handleToggleSelect = (id: string) => {
        const isSelected = selectedMusic.includes(id);
        if (isSelected) {
            updateData({ backgroundMusic: selectedMusic.filter((m: string) => m !== id) });
        } else {
            updateData({ backgroundMusic: [...selectedMusic, id] });
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Background Music</h2>
                <p className="text-zinc-500 text-sm">Select tracks for your series.</p>
            </div>

            <ScrollArea className="h-[480px] pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {BackgroundMusic.map((track) => (
                        <Card
                            key={track.id}
                            className={cn(
                                "group relative flex  justify-between p-3.5 transition-all duration-200 hover:border-indigo-400 hover:shadow-md cursor-pointer",
                                selectedMusic.includes(track.id)
                                    ? "border-2 border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600/20"
                                    : "border border-zinc-200 bg-white"
                            )}
                            onClick={() => handleToggleSelect(track.id)}
                        >
                            <div className="flex items-center gap-3 justify-between ">
                                <div className='flex items-center gap-3'>
                                    <Checkbox
                                        checked={selectedMusic.includes(track.id)}
                                        onCheckedChange={() => handleToggleSelect(track.id)}
                                        className="h-4 w-4 border-zinc-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                        onClick={(e) => e.stopPropagation()}
                                    />

                                    <div className={cn(
                                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-50 transition-colors group-hover:bg-indigo-50",
                                        selectedMusic.includes(track.id) && "bg-white"
                                    )}>
                                        <Music className={cn("h-5 w-5 text-zinc-400 group-hover:text-indigo-500", selectedMusic.includes(track.id) && "text-indigo-600")} />
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="font-bold text-sm text-zinc-900 truncate pr-2">{track.name}</h3>
                                        <p className="mt-0.5 text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Track</p>
                                    </div>
                                </div>

                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className={cn(
                                        "h-9 w-9 shrink-0 rounded-full transition-colors",
                                        playingPreview === track.url
                                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                    )}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleTogglePreview(track.url);
                                    }}
                                >
                                    {playingPreview === track.url ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                                </Button>

                            </div>


                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
