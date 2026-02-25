'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    Film,
    Video,
    CalendarDays,
    BookOpen,
    CreditCard,
    Settings,
    Plus,
    Zap,
    User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useClerk } from '@clerk/nextjs';
import { usePlanLimits } from '@/hooks/use-plan-limits';

const navItems = [
    { name: 'Series', href: '/dashboard', icon: Film },
    { name: 'Videos', href: '/dashboard/videos', icon: Video },
    { name: 'Calendar', href: '/dashboard/calendar', icon: CalendarDays },
    { name: 'Guides', href: 'https://tubeguruji.com', icon: BookOpen },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { openUserProfile } = useClerk();
    const { currentPlan } = usePlanLimits();

    const showUpgrade = currentPlan === 'free_user' || currentPlan === 'basic';

    return (
        <aside className="flex h-screen w-72 flex-col border-r border-zinc-200 bg-white shadow-sm transition-all duration-300">
            {/* Header */}
            <div className="flex h-16 items-center gap-3 border-b border-zinc-100 px-6">
                <Image
                    src="/logo.png"
                    alt="VidMaxx Logo"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-lg object-contain"
                />
                <span className="text-xl font-bold tracking-tight text-zinc-900">
                    VidMaxx
                </span>
            </div>

            {/* Action Button */}
            <div className="p-6">
                <Link href="/dashboard/create">
                    <Button
                        className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200 bg-indigo-600 hover:bg-indigo-700 active:scale-95"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Create New Series
                    </Button>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isExternal = item.href.startsWith('http');
                    const isActive = !isExternal && (item.href === '/dashboard'
                        ? pathname === '/dashboard'
                        : pathname.startsWith(item.href));

                    const content = (
                        <>
                            <Icon className={cn("h-6 w-6", isActive ? "text-indigo-600" : "text-zinc-400 group-hover:text-zinc-600")} />
                            {item.name}
                        </>
                    );

                    const className = cn(
                        "flex items-center gap-3 rounded-lg px-4 py-3.5 text-base font-medium transition-all duration-200",
                        isActive
                            ? "bg-indigo-50 text-indigo-700 shadow-sm"
                            : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                    );

                    if (isExternal) {
                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={className}
                            >
                                {content}
                            </a>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={className}
                        >
                            {content}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="border-t border-zinc-100 p-4 space-y-2">
                {showUpgrade && (
                    <Link href="/dashboard/billing">
                        <div className="group flex items-center gap-3 rounded-lg px-4 py-3.5 text-base font-medium text-zinc-600 transition-all hover:bg-amber-50 hover:text-amber-700">
                            <Zap className="h-6 w-6 text-amber-500 group-hover:text-amber-600" />
                            <span>Upgrade Plan</span>
                        </div>
                    </Link>
                )}

                <button
                    onClick={() => openUserProfile()}
                    className="w-full flex items-center gap-3 rounded-lg px-4 py-3.5 text-base font-medium text-zinc-600 transition-all hover:bg-zinc-50 hover:text-zinc-900"
                >
                    <User className="h-6 w-6 text-zinc-400" />
                    <span>Profile Settings</span>
                </button>
            </div>
        </aside>
    );
}
