'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Plus,
    LayoutGrid,
    Loader2,
    ChevronDown,
    ChevronUp,
    CalendarDays,
    Clock3,
    MessageSquareText,
    BarChart3,
    PieChart,
    Sparkles,
    FileText,
    Users,
    Tags,
    FolderKanban,
    CheckCheck,
    Radio,
    Megaphone,
    Inbox,
    Shapes,
    type LucideIcon,
} from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SeriesCard } from '@/components/dashboard/series-card';
import { toast } from 'sonner';
import { usePlanLimits } from '@/hooks/use-plan-limits';
import { UpgradeModal } from '@/components/dashboard/upgrade-modal';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

type ToolItem = {
    name: string;
    description: string;
    tag: 'Core' | 'Premium';
    href: string;
    icon: LucideIcon;
    accent: string;
    soft: string;
    artwork?: 'default' | 'analytics';
};

const CORE_TOOLS: ToolItem[] = [
    {
        name: 'Publishing Tools',
        description: 'Easily draft, schedule, or publish a post.',
        icon: CalendarDays,
        tag: 'Core',
        href: '/dashboard/calendar',
        accent: '#f5c543',
        soft: '#fff7d6',
    },
    {
        name: 'Optimal Send Times',
        description: 'Automatically schedule best post times.',
        icon: Clock3,
        tag: 'Core',
        href: '/dashboard/calendar',
        accent: '#2f80ed',
        soft: '#dff0ff',
    },
    {
        name: 'Brand Sentiment',
        description: 'Uncover what people are saying.',
        icon: Radio,
        tag: 'Core',
        href: '/dashboard/strategy',
        accent: '#5ad0dd',
        soft: '#ddf8fb',
    },
    {
        name: 'Message Prioritization',
        description: 'Quickly know which messages to tackle.',
        icon: MessageSquareText,
        tag: 'Core',
        href: '/dashboard',
        accent: '#0f4c81',
        soft: '#d9ebfb',
    },
    {
        name: 'Performance Overview',
        description: 'Your overall social performance.',
        icon: PieChart,
        tag: 'Core',
        href: '/dashboard',
        accent: '#31c667',
        soft: '#defbe7',
        artwork: 'analytics',
    },
    {
        name: 'AI Assist',
        description: 'Use AI to write your captions.',
        icon: Sparkles,
        tag: 'Core',
        href: '/dashboard/posters',
        accent: '#5f6fe8',
        soft: '#e6e9ff',
    },
];

const EXTRA_TOOLS: ToolItem[] = [
    {
        name: 'Facebook Pages Report',
        description: "See what's working and what isn't.",
        icon: FileText,
        tag: 'Core',
        href: '/dashboard',
        accent: '#4f8df7',
        soft: '#e2eeff',
    },
    {
        name: 'Connect more profiles',
        description: 'Get a complete view of your performance.',
        icon: Users,
        tag: 'Core',
        href: '/dashboard/settings',
        accent: '#7c5cff',
        soft: '#efe9ff',
    },
    {
        name: 'Content Labels',
        description: 'Easily label and monitor posts.',
        icon: Tags,
        tag: 'Core',
        href: '/dashboard/calendar',
        accent: '#ff79be',
        soft: '#fff0f7',
    },
    {
        name: 'Asset Library',
        description: 'Content storage for repeat usage.',
        icon: FolderKanban,
        tag: 'Core',
        href: '/dashboard/videos',
        accent: '#27b65b',
        soft: '#e3f8ea',
    },
    {
        name: 'Approval Workflows',
        description: 'Add post approvers.',
        icon: CheckCheck,
        tag: 'Core',
        href: '/dashboard',
        accent: '#1b9bbb',
        soft: '#def6fb',
    },
    {
        name: 'Social Listening',
        description: 'Insights to inform world-class strategies.',
        icon: Radio,
        tag: 'Premium',
        href: '/dashboard/strategy',
        accent: '#ffd84d',
        soft: '#fff7d6',
    },
    {
        name: 'Ad Campaign Insights',
        description: 'Analyze and improve paid ad campaigns.',
        icon: Megaphone,
        tag: 'Core',
        href: '/dashboard',
        accent: '#ff68b0',
        soft: '#fff0f7',
    },
    {
        name: 'Inbox Activity Report',
        description: "See how you're responding to people.",
        icon: Inbox,
        tag: 'Core',
        href: '/dashboard',
        accent: '#d95bf3',
        soft: '#fbecff',
    },
    {
        name: 'Groups',
        description: 'Easily manage multiple groups.',
        icon: Shapes,
        tag: 'Core',
        href: '/dashboard',
        accent: '#8e72ff',
        soft: '#efeaff',
    },
];

