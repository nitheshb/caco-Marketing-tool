'use client';

import { Button } from "@/components/ui/button";
import { Plus, Search, Play, Pause, MoreHorizontal, Sparkles } from "lucide-react";
import { useState } from "react";

const sequences = [
    { name: 'SaaS Outbound - Cold', steps: 6, active: 120, replied: 18, status: 'active' },
    { name: 'E-Commerce Follow-Up', steps: 4, active: 45, replied: 9, status: 'active' },
    { name: 'Re-engagement 90 days', steps: 3, active: 0, replied: 0, status: 'paused' },
    { name: 'Enterprise Inbound Response', steps: 8, active: 30, replied: 12, status: 'active' },
    { name: 'LinkedIn Warm Prospects', steps: 5, active: 88, replied: 21, status: 'active' },
];

export default function SequencesPage() {
    const [search, setSearch] = useState('');
    const filtered = sequences.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="p-6 space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-zinc-900">Sequences</h1>
                    <p className="text-sm text-zinc-500 mt-0.5">Automate multi-step outreach campaigns across email, calls, and LinkedIn</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-8 text-sm gap-2 border-zinc-200">
                        <Sparkles className="h-4 w-4 text-purple-500" /> AI Sequences
                    </Button>
                    <Button className="h-8 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm gap-2">
                        <Plus className="h-4 w-4" /> New Sequence
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Active Contacts', value: '283', sub: 'across all sequences' },
                    { label: 'Emails Sent', value: '1,492', sub: 'in last 30 days' },
                    { label: 'Open Rate', value: '42%', sub: '+5% vs last month' },
                    { label: 'Reply Rate', value: '12%', sub: '+2% vs last month' },
                ].map((s, i) => (
                    <div key={i} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                        <div className="text-xs text-zinc-500 font-medium mb-1">{s.label}</div>
                        <div className="text-2xl font-bold text-zinc-900">{s.value}</div>
                        <div className="text-xs text-zinc-400 mt-0.5">{s.sub}</div>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sequences..." className="h-8 w-full rounded-md border border-zinc-200 pl-8 pr-3 text-sm focus:outline-none" />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-zinc-100 bg-zinc-50 text-left">
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Name</th>
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Steps</th>
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Active</th>
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Replied</th>
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Status</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {filtered.map((s, i) => (
                            <tr key={i} className="hover:bg-zinc-50 cursor-pointer transition-colors">
                                <td className="px-4 py-3 font-medium text-zinc-900">{s.name}</td>
                                <td className="px-4 py-3 text-zinc-600">{s.steps} steps</td>
                                <td className="px-4 py-3 text-zinc-700 font-medium">{s.active}</td>
                                <td className="px-4 py-3 text-zinc-700 font-medium">{s.replied}</td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                                        {s.status === 'active' ? <Play className="h-2.5 w-2.5" /> : <Pause className="h-2.5 w-2.5" />}
                                        {s.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <Button variant="ghost" className="h-7 w-7 p-0">
                                        <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
