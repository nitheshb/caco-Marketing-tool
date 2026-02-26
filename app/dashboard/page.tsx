'use client';

import { Button } from "@/components/ui/button";
import { Sparkles, Activity } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<'setup' | 'recommendations'>('setup');

    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="max-w-5xl mx-auto space-y-8 font-sans">
            {/* Header Area */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
                    Welcome, Prajjwal 👋
                </h1>
                <Button variant="outline" className="gap-2 bg-white h-9 shadow-sm border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-medium">
                    <Activity className="h-4 w-4 text-zinc-500" />
                    Getting started
                </Button>
            </div>

            {/* Next steps section */}
            <div className="space-y-4">
                <h2 className="text-[17px] font-bold text-zinc-900">Next steps for you</h2>
                <p className="text-sm text-zinc-600">Explore recommended actions to build on your setup and unlock more value</p>

                <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
                    {/* Tabs */}
                    <div className="flex items-center justify-between border-b border-zinc-100 px-6 pt-4">
                        <div className="flex gap-6">
                            <button
                                onClick={() => setActiveTab('setup')}
                                className={cn(
                                    "pb-3 text-[13px] font-medium transition-colors relative",
                                    activeTab === 'setup' ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
                                )}
                            >
                                Workspace setup <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-600">2</span>
                                {activeTab === 'setup' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 rounded-t-full" />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('recommendations')}
                                className={cn(
                                    "pb-3 text-[13px] font-medium transition-colors relative",
                                    activeTab === 'recommendations' ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
                                )}
                            >
                                Recommendations
                                {activeTab === 'recommendations' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 rounded-t-full" />
                                )}
                            </button>
                        </div>
                        <div className="flex items-center gap-2 pb-3">
                            <div className="relative inline-flex h-4 w-7 cursor-pointer items-center rounded-full bg-zinc-800 transition-colors">
                                <span className="inline-block h-3 w-3 translate-x-3.5 rounded-full bg-white transition-transform" />
                            </div>
                            <span className="text-[13px] font-medium text-zinc-600">Hide completed</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4 bg-zinc-50/50">
                        {/* Setup Essentials Accordion Item */}
                        <div className="rounded-lg border border-zinc-200 bg-white shadow-sm overflow-hidden">
                            <div className="flex w-full items-center justify-between p-4 bg-white">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="h-5 w-5 text-zinc-500" />
                                    <span className="text-[15px] font-bold text-zinc-900">Set up essentials to work smarter in Apollo</span>
                                </div>
                                <div className="flex items-center gap-0">
                                    <Button className="h-8 rounded-l-md rounded-r-none border-r border-yellow-500 bg-yellow-300 px-6 text-[13px] font-bold text-zinc-900 hover:bg-yellow-400">
                                        Start
                                    </Button>
                                    <Button className="h-8 w-8 rounded-l-none rounded-r-md bg-yellow-300 p-0 text-zinc-900 hover:bg-yellow-400 items-center justify-center">
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                            
                            {/* Expanded Content Area */}
                            <div className="border-t border-zinc-100 p-6 bg-white pl-[52px]">
                                <h3 className="text-[15px] font-bold text-zinc-900 mb-5">Get started with the basics</h3>
                                
                                <div className="relative border-l border-zinc-200 ml-[5px] pl-6 space-y-8 pb-2">
                                    {/* Item 1 */}
                                    <div className="relative">
                                        <div className="absolute -left-[30px] top-1 h-[9px] w-[9px] rounded-sm border-2 border-zinc-300 bg-white" />
                                        <div className="space-y-1">
                                            <h4 className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase">Connect mailbox</h4>
                                            <p className="text-[13px] text-zinc-500">Use Apollo to send, track, and schedule emails from your connected mailbox</p>
                                        </div>
                                    </div>
                                    {/* Item 2 */}
                                    <div className="relative">
                                        <div className="absolute -left-[30px] top-1 h-[9px] w-[9px] rounded-sm border-2 border-zinc-300 bg-white" />
                                        <div className="space-y-1">
                                            <h4 className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase">Download the chrome extension</h4>
                                            <p className="text-[13px] text-zinc-500">Prospect anywhere by bringing Apollo into the tools you use every day</p>
                                        </div>
                                        
                                        <div className="mt-4 flex gap-3">
                                            <Button className="h-8 bg-zinc-800 px-6 text-[13px] font-medium text-white hover:bg-zinc-900">Start</Button>
                                            <Button variant="outline" className="h-8 px-4 text-[13px] font-medium text-zinc-700 bg-white hover:bg-zinc-50">Not interested</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Keep deals moving Accordion Item */}
                        <div className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 shadow-sm hover:bg-zinc-50 cursor-pointer transition-colors">
                            <div className="flex items-center gap-3">
                                <Activity className="h-5 w-5 text-zinc-500" />
                                <span className="text-[15px] font-bold text-zinc-900">Keep your deals moving with enriched data</span>
                            </div>
                            <div className="flex items-center gap-0">
                                <Button variant="outline" className="h-8 rounded-l-md rounded-r-none border-zinc-200 bg-white px-6 text-[13px] font-bold text-zinc-700 hover:bg-zinc-50">
                                    Start
                                </Button>
                                <Button variant="outline" className="h-8 w-8 rounded-l-none rounded-r-md border-l-0 border-zinc-200 bg-white p-0 text-zinc-700 hover:bg-zinc-50 items-center justify-center">
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Card Section */}
            <div className="pt-8">
                <h2 className="text-[17px] font-bold text-zinc-900 mb-4">Start strong with expert-built Plays and guided training</h2>
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                            <svg className="h-4 w-4 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-[15px] font-bold text-zinc-900">Proven GTM Plays to get you started</span>
                    </div>

                    {/* Cards Grid placeholder */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="h-40 rounded-lg bg-[#e1eafe] border border-zinc-100 flex items-center justify-center overflow-hidden">
                            {/* Paper airplane svg placeholder */}
                            <svg className="w-24 h-24 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                        </div>
                        <div className="h-40 rounded-lg bg-[#dbe2fa] border border-zinc-100 flex items-center justify-center overflow-hidden">
                            {/* Magnifying glass svg placeholder */}
                            <svg className="w-24 h-24 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <div className="h-40 rounded-lg bg-[#eedcca] border border-zinc-100 flex items-center justify-center overflow-hidden">
                             {/* User spy svg placeholder */}
                             <svg className="w-24 h-24 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                        </div>
                        <div className="h-40 rounded-lg bg-[#fae8ff] border border-zinc-100 flex items-center justify-center overflow-hidden">
                            {/* Lightbulb svg placeholder */}
                            <svg className="w-24 h-24 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Help Button (Fixed bottom right) */}
            <div className="fixed bottom-6 right-6">
                <button className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-lg hover:bg-zinc-800 transition-colors">
                    <span className="text-xl font-bold">?</span>
                </button>
            </div>
        </div>
        </div>
    );
}
