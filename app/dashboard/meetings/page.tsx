'use client';

import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, Calendar } from "lucide-react";

export default function MeetingsPage() {
    return (
        <div className="flex flex-col h-full">
            {/* Warning Banner */}
            <div className="bg-orange-50 border-b border-orange-200 px-6 py-2.5 flex items-center gap-2 flex-shrink-0">
                <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <p className="text-[13px] text-orange-800">
                    You have no mailboxes linked. Please connect your email account to start managing and sending emails via Apollo.{" "}
                    <a href="#" className="underline font-semibold hover:text-orange-900">Link mailbox</a>
                </p>
            </div>

            {/* Hero Two-column Layout */}
            <div className="flex flex-1 min-h-0 overflow-y-auto">
                {/* Left: Graphics / Calendar mockup */}
                <div className="w-1/2 bg-gradient-to-br from-purple-100 via-purple-50 to-blue-50 flex items-center justify-center p-10 relative overflow-hidden">
                    <div className="w-full max-w-md space-y-4 relative z-10">
                        {/* Calendar Card */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <div className="flex gap-6">
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-zinc-700 mb-4 flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-zinc-400" /> 
                                        Select date
                                    </p>
                                    <p className="text-center text-sm font-semibold text-zinc-800 mb-3">January 2025</p>
                                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-2">
                                        {['S','M','T','W','T','F','S'].map((d,i) => <div key={i}>{d}</div>)}
                                    </div>
                                    <div className="grid grid-cols-7 gap-y-1 text-center text-[11px] text-zinc-600">
                                        <div></div><div></div><div></div>
                                        <div className="py-1">1</div><div className="py-1">2</div><div className="py-1">3</div><div className="py-1">4</div>
                                        <div className="py-1">5</div><div className="py-1">6</div><div className="py-1">7</div><div className="py-1">8</div><div className="py-1">9</div><div className="py-1">10</div><div className="py-1">11</div>
                                        <div className="py-1">12</div><div className="py-1">13</div><div className="py-1">14</div><div className="py-1">15</div><div className="py-1">16</div><div className="py-1">17</div><div className="py-1">18</div>
                                        <div className="py-1">19</div><div className="py-1">20</div><div className="py-1">21</div>
                                        <div className="bg-blue-600 text-white rounded-full py-1 font-bold">22</div>
                                        <div className="bg-blue-50 text-blue-600 rounded-full py-1 font-bold">23</div>
                                        <div className="py-1">24</div><div className="py-1">25</div>
                                        <div className="py-1">26</div><div className="py-1">27</div><div className="py-1">28</div><div className="py-1">29</div><div className="py-1">30</div><div className="py-1">31</div>
                                    </div>
                                </div>
                                <div className="w-[110px] border-l border-zinc-100 pl-5">
                                    <p className="text-sm font-semibold text-zinc-700 mb-4">Select time</p>
                                    <div className="space-y-2 text-center">
                                        <div className="text-xs font-medium text-zinc-500 py-2 border border-zinc-200 rounded-lg">10:15 AM</div>
                                        <div className="text-xs font-bold text-blue-600 py-2 border-2 border-blue-500 bg-blue-50 rounded-lg">11:00 AM</div>
                                        <div className="text-xs font-medium text-zinc-500 py-2 border border-zinc-200 rounded-lg">03:30 PM</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Meetings table mockup */}
                        <div className="bg-white rounded-2xl shadow-xl p-4">
                            <div className="flex gap-4 border-b border-zinc-100 pb-3 mb-3">
                                <span className="text-xs font-bold text-zinc-900 border-b-2 border-zinc-900 pb-1">Upcoming</span>
                                <span className="text-xs font-medium text-zinc-400">Past</span>
                            </div>
                            <div className="space-y-2">
                                {[
                                    { name: 'Intro Call - John', date: '01/22/24', time: '11:00 - 11:30 AM', badge: 'Insights', color: 'bg-blue-100 text-blue-700' },
                                    { name: 'Product Demo - Sarah', date: '01/23/24', time: '10:00 - 11:30 AM', badge: 'Insights', color: 'bg-green-100 text-green-700' },
                                    { name: 'Discovery call', date: '03/24', time: '10:00 - 11:00 AM', badge: 'No-showed', color: 'bg-red-100 text-red-700' },
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center gap-3 text-xs py-1">
                                        <div className="flex-1 font-medium text-zinc-800 truncate">{row.name}</div>
                                        <div className="text-zinc-400">{row.date}</div>
                                        <div className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${row.color}`}>{row.badge}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Decorative bg blob */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
                </div>

                {/* Right: Copy + CTA */}
                <div className="w-1/2 flex flex-col justify-center p-14">
                    <div className="max-w-md">
                        <h2 className="text-[28px] leading-[1.25] font-extrabold text-zinc-900 mb-6">
                            Simplify scheduling and run more effective meetings
                        </h2>
                        <p className="text-sm font-bold text-zinc-800 mb-3">Works with conferencing apps</p>
                        <div className="flex items-center gap-2 mb-7">
                            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M4.5 7h15a2 2 0 012 2v6a2 2 0 01-2 2h-15a2 2 0 01-2-2V9a2 2 0 012-2zm12 3v4l4 3V7l-4 3z" /></svg>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-white border border-zinc-200 shadow-sm flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-4 h-4 text-green-600" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-[#464eb8] flex items-center justify-center text-white text-xs font-bold">T</div>
                        </div>
                        <ul className="space-y-3 mb-8">
                            {[
                                "Let customers easily book meetings through your booking link",
                                "Get AI-powered insights to prep for upcoming meetings",
                                "Link meetings to contacts and accounts to view history in one place"
                            ].map((text, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-[14px] text-zinc-700 leading-relaxed">{text}</span>
                                </li>
                            ))}
                        </ul>
                        <Button className="h-10 bg-yellow-300 hover:bg-yellow-400 text-zinc-900 font-bold px-6 rounded text-sm">
                            Connect calendar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
