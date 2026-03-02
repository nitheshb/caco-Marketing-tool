'use client';

import { Button } from "@/components/ui/button";
import { Search, ChevronDown, List as ListIcon, Users, MapPin, Landmark, BarChart2, Star, Brain, Lock, ArrowUpDown, Sparkles, DollarSign, Mail, Briefcase, Filter } from "lucide-react";
import { useState } from "react";

const filters = [
    { icon: ListIcon, name: 'Lists' },
    { icon: Users, name: 'Persona' },
    { icon: Mail, name: 'Email Status' },
    { icon: Briefcase, name: 'Job Titles' },
    { icon: Users, name: 'People Lookalikes', locked: true },
    { icon: Landmark, name: 'Company' },
    { icon: Users, name: 'Company Lookalikes', locked: true },
    { icon: Star, name: 'Education', badge: 'Beta' },
    { icon: MapPin, name: 'Location' },
    { icon: Users, name: '# Employees' },
    { icon: BarChart2, name: 'Industry & Keywords' },
    { icon: Brain, name: 'AI Filters' },
];

export default function PeoplePage() {
    const [query, setQuery] = useState('');

    return (
        <div className="flex flex-col h-full">
            {/* Topbar */}
            <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-2.5 flex-shrink-0 gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <h1 className="text-[17px] font-bold text-zinc-900">Find people</h1>
                    <Button variant="outline" className="h-7 px-2.5 text-xs font-medium gap-1.5 border-zinc-200">
                        <ListIcon className="h-3.5 w-3.5 text-zinc-500" /> Default view <ChevronDown className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" className="h-7 px-2.5 text-xs text-zinc-500 gap-1.5">
                        <Filter className="h-3.5 w-3.5" /> Hide Filters
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1.5 h-3.5 w-3.5 text-zinc-400" />
                        <input type="text" placeholder="Search people" className="h-7 w-44 rounded-md border border-zinc-200 pl-8 pr-3 text-xs placeholder:text-zinc-400 focus:outline-none bg-zinc-50" />
                    </div>
                    <Button variant="outline" className="h-7 px-2.5 text-xs gap-1.5 border-zinc-200">
                        <Sparkles className="h-3.5 w-3.5 text-purple-500" /> Research with AI
                    </Button>
                    <Button variant="outline" className="h-7 px-2.5 text-xs gap-1.5 border-zinc-200">
                        <Sparkles className="h-3.5 w-3.5 text-zinc-400" /> Create workflow <ChevronDown className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" className="h-7 px-2.5 text-xs border-zinc-200">Save as new search</Button>
                    <Button variant="outline" className="h-7 px-2.5 text-xs gap-1.5 border-zinc-200"><ArrowUpDown className="h-3.5 w-3.5" /> People Auto-Score <ChevronDown className="h-3 w-3" /></Button>
                </div>
            </div>

            {/* Split Pane */}
            <div className="flex flex-1 overflow-hidden min-h-0">
                {/* Left Filters */}
                <div className="w-[260px] flex-shrink-0 flex flex-col border-r border-zinc-200 bg-white overflow-hidden">
                    <div className="p-3 border-b border-zinc-100">
                        <div className="flex rounded-lg border border-zinc-200 overflow-hidden text-center divide-x divide-zinc-200">
                            <div className="flex-1 py-2 bg-blue-50">
                                <div className="text-[10px] font-bold text-blue-600 uppercase">Total</div>
                                <div className="text-sm font-bold text-zinc-900">240.0M</div>
                            </div>
                            <div className="flex-1 py-2">
                                <div className="text-[10px] font-bold text-zinc-400 uppercase">Net New</div>
                                <div className="text-sm font-bold text-zinc-900">240.0M</div>
                            </div>
                            <div className="flex-1 py-2">
                                <div className="text-[10px] font-bold text-zinc-400 uppercase">Saved</div>
                                <div className="text-sm font-bold text-zinc-900">0</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filters.map((f, i) => (
                            <button key={i} className="flex w-full items-center justify-between border-b border-zinc-100 px-4 py-2.5 hover:bg-zinc-50 group">
                                <div className="flex items-center gap-2.5">
                                    <f.icon className="h-4 w-4 text-zinc-400" />
                                    <span className="text-[13px] font-medium text-zinc-700">{f.name}</span>
                                    {f.badge && <span className="text-[9px] font-bold uppercase bg-green-100 text-green-700 px-1.5 py-0.5 rounded">{f.badge}</span>}
                                </div>
                                <div className="flex items-center gap-1">
                                    {f.locked && <Lock className="h-3 w-3 text-blue-400" />}
                                    <ChevronDown className="h-3.5 w-3.5 text-zinc-300 opacity-0 group-hover:opacity-100" />
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="border-t border-zinc-200 bg-white p-3 flex justify-between">
                        <button className="text-xs text-zinc-500 hover:text-zinc-900 font-medium">Clear all</button>
                        <Button variant="outline" className="h-7 text-xs font-semibold border-zinc-200 rounded-full px-4">More Filters</Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto bg-zinc-50/30 flex items-center justify-center p-8">
                    <div className="max-w-2xl w-full space-y-6">
                        <h2 className="text-2xl font-bold text-center text-zinc-900">Use Apollo AI to find the right prospects</h2>
                        <div className="relative">
                            <Sparkles className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400" />
                            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                                placeholder="Example: Find leading Sales Managers in New York"
                                className="w-full rounded-lg border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm focus:border-zinc-300 focus:outline-none placeholder:text-zinc-400" />
                        </div>
                        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                            <h3 className="text-sm font-bold text-zinc-900 mb-5">Quick filters</h3>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-zinc-600">Locations</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {['United States', 'Canada'].map(l => <span key={l} className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs text-zinc-600 cursor-pointer hover:border-zinc-400">{l}</span>)}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-zinc-600">Email Status</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {['Verified', 'Unverified', 'Unavailable'].map(l => <span key={l} className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs text-zinc-600 cursor-pointer hover:border-zinc-400">{l}</span>)}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-zinc-600">Job Titles</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {['founder', 'sales manager', 'marketing director'].map(l => <span key={l} className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs text-zinc-600 cursor-pointer hover:border-zinc-400">{l}</span>)}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-zinc-600">Industry</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {['information technology & services', 'marketing & advertising', 'retail'].map(l => <span key={l} className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs text-zinc-600 cursor-pointer hover:border-zinc-400">{l}</span>)}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 rounded-lg bg-zinc-50 border border-zinc-100 p-3.5 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-zinc-500">
                                    <Lock className="h-3.5 w-3.5" /><span>Unlock advanced filters:</span>
                                    <span className="font-medium text-zinc-700 flex gap-3 ml-1">
                                        <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />Revenue</span>
                                        <span className="flex items-center gap-1"><Landmark className="h-3 w-3" />Funding</span>
                                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />Company Lookalikes</span>
                                    </span>
                                </div>
                                <Button className="h-7 bg-yellow-300 hover:bg-yellow-400 text-zinc-900 font-bold text-xs px-4 rounded">View plans</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
