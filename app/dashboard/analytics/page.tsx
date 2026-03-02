'use client';

import { Button } from "@/components/ui/button";
import { BarChart2, TrendingUp, Mail, Phone, Users, ArrowUp, ArrowDown } from "lucide-react";

const metrics = [
    { label: 'Emails Sent', value: '4,821', change: '+12%', up: true },
    { label: 'Open Rate', value: '41.2%', change: '+3.1%', up: true },
    { label: 'Reply Rate', value: '11.8%', change: '-0.4%', up: false },
    { label: 'Calls Made', value: '312', change: '+28%', up: true },
    { label: 'Meetings Booked', value: '34', change: '+8%', up: true },
    { label: 'Deals Closed', value: '5', change: '-2', up: false },
];

const barData = [40, 65, 50, 80, 55, 90, 70, 75, 60, 85, 72, 95];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AnalyticsPage() {
    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-zinc-900">Analytics</h1>
                    <p className="text-sm text-zinc-500 mt-0.5">Track your team's performance and outreach effectiveness</p>
                </div>
                <div className="flex gap-2">
                    {['7 days', '30 days', '90 days', 'This year'].map((t, i) => (
                        <button key={i} className={`px-3 py-1.5 text-xs font-medium rounded-lg border ${i === 1 ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-200 text-zinc-600 hover:border-zinc-400 bg-white'}`}>{t}</button>
                    ))}
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-4">
                {metrics.map((m, i) => (
                    <div key={i} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                        <div className="text-xs text-zinc-500 font-medium mb-1">{m.label}</div>
                        <div className="text-2xl font-bold text-zinc-900">{m.value}</div>
                        <div className={`flex items-center gap-1 text-xs font-semibold mt-1 ${m.up ? 'text-green-600' : 'text-red-500'}`}>
                            {m.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                            {m.change} vs prev period
                        </div>
                    </div>
                ))}
            </div>

            {/* Email Volume Chart */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-bold text-zinc-900 mb-4">Email Volume (Monthly)</h2>
                <div className="flex items-end gap-2 h-36">
                    {barData.map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full rounded-t bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer" style={{ height: `${h}%` }} />
                            <span className="text-[9px] text-zinc-400">{months[i]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Channel Performance */}
            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-bold text-zinc-900 mb-4">Top Sequences by Reply Rate</h2>
                    <div className="space-y-3">
                        {[
                            { name: 'LinkedIn Warm Prospects', rate: '24%', width: '24%' },
                            { name: 'Enterprise Inbound Response', rate: '18%', width: '18%' },
                            { name: 'SaaS Outbound - Cold', rate: '11%', width: '11%' },
                            { name: 'E-Commerce Follow-Up', rate: '8%', width: '8%' },
                        ].map((s, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-zinc-700 font-medium">{s.name}</span>
                                    <span className="text-zinc-500">{s.rate}</span>
                                </div>
                                <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${parseFloat(s.rate) * 4}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-bold text-zinc-900 mb-4">Activity Breakdown</h2>
                    <div className="space-y-3">
                        {[
                            { icon: Mail, label: 'Emails', value: 4821, color: 'bg-blue-500' },
                            { icon: Phone, label: 'Calls', value: 312, color: 'bg-green-500' },
                            { icon: Users, label: 'LinkedIn Actions', value: 148, color: 'bg-purple-500' },
                        ].map((a, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center"><a.icon className="h-4 w-4 text-zinc-600" /></div>
                                <div className="flex-1">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-medium text-zinc-700">{a.label}</span>
                                        <span className="text-zinc-500">{a.value.toLocaleString()}</span>
                                    </div>
                                    <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${a.color} rounded-full`} style={{ width: `${(a.value / 4821) * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
