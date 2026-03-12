'use client';

import { Calendar, Rocket, FileText, Palette, Megaphone, ShoppingBag, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StrategyTemplatePrefill {
    businessType?: string;
    goal?: string;
    theme?: string;
    platforms?: string[];
    durationDays?: number;
}

export interface StrategyTemplate {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    iconBg: string;
    prefill: StrategyTemplatePrefill;
}

export const STRATEGY_TEMPLATES: StrategyTemplate[] = [
    {
        id: 'content-calendar',
        title: 'Content Calendar',
        subtitle: '30-day content plan',
        icon: Calendar,
        iconBg: 'bg-amber-100 text-amber-600',
        prefill: {
            businessType: 'Other',
            goal: 'brand_awareness',
            theme: 'content_calendar',
            platforms: ['instagram', 'linkedin'],
            durationDays: 30,
        },
    },
    {
        id: 'product-launch',
        title: 'Product Launch Plan',
        subtitle: 'Launch campaigns',
        icon: Rocket,
        iconBg: 'bg-emerald-100 text-emerald-600',
        prefill: {
            businessType: 'Ecommerce',
            goal: 'increase_sales',
            theme: 'product_launch',
            platforms: ['instagram', 'linkedin', 'youtube'],
            durationDays: 14,
        },
    },
    {
        id: 'marketing-strategy',
        title: 'Marketing Strategy Doc',
        subtitle: 'Brand & campaign planning',
        icon: FileText,
        iconBg: 'bg-blue-100 text-blue-600',
        prefill: {
            businessType: 'Agency',
            goal: 'brand_awareness',
            theme: 'marketing_strategy',
            platforms: ['instagram', 'linkedin', 'facebook'],
            durationDays: 30,
        },
    },
    {
        id: 'brand-guidelines',
        title: 'Brand Guidelines',
        subtitle: 'Consistent brand voice',
        icon: Palette,
        iconBg: 'bg-violet-100 text-violet-600',
        prefill: {
            businessType: 'Personal Brand',
            goal: 'brand_awareness',
            theme: 'brand_guidelines',
            platforms: ['instagram', 'linkedin'],
            durationDays: 30,
        },
    },
    {
        id: 'campaign-brief',
        title: 'Campaign Brief',
        subtitle: 'Targeted campaigns',
        icon: Megaphone,
        iconBg: 'bg-rose-100 text-rose-600',
        prefill: {
            businessType: 'Other',
            goal: 'engagement',
            theme: 'campaign',
            platforms: ['instagram', 'facebook', 'youtube'],
            durationDays: 14,
        },
    },
    {
        id: 'social-media',
        title: 'Social Media',
        subtitle: 'Cross-platform presence',
        icon: Sparkles,
        iconBg: 'bg-indigo-100 text-indigo-600',
        prefill: {
            businessType: 'Other',
            goal: 'increase_followers',
            theme: 'social_media',
            platforms: ['instagram', 'linkedin', 'facebook', 'youtube'],
            durationDays: 30,
        },
    },
    {
        id: 'ecommerce-promo',
        title: 'E-commerce Promotions',
        subtitle: 'Sales & offers',
        icon: ShoppingBag,
        iconBg: 'bg-orange-100 text-orange-600',
        prefill: {
            businessType: 'Ecommerce',
            goal: 'increase_sales',
            theme: 'promotional',
            platforms: ['instagram', 'facebook'],
            durationDays: 14,
        },
    },
];

interface StrategyTemplateCardProps {
    template: StrategyTemplate;
    onClick: () => void;
}

export function StrategyTemplateCard({ template, onClick }: StrategyTemplateCardProps) {
    const Icon = template.icon;
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'flex flex-col items-start text-left rounded-xl border p-5 min-w-[180px] sm:min-w-[200px]',
                'bg-white border-zinc-200 shadow-sm transition-all',
                'hover:border-amber-300 hover:shadow-md hover:bg-amber-50/30'
            )}
        >
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg mb-3', template.iconBg)}>
                <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-zinc-900">{template.title}</h3>
            <p className="text-sm text-zinc-500 mt-0.5">{template.subtitle}</p>
        </button>
    );
}
