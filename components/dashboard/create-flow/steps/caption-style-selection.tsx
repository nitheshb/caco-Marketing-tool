'use client';

import { CaptionStyles } from '@/lib/constants';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { CaptionPreview } from '../caption-preview';

interface CaptionStyleSelectionProps {
    data: any;
    updateData: (updates: any) => void;
}

export function CaptionStyleSelection({ data, updateData }: CaptionStyleSelectionProps) {
    const selectedStyle = data.captionStyle || '';

    const handleSelect = (id: string) => {
        updateData({ captionStyle: id });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Caption Style</h2>
                <p className="text-zinc-500 text-sm">Choose how captions will appear in your video.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {CaptionStyles.map((style) => (
                    <Card
                        key={style.id}
                        className={cn(
                            "group relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer border-2 ring-offset-background",
                            selectedStyle === style.id
                                ? "border-indigo-600 ring-indigo-600 ring-offset-2 bg-indigo-50/10"
                                : "border-zinc-200 bg-white"
                        )}
                        onClick={() => handleSelect(style.id)}
                    >
                        <div className="p-4 space-y-3">
                            <div className="aspect-video relative overflow-hidden">
                                <CaptionPreview
                                    style={style.id}
                                    animation={style.animation}
                                    text="VIDMAXX"
                                />

                                {selectedStyle === style.id && (
                                    <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg z-10">
                                        <Check className="h-4 w-4 stroke-[3]" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <h3 className="font-bold text-zinc-900 text-sm">{style.name}</h3>
                                <p className="text-zinc-500 text-[10px] leading-tight line-clamp-2">
                                    {style.description}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
