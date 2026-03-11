'use client';

import { useState, useEffect } from 'react';
import type { StrategyTemplatePrefill } from './strategy-template-card';
import { SlidePanel } from '@/components/ui/slide-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const BUSINESS_TYPES = ['Ecommerce', 'SaaS', 'Restaurant', 'Personal Brand', 'Agency', 'Other'];
const GOALS = ['Increase Followers', 'Increase Sales', 'Brand Awareness', 'Engagement'];
const PLATFORMS = [
    { id: 'instagram', label: 'Instagram' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'youtube', label: 'YouTube' },
];
const DURATIONS = [
    { value: 7, label: '7 days' },
    { value: 14, label: '14 days' },
    { value: 30, label: '30 days' },
];

interface GenerateStrategyModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: (strategy: { id: string; name: string }) => void;
    prefill?: StrategyTemplatePrefill | null;
}

export function GenerateStrategyModal({
    open,
    onOpenChange,
    onSuccess,
    prefill,
}: GenerateStrategyModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [businessType, setBusinessType] = useState('');
    const [brandName, setBrandName] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [goal, setGoal] = useState('');
    const [platforms, setPlatforms] = useState<string[]>([]);
    const [theme, setTheme] = useState('');
    const [durationDays, setDurationDays] = useState(30);
    const [startDate, setStartDate] = useState<string>('');

    useEffect(() => {
        if (open && prefill) {
            if (prefill.businessType) setBusinessType(prefill.businessType);
            if (prefill.goal) setGoal(prefill.goal);
            if (prefill.theme) setTheme(prefill.theme);
            if (prefill.platforms?.length) setPlatforms(prefill.platforms);
            if (prefill.durationDays) setDurationDays(prefill.durationDays);
        }
    }, [open, prefill]);

    const togglePlatform = (id: string) => {
        setPlatforms((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        if (!brandName.trim()) {
            toast.error('Brand name is required');
            return;
        }
        if (platforms.length === 0) {
            toast.error('Select at least one platform');
            return;
        }
        if (!startDate) {
            toast.error('Start date is required');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/strategy/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    businessType: businessType || 'Other',
                    brandName: brandName.trim(),
                    targetAudience: targetAudience.trim(),
                    goal: goal || 'Brand Awareness',
                    platforms,
                    theme: theme.trim() || undefined,
                    durationDays,
                    startDate,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to generate strategy');
            }

            toast.success('Strategy generated successfully!');
            onSuccess(data.strategy);
            onOpenChange(false);

            // Reset form
            setBusinessType('');
            setBrandName('');
            setTargetAudience('');
            setGoal('');
            setPlatforms([]);
            setTheme('');
            setDurationDays(30);
            setStartDate('');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to generate strategy');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SlidePanel
            open={open}
            onClose={() => onOpenChange(false)}
            title="Generate AI Strategy"
            size="half"
            footer={
                <div className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="rounded-full font-medium text-[15px] border-zinc-200"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !brandName.trim() || platforms.length === 0}
                        className="rounded-full font-medium text-[15px] bg-[#f2d412] hover:bg-[#f2c112] text-zinc-900"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            'Generate Strategy'
                        )}
                    </Button>
                </div>
            }
        >
            <div className="space-y-5 px-6 py-4">
                    <div>
                        <Label className="text-sm font-bold text-zinc-600">Business Type</Label>
                        <Select value={businessType} onValueChange={setBusinessType}>
                            <SelectTrigger className="mt-1.5 h-11 rounded-xl border-zinc-200 bg-white">
                                <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                                {BUSINESS_TYPES.map((t) => (
                                    <SelectItem key={t} value={t}>
                                        {t}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="text-sm font-bold text-zinc-600">Brand Name *</Label>
                        <Input
                            placeholder="e.g. Nike"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            className="mt-1.5 h-11 rounded-xl border-zinc-200"
                        />
                    </div>

                    <div>
                        <Label className="text-sm font-bold text-zinc-600">Target Audience</Label>
                        <Textarea
                            placeholder="Describe your target audience..."
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                            className="mt-1.5 min-h-[80px] rounded-xl border-zinc-200 resize-none"
                        />
                    </div>

                    <div>
                        <Label className="text-sm font-bold text-zinc-600">Goal</Label>
                        <Select value={goal} onValueChange={setGoal}>
                            <SelectTrigger className="mt-1.5 h-11 rounded-xl border-zinc-200 bg-white">
                                <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                                {GOALS.map((g) => (
                                    <SelectItem key={g} value={g.toLowerCase().replace(/\s/g, '_')}>
                                        {g}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="text-sm font-bold text-zinc-600">Platforms *</Label>
                        <div className="mt-2 flex flex-wrap gap-3">
                            {PLATFORMS.map((p) => (
                                <label
                                    key={p.id}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <Checkbox
                                        checked={platforms.includes(p.id)}
                                        onCheckedChange={() => togglePlatform(p.id)}
                                    />
                                    <span className="text-sm font-medium">{p.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Label className="text-sm font-bold text-zinc-600">Campaign Theme (optional)</Label>
                        <Input
                            placeholder="e.g. Holi, Product Launch, Summer Sale"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            className="mt-1.5 h-11 rounded-xl border-zinc-200"
                        />
                    </div>

                    <div>
                        <Label className="text-sm font-bold text-zinc-600">Strategy Duration</Label>
                        <Select
                            value={String(durationDays)}
                            onValueChange={(v) => setDurationDays(Number(v))}
                        >
                            <SelectTrigger className="mt-1.5 h-11 rounded-xl border-zinc-200 bg-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {DURATIONS.map((d) => (
                                    <SelectItem key={d.value} value={String(d.value)}>
                                        {d.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="text-sm font-bold text-zinc-600">Start Date *</Label>
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="mt-1.5 h-11 rounded-xl border-zinc-200"
                        />
                    </div>
                </div>
        </SlidePanel>
    );
}
