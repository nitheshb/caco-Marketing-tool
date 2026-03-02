'use client';

import { Button } from "@/components/ui/button";
import { Search, ChevronDown, List as ListIcon, Building2, Users, MapPin, Landmark, BarChart2, Star, Brain, Lock, ArrowUpDown, Sparkles, DollarSign, Globe, Settings } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const filters = [
    { icon: ListIcon, name: 'Lists' },
    { icon: Building2, name: 'Company' },
    { icon: Users, name: 'Lookalikes', locked: true },
    { icon: MapPin, name: 'Account Location' },
    { icon: Users, name: '# Employees' },
    { icon: Star, name: 'Industry & Keywords' },
    { icon: Landmark, name: 'Market Segments' },
    { icon: BarChart2, name: 'SIC and NAICS' },
    { icon: Brain, name: 'AI Filters' },
    { icon: Star, name: 'Buying Intent' },
    { icon: Globe, name: 'Website Visitors' },
];

export default function CompaniesPage() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="flex flex-col h-full">
            {/* Page Topbar */}
            <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-2.5 flex-shrink-0 gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <h1 className="text-[17px] font-bold text-zinc-900">Find companies</h1>
                    <Button variant="outline" className="h-7 px-2.5 text-xs font-medium gap-1.5 border-zinc-200">
                        <ListIcon className="h-3.5 w-3.5 text-zinc-500" />
                        Default view
                        <ChevronDown className="h-3 w-3 text-zinc-500" />
                    </Button>
                    <Button variant="ghost" className="h-7 px-2.5 text-xs font-medium text-zinc-600 gap-1.5">
                        Hide Filters
                    </Button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1.5 h-3.5 w-3.5 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search companies"
                            className="h-7 w-48 rounded-md border border-zinc-200 pl-8 pr-3 text-xs placeholder:text-zinc-400 focus:border-zinc-300 focus:outline-none bg-zinc-50"
                        />
                    </div>
                    <Button variant="outline" className="h-7 px-2.5 text-xs font-medium gap-1.5 border-zinc-200">
                        <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                        Create workflow
                        <ChevronDown className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" className="h-7 px-2.5 text-xs font-medium border-zinc-200">Save as new search</Button>
                    <Button variant="outline" className="h-7 px-2.5 text-xs font-medium gap-1.5 border-zinc-200">
                        <ArrowUpDown className="h-3.5 w-3.5" /> Sort
                    </Button>
                    <Button variant="ghost" className="h-7 w-7 p-0 text-zinc-500">
                        <Settings className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            {/* Split Pane */}
            <div className="flex flex-1 overflow-hidden min-h-0">
                {/* Left Filter Sidebar */}
                <div className="w-[260px] flex-shrink-0 flex flex-col border-r border-zinc-200 bg-white overflow-hidden">
                    {/* Metrics */}
                    <div className="p-3 border-b border-zinc-100">
                        <div className="flex rounded-lg border border-zinc-200 overflow-hidden text-center divide-x divide-zinc-200">
                            <div className="flex-1 py-2 bg-blue-50">
                                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Total</div>
                                <div className="text-sm font-bold text-zinc-900">32.4M</div>
                            </div>
                            <div className="flex-1 py-2">
                                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Net New</div>
                                <div className="text-sm font-bold text-zinc-900">32.4M</div>
                            </div>
                            <div className="flex-1 py-2">
                                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Saved</div>
                                <div className="text-sm font-bold text-zinc-900">0</div>
                            </div>
                        </div>
                    </div>

                    {/* Filters list */}
                    <div className="flex-1 overflow-y-auto">
                        {filters.map((filter, i) => (
                            <button key={i} className="flex w-full items-center justify-between border-b border-zinc-100 px-4 py-2.5 hover:bg-zinc-50 transition-colors group">
                                <div className="flex items-center gap-2.5 text-zinc-700">
                                    <filter.icon className="h-4 w-4 text-zinc-400" />
                                    <span className="text-[13px] font-medium">{filter.name}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {filter.locked && <Lock className="h-3 w-3 text-blue-400" />}
                                    <ChevronDown className="h-3.5 w-3.5 text-zinc-300 opacity-0 group-hover:opacity-100" />
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-zinc-200 bg-white p-3 flex justify-between items-center">
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
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Example: Find financial services companies in New York"
                                className="w-full rounded-lg border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm focus:border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-200 placeholder:text-zinc-400"
                            />
                        </div>

                        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                            <h3 className="text-sm font-bold text-zinc-900 mb-5">Quick filters</h3>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-zinc-600">Locations</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {['United States', 'Canada'].map(l => (
                                            <span key={l} className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs text-zinc-600 cursor-pointer hover:border-zinc-400 hover:bg-zinc-50">{l}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-zinc-600">Employee Count</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {['1-10', '11-20', '21-50'].map(l => (
                                            <span key={l} className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs text-zinc-600 cursor-pointer hover:border-zinc-400 hover:bg-zinc-50">{l}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <p className="text-xs font-semibold text-zinc-600">Industry</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {['information technology & services', 'marketing & advertising', 'retail'].map(l => (
                                            <span key={l} className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs text-zinc-600 cursor-pointer hover:border-zinc-400 hover:bg-zinc-50">{l}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 rounded-lg bg-zinc-50 border border-zinc-100 p-3.5 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-zinc-500">
                                    <Lock className="h-3.5 w-3.5" />
                                    <span>Unlock advanced filters:</span>
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
