'use client';

import { Button } from "@/components/ui/button";
import { Database, Sparkles, Upload, RefreshCw, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const enrichments = [
    { name: 'LinkedIn Job Titles', records: '1,240', status: 'completed', date: 'Feb 24, 2025', icon: '💼' },
    { name: 'Email Verification', records: '3,500', status: 'processing', date: 'Feb 25, 2025', icon: '✉️' },
    { name: 'Company Firmographics', records: '800', status: 'completed', date: 'Feb 20, 2025', icon: '🏢' },
    { name: 'Phone Numbers', records: '620', status: 'failed', date: 'Feb 18, 2025', icon: '📞' },
];

const statusIcon: Record<string, JSX.Element> = {
    completed: <CheckCircle2 className="h-4 w-4 text-green-600" />,
    processing: <Clock className="h-4 w-4 text-blue-500 animate-spin" />,
    failed: <AlertCircle className="h-4 w-4 text-red-500" />,
};

const statusColor: Record<string, string> = {
    completed: 'bg-green-50 text-green-700',
    processing: 'bg-blue-50 text-blue-700',
    failed: 'bg-red-50 text-red-700',
};

export default function DataEnrichmentPage() {
    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-zinc-900">Data Enrichment</h1>
                    <p className="text-sm text-zinc-500 mt-0.5">Enrich your contacts and companies with accurate, up-to-date data</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-8 text-sm gap-2 border-zinc-200">
                        <Upload className="h-4 w-4" /> Import CSV
                    </Button>
                    <Button className="h-8 bg-yellow-300 hover:bg-yellow-400 text-zinc-900 font-bold text-sm gap-2">
                        <Sparkles className="h-4 w-4" /> Enrich with AI
                    </Button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Records Enriched', value: '6,160', change: '+340 this week', icon: Database },
                    { label: 'Fields Enriched', value: '18 of 24', change: '75% coverage', icon: CheckCircle2 },
                    { label: 'API Credits Used', value: '4,820', change: '1,180 remaining', icon: RefreshCw },
                ].map((s, i) => (
                    <div key={i} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium mb-2">
                            <s.icon className="h-4 w-4" /> {s.label}
                        </div>
                        <div className="text-2xl font-bold text-zinc-900">{s.value}</div>
                        <div className="text-xs text-zinc-400 mt-1">{s.change}</div>
                    </div>
                ))}
            </div>

            {/* Enrichment Jobs Table */}
            <div>
                <h2 className="text-sm font-bold text-zinc-800 mb-3">Recent Enrichment Jobs</h2>
                <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50 text-left">
                                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Job Name</th>
                                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Records</th>
                                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Date</th>
                                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {enrichments.map((e, i) => (
                                <tr key={i} className="hover:bg-zinc-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-lg">{e.icon}</span>
                                            <span className="font-medium text-zinc-900">{e.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-zinc-600">{e.records}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            {statusIcon[e.status]}
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor[e.status]}`}>{e.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-zinc-500">{e.date}</td>
                                    <td className="px-4 py-3">
                                        <Button variant="ghost" className="h-7 text-xs text-zinc-600 px-2">View</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
