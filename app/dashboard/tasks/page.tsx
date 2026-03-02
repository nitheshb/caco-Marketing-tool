'use client';

import { Button } from "@/components/ui/button";
import { Plus, CheckSquare, Circle, Calendar, AlertCircle, Search } from "lucide-react";
import { useState } from "react";

const tasks = [
    { title: 'Follow up with Sarah Chen - sent demo', type: 'Email', priority: 'high', due: 'Today', contact: 'Sarah Chen', done: false },
    { title: 'Call James Miller - left voicemail', type: 'Call', priority: 'medium', due: 'Today', contact: 'James Miller', done: false },
    { title: 'Send proposal to Priya Patel', type: 'Email', priority: 'high', due: 'Tomorrow', contact: 'Priya Patel', done: false },
    { title: 'LinkedIn connect - David Ross', type: 'LinkedIn', priority: 'low', due: 'Feb 28', contact: 'David Ross', done: true },
    { title: 'Research TechCorp before call', type: 'General', priority: 'medium', due: 'Mar 1', contact: 'Sarah Chen', done: true },
];

const priorityColor: Record<string, string> = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-zinc-100 text-zinc-600',
};

export default function TasksPage() {
    const [search, setSearch] = useState('');
    const [items, setItems] = useState(tasks);

    const toggle = (i: number) => setItems(prev => prev.map((t, idx) => idx === i ? { ...t, done: !t.done } : t));
    const filtered = items.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    const pending = filtered.filter(t => !t.done);
    const done = filtered.filter(t => t.done);

    return (
        <div className="p-6 space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-zinc-900">Tasks</h1>
                    <p className="text-sm text-zinc-500 mt-0.5">Stay on top of your follow-ups and to-dos</p>
                </div>
                <Button className="h-8 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm gap-2">
                    <Plus className="h-4 w-4" /> Add Task
                </Button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Due Today', value: items.filter(t => t.due === 'Today' && !t.done).length, color: 'text-red-600', icon: AlertCircle },
                    { label: 'Upcoming', value: items.filter(t => t.due !== 'Today' && !t.done).length, color: 'text-blue-600', icon: Calendar },
                    { label: 'Completed', value: items.filter(t => t.done).length, color: 'text-green-600', icon: CheckSquare },
                ].map((s, i) => (
                    <div key={i} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex items-center gap-3">
                        <s.icon className={`h-6 w-6 ${s.color}`} />
                        <div>
                            <div className="text-xl font-bold text-zinc-900">{s.value}</div>
                            <div className="text-xs text-zinc-500 font-medium">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="relative max-w-xs">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." className="h-8 w-full rounded-md border border-zinc-200 pl-8 pr-3 text-sm focus:outline-none" />
            </div>

            {/* Task Lists */}
            <div className="space-y-4">
                {[{ label: 'Pending', items: pending }, { label: 'Completed', items: done }].map((group, gi) => (
                    group.items.length > 0 && (
                        <div key={gi}>
                            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">{group.label} ({group.items.length})</h2>
                            <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm divide-y divide-zinc-100">
                                {group.items.map((t, i) => {
                                    const realIdx = items.indexOf(t);
                                    return (
                                        <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-zinc-50 cursor-pointer transition-colors" onClick={() => toggle(realIdx)}>
                                            {t.done ? <CheckSquare className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /> : <Circle className="h-4 w-4 text-zinc-300 mt-0.5 flex-shrink-0" />}
                                            <div className="flex-1 min-w-0">
                                                <div className={`text-sm font-medium ${t.done ? 'line-through text-zinc-400' : 'text-zinc-900'}`}>{t.title}</div>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400">
                                                    <span>{t.contact}</span>
                                                    <span>·</span>
                                                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{t.due}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded">{t.type}</span>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${priorityColor[t.priority]}`}>{t.priority}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}
