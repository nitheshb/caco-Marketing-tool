'use client';

import { Button } from "@/components/ui/button";
import { Search, Mail, CheckCircle2, Clock, AlertCircle, RefreshCw, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

const emails = [
    { subject: 'Following up on our conversation', to: 'sarah@techcorp.com', status: 'opened', time: '2h ago', sequence: 'SaaS Outbound' },
    { subject: 'Quick question about your goals', to: 'james@startup.io', status: 'sent', time: '5h ago', sequence: 'E-Commerce Follow-Up' },
    { subject: 'Saw your post on LinkedIn...', to: 'priya@ventures.com', status: 'clicked', time: '1d ago', sequence: 'LinkedIn Warm Prospects' },
    { subject: 'Re: Product Demo Next Week?', to: 'david@enterprise.co', status: 'replied', time: '2d ago', sequence: 'Enterprise Inbound' },
    { subject: 'Last check-in before I close your file', to: 'anna@ecommerce.io', status: 'bounced', time: '3d ago', sequence: 'Re-engagement' },
];

const statusConfig: Record<string, { icon: JSX.Element; color: string }> = {
    opened: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, color: 'bg-blue-50 text-blue-700' },
    sent: { icon: <Clock className="h-3.5 w-3.5" />, color: 'bg-zinc-100 text-zinc-600' },
    clicked: { icon: <LinkIcon className="h-3.5 w-3.5" />, color: 'bg-purple-50 text-purple-700' },
    replied: { icon: <Mail className="h-3.5 w-3.5" />, color: 'bg-green-50 text-green-700' },
    bounced: { icon: <AlertCircle className="h-3.5 w-3.5" />, color: 'bg-red-50 text-red-700' },
};

export default function EmailsPage() {
    const [search, setSearch] = useState('');
    const filtered = emails.filter(e => e.subject.toLowerCase().includes(search.toLowerCase()) || e.to.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="p-6 space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-zinc-900">Emails</h1>
                    <p className="text-sm text-zinc-500 mt-0.5">Track all outbound emails sent through your sequences</p>
                </div>
                <Button variant="outline" className="h-8 text-sm gap-2 border-zinc-200">
                    <RefreshCw className="h-4 w-4" /> Sync Mailbox
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Sent (30d)', value: '1,492', icon: Mail },
                    { label: 'Open Rate', value: '42%', icon: CheckCircle2 },
                    { label: 'Click Rate', value: '8%', icon: LinkIcon },
                    { label: 'Reply Rate', value: '12%', icon: RefreshCw },
                ].map((s, i) => (
                    <div key={i} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
                            <s.icon className="h-4 w-4 text-zinc-600" />
                        </div>
                        <div>
                            <div className="text-xs text-zinc-500 font-medium">{s.label}</div>
                            <div className="text-xl font-bold text-zinc-900 mt-0.5">{s.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter bar */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search emails..." className="h-8 w-full rounded-md border border-zinc-200 pl-8 pr-3 text-sm focus:outline-none" />
                </div>
                {['All', 'Opened', 'Clicked', 'Replied', 'Bounced'].map((t, i) => (
                    <button key={i} className={`text-xs font-medium px-3 py-1 rounded-full border ${i === 0 ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'}`}>{t}</button>
                ))}
            </div>

            {/* Table */}
            <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-zinc-100 bg-zinc-50 text-left">
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Subject</th>
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">To</th>
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Sequence</th>
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {filtered.map((e, i) => (
                            <tr key={i} className="hover:bg-zinc-50 cursor-pointer transition-colors">
                                <td className="px-4 py-3 font-medium text-zinc-900 max-w-[240px] truncate">{e.subject}</td>
                                <td className="px-4 py-3 text-zinc-500">{e.to}</td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${statusConfig[e.status].color}`}>
                                        {statusConfig[e.status].icon} {e.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-zinc-500 text-xs">{e.sequence}</td>
                                <td className="px-4 py-3 text-zinc-400 text-xs">{e.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
