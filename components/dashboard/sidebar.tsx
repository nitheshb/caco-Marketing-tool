'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    Home, Search, Send, DollarSign, Wrench, ArrowDownLeft,
    Bookmark, ShieldCheck, Settings, ChevronDown, ChevronRight,
    ChevronsLeft, Menu, Film, Video, CalendarDays, Plus, CreditCard, User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { usePlanLimits } from '@/hooks/use-plan-limits';

const sidebarData = [
    {
        name: 'Home',
        icon: null, // keep empty or remove if Home icon is not provided
        href: '/dashboard',
        hasBorderBottom: true,
    },
    {
        name: 'Postings Calendar',
        icon: '/images/sidebare-icons/posting-calender.png',
        href: '/dashboard/calendar'
    },
    {
        name: 'Content Creation',
        icon: '/images/sidebare-icons/create-new.png',
        defaultExpanded: true,
        items: [
            { name: 'Series', href: '/dashboard/series', icon: '/images/sidebare-icons/series.png' },
            { name: 'Videos', href: '/dashboard/videos', icon: '/images/sidebare-icons/videos.png' },
            { name: 'Posters', href: '/dashboard/posters', icon: '/images/sidebare-icons/posters.png' },
            
            { name: 'Create New', href: '/dashboard/create', icon: '/images/sidebare-icons/create-new.png' },
            // { name: 'Billing', href: '/dashboard/billing' },
        ]
    },
    {
        name: 'Billing',
        icon: '/images/sidebare-icons/billing.png',
        href: '/dashboard/billing'
    },
    {
        name: 'Whathub',
        icon: '/images/sidebare-icons/whathub.png',
        href: 'http://146.190.113.104:8080/',
        external: true,
    },
    {
        name: 'CRM',
        icon: '/images/sidebare-icons/crm.png',
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
        icon: '/images/sidebare-icons/sequences.png',
        defaultExpanded: true,
        items: [
            { name: 'Sequences', href: '/dashboard/sequences', icon: '/images/sidebare-icons/sequences.png' },
            { name: 'Emails', href: '/dashboard/emails', icon: '/images/sidebare-icons/email.png' },
            { name: 'Calls', href: '/dashboard/calls', icon: '/images/sidebare-icons/calls.png' },
            { name: 'Tasks', href: '/dashboard/tasks', icon: '/images/sidebare-icons/tasks.png' },
        ]
    },
    {
        name: 'Win deals',
        icon: '/images/sidebare-icons/win-deals.png',
        defaultExpanded: false,
        items: [
            { name: 'Meetings', href: '/dashboard/meetings', icon: '/images/sidebare-icons/meetigs.png' },
            { name: 'Conversations', href: '/dashboard/conversations', icon: '/images/sidebare-icons/conversations.png' },
            { name: 'Deals', href: '/dashboard/deals', icon: '/images/sidebare-icons/deals.png' },
        ]
    },
    {
        name: 'Tools and automation',
        icon: '/images/sidebare-icons/automation.png',
        defaultExpanded: false,
        items: [
            { name: 'Workflows', href: '/dashboard/workflows', icon: '/images/sidebare-icons/workflows.png' },
            { name: 'Analytics', href: '/dashboard/analytics' }, // Assuming no analytics icon uploaded
        ]
    },
    {
        name: 'Inbound',
        icon: '/images/sidebare-icons/inbound.png',
        defaultExpanded: false,
        items: [
            { name: 'Website visitors', href: '/dashboard/website-visitors', badge: 'New', icon: '/images/sidebare-icons/website-visitors.png' },
            { name: 'Forms', href: '/dashboard/forms', icon: '/images/sidebare-icons/forms.png' },
        ]
    },
    {
        name: 'Saved records',
        icon: '/images/sidebare-icons/save-records.png',
        defaultExpanded: false,
        items: [
            { name: 'People', href: '/dashboard/saved-people', icon: '/images/sidebare-icons/people.png' },
        ]
    },
    {
        name: 'Deliverability suite',
        icon: '/images/sidebare-icons/deliverability-suite.png',
        href: '/dashboard/deliverability'
    },
   
    {
        name: 'Admin Settings',
        icon: '/images/sidebare-icons/settings.png',
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
                                        "group flex items-center rounded-full px-2 py-2 text-[15px] font-extrabold text-[#333333] hover:text-black hover:bg-zinc-100 transition-colors",
                                        isCollapsed ? "justify-center" : "justify-between w-full"
                                    )}
                                    title={isCollapsed ? section.name : undefined}
                                >
                                    <div className="flex items-center gap-3">
                                        {typeof Icon === 'string' ? (
                                            <Image src={Icon} alt={section.name} width={24} height={24} className="h-6 w-6 transition-opacity drop-shadow-sm" />
                                        ) : Icon ? (
                                            <span className="flex items-center justify-center h-6 w-6">
                                                {(() => { const Element = Icon as any; return <Element className="h-6 w-6 text-zinc-600 group-hover:text-black transition-colors" strokeWidth={2.5} />; })()}
                                            </span>
                                        ) : (
                                            <Home className="h-6 w-6 text-zinc-600 group-hover:text-black transition-colors" opacity={0} /> // Blank fallback
                                        )}
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
                                                            "flex items-center rounded-full px-3 py-2 text-[14px] transition-colors justify-between",
                                                            "text-zinc-700 font-bold hover:text-black hover:bg-zinc-100"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                            {(item as any).icon && <Image src={(item as any).icon} width={20} height={20} alt={item.name} className="flex-shrink-0 drop-shadow-sm h-5 w-5" />}
                                                            <span className="truncate">{item.name}</span>
                                                        </div>
                                                    </a>
                                                );
                                            }
                                            
                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className={cn(
                                                        "flex items-center rounded-full px-3 py-2 text-[14px] transition-colors justify-between",
                                                        isActive
                                                            ? "bg-zinc-400 text-white font-extrabold shadow-sm"
                                                            : "text-zinc-700 font-bold hover:text-black hover:bg-zinc-100"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        {(item as any).icon && <Image src={(item as any).icon} width={20} height={20} alt={item.name} className={cn("flex-shrink-0 drop-shadow-sm h-5 w-5", isActive && "invert opacity-100")} />}
                                                        <span className="truncate">{item.name}</span>
                                                    </div>
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
                            ? "justify-center p-2 rounded-full"
                            : "w-full justify-between px-2 py-2 text-[15px] font-extrabold",
                        isActive
                            ? "bg-zinc-600 text-white shadow-sm rounded-full"
                            : "text-[#333333] hover:text-black hover:bg-zinc-100 rounded-full",
                    );

                    const linkContent = (
                        <>
                            <div className="flex items-center gap-3 overflow-hidden">
                                {typeof Icon === 'string' ? (
                                    <Image src={Icon} alt={section.name} width={24} height={24} className={cn("h-6 w-6 flex-shrink-0 transition-opacity drop-shadow-sm", isActive ? "invert opacity-100" : "")} />
                                ) : Icon ? (
                                    <span className="flex items-center justify-center h-6 w-6">
                                        {(() => { const Element = Icon as any; return <Element className={cn("h-6 w-6 flex-shrink-0 transition-colors", isActive ? "text-white" : "text-zinc-600 group-hover:text-black")} strokeWidth={isActive ? 2.5 : 2} />; })()}
                                    </span>
                                ) : (
                                    <Home className="h-6 w-6 opacity-0" />
                                )}
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
