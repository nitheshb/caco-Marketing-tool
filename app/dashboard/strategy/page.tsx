'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { StrategyCard } from '@/components/strategy/strategy-card';
import { GenerateStrategyModal } from '@/components/strategy/generate-strategy-modal';
import {
    STRATEGY_TEMPLATES,
    StrategyTemplateCard,
    type StrategyTemplatePrefill,
} from '@/components/strategy/strategy-template-card';

interface Strategy {
    id: string;
    name: string;
    platforms: string[];
    duration_days: number;
    created_at: string;
}

const LANDING_BTN =
    'bg-[#f2d412] hover:bg-[#f2c112] text-zinc-900 rounded-full font-medium text-[15px] shadow-md transition-all';

export default function StrategyPage() {
    const [strategies, setStrategies] = useState<Strategy[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [prefill, setPrefill] = useState<StrategyTemplatePrefill | null>(null);

    const fetchStrategies = async () => {
        try {
            const res = await fetch('/api/strategy');
            if (res.ok) {
                const data = await res.json();
                setStrategies(data);
            }
        } catch {
            setStrategies([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStrategies();
    }, []);

    const handleDelete = async (id: string) => {
        const res = await fetch(`/api/strategy/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setStrategies((prev) => prev.filter((s) => s.id !== id));
        } else {
            throw new Error('Delete failed');
        }
    };

    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto">
            <div className="bg-white p-6 rounded-[10px] border border-zinc-200 shadow-sm">
                <div className="space-y-1 mb-6">
                    <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 leading-tight">
                        Strategy Planner
                    </h1>
                    <p className="text-base leading-relaxed text-zinc-500 max-w-2xl">
                        AI-powered social media strategy. Generate a plan, review, edit, then convert to calendar events.
                    </p>
                </div>

                <div className="space-y-4">
                    <p className="text-sm font-bold tracking-widest uppercase text-[#239047]">
                        Choose a strategy template or create your own
                    </p>
                    <div className="flex gap-4 overflow-x-auto pb-2 -mx-1">
                        {STRATEGY_TEMPLATES.map((t) => (
                            <StrategyTemplateCard
                                key={t.id}
                                template={t}
                                onClick={() => {
                                    setPrefill(t.prefill);
                                    setModalOpen(true);
                                }}
                            />
                        ))}
                    </div>
                    <Button
                        onClick={() => {
                            setPrefill(null);
                            setModalOpen(true);
                        }}
                        className={`h-11 px-6 gap-2 ${LANDING_BTN}`}
                    >
                        Generate your own AI strategy
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex h-[40vh] flex-col items-center justify-center gap-4 bg-white rounded-[10px] shadow-sm border border-zinc-200">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                    <p className="text-base text-zinc-500">Loading strategies...</p>
                </div>
            ) : strategies.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-6 py-16 bg-white rounded-[10px] border border-zinc-200 shadow-sm">
                    <div className="rounded-full bg-indigo-100 p-4">
                        <Sparkles className="h-10 w-10 text-indigo-600" />
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">No strategies yet</h2>
                        <p className="text-base leading-relaxed text-zinc-500 max-w-sm">
                            Generate your first AI-powered strategy to plan content across your social channels.
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            setPrefill(null);
                            setModalOpen(true);
                        }}
                        className={`h-11 px-6 gap-2 ${LANDING_BTN}`}
                    >
                        <Sparkles className="h-5 w-5" />
                        Generate your own AI strategy
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {strategies.map((s) => (
                        <StrategyCard
                            key={s.id}
                            id={s.id}
                            name={s.name}
                            platforms={s.platforms || []}
                            durationDays={s.duration_days}
                            createdAt={s.created_at}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            <GenerateStrategyModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                onSuccess={() => fetchStrategies()}
                prefill={prefill}
            />
        </div>
    );
}
