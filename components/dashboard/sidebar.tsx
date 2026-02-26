'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    Home,
    Search,
    Users,
    Building2,
    List,
    Database,
    Send,
    Workflow,
    Mail,
    Phone,
    CheckSquare,
    DollarSign,
    Calendar,
    MessageCircle,
    Briefcase,
    Wrench,
    GitMerge,
    BarChart2,
    ArrowDownLeft,
    Globe,
    FileText,
    Bookmark,
    ShieldCheck,
    Settings,
    ChevronDown,
    ChevronRight,
    ChevronsLeft,
    Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClerk } from '@clerk/nextjs';

const sidebarData = [
    {
        name: 'Home',
        icon: Home,
        href: '/dashboard',
    },
    {
        name: 'Prospect and enrich',
        icon: Search,
        defaultExpanded: true,
        items: [
            { name: 'People', href: '#' },
            { name: 'Companies', href: '#' },
            { name: 'Lists', href: '#' },
            { name: 'Data enrichment', href: '#' },
        ]
    },
    {
        name: 'Engage',
        icon: Send,
        defaultExpanded: true,
        items: [
            { name: 'Sequences', href: '#' },
            { name: 'Emails', href: '#' },
            { name: 'Calls', href: '#' },
            { name: 'Tasks', href: '#' },
        ]
    },
    {
        name: 'Win deals',
        icon: DollarSign,
        defaultExpanded: false,
        items: [
            { name: 'Meetings', href: '#' },
            { name: 'Conversations', href: '#' },
            { name: 'Deals', href: '#' },
        ]
    },
    {
        name: 'Tools and automation',
        icon: Wrench,
        defaultExpanded: false,
        items: [
            { name: 'Workflows', href: '#' },
            { name: 'Analytics', href: '#' },
        ]
    },
    {
        name: 'Inbound',
        icon: ArrowDownLeft,
        defaultExpanded: false,
        items: [
            { name: 'Website visitors', href: '#', badge: 'New' },
            { name: 'Forms', href: '#' },
        ]
    },
    {
        name: 'Saved records',
        icon: Bookmark,
        defaultExpanded: false,
        items: [
            { name: 'People', href: '#' },
        ]
    },
    {
        name: 'Deliverability suite',
        icon: ShieldCheck,
        href: '#'
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

    // Global sidebar collapse state
    const [isCollapsed, setIsCollapsed] = useState(false);

    // State for collapsible sections
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
        sidebarData.reduce((acc, section) => {
            if (section.items) {
                acc[section.name] = section.defaultExpanded ?? false;
            }
            return acc;
        }, {} as Record<string, boolean>)
    );

    const toggleSection = (name: string) => {
        if (isCollapsed) setIsCollapsed(false); // expands sidebar if user clicks a section while collapsed
        setExpandedSections(prev => ({ ...prev, [name]: !prev[name] }));
    };

    return (
        <aside className={cn(
            "flex h-screen flex-col border-r border-zinc-200 bg-white transition-all duration-300 overflow-hidden font-sans",
            isCollapsed ? "w-16" : "w-64"
        )}>
            {/* Header / Logo and Toggle */}
            <div className={cn("flex h-14 items-center px-4 flex-shrink-0 pt-2", isCollapsed ? "justify-center" : "justify-between")}>
                {!isCollapsed && (
                    <div className="flex items-center gap-3">
                        <Image
                            src="/logo.png"
                            alt="VidMaxx Logo"
                            width={24}
                            height={24}
                            className="h-6 w-6 rounded object-contain"
                        />
                    </div>
                )}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                    title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    {isCollapsed ? <Menu className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
                </button>
            </div>

            {/* Navigation Scroll Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-0.5 custom-scrollbar">
                {sidebarData.map((section, idx) => {
                    const Icon = section.icon;
                    const isExpanded = expandedSections[section.name];

                    if (section.items) {
                        return (
                            <div key={section.name} className="flex flex-col">
                                <button
                                    onClick={() => toggleSection(section.name)}
                                    className={cn(
                                        "group flex items-center rounded-md px-2 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors",
                                        isCollapsed ? "justify-center" : "justify-between w-full"
                                    )}
                                    title={isCollapsed ? section.name : undefined}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon className="h-4 w-4 text-zinc-500" strokeWidth={2} />
                                        {!isCollapsed && <span>{section.name}</span>}
                                    </div>
                                    {!isCollapsed && (
                                        isExpanded ? (
                                            <ChevronDown className="h-4 w-4 text-zinc-400 group-hover:text-zinc-600 transition-transform" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-zinc-600 transition-transform" />
                                        )
                                    )}
                                </button>
                                
                                {!isCollapsed && isExpanded && (
                                    <div className="mt-0.5 flex flex-col space-y-0.5 relative pl-[26px]">
                                        <div className="absolute left-3.5 top-0 bottom-0 w-px bg-zinc-200"></div>
                                        {section.items.map(item => {
                                            const isActive = item.href !== '#' && pathname.startsWith(item.href);
                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className={cn(
                                                        "flex items-center rounded-md px-3 py-1.5 text-sm transition-colors justify-between",
                                                        isActive 
                                                            ? "bg-zinc-100 text-zinc-900 font-semibold" 
                                                            : "text-zinc-600 font-normal hover:bg-zinc-100 hover:text-zinc-900"
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
                    const isActive = section.href !== '#' && (
                        section.href === '/dashboard' 
                            ? pathname === '/dashboard' 
                            : pathname.startsWith(section.href!)
                    );

                    return (
                        <Link
                            key={section.name}
                            href={section.href!}
                            title={isCollapsed ? section.name : undefined}
                            className={cn(
                                "group flex items-center transition-colors my-0.5",
                                isCollapsed 
                                    ? "justify-center p-2 rounded-md" 
                                    : "w-full justify-between px-3 py-2 text-sm font-medium",
                                isActive
                                    ? (isCollapsed ? "bg-zinc-900 text-white" : "bg-zinc-900 text-white rounded-[10px] shadow-sm")
                                    : "text-zinc-700 hover:bg-zinc-100 rounded-[10px]",
                                isCollapsed && isActive && "rounded-md shadow-sm"
                            )}
                        >
                            <div className="flex items-center gap-2.5 overflow-hidden">
                                <Icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-white" : "text-zinc-500")} strokeWidth={isActive ? 2.5 : 2} />
                                {!isCollapsed && <span className="truncate">{section.name}</span>}
                            </div>
                            {!isCollapsed && section.hasArrow && (
                                <ChevronRight className={cn("h-4 w-4 flex-shrink-0 transition-opacity", isActive ? "text-zinc-300 opacity-100" : "text-zinc-400 opacity-0 group-hover:opacity-100")} />
                            )}
                        </Link>
                    )
                })}
            </div>

            {/* Remove the Upgrade plan button, just a thin border spacing at bottom like Apollo */}
            <div className="h-4 border-t border-zinc-200 mt-auto bg-zinc-50" />
            
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e4e4e7;
                    border-radius: 4px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: #d4d4d8;
                }
            `}</style>
        </aside>
    );
}
