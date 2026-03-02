'use client';

import { Button } from "@/components/ui/button";
import { Phone, Search, Plus, PhoneCall, PhoneMissed, PhoneIncoming, Clock } from "lucide-react";
import { useState } from "react";

const calls = [
    { contact: 'Sarah Chen', company: 'TechCorp Inc', duration: '8:42', outcome: 'interested', time: '30m ago' },
    { contact: 'James Miller', company: 'StartupIO', duration: '3:15', outcome: 'voicemail', time: '2h ago' },
    { contact: 'Priya Patel', company: 'Ventures Co', duration: '15:30', outcome: 'meeting booked', time: '5h ago' },
    { contact: 'David Ross', company: 'Enterprise Ltd', duration: '0:00', outcome: 'no answer', time: '1d ago' },
    { contact: 'Anna Lopez', company: 'E-Comm Store', duration: '5:58', outcome: 'not interested', time: '1d ago' },
];

const outcomeConfig: Record<string, string> = {
    interested: 'bg-green-100 text-green-700',
    voicemail: 'bg-yellow-100 text-yellow-700',
    'meeting booked': 'bg-blue-100 text-blue-700',
    'no answer': 'bg-zinc-100 text-zinc-600',
    'not interested': 'bg-red-100 text-red-700',
};

export default function CallsPage() {
    const [search, setSearch] = useState('');
    const filtered = calls.filter(c => c.contact.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="p-6 space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-zinc-900">Calls</h1>
                    <p className="text-sm text-zinc-500 mt-0.5">Log, track, and review all your prospect and customer calls</p>
                </div>
                <Button className="h-8 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm gap-2">
                    <Plus className="h-4 w-4" /> Log Call
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Calls This Week', value: '47', icon: PhoneCall, color: 'text-blue-600 bg-blue-50' },
                    { label: 'Avg Duration', value: '6:20', icon: Clock, color: 'text-purple-600 bg-purple-50' },
                    { label: 'Meetings Booked', value: '8', icon: PhoneIncoming, color: 'text-green-600 bg-green-50' },
                    { label: 'No Answer', value: '12', icon: PhoneMissed, color: 'text-red-600 bg-red-50' },
                ].map((s, i) => (
                    <div key={i} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex items-start gap-3">
                        <div className={`h-8 w-8 rounded-lg ${s.color} flex items-center justify-center flex-shrink-0`}>
                            <s.icon className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="text-xs text-zinc-500 font-medium">{s.label}</div>
                            <div className="text-xl font-bold text-zinc-900 mt-0.5">{s.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="relative max-w-xs">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search calls..." className="h-8 w-full rounded-md border border-zinc-200 pl-8 pr-3 text-sm focus:outline-none" />
            </div>

            {/* Table */}
            <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-zinc-100 bg-zinc-50 text-left">
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Contact</th>
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Company</th>
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Duration</th>
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Outcome</th>
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {filtered.map((c, i) => (
                            <tr key={i} className="hover:bg-zinc-50 cursor-pointer transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-7 w-7 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-600">{c.contact[0]}</div>
                                        <span className="font-medium text-zinc-900">{c.contact}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-zinc-500">{c.company}</td>
                                <td className="px-4 py-3 font-mono text-zinc-700">{c.duration}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${outcomeConfig[c.outcome]}`}>{c.outcome}</span>
                                </td>
                                <td className="px-4 py-3 text-zinc-400 text-xs">{c.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
