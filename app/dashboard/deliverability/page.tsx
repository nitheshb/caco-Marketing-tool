'use client';

import { Button } from "@/components/ui/button";
import { Shield, CheckCircle2, AlertCircle, XCircle, RefreshCw, Mail, Settings } from "lucide-react";

const checks = [
    { name: 'SPF Record', status: 'pass', detail: 'Your SPF record is correctly configured', domain: 'yourdomain.com' },
    { name: 'DKIM Signing', status: 'pass', detail: 'Email signing is active and verified', domain: 'yourdomain.com' },
    { name: 'DMARC Policy', status: 'warning', detail: 'DMARC policy is set to "none" — consider tightening to "quarantine"', domain: 'yourdomain.com' },
    { name: 'MX Records', status: 'pass', detail: 'MX records are correctly configured', domain: 'yourdomain.com' },
    { name: 'Reverse DNS', status: 'fail', detail: 'PTR record not found for sending IP', domain: 'mail.yourdomain.com' },
    { name: 'Blacklist Check', status: 'pass', detail: 'Not found on any major email blacklists', domain: 'yourdomain.com' },
];

const statusConfig = {
    pass: { icon: <CheckCircle2 className="h-5 w-5 text-green-600" />, label: 'Pass', color: 'bg-green-50 text-green-700 border-green-200' },
    warning: { icon: <AlertCircle className="h-5 w-5 text-yellow-500" />, label: 'Warning', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    fail: { icon: <XCircle className="h-5 w-5 text-red-500" />, label: 'Fail', color: 'bg-red-50 text-red-700 border-red-200' },
};

const score = 78;

export default function DeliverabilityPage() {
    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-zinc-900">Deliverability Suite</h1>
                    <p className="text-sm text-zinc-500 mt-0.5">Monitor and improve your email sending reputation and inbox placement</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-8 text-sm gap-2 border-zinc-200">
                        <RefreshCw className="h-4 w-4" /> Run New Test
                    </Button>
                    <Button className="h-8 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm gap-2">
                        <Settings className="h-4 w-4" /> Configure Domain
                    </Button>
                </div>
            </div>

            {/* Score Card */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm flex items-center gap-8">
                <div className="relative">
                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#f4f4f5" strokeWidth="12" />
                        <circle cx="50" cy="50" r="40" fill="none"
                            stroke={score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626'}
                            strokeWidth="12" strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 40 * score / 100} ${2 * Math.PI * 40 * (1 - score / 100)}`} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center rotate-0">
                        <div className="text-center">
                            <div className="text-3xl font-black text-zinc-900">{score}</div>
                            <div className="text-[10px] text-zinc-400 font-medium">/100</div>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-zinc-900 mb-1">
                        {score >= 80 ? '🟢 Good Deliverability' : score >= 60 ? '🟡 Needs Attention' : '🔴 Poor Deliverability'}
                    </h2>
                    <p className="text-sm text-zinc-500 max-w-md">Your email deliverability score is above average but you have some issues to address. Fix the failing checks to improve inbox placement rates.</p>
                    <div className="flex items-center gap-4 mt-3 text-xs">
                        <span className="flex items-center gap-1 text-green-700 font-medium"><CheckCircle2 className="h-3.5 w-3.5" />4 Passed</span>
                        <span className="flex items-center gap-1 text-yellow-600 font-medium"><AlertCircle className="h-3.5 w-3.5" />1 Warning</span>
                        <span className="flex items-center gap-1 text-red-600 font-medium"><XCircle className="h-3.5 w-3.5" />1 Failed</span>
                    </div>
                </div>
            </div>

            {/* Checks List */}
            <div>
                <h2 className="text-sm font-bold text-zinc-900 mb-3">Authentication Checks</h2>
                <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm divide-y divide-zinc-100">
                    {checks.map((c, i) => {
                        const cfg = statusConfig[c.status as keyof typeof statusConfig];
                        return (
                            <div key={i} className="flex items-center gap-4 px-4 py-3.5 hover:bg-zinc-50 transition-colors">
                                <div className="flex-shrink-0">{cfg.icon}</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-zinc-900 text-sm">{c.name}</span>
                                        <span className="text-xs text-zinc-400">{c.domain}</span>
                                    </div>
                                    <p className="text-xs text-zinc-500 mt-0.5">{c.detail}</p>
                                </div>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cfg.color}`}>{cfg.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Tips */}
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-5">
                <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className="text-sm font-bold text-blue-900">💡 Quick Win: Fix Your Reverse DNS</h3>
                        <p className="text-sm text-blue-700 mt-1">Contact your email hosting provider to set up a PTR record for your sending IP. This is one of the most impactful fixes for inbox placement.</p>
                        <Button className="h-7 mt-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4">Learn How</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
