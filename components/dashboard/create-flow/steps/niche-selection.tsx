'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
    Check,
    Skull,
    Zap,
    Lightbulb,
    HeartPulse,
    Cpu,
    DollarSign,
    Landmark,
    Clapperboard,
    Compass,
    Film
} from "lucide-react";

const AVAILABLE_NICHES = [
    { id: 'scary', title: 'Scary Stories', description: 'Chilling tales and urban legends.', icon: Skull, color: 'text-red-500' },
    { id: 'motivational', title: 'Motivational', description: 'Boost productivity and mindset.', icon: Zap, color: 'text-amber-500' },
    { id: 'facts', title: 'Interesting Facts', description: 'Mind-blowing trivia tidbits.', icon: Lightbulb, color: 'text-blue-500' },
    { id: 'historical', title: 'Historical Stories', description: 'Epic tales from the ancient past.', icon: Landmark, color: 'text-orange-500' },
    { id: 'drama', title: 'Entertainment', description: 'Celebrity news and drama.', icon: Clapperboard, color: 'text-pink-500' },
    { id: 'travel', title: 'Travel & Adventure', description: 'Explore the world from home.', icon: Compass, color: 'text-teal-500' },
    { id: 'movie-recaps', title: 'Movie Recaps', description: 'Brief summaries of top movies.', icon: Film, color: 'text-indigo-500' },
    { id: 'health', title: 'Health & Fitness', description: 'Quick tips for better lifestyle.', icon: HeartPulse, color: 'text-emerald-500' },
    { id: 'tech', title: 'Tech News', description: 'Latest updates from tech world.', icon: Cpu, color: 'text-purple-500' },
    { id: 'finance', title: 'Finance Tips', description: 'Smart money management advice.', icon: DollarSign, color: 'text-green-500' },
];

interface NicheSelectionProps {
    data: any;
    updateData: (updates: any) => void;
}

export function NicheSelection({ data, updateData }: NicheSelectionProps) {
    const selectedNiche = data.niche;
    const isCustom = data.isCustomNiche;

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Select your niche</h2>
                <p className="text-zinc-500 text-sm">Choose a niche that best fits your series or create a custom one.</p>
            </div>

            <Tabs
                defaultValue={isCustom ? "custom" : "available"}
                className="w-full"
                onValueChange={(val) => updateData({ isCustomNiche: val === "custom" })}
            >
                <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-8">
                    <TabsTrigger value="available">Available Niche</TabsTrigger>
                    <TabsTrigger value="custom">Custom Niche</TabsTrigger>
                </TabsList>

                <TabsContent value="available" className="mt-0">
                    <ScrollArea className="h-[450px] pr-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {AVAILABLE_NICHES.map((niche) => {
                                const Icon = niche.icon;
                                return (
                                    <Card
                                        key={niche.id}
                                        className={cn(
                                            "relative cursor-pointer p-4 transition-all duration-200 hover:border-indigo-400 hover:shadow-md",
                                            selectedNiche === niche.id
                                                ? "border-2 border-indigo-600 bg-indigo-50/30"
                                                : "border border-zinc-200"
                                        )}
                                        onClick={() => updateData({ niche: niche.id })}
                                    >
                                        {selectedNiche === niche.id && (
                                            <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                                                <Check className="h-3 w-3" />
                                            </div>
                                        )}
                                        <div className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-50 transition-colors", selectedNiche === niche.id && "bg-white")}>
                                            <Icon className={cn("h-6 w-6", niche.color)} />
                                        </div>
                                        <h3 className="font-bold text-sm text-zinc-900 leading-tight">{niche.title}</h3>
                                        <p className="mt-1 text-[12px] text-zinc-500 leading-snug">{niche.description}</p>
                                    </Card>
                                )
                            })}
                        </div>
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="custom" className="mt-0">
                    <div className="rounded-xl border border-zinc-200 bg-white p-8 space-y-4 shadow-sm">
                        <div className="space-y-3">
                            <Label htmlFor="custom-niche" className="text-base font-semibold">Custom Niche Name</Label>
                            <Input
                                id="custom-niche"
                                placeholder="Enter your niche (e.g., Space Exploration)"
                                value={isCustom ? (selectedNiche || "") : ""}
                                onChange={(e) => updateData({ niche: e.target.value })}
                                className="h-12 text-lg focus:ring-indigo-600"
                            />
                        </div>
                        <p className="text-sm text-zinc-500">
                            Provide a name for your specific niche. Our AI will adapt to your choice.
                        </p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
