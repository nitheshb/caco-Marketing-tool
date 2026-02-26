'use client';

import { SlidePanel } from '@/components/ui/slide-panel';
import { Button } from '@/components/ui/button';
import { Zap, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
}

const features = [
    'Unlock unlimited series creation',
    'Connect Instagram & TikTok accounts',
    'Prioritized high-speed rendering',
];

export function UpgradeModal({
    isOpen,
    onClose,
    title = 'Upgrade Your Plan',
    description = "You've reached the limit of your current plan. Upgrade to unlock more features and generations.",
}: UpgradeModalProps) {
    const router = useRouter();

    return (
        <SlidePanel
            open={isOpen}
            onClose={onClose}
            title={title}
            subtitle={description}
            size="sm"
            footer={
                <div className="flex flex-col gap-2">
                    <Button
                        onClick={() => router.push('/dashboard/billing')}
                        className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100"
                    >
                        Go to Billing
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="w-full h-9 text-zinc-400 hover:text-zinc-600"
                    >
                        Maybe later
                    </Button>
                </div>
            }
        >
            <div className="p-6 space-y-6">
                {/* Crown icon */}
                <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                        <Crown className="h-8 w-8" />
                    </div>
                </div>

                {/* Feature list */}
                <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-4 space-y-3">
                    {features.map((f, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className="mt-0.5 rounded-full bg-indigo-100 p-1 flex-shrink-0">
                                <Zap className="h-3 w-3 text-indigo-600" />
                            </div>
                            <p className="text-sm font-medium text-zinc-700">{f}</p>
                        </div>
                    ))}
                </div>
            </div>
        </SlidePanel>
    );
}
