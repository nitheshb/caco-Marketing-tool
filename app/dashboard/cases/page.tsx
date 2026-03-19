'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessagesSquare, Inbox, ArrowRight } from 'lucide-react';

export default function CasesPage() {
    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-300">
            <div>
                <h1 className="text-2xl font-bold text-zinc-900">Cases</h1>
                <p className="text-sm text-zinc-500 mt-1">
                    Manage support or review cases that need follow-up.
                </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-zinc-100 text-zinc-600 flex items-center justify-center">
                    <MessagesSquare className="h-7 w-7" />
                </div>
                <h2 className="mt-4 text-xl font-bold text-zinc-900">No open cases</h2>
                <p className="mt-2 text-sm text-zinc-500 max-w-md mx-auto">
                    You're all caught up for now. When a new case needs attention, it will appear here.
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                    <Link href="/dashboard/emails">
                        <Button className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold">
                            <Inbox className="h-4 w-4 mr-2" />
                            Open Messages
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="outline" className="rounded-xl font-bold">
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
