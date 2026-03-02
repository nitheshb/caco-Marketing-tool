'use client';

import { Button } from "@/components/ui/button";
import { Plus, FileText, Eye, Users, ArrowUpRight, Copy, ExternalLink, Settings } from "lucide-react";
import { useState } from "react";

const forms = [
    { name: 'Product Demo Request', submissions: 142, conversion: '18%', status: 'active', created: 'Jan 10, 2025' },
    { name: 'Newsletter Signup', submissions: 890, conversion: '34%', status: 'active', created: 'Dec 5, 2024' },
    { name: 'Contact Sales Form', submissions: 67, conversion: '12%', status: 'active', created: 'Feb 1, 2025' },
    { name: 'Free Trial Signup', submissions: 0, conversion: '0%', status: 'draft', created: 'Feb 22, 2025' },
];

export default function FormsPage() {
    const [tab, setTab] = useState(0);

    return (
        <div className="p-6 space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-zinc-900">Forms</h1>
                    <p className="text-sm text-zinc-500 mt-0.5">Capture leads directly from your website with embeddable forms</p>
                </div>
                <Button className="h-8 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm gap-2">
                    <Plus className="h-4 w-4" /> Create Form
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total Submissions', value: '1,099', icon: FileText },
                    { label: 'Avg Conversion Rate', value: '21.3%', icon: ArrowUpRight },
                    { label: 'Active Forms', value: '3', icon: Eye },
                ].map((s, i) => (
                    <div key={i} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center"><s.icon className="h-4 w-4 text-zinc-600" /></div>
                        <div>
                            <div className="text-xs text-zinc-500 font-medium">{s.label}</div>
                            <div className="text-xl font-bold text-zinc-900 mt-0.5">{s.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-5 border-b border-zinc-200">
                {['My Forms', 'Templates'].map((t, i) => (
                    <button key={i} onClick={() => setTab(i)} className={`pb-2 text-[13px] font-medium ${tab === i ? 'text-zinc-900 border-b-2 border-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}>{t}</button>
                ))}
            </div>

            {tab === 0 ? (
                <div className="grid grid-cols-2 gap-4">
                    {forms.map((f, i) => (
                        <div key={i} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-bold text-zinc-900 text-[15px]">{f.name}</h3>
                                    <p className="text-xs text-zinc-400 mt-0.5">Created {f.created}</p>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${f.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>{f.status}</span>
                            </div>
                            <div className="flex items-center gap-5 mt-4 text-sm">
                                <div className="flex items-center gap-1.5 text-zinc-600">
                                    <Users className="h-4 w-4 text-zinc-400" />
                                    <span className="font-semibold text-zinc-900">{f.submissions}</span> submissions
                                </div>
                                <div className="flex items-center gap-1.5 text-zinc-600">
                                    <ArrowUpRight className="h-4 w-4 text-zinc-400" />
                                    <span className="font-semibold text-zinc-900">{f.conversion}</span> conv. rate
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                                <Button variant="outline" className="h-7 text-xs gap-1 border-zinc-200"><Copy className="h-3 w-3" /> Copy embed</Button>
                                <Button variant="outline" className="h-7 text-xs gap-1 border-zinc-200"><ExternalLink className="h-3 w-3" /> View</Button>
                                <Button variant="ghost" className="h-7 w-7 p-0 ml-auto text-zinc-400"><Settings className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-4">
                    {['Lead Capture Basic', 'Event Registration', 'Survey Form', 'Quote Request', 'Job Application', 'Feedback Form'].map((t, i) => (
                        <div key={i} className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-5 text-center hover:border-zinc-400 hover:bg-white transition-colors cursor-pointer">
                            <FileText className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
                            <p className="text-sm font-medium text-zinc-700">{t}</p>
                            <Button variant="outline" className="h-7 text-xs mt-3 border-zinc-200">Use template</Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
