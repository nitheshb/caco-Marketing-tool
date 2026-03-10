'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    Home, Search, Send, DollarSign, Wrench, ArrowDownLeft,
    Bookmark, ShieldCheck, Settings, ChevronDown, ChevronRight,
    ChevronsLeft, Menu, Film, Video, CalendarDays, Plus, CreditCard, User,
    LayoutGrid
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { usePlanLimits } from '@/hooks/use-plan-limits';

const WhatsappIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="currentColor"
        className={className}
    >
        <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.664 4.82 1.822 6.832L2 30l7.374-1.794A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 2c6.627 0 12 5.373 12 12s-5.373 12-12 12a11.93 11.93 0 0 1-6.168-1.713l-.44-.27-4.573 1.113 1.147-4.458-.287-.459A11.93 11.93 0 0 1 4 16C4 9.373 9.373 4 16 4zm-3.07 5.5c-.234 0-.613.088-.936.438-.322.35-1.23 1.2-1.23 2.926s1.26 3.394 1.435 3.628c.176.234 2.432 3.87 5.982 5.27 2.96 1.17 3.55.938 4.19.88.64-.058 2.07-.847 2.362-1.664.292-.817.292-1.517.205-1.664-.088-.147-.322-.234-.672-.41-.35-.176-2.07-1.022-2.39-1.138-.322-.117-.556-.176-.79.176-.234.35-.906 1.138-1.11 1.372-.205.234-.41.263-.76.088-.35-.176-1.478-.545-2.815-1.737-1.04-.928-1.742-2.074-1.947-2.424-.204-.35-.022-.54.154-.714.158-.157.35-.41.526-.614.175-.205.232-.35.35-.585.116-.234.058-.44-.03-.614-.088-.176-.776-1.897-1.076-2.593-.275-.645-.558-.652-.79-.66a14.8 14.8 0 0 0-.66-.002z"/>
    </svg>
);

const sidebarData = [
    {
        name: 'Home',
        icon: Home,
        href: '/dashboard',
        hasBorderBottom: true,
    },
    {
        name: 'Strategy Planner',
        icon: LayoutGrid,
        href: '/dashboard/strategy'
    },
    {
        name: 'Postings Calendar',
        icon: CalendarDays,
        href: '/dashboard/calendar'
    },
    {
        name: 'Content Creation',
        icon: Film,
        defaultExpanded: true,
        items: [
            { name: 'Series', href: '/dashboard' },
            { name: 'Videos', href: '/dashboard/videos' },
            { name: 'Posters', href: '/dashboard/posters' },
            
            { name: 'Create New', href: '/dashboard/create' },
            // { name: 'Billing', href: '/dashboard/billing' },
        ]
    },
    {
        name: 'Billing',
        icon: CreditCard,
        href: '/dashboard/billing'
    },
    {
        name: 'Whathub',
        icon: WhatsappIcon,
        href: '/api/whathub/sso',
        external: true,
    },
    {
        name: 'CRM',
        icon: CreditCard,
        href: '/dashboard/billing',
        items: [
            { name: 'Contacts', href: '/dashboard/contacts' },
            { name: 'Companies', href: '/dashboard/companies' },
            { name: 'Lists', href: '/dashboard/lists' },
            { name: 'Data enrichment', href: '/dashboard/data-enrichment' },
        ]
    },
    {
        name: 'Engage',
        icon: Send,
        defaultExpanded: true,
        items: [
            { name: 'Sequences', href: '/dashboard/sequences' },
            { name: 'Emails', href: '/dashboard/emails' },
            { name: 'Calls', href: '/dashboard/calls' },
            { name: 'Tasks', href: '/dashboard/tasks' },
        ]
    },
    {
        name: 'Win deals',
        icon: DollarSign,
        defaultExpanded: false,
        items: [
            { name: 'Meetings', href: '/dashboard/meetings' },
            { name: 'Conversations', href: '/dashboard/conversations' },
            { name: 'Deals', href: '/dashboard/deals' },
        ]
    },
    {
        name: 'Tools and automation',
        icon: Wrench,
        defaultExpanded: false,
        items: [
            { name: 'Workflows', href: '/dashboard/workflows' },
            { name: 'Analytics', href: '/dashboard/analytics' },
        ]
    },
    {
        name: 'Inbound',
        icon: ArrowDownLeft,
        defaultExpanded: false,
        items: [
            { name: 'Website visitors', href: '/dashboard/website-visitors', badge: 'New' },
            { name: 'Forms', href: '/dashboard/forms' },
        ]
    },
    {
        name: 'Saved records',
        icon: Bookmark,
        defaultExpanded: false,
        items: [
            { name: 'People', href: '/dashboard/saved-people' },
        ]
    },
    {
        name: 'Deliverability suite',
        icon: ShieldCheck,
        href: '/dashboard/deliverability'
    },
   
    {
        name: 'Admin Settings',
        icon: Settings,
        href: '/dashboard/settings',
        hasArrow: true
    }
];

