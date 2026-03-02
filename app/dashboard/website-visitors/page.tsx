'use client';

import { Button } from "@/components/ui/button";
import { Globe, Eye, Clock, ArrowUp, MapPin, ExternalLink } from "lucide-react";

const visitors = [
    { company: 'TechCorp Inc', location: 'San Francisco, CA', pages: 14, time: '12m', source: 'Google', last: '5m ago', intent: 'high' },
    { company: 'StartupIO', location: 'New York, NY', pages: 7, time: '5m', source: 'Direct', last: '23m ago', intent: 'medium' },
    { company: 'VenturesCo', location: 'Austin, TX', pages: 22, time: '31m', source: 'LinkedIn', last: '1h ago', intent: 'high' },
    { company: 'E-Comm Store', location: 'Chicago, IL', pages: 3, time: '2m', source: 'Google', last: '2h ago', intent: 'low' },
    { company: 'Enterprise Ltd', location: 'Boston, MA', pages: 18, time: '24m', source: 'Email', last: '3h ago', intent: 'high' },
];

const intentColor = { high: 'bg-red-100 text-red-700', medium: 'bg-yellow-100 text-yellow-700', low: 'bg-zinc-100 text-zinc-600' };

export default function WebsiteVisitorsPage() {
    return (
        <div className="p-6 space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-zinc-900">Website Visitors</h1>
                    <p className="text-sm text-zinc-500 mt-0.5">See which companies are visiting your website and identify high-intent prospects</p>
                </div>
                <Button className="h-8 bg-yellow-300 hover:bg-yellow-400 text-zinc-900 font-bold text-sm gap-2">
                    <Globe className="h-4 w-4" /> Install Tracking Script
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Companies Today', value: '48', icon: Globe },
                    { label: 'Page Views', value: '312', icon: Eye },
                    { label: 'Avg Time on Site', value: '8m 42s', icon: Clock },
                    { label: 'High Intent', value: '12', icon: ArrowUp },
                ].map((s, i) => (
                    <div key={i} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center">
                            <s.icon className="h-4 w-4 text-zinc-600" />
                        </div>
                        <div>
                            <div className="text-xs text-zinc-500 font-medium">{s.label}</div>
                            <div className="text-xl font-bold text-zinc-900 mt-0.5">{s.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Visitors Table */}
            <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
                    <h2 className="text-sm font-bold text-zinc-900">Recent Visitors</h2>
                    <div className="flex gap-2">
                        {['All', 'High Intent', 'New'].map((t, i) => (
                            <button key={i} className={`text-xs font-medium px-2.5 py-1 rounded-full ${i === 0 ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'}`}>{t}</button>
                        ))}
                    </div>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-zinc-100 bg-zinc-50 text-left">
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Company</th>
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Location</th>
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Pages</th>
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Time</th>
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Source</th>
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Intent</th>
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Last Seen</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {visitors.map((v, i) => (
                            <tr key={i} className="hover:bg-zinc-50 cursor-pointer transition-colors group">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded bg-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-600">{v.company[0]}</div>
                                        <span className="font-medium text-zinc-900">{v.company}</span>
                                        <ExternalLink className="h-3 w-3 text-zinc-300 opacity-0 group-hover:opacity-100" />
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-zinc-500 text-xs"><div className="flex items-center gap-1"><MapPin className="h-3 w-3" />{v.location}</div></td>
                                <td className="px-4 py-3 text-zinc-700 font-medium">{v.pages}</td>
                                <td className="px-4 py-3 text-zinc-500">{v.time}</td>
                                <td className="px-4 py-3 text-zinc-500">{v.source}</td>
                                <td className="px-4 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${intentColor[v.intent as keyof typeof intentColor]}`}>{v.intent}</span></td>
                                <td className="px-4 py-3 text-zinc-400 text-xs">{v.last}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
