'use client';

import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles } from 'lucide-react';
import type { WorkbenchType } from './posters-workbench';

const LANDING_BTN =
    'bg-[#f2d412] hover:bg-[#f2c112] text-zinc-900 rounded-full font-medium text-[15px] shadow-md transition-all';

const FORMAT_OPTIONS = [
    { value: 'landscape-16-9', label: '16:9 (Landscape)' },
    { value: 'square-1-1', label: '1:1 (Square)' },
    { value: 'portrait-4-5', label: '4:5 (Portrait)' },
    { value: 'reels-9-16', label: '9:16 (Reels)' },
];

const STYLE_OPTIONS = [
    { value: 'clean-modern', label: 'Clean & modern' },
    { value: 'bold-typography', label: 'Bold typography' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'luxury', label: 'Luxury' },
];

const TONE_OPTIONS = [
    { value: 'brand-safe', label: 'Brand-safe' },
    { value: 'playful', label: 'Playful' },
    { value: 'premium', label: 'Premium' },
    { value: 'urgent-salesy', label: 'Urgent / salesy' },
];

export interface AiHelpSelection {
    description: string;
    requirements: string;
    format: string;
    style: string;
    tone: string;
}

interface PostersAiHelpSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    type: WorkbenchType;
    onApply: (selection: AiHelpSelection) => void;
}

export function PostersAiHelpSheet({
    open,
    onOpenChange,
    type,
    onApply,
}: PostersAiHelpSheetProps) {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
    const [format, setFormat] = useState('landscape-16-9');
    const [style, setStyle] = useState('clean-modern');
    const [tone, setTone] = useState('brand-safe');
    const [requirements, setRequirements] = useState('');

    useEffect(() => {
        if (!open) {
            setSuggestions([]);
            setSelectedPrompt(null);
            return;
        }
        setLoading(true);
        const auth = getAuth(app);
        const getToken = auth.currentUser ? auth.currentUser.getIdToken(true) : Promise.resolve(null);
        getToken.then((token) => {
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            return fetch('/api/posters/suggestions', {
                method: 'POST',
                headers,
                body: JSON.stringify({ type }),
            });
        }).then((res) => res.json())
            .then((data) => {
                if (data.suggestions) setSuggestions(data.suggestions);
            })
            .catch(() => setSuggestions([]))
            .finally(() => setLoading(false));
    }, [open, type]);

    const handleApply = () => {
        const description = selectedPrompt || '';
        if (!description.trim()) return;
        onApply({
            description: description.trim(),
            requirements: requirements.trim(),
            format,
            style,
            tone,
        });
        onOpenChange(false);
        setSelectedPrompt(null);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="flex flex-col w-full sm:max-w-xl md:max-w-2xl overflow-hidden"
                showCloseButton={true}
            >
                <SheetHeader className="space-y-3 pb-6">
                    <SheetTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-[#f2d412]" />
                        AI Prompt Suggestions
                    </SheetTitle>
                    <p className="text-sm text-zinc-500 font-normal">
                        Pick a suggestion and refine your options. Click OK to fill the prompt.
                    </p>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
                    <div className="space-y-3">
                        <p className="text-xs font-semibold text-zinc-700">
                            Choose a prompt
                        </p>
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {suggestions.map((s, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setSelectedPrompt(s)}
                                        className={`w-full text-left rounded-xl border px-4 py-3.5 text-sm transition-colors ${
                                            selectedPrompt === s
                                                ? 'border-[#f2d412] bg-[#f2d412]/10'
                                                : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                                        }`}
                                    >
                                        <span className="line-clamp-3 text-zinc-800 leading-relaxed">{s}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 pt-1">
                        <p className="text-xs font-semibold text-zinc-700">Format</p>
                        <Select value={format} onValueChange={setFormat}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent align="start">
                                {FORMAT_OPTIONS.map((o) => (
                                    <SelectItem key={o.value} value={o.value}>
                                        {o.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 pt-1">
                        <p className="text-xs font-semibold text-zinc-700">Style</p>
                        <Select value={style} onValueChange={setStyle}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent align="start">
                                {STYLE_OPTIONS.map((o) => (
                                    <SelectItem key={o.value} value={o.value}>
                                        {o.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 pt-1">
                        <p className="text-xs font-semibold text-zinc-700">Tone</p>
                        <Select value={tone} onValueChange={setTone}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent align="start">
                                {TONE_OPTIONS.map((o) => (
                                    <SelectItem key={o.value} value={o.value}>
                                        {o.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 pt-1">
                        <p className="text-xs font-semibold text-zinc-700">
                            Requirements (optional)
                        </p>
                        <Input
                            value={requirements}
                            onChange={(e) => setRequirements(e.target.value)}
                            placeholder="Brand colors, CTA, logo placement..."
                        />
                    </div>
                </div>

                <SheetFooter className="pt-6 pb-2">
                    <Button
                        className={`w-full h-11 ${LANDING_BTN}`}
                        disabled={!selectedPrompt?.trim()}
                        onClick={handleApply}
                    >
                        OK – Use this prompt
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
