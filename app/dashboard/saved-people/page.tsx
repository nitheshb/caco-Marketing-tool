'use client';

import { Button } from "@/components/ui/button";
import { Bookmark, Search, Tag, Mail, Building2, Plus } from "lucide-react";
import { useState } from "react";

const saved = [
    { name: 'Alex Johnson', title: 'VP of Sales', company: 'TechCorp Inc', email: 'alex@techcorp.com', addedOn: 'Feb 20, 2025', tags: ['Hot lead', 'ICP'] },
    { name: 'Maria Garcia', title: 'Head of Marketing', company: 'StartupIO', email: 'maria@startup.io', addedOn: 'Feb 18, 2025', tags: ['Warm'] },
    { name: 'Kevin Liu', title: 'CTO', company: 'VenturesCo', email: 'kliu@ventures.com', addedOn: 'Feb 15, 2025', tags: ['Decision maker', 'ICP'] },
    { name: 'Emma Brown', title: 'Sales Director', company: 'Enterprise Ltd', email: 'emma@enterprise.co', addedOn: 'Feb 10, 2025', tags: ['Follow up'] },
];

export default function SavedPeoplePage() {
    const [search, setSearch] = useState('');
    const filtered = saved.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.company.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="p-6 space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-zinc-900">Saved People</h1>
                    <p className="text-sm text-zinc-500 mt-0.5">Contacts you've bookmarked for quick access and outreach</p>
                </div>
                <Button className="h-8 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm gap-2">
                    <Plus className="h-4 w-4" /> Add People
                </Button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search saved contacts..." className="h-8 w-full rounded-md border border-zinc-200 pl-8 pr-3 text-sm focus:outline-none" />
                </div>
                <Button variant="outline" className="h-8 text-sm gap-1.5 border-zinc-200"><Tag className="h-3.5 w-3.5" /> All Tags</Button>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-2 gap-4">
                {filtered.map((p, i) => (
                    <div key={i} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm flex gap-4 hover:shadow-md transition-shadow">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                            {p.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-bold text-zinc-900">{p.name}</h3>
                                    <p className="text-xs text-zinc-500">{p.title}</p>
                                </div>
                                <Bookmark className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400">
                                <Building2 className="h-3 w-3" />{p.company}
                                <span>·</span>
                                <Mail className="h-3 w-3" />{p.email}
                            </div>
                            <div className="flex items-center gap-1.5 mt-3">
                                {p.tags.map((t, j) => (
                                    <span key={j} className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{t}</span>
                                ))}
                                <span className="text-[10px] text-zinc-400 ml-auto">Added {p.addedOn}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