const INTEGRATIONS = [
    { name: 'Figma', color: '#A259FF' },
    { name: 'Zendesk', color: '#03363D' },
    { name: 'HubSpot', color: '#FF7A59' },
    { name: 'Salesforce', color: '#00A1E0' },
    { name: 'Google Drive', color: '#4285F4' },
    { name: 'Shopify', color: '#96BF48' },
    { name: 'WooCommerce', color: '#96588A' },
    { name: 'Mailchimp', color: '#FFE01B' },
    { name: 'Notion', color: '#000000' },
    { name: 'Canva', color: '#00C4CC' },
    { name: 'Zapier', color: '#FF4A00' },
    { name: 'Slack', color: '#4A154B' },
    { name: 'Trello', color: '#0079BF' },
    { name: 'Asana', color: '#F06A6A' },
    { name: 'Monday', color: '#FF3D57' },
    { name: 'Airtable', color: '#18BFFF' },
];

function ToolArtwork({ tool }: { tool: ToolItem }) {
    const Icon = tool.icon;

    if (tool.artwork === 'analytics') {
        return (
            <div
                className="relative h-12 w-12 rounded-xl border border-white/80 shadow-sm overflow-hidden shrink-0"
                style={{ backgroundColor: tool.soft }}
            >
                <div
                    className="absolute left-2.5 bottom-2 h-4 w-1.5 rounded-full"
                    style={{ backgroundColor: `${tool.accent}55` }}
                />
                <div
                    className="absolute left-5 bottom-2 h-6 w-1.5 rounded-full"
                    style={{ backgroundColor: `${tool.accent}80` }}
                />
                <div
                    className="absolute left-[1.85rem] bottom-2 h-3 w-1.5 rounded-full"
                    style={{ backgroundColor: `${tool.accent}40` }}
                />
                <div
                    className="absolute right-2 top-2 h-7 w-7 rounded-full flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: tool.accent }}
                >
                    <Icon className="h-4 w-4 text-white" />
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative h-12 w-12 rounded-xl border border-white/80 shadow-sm overflow-hidden shrink-0"
            style={{ backgroundColor: tool.soft }}
        >
            <div
                className="absolute left-2 right-2 top-3 h-1.5 rounded-full opacity-70"
                style={{ backgroundColor: `${tool.accent}33` }}
            />
            <div
                className="absolute left-2 right-5 top-6 h-1.5 rounded-full opacity-55"
                style={{ backgroundColor: `${tool.accent}26` }}
            />
            <div
                className="absolute bottom-2 right-2 h-7 w-7 rounded-lg flex items-center justify-center shadow-sm"
                style={{ backgroundColor: tool.accent }}
            >
                <Icon className="h-4 w-4 text-white" />
            </div>
        </div>
    );
}

function ToolCard({ tool }: { tool: ToolItem }) {
    return (
        <Link
            href={tool.href}
            className="flex items-start gap-4 p-5 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm transition-all group"
        >
            <ToolArtwork tool={tool} />
            <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-zinc-900 group-hover:text-zinc-700 transition-colors">
                    {tool.name}
                </div>
                <div className="text-xs text-zinc-500 mt-0.5 leading-snug">
                    {tool.description}
                </div>
                <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-400">
                    <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: tool.tag === 'Premium' ? '#8b5cf6' : '#71717a' }}
                    />
                    {tool.tag}
                </div>
            </div>
        </Link>
    );
}

function IntegrationIcon({ integration }: { integration: typeof INTEGRATIONS[number] }) {
    return (
        <div
            className="h-10 w-10 rounded-lg flex items-center justify-center text-white text-[11px] font-black shrink-0 border border-zinc-100 shadow-sm transition-transform hover:scale-110"
            style={{ backgroundColor: integration.color }}
            title={integration.name}
        >
            {integration.name.substring(0, 2)}
        </div>
    );
}