export function Sidebar() {
    const pathname = usePathname();
    const { currentPlan } = usePlanLimits();
    const showUpgrade = false; // All features enabled

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
        sidebarData.reduce((acc, section) => {
            if (section.items) {
                acc[section.name] = section.defaultExpanded ?? false;
            }
            return acc;
        }, {} as Record<string, boolean>)
    );

    const toggleSection = (name: string) => {
        if (isCollapsed) setIsCollapsed(false);
        setExpandedSections(prev => ({ ...prev, [name]: !prev[name] }));
    };

    return (
        <aside className={cn(
            "flex h-screen flex-col border-r border-zinc-200 bg-white transition-all duration-300 overflow-hidden font-sans",
            isCollapsed ? "w-14" : "w-[240px]"
        )}>
            {/* Header / Logo and Toggle */}
            <div className={cn("flex h-14 items-center px-4 flex-shrink-0", isCollapsed ? "justify-center" : "justify-between")}>
                {!isCollapsed && (
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 overflow-hidden shrink-0">
                            <Image src="/logo.png" alt="Agent Elephant Logo" width={32} height={32} className="object-cover scale-125" />
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                    title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    {isCollapsed ? <Menu className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
                </button>
            </div>

            {/* Navigation Scroll Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3 pt-1 space-y-0 custom-scrollbar">
                {sidebarData.map((section) => {
                    const Icon = section.icon;
                    const isExpanded = expandedSections[section.name];

                    if (section.items) {
                        return (
                            <div key={section.name} className="flex flex-col">
                                <button
                                    onClick={() => toggleSection(section.name)}
                                    className={cn(
                                        "group flex items-center rounded-md px-2 py-1 text-[12px] font-bold text-black hover:bg-zinc-100 transition-colors",
                                        isCollapsed ? "justify-center" : "justify-between w-full"
                                    )}
                                    title={isCollapsed ? section.name : undefined}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon className="h-4 w-4 text-black" strokeWidth={2} />
                                        {!isCollapsed && <span>{section.name}</span>}
                                    </div>
                                    {!isCollapsed && (
                                        isExpanded ? (
                                            <ChevronDown className="h-4 w-4 text-zinc-400 group-hover:text-zinc-600" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-zinc-600" />
                                        )
                                    )}
                                </button>

                                {!isCollapsed && isExpanded && (
                                    <div className="mt-0.5 flex flex-col space-y-0.5 relative pl-[16px]">
                                        {section.items.map(item => {
                                            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                                            
                                            if ((item as any).external) {
                                                return (
                                                    <a
                                                        key={item.name}
                                                        href={item.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={cn(
                                                            "flex items-center rounded-md px-3 py-1 text-[12px] transition-colors justify-between",
                                                            "text-black font-medium hover:bg-zinc-100"
                                                        )}
                                                    >
                                                        <span className="truncate">{item.name}</span>
                                                    </a>
                                                );
                                            }
                                            
                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className={cn(
                                                        "flex items-center rounded-md px-3 py-1 text-[12px] transition-colors justify-between",
                                                        isActive
                                                            ? "bg-zinc-900 text-white font-bold shadow-sm"
                                                            : "text-black font-medium hover:bg-zinc-100"
                                                    )}
                                                >
                                                    <span className="truncate">{item.name}</span>
                                                    {(item as any).badge && (
                                                        <span className="text-[10px] uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-sm font-semibold flex-shrink-0 ml-2">
                                                            {(item as any).badge}
                                                        </span>
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    // Single link items
                    const isActive = !section.external && (
                        section.href === '/dashboard'
                            ? pathname === '/dashboard'
                            : pathname.startsWith(section.href!)
                    );

                    const linkClasses = cn(
                        "group flex items-center transition-colors my-0",
                        isCollapsed
                            ? "justify-center p-2 rounded-md"
                            : "w-full justify-between px-2 py-1 text-[12px] font-bold",
                        isActive
                            ? "bg-zinc-900 text-white rounded-md shadow-sm"
                            : "text-black hover:bg-zinc-100 rounded-md",
                    );

                    const linkContent = (
                        <>
                            <div className="flex items-center gap-2.5 overflow-hidden">
                                <Icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-white" : "text-black")} strokeWidth={isActive ? 2.5 : 2} />
                                {!isCollapsed && <span className="truncate">{section.name}</span>}
                            </div>
                            {!isCollapsed && section.hasArrow && (
                                <ChevronRight className={cn("h-4 w-4 flex-shrink-0 transition-opacity", isActive ? "text-zinc-300 opacity-100" : "text-zinc-400 opacity-0 group-hover:opacity-100")} />
                            )}
                        </>
                    );

                    return (
                        <div key={section.name} className={cn("flex flex-col", section.hasBorderBottom && "border-b border-zinc-200 pb-2 mb-2")}>
                            {(section as any).external ? (
                                <a
                                    href={section.href!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={isCollapsed ? section.name : undefined}
                                    className={linkClasses}
                                >
                                    {linkContent}
                                </a>
                            ) : (
                                <Link
                                    href={section.href!}
                                    title={isCollapsed ? section.name : undefined}
                                    className={linkClasses}
                                >
                                    {linkContent}
                                </Link>
                            )}
                        </div>
                    );
                })}

            </div>

            <div className="h-4 border-t border-zinc-200 mt-auto bg-zinc-50" />

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 4px; }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #d4d4d8; }
            `}</style>
        </aside>
    );
}
