'use client';

import { Button } from "@/components/ui/button";
import { Search, Sparkles, ChevronDown, Settings, ArrowUpDown } from "lucide-react";
import { useState } from "react";

const templates = [
    {
        tags: [{ label: 'Linear', color: 'bg-blue-50 text-blue-700' }, { label: 'AI', color: 'bg-purple-50 text-purple-700', icon: true }],
        title: 'Convert ideal customers with AI sequences',
        desc: 'When a contact aligns with your ICP, enroll them in a list and send an AI-drafted sequence targeting their profile.',
    },
    {
        tags: [{ label: 'Multi-branch', color: 'bg-orange-50 text-orange-700' }],
        title: 'Target Website Visitors',
        desc: 'This template will automatically identify companies that are actively visiting your website and enroll them.',
    },
    {
        tags: [{ label: 'Generate pipeline', color: 'bg-pink-50 text-pink-700' }, { label: 'AI', color: 'bg-purple-50 text-purple-700', icon: true }],
        title: 'Engage companies researching your category with AI outreach',
        desc: 'Add interested companies to a list, then trigger an AI-drafted sequence based on buying intent signals.',
    },
    {
        tags: [{ label: 'Generate pipeline', color: 'bg-pink-50 text-pink-700' }, { label: 'AI', color: 'bg-purple-50 text-purple-700', icon: true }],
        title: 'Target new hires with AI-drafted outreach in first 90 days',
        desc: 'When a contact enters a new role, add them to a list, then enroll them in a tailored follow-up sequence.',
    },
];

export default function WorkflowsPage() {
    const [search, setSearch] = useState('');

    return (
        <div className="flex flex-col min-h-full">
            {/* Topbar */}
            <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-2.5 flex-shrink-0 gap-2">
                <div className="flex items-center gap-3">
                    <h1 className="text-[17px] font-bold text-zinc-900">Workflows</h1>
                    <Button variant="ghost" className="h-7 px-2.5 text-xs text-zinc-500 gap-1">
                        Learn more <ChevronDown className="h-3 w-3" />
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-7 px-3 text-xs font-medium gap-1.5 border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100">
                        <Sparkles className="h-3.5 w-3.5" />
                        Outbound Copilot
                    </Button>
                    <Button className="h-7 bg-yellow-300 hover:bg-yellow-400 text-zinc-900 font-bold text-xs px-4 rounded">
                        Create workflow
                    </Button>
                </div>
            </div>

            {/* Sub Nav */}
            <div className="flex border-b border-zinc-200 bg-white px-6">
                <button className="py-2.5 text-[13px] font-bold text-zinc-900 border-b-2 border-zinc-900 mr-5">Workflows</button>
                <button className="py-2.5 text-[13px] font-medium text-zinc-500 hover:text-zinc-700">Templates</button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                {/* Templates Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-zinc-900">Start with workflow templates</h2>
                    <Button variant="outline" className="h-7 text-xs border-zinc-200 gap-1.5">
                        View all templates <ChevronDown className="h-3 w-3" />
                    </Button>
                </div>

                {/* Template Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {templates.map((t, i) => (
                        <div key={i} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col min-h-[160px]">
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {t.tags.map((tag, j) => (
                                    <span key={j} className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold ${tag.color}`}>
                                        {tag.icon && <Sparkles className="h-2.5 w-2.5" />}
                                        {tag.label}
                                    </span>
                                ))}
                            </div>
                            <h3 className="text-[13px] font-bold text-zinc-900 leading-snug mb-auto">{t.title}</h3>
                            <p className="text-[11px] text-zinc-500 mt-3 line-clamp-2">{t.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Filter + Empty State */}
                <div className="border-t border-zinc-200 pt-5">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" className="h-7 text-xs font-bold text-zinc-800 gap-1.5">Show Filters</Button>
                            <div className="relative">
                                <Search className="absolute left-3 top-1.5 h-3.5 w-3.5 text-zinc-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search workflows"
                                    className="h-7 w-56 rounded-full border border-zinc-200 bg-zinc-50 pl-8 pr-3 text-xs placeholder:text-zinc-400 focus:outline-none focus:border-zinc-300"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="h-7 text-xs gap-1.5 border-zinc-200">
                                <ArrowUpDown className="h-3.5 w-3.5" /> Sort
                            </Button>
                            <Button variant="ghost" className="h-7 w-7 p-0 text-zinc-500"><Settings className="h-3.5 w-3.5" /></Button>
                        </div>
                    </div>

                    {/* Empty state */}
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-[15px] font-bold text-zinc-900 mb-2">No workflows match your criteria</h3>
                        <p className="text-[13px] text-zinc-500 mb-5">Try adjusting your search filters to find what you're looking for.</p>
                        <Button variant="outline" className="h-8 text-sm border-zinc-200 px-5 font-medium">Reset filters</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
