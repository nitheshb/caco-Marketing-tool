'use client';

import { Button } from "@/components/ui/button";
import { Plus, Search, DollarSign, TrendingUp, Circle, ChevronRight } from "lucide-react";
import { useState } from "react";

const stages = ['Prospecting', 'Qualified', 'Proposal', 'Negotiation', 'Won'];

const deals = [
    { name: 'TechCorp Enterprise License', company: 'TechCorp Inc', stage: 'Proposal', value: 48000, owner: 'You', close: 'Mar 31, 2025' },
    { name: 'StartupIO Growth Plan', company: 'StartupIO', stage: 'Qualified', value: 12000, owner: 'You', close: 'Mar 15, 2025' },
    { name: 'Ventures Co Platform', company: 'Ventures Co', stage: 'Negotiation', value: 75000, owner: 'You', close: 'Apr 10, 2025' },
    { name: 'E-Comm Starter Pack', company: 'E-Comm Store', stage: 'Prospecting', value: 3600, owner: 'You', close: 'Apr 1, 2025' },
    { name: 'Enterprise Analytics Suite', company: 'Enterprise Ltd', stage: 'Won', value: 120000, owner: 'You', close: 'Feb 20, 2025' },
];

const stageColor: Record<string, string> = {
    Prospecting: 'bg-zinc-100 text-zinc-600',
    Qualified: 'bg-blue-100 text-blue-700',
    Proposal: 'bg-purple-100 text-purple-700',
    Negotiation: 'bg-orange-100 text-orange-700',
    Won: 'bg-green-100 text-green-700',
};

export default function DealsPage() {
    const [view, setView] = useState<'list' | 'kanban'>('list');
    const [search, setSearch] = useState('');
    const filtered = deals.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="p-6 space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-zinc-900">Deals</h1>
                    <p className="text-sm text-zinc-500 mt-0.5">Manage and track your sales pipeline</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden">
                        <button onClick={() => setView('list')} className={`px-3 py-1.5 text-xs font-medium ${view === 'list' ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-600 hover:bg-zinc-50'}`}>List</button>
                        <button onClick={() => setView('kanban')} className={`px-3 py-1.5 text-xs font-medium ${view === 'kanban' ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-600 hover:bg-zinc-50'}`}>Board</button>
                    </div>
                    <Button className="h-8 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm gap-2">
                        <Plus className="h-4 w-4" /> New Deal
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Pipeline Value', value: '$258,600', icon: DollarSign, sub: '4 active deals' },
                    { label: 'Won This Month', value: '$120,000', icon: TrendingUp, sub: '1 deal closed' },
                    { label: 'Avg Deal Size', value: '$51,720', icon: Circle, sub: 'up 18% vs last month' },
                ].map((s, i) => (
                    <div key={i} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium mb-1"><s.icon className="h-3.5 w-3.5" />{s.label}</div>
                        <div className="text-2xl font-bold text-zinc-900">{s.value}</div>
                        <div className="text-xs text-zinc-400 mt-0.5">{s.sub}</div>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="relative max-w-xs">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search deals..." className="h-8 w-full rounded-md border border-zinc-200 pl-8 pr-3 text-sm focus:outline-none" />
            </div>

            {view === 'list' ? (
                <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50 text-left">
                                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Deal</th>
                                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Stage</th>
                                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Value</th>
                                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Close Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filtered.map((d, i) => (
                                <tr key={i} className="hover:bg-zinc-50 cursor-pointer transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-zinc-900">{d.name}</div>
                                        <div className="text-xs text-zinc-400">{d.company}</div>
                                    </td>
                                    <td className="px-4 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stageColor[d.stage]}`}>{d.stage}</span></td>
                                    <td className="px-4 py-3 font-semibold text-zinc-900">${d.value.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-zinc-500 text-xs">{d.close}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex gap-3 overflow-x-auto pb-4">
                    {stages.map(stage => (
                        <div key={stage} className="flex-shrink-0 w-56 rounded-xl bg-zinc-100 p-3">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold text-zinc-700 uppercase tracking-wide">{stage}</span>
                                <span className="text-xs text-zinc-400">{filtered.filter(d => d.stage === stage).length}</span>
                            </div>
                            <div className="space-y-2">
                                {filtered.filter(d => d.stage === stage).map((d, i) => (
                                    <div key={i} className="bg-white rounded-lg p-3 border border-zinc-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                                        <div className="text-xs font-semibold text-zinc-900 leading-snug">{d.name}</div>
                                        <div className="text-xs text-zinc-400 mt-1">{d.company}</div>
                                        <div className="text-sm font-bold text-zinc-800 mt-2">${d.value.toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
