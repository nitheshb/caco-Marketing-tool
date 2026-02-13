'use client';

import Image from 'next/image';
import { VideoStyles } from '@/lib/constants';
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface VideoStyleSelectionProps {
    data: any;
    updateData: (updates: any) => void;
}

export function VideoStyleSelection({ data, updateData }: VideoStyleSelectionProps) {
    const selectedStyle = data.videoStyle || '';

    const handleSelect = (id: string) => {
        updateData({ videoStyle: id });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Video Style</h2>
                <p className="text-zinc-500 text-sm">Choose the visual style for your videos.</p>
            </div>

            <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex w-max space-x-4 p-4">
                    {VideoStyles.map((style) => (
                        <Card
                            key={style.id}
                            className={cn(
                                "group relative w-[240px] shrink-0 overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer ring-offset-background",
                                selectedStyle === style.id
                                    ? "ring-2 ring-indigo-600 ring-offset-2"
                                    : "border border-zinc-200"
                            )}
                            onClick={() => handleSelect(style.id)}
                        >
                            <div className="aspect-[9/16] relative overflow-hidden bg-zinc-100">
                                <Image
                                    src={style.image}
                                    alt={style.name}
                                    fill
                                    className={cn(
                                        "object-cover transition-transform duration-500 group-hover:scale-110",
                                        selectedStyle === style.id ? "scale-105" : ""
                                    )}
                                    sizes="240px"
                                />

                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                {/* Selection Indicator */}
                                {selectedStyle === style.id && (
                                    <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg animate-in zoom-in-50 duration-300">
                                        <Check className="h-5 w-5 stroke-[3]" />
                                    </div>
                                )}

                                {/* Style Name Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className={cn(
                                        "text-lg font-bold text-white transition-transform",
                                        selectedStyle === style.id ? "translate-x-1" : "group-hover:translate-x-1"
                                    )}>
                                        {style.name}
                                    </h3>
                                    <p className="text-white/60 text-xs">9:16 Portrait</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}