export default function DashboardPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [series, setSeries] = useState<any[]>([]);
    const [videoCount, setVideoCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [showMore, setShowMore] = useState(false);

    const { currentPlan, limits, canCreateVideo, canExecuteWorkflow } = usePlanLimits();

    const displayName = user?.displayName || user?.email?.split('@')[0] || 'there';

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const seriesRes = await fetch('/api/series');
            if (seriesRes.ok) {
                const data = await seriesRes.json();
                setSeries(data);
            }
            const videosRes = await fetch('/api/videos');
            if (videosRes.ok) {
                const data = await videosRes.json();
                setVideoCount(data.length);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this series?")) return;
        try {
            const response = await fetch(`/api/series/${id}`, { method: 'DELETE' });
            if (response.ok) {
                toast.success("Series deleted");
                setSeries(prev => prev.filter(s => s.id !== id));
            }
        } catch {
            toast.error("Failed to delete series");
        }
    };

    const handleTogglePause = async (id: string) => {
        const item = series.find(s => s.id === id);
        const newStatus = item.status === 'paused' ? 'active' : 'paused';
        try {
            const response = await fetch(`/api/series/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                toast.success(`Series ${newStatus === 'paused' ? 'paused' : 'resumed'}`);
                setSeries(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
            }
        } catch {
            toast.error("Failed to update status");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                <p className="text-zinc-500 font-medium">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Welcome Banner */}
            <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-sm shrink-0">
                        {(user?.displayName || user?.email || 'U').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-zinc-900">
                            Welcome, {displayName}!
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-zinc-500 font-medium hidden sm:inline">
                        30 days remaining in trial
                    </span>
                    <Button
                        variant="outline"
                        className="rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-sm px-4 h-9"
                    >
                        Trial more features
                    </Button>
                    <Button className="rounded-full bg-zinc-900 text-white hover:bg-zinc-800 font-bold text-sm px-4 h-9">
                        Start my subscription
                    </Button>
                </div>
            </div>

            {/* Explore Section */}
            <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
                {/* Green progress bar at top */}
                <div className="h-1.5 w-full bg-emerald-400" />

                <div className="p-6">
                    <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        Explore Agent Elephant
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 mt-1">
                        Check out these core tools first
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1">
                        We recommend these tools for someone just getting started.
                    </p>

                    {/* Progress */}
                    <div className="mt-4 flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-zinc-100 overflow-hidden">
                            <div className="h-full w-0 bg-emerald-400 rounded-full transition-all duration-1000" />
                        </div>
                        <span className="text-xs font-semibold text-zinc-500 shrink-0">0% complete</span>
                    </div>

                    {/* Core Tools Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                        {CORE_TOOLS.map((tool) => (
                            <ToolCard key={tool.name} tool={tool} />
                        ))}
                    </div>

                    {/* Expanded Tools */}
                    {showMore && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                            {EXTRA_TOOLS.map((tool) => (
                                <ToolCard key={tool.name} tool={tool} />
                            ))}
                        </div>
                    )}

                    {/* Show more / Show less */}
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={() => setShowMore(!showMore)}
                            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg border border-zinc-200 bg-white text-sm font-bold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
                        >
                            {showMore ? (
                                <>Show less <ChevronUp className="h-4 w-4" /></>
                            ) : (
                                <>Show more <ChevronDown className="h-4 w-4" /></>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Integrations Section */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-zinc-900">
                            Integrations
                        </h2>
                        <p className="text-sm text-zinc-500 mt-0.5">
                            Unify your workflow by integrating with your tech stack. Select a tool to get started.
                        </p>
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        {INTEGRATIONS.map((integration) => (
                            <IntegrationIcon key={integration.name} integration={integration} />
                        ))}
                    </div>
                    <Link
                        href="/dashboard/settings"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-zinc-200 bg-white text-sm font-bold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors shrink-0 whitespace-nowrap"
                    >
                        Browse all integrations
                    </Link>
                </div>
            </div>

            {/* Series Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold tracking-tight text-zinc-900">Your Series</h2>
                        <p className="text-[13px] text-zinc-500 font-medium">Manage and monitor your automated video series.</p>
                    </div>
                    <Link href="/dashboard/create">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 px-6 shadow-lg shadow-indigo-200 transition-all active:scale-95 gap-2 rounded-xl">
                            <Plus className="h-5 w-5" />
                            New Series
                        </Button>
                    </Link>
                </div>

                {series.length === 0 ? (
                    <div className="flex h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-white/50 space-y-4 text-center p-8">
                        <div className="h-16 w-16 rounded-2xl bg-zinc-50 flex items-center justify-center border border-zinc-100">
                            <LayoutGrid className="h-8 w-8 text-zinc-300" />
                        </div>
                        <div className="space-y-1 max-w-sm">
                            <h3 className="text-lg font-bold text-zinc-900">No series created yet</h3>
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                Start your content journey by creating your first automated video series.
                            </p>
                        </div>
                        <Link href="/dashboard/create">
                            <Button className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 px-8 rounded-xl shadow-md transition-all active:scale-95">
                                Create Now
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {series.map((item) => (
                            <SeriesCard
                                key={item.id}
                                series={item}
                                onDelete={handleDelete}
                                onTogglePause={handleTogglePause}
                                onEdit={(id) => router.push(`/dashboard/create?id=${id}`)}
                                canExecuteWorkflow={canExecuteWorkflow}
                                onGenerateNow={async (id, testMode = false) => {
                                    if (!canCreateVideo(videoCount)) {
                                        toast.error(`You've reached the video limit for the ${limits.name} plan.`);
                                        setIsUpgradeModalOpen(true);
                                        return;
                                    }
                                    try {
                                        const response = await fetch('/api/video/generate', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ seriesId: id, testMode })
                                        });
                                        if (response.ok) {
                                            toast.success(testMode ? "Test workflow started (4 min total delay)!" : "Video generation started!");
                                            router.push('/dashboard/videos');
                                        } else {
                                            toast.error("Failed to start generation");
                                        }
                                    } catch {
                                        toast.error("Error starting generation");
                                    }
                                }}
                                onViewVideos={(id) => router.push(`/dashboard/videos?seriesId=${id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                title="Upgrade to Generate More Videos"
                description={`You've reached the ${limits.maxVideos} video limit on the ${limits.name} plan. Upgrade to Basic or Unlimited to unlock more generations!`}
            />
        </div>
    );
}
