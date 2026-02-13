'use client';

import { useState, useRef } from 'react';
import { Languages, DeepgramVoices, FonadalabVoices } from '@/lib/constants';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Play, Pause, Check, Globe } from "lucide-react";

interface LanguageVoiceSelectionProps {
    data: any;
    updateData: (updates: any) => void;
}

export function LanguageVoiceSelection({ data, updateData }: LanguageVoiceSelectionProps) {
    const [playingPreview, setPlayingPreview] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const selectedLanguage = Languages.find(l => l.language === data.language) || Languages[0];
    const voices = selectedLanguage.modelName === 'deepgram' ? DeepgramVoices : FonadalabVoices;

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

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Language & Voice</h2>
                <p className="text-zinc-500 text-sm">Pick a language and a voice that matches your content's tone.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Language Selection */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                        <Globe className="h-4 w-4 text-indigo-600" />
                        Select Language
                    </label>
                    <Select
                        value={data.language}
                        onValueChange={(val) => {
                            const lang = Languages.find(l => l.language === val);
                            updateData({
                                language: val,
                                voice: '', // Reset voice when language changes (model might change)
                                modelName: lang?.modelName,
                                modelLangCode: lang?.modelLangCode
                            });
                        }}
                    >
                        <SelectTrigger className="h-12 text-lg border-zinc-200">
                            <SelectValue placeholder="Choose a language" />
                        </SelectTrigger>
                        <SelectContent>
                            {Languages.map((lang) => (
                                <SelectItem key={lang.language} value={lang.language} className="text-lg">
                                    <span className="mr-2">{lang.countryFlag}</span>
                                    {lang.language}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Info Card */}
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/20 p-4 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-indigo-700 font-semibold mb-1">
                        <span className="text-lg">{selectedLanguage.countryFlag}</span>
                        <span>{selectedLanguage.language} selected</span>
                    </div>
                    <p className="text-xs text-indigo-600/70">
                        Using {selectedLanguage.modelName} model for high-quality {selectedLanguage.language} generation.
                    </p>
                </div>
            </div>

            {/* Voice Selection */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-zinc-700">Available Voices</label>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-zinc-400">
                        {voices.length} Voices available
                    </Badge>
                </div>

                <ScrollArea className="h-[380px] rounded-xl border border-zinc-100 bg-white/50 p-4 shadow-inner">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {voices.map((voice) => (
                            <Card
                                key={voice.modelName}
                                className={cn(
                                    "relative cursor-pointer overflow-hidden p-5 transition-all duration-200 hover:border-indigo-400 hover:shadow-md",
                                    data.voice === voice.modelName
                                        ? "border-2 border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600/20"
                                        : "border border-zinc-200"
                                )}
                                onClick={() => updateData({ voice: voice.modelName })}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-zinc-900 capitalize leading-none">
                                            {voice.modelName.replace('aura-2-', '').replace('-en', '')}
                                        </h3>
                                        <div className="flex items-center gap-1.5 pt-1">
                                            <Badge variant="secondary" className="text-[10px] py-0 h-4 px-1.5 text-zinc-500 font-normal">
                                                {voice.gender}
                                            </Badge>
                                            <span className="text-[10px] text-zinc-400 uppercase">{voice.model}</span>
                                        </div>
                                    </div>

                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className={cn(
                                            "h-8 w-8 rounded-full transition-colors",
                                            playingPreview === voice.preview
                                                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                        )}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTogglePreview(voice.preview);
                                        }}
                                    >
                                        {playingPreview === voice.preview ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                    </Button>
                                </div>

                                {data.voice === voice.modelName && (
                                    <div className="absolute -right-2 -top-2 flex h-8 w-8 rotate-12 items-center justify-center bg-indigo-600 text-white pt-2 pr-2">
                                        <Check className="h-3 w-3" />
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
