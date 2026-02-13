'use client';

import { cn } from "@/lib/utils";

interface CaptionPreviewProps {
    style: string;
    text?: string;
    animation?: string;
    className?: string;
}

export function CaptionPreview({ style, text = "Captions", animation, className }: CaptionPreviewProps) {
    const getStyleClasses = () => {
        switch (style) {
            case 'classic':
                return "text-white font-black uppercase tracking-tighter [text-shadow:2px_2px_0_#000,-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000]";
            case 'highlight':
                return "bg-yellow-400 text-black font-bold px-2 py-0.5 rounded-sm shadow-lg rotate-[-2deg]";
            case 'modern':
                return "text-white font-medium tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]";
            case 'neon':
                return "text-white font-bold tracking-widest uppercase animate-caption-glow";
            case 'typewriter':
                return "text-green-400 font-mono border-r-2 border-green-400 pr-1";
            case 'pop':
                return "text-indigo-500 font-black italic uppercase drop-shadow-[0_4px_0_rgba(255,255,255,1)]";
            default:
                return "text-white";
        }
    };

    const getAnimationClass = () => {
        switch (animation) {
            case 'pop':
                return "animate-caption-pop";
            case 'fade':
                return "animate-caption-fade";
            case 'glow':
                return "animate-caption-glow";
            case 'type':
                return "animate-caption-typewriter";
            case 'bounce':
                return "animate-caption-bounce";
            default:
                return "";
        }
    };

    return (
        <div className={cn(
            "flex h-full w-full items-center justify-center bg-zinc-900/40 overflow-hidden rounded-lg border border-zinc-200/50",
            className
        )}>
            <div className={cn(
                "text-2xl transition-all duration-300",
                getStyleClasses(),
                getAnimationClass()
            )}>
                {text}
            </div>
        </div>
    );
}
