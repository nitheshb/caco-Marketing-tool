'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VideoDurations, PublishPlatforms } from "@/lib/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { Info, Music2, Youtube, Instagram, Mail, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const IconMap: Record<string, LucideIcon> = {
    Music2,
    Youtube,
    Instagram,
    Mail
};

interface SeriesDetailsSelectionProps {
    data: any;
    updateData: (updates: any) => void;
}

export function SeriesDetailsSelection({ data, updateData }: SeriesDetailsSelectionProps) {
    const selectedPlatforms = data.platforms || [];

    const handlePlatformToggle = (platformId: string) => {
        if (selectedPlatforms.includes(platformId)) {
            updateData({ platforms: selectedPlatforms.filter((p: string) => p !== platformId) });
        } else {
            updateData({ platforms: [...selectedPlatforms, platformId] });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Series Details</h2>
                <p className="text-zinc-500 text-sm">Configure your series settings and schedule.</p>
            </div>

            <div className="grid gap-6 max-w-2xl">
                {/* Series Name */}
                <div className="space-y-2">
                    <Label htmlFor="seriesName" className="text-sm font-semibold text-zinc-700">Series Name</Label>
                    <Input
                        id="seriesName"
                        placeholder="e.g., Daily Stoic Wisdom"
                        value={data.seriesName || ''}
                        onChange={(e) => updateData({ seriesName: e.target.value })}
                        className="h-11 border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                {/* Video Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-zinc-700">Video Duration</Label>
                        <Select
                            value={data.duration || ''}
                            onValueChange={(value) => updateData({ duration: value })}
                        >
                            <SelectTrigger className="h-11 border-zinc-200 focus:ring-indigo-500">
                                <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                                {VideoDurations.map((duration) => (
                                    <SelectItem key={duration.id} value={duration.id}>
                                        {duration.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Publish Time */}
                    <div className="space-y-2">
                        <Label htmlFor="publishTime" className="text-sm font-semibold text-zinc-700">Publish Time</Label>
                        <Input
                            id="publishTime"
                            type="time"
                            value={data.publishTime || ''}
                            onChange={(e) => updateData({ publishTime: e.target.value })}
                            className="h-11 border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Platform Selection */}
                <div className="space-y-3">
                    <Label className="text-sm font-semibold text-zinc-700">Publish Platforms</Label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {PublishPlatforms.map((platform) => (
                            <div
                                key={platform.id}
                                onClick={() => handlePlatformToggle(platform.id)}
                                className={cn(
                                    "flex flex-col items-center gap-2.5 p-4 rounded-xl border cursor-pointer transition-all duration-300",
                                    selectedPlatforms.includes(platform.id)
                                        ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm"
                                        : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50"
                                )}
                            >
                                <div className="flex w-full items-center justify-between">
                                    <Checkbox
                                        checked={selectedPlatforms.includes(platform.id)}
                                        onCheckedChange={() => handlePlatformToggle(platform.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 h-4 w-4"
                                    />
                                    {platform.icon && IconMap[platform.icon] && (
                                        (() => {
                                            const Icon = IconMap[platform.icon];
                                            return <Icon className={cn("h-4 w-4", selectedPlatforms.includes(platform.id) ? "text-indigo-600" : "text-zinc-400")} />;
                                        })()
                                    )}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest">{platform.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-2 text-zinc-500 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                        <Info className="h-4 w-4 text-indigo-600" />
                    </div>
                    <p className="text-[12px] font-medium leading-relaxed">
                        <span className="font-bold text-zinc-900">Note:</span> Video will generate 3-6 hours before video publish
                    </p>
                </div>
            </div>
        </div>
    );
}
