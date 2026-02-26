'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    Home, Search, Send, DollarSign, Wrench, ArrowDownLeft,
    Bookmark, ShieldCheck, Settings, ChevronDown, ChevronRight,
    ChevronsLeft, Menu, Film, Video, CalendarDays, Plus, CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClerk } from '@clerk/nextjs';

const sidebarData = [
    {
        name: 'Home',
        icon: Home,
        href: '/dashboard',
        hasBorderBottom: true,
    },
    {
        name: 'Studio',
        icon: Film,
        defaultExpanded: true,
        items: [
            { name: 'Series', href: '/dashboard' },
            { name: 'Videos', href: '/dashboard/videos' },
            { name: 'Calendar', href: '/dashboard/calendar' },
            { name: 'Create New', href: '/dashboard/create' },
            { name: 'Billing', href: '/dashboard/billing' },
        ]
    },
    {
        name: 'Prospect and enrich',
        icon: Search,
        defaultExpanded: true,
        items: [
            { name: 'People', href: '/dashboard/people' },
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
    const { openUserProfile } = useClerk();

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
                        <img
                            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgZmlsbD0ibm9uZSIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJtMjUuNzU5IDYuMDg2LjAwNSAxMy4wOThjLjAwMSAyLjA2OS0yLjIgMy4zOTUtNC4wMyAyLjQyOGwtMTMuMTMtNi45NDVhMTguMSAxOC4xIDAgMCAxIDMuNzItNC4zNjdsMTAuMjk5IDkuNTE4Yy41NDYuNTA0IDEuNDA2LS4wNDMgMS4xODEtLjc1TDE5LjgxIDYuNDlhMTggMTggMCAwIDEgNS45NDktLjQwNU0yMi4xOTYgNDEuOTEgMjIuMTkgMjguODhjLS4wMDEtMi4wNyAyLjItMy4zOTYgNC4wMy0yLjQyOWwxMy4xMzUgNi45NDdhMTguMSAxOC4xIDAgMCAxLTMuNzM5IDQuMzUzbC0xMC4yODUtOS41MDZjLS41NDUtLjUwNC0xLjQwNi4wNDMtMS4xOC43NWwzLjk3OCAxMi41M2ExOCAxOCAwIDAgMS01LjkzMy4zODZNMjguMTkgMjIuNjc4bDkuNTM4LTEwLjMyYTE4LjEgMTguMSAwIDAgMC00LjM2OC0zLjczNWwtNi45NjQgMTMuMTY2Yy0uOTY4IDEuODMuMzYgNC4wMzEgMi40MjggNC4wM2wxMy4wODYtLjAwNlE0MiAyNC45MiA0MiAyNGMwLTEuNDIzLS4xNjYtMi44MDgtLjQ3OC00LjEzNkwyOC45NCAyMy44NTljLS43MDguMjI0LTEuMjU1LS42MzYtLjc1LTEuMTgxTTYuMDg1IDIyLjI0OWwxMy4wNDUtLjAwNmMyLjA3IDAgMy4zOTcgMi4yIDIuNDMgNC4wM0wxNC42MyAzOS4zN2ExOC4xIDE4LjEgMCAwIDEtNC4zNTItMy43MjNsOS40ODctMTAuMjY0Yy41MDQtLjU0NS0uMDQzLTEuNDA1LS43NS0xLjE4TDYuNDg4IDI4LjE4YTE4IDE4IDAgMCAxLS40MDQtNS45MzEiLz48L2c+PC9zdmc+"
                            alt="Logo"
                            className="h-8 w-8 object-contain text-black"
                        />
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
                                                    {item.badge && (
                                                        <span className="text-[10px] uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-sm font-semibold flex-shrink-0 ml-2">
                                                            {item.badge}
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
                    const isActive = section.href === '/dashboard'
                        ? pathname === '/dashboard'
                        : pathname.startsWith(section.href!);

                    return (
                        <div key={section.name} className={cn("flex flex-col", section.hasBorderBottom && "border-b border-zinc-200 pb-2 mb-2")}>
                            <Link
                                href={section.href!}
                                title={isCollapsed ? section.name : undefined}
                                className={cn(
                                    "group flex items-center transition-colors my-0",
                                    isCollapsed
                                        ? "justify-center p-2 rounded-md"
                                        : "w-full justify-between px-3 py-1 text-[12px] font-bold",
                                    isActive
                                        ? "bg-zinc-900 text-white rounded-md shadow-sm"
                                        : "text-black hover:bg-zinc-100 rounded-md",
                                )}
                            >
                                <div className="flex items-center gap-2.5 overflow-hidden">
                                    <Icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-white" : "text-black")} strokeWidth={isActive ? 2.5 : 2} />
                                    {!isCollapsed && <span className="truncate">{section.name}</span>}
                                </div>
                                {!isCollapsed && section.hasArrow && (
                                    <ChevronRight className={cn("h-4 w-4 flex-shrink-0 transition-opacity", isActive ? "text-zinc-300 opacity-100" : "text-zinc-400 opacity-0 group-hover:opacity-100")} />
                                )}
                            </Link>
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
