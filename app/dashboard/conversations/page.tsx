'use client';

import { Button } from "@/components/ui/button";
import { MessageCircle, Search, Plus, Phone, Mail, Video } from "lucide-react";
import { useState } from "react";

const conversations = [
    { contact: 'Sarah Chen', company: 'TechCorp Inc', last: 'Sounds great, looking forward to the demo!', channel: 'email', time: '5m ago', unread: true },
    { contact: 'James Miller', company: 'StartupIO', last: 'Can we push to next Tuesday?', channel: 'email', time: '1h ago', unread: true },
    { contact: 'Priya Patel', company: 'Ventures Co', last: 'I shared it with my team. Will follow up.', channel: 'phone', time: '3h ago', unread: false },
    { contact: 'David Ross', company: 'Enterprise Ltd', last: 'Thanks for the proposal, reviewing now.', channel: 'email', time: '1d ago', unread: false },
    { contact: 'Anna Lopez', company: 'E-Comm Store', last: 'Not quite what we need right now.', channel: 'phone', time: '2d ago', unread: false },
];

const channelIcon = { email: <Mail className="h-3.5 w-3.5" />, phone: <Phone className="h-3.5 w-3.5" />, video: <Video className="h-3.5 w-3.5" /> };

export default function ConversationsPage() {
    const [active, setActive] = useState(0);
    const [search, setSearch] = useState('');
    const filtered = conversations.filter(c => c.contact.toLowerCase().includes(search.toLowerCase()));
    const current = conversations[active];

    return (
        <div className="flex h-full min-h-0 animate-in fade-in duration-300">
            {/* Left Pane - Conversation List */}
            <div className="w-[300px] flex-shrink-0 border-r border-zinc-200 bg-white flex flex-col">
                <div className="p-3 border-b border-zinc-100">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations..." className="h-8 w-full rounded-md border border-zinc-200 pl-8 pr-3 text-xs focus:outline-none" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
                    {filtered.map((c, i) => (
                        <button key={i} onClick={() => setActive(i)} className={`w-full text-left px-4 py-3 hover:bg-zinc-50 transition-colors ${i === active ? 'bg-blue-50' : ''}`}>
                            <div className="flex items-start gap-2.5">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${i === active ? 'bg-blue-600 text-white' : 'bg-zinc-200 text-zinc-600'}`}>
                                    {c.contact[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm ${c.unread ? 'font-bold text-zinc-900' : 'font-medium text-zinc-700'}`}>{c.contact}</span>
                                        <span className="text-[10px] text-zinc-400">{c.time}</span>
                                    </div>
                                    <div className="text-xs text-zinc-400 truncate mt-0.5">{c.last}</div>
                                </div>
                                {c.unread && <div className="h-2 w-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right Pane - Conversation Thread */}
            <div className="flex-1 flex flex-col bg-zinc-50">
                <div className="border-b border-zinc-200 bg-white px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">{current.contact[0]}</div>
                        <div>
                            <div className="text-sm font-bold text-zinc-900">{current.contact}</div>
                            <div className="text-xs text-zinc-500">{current.company}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-7 text-xs border-zinc-200 gap-1.5"><Phone className="h-3.5 w-3.5" /> Call</Button>
                        <Button variant="outline" className="h-7 text-xs border-zinc-200 gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</Button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    <div className="flex justify-start">
                        <div className="max-w-xs rounded-2xl rounded-tl-sm bg-white border border-zinc-200 px-4 py-2.5 text-sm text-zinc-800 shadow-sm">{current.last}</div>
                    </div>
                    <div className="flex justify-end">
                        <div className="max-w-xs rounded-2xl rounded-tr-sm bg-zinc-900 px-4 py-2.5 text-sm text-white">Thanks for reaching out! Let me know a good time to connect.</div>
                    </div>
                </div>

                {/* Reply Box */}
                <div className="border-t border-zinc-200 bg-white p-3">
                    <textarea placeholder="Type a reply..." rows={3} className="w-full rounded-lg border border-zinc-200 p-3 text-sm focus:outline-none focus:border-zinc-300 resize-none" />
                    <div className="flex justify-end mt-2">
                        <Button className="h-8 bg-zinc-900 text-white text-sm px-4">Send</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
