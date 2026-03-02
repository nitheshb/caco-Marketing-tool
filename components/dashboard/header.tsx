'use client';

import { useAuth } from "@/lib/auth-context";
import { Search, Sparkles, Command, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
    const { user, signOut } = useAuth();

    return (
        <header className="flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 shrink-0 transition-all font-sans">
            <div className="flex flex-1 items-center max-w-2xl">
                {/* Enhanced Search Bar */}
                <div className="group flex w-full max-w-[240px] items-center gap-1.5 rounded flex-shrink-0 border border-zinc-200 bg-zinc-50 px-2 py-1 transition-all focus-within:border-zinc-300 focus-within:bg-white focus-within:shadow-sm hover:border-zinc-300">
                    <Search className="h-3 w-3 text-zinc-400 group-focus-within:text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search across Apollo..."
                        className="flex-1 bg-transparent text-xs text-zinc-900 placeholder:text-zinc-500 focus:outline-none"
                    />
                    <div className="flex items-center gap-0.5 rounded bg-white border border-zinc-200 px-1 py-0.5 shadow-sm text-[9px] font-medium text-zinc-500">
                        <Command className="h-2.5 w-2.5" />
                        <span>K</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Execute with AI button */}
                <button className="flex items-center gap-2 rounded-full bg-zinc-800 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-900">
                    <Sparkles className="h-3.5 w-3.5 text-zinc-300" />
                    <span>Execute with AI</span>
                </button>

                {/* Additional Badge (Green PR placeholder from screenshot) */}
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-medium text-emerald-800 ring-1 ring-inset ring-emerald-200">
                    PR
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100 ml-1">
                    {user?.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt="Profile"
                            className="h-7 w-7 rounded-full object-cover ring-2 ring-white"
                        />
                    ) : (
                        <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-indigo-600" />
                        </div>
                    )}
                    <span className="text-sm font-medium text-zinc-700 max-w-[150px] truncate">
                        {user?.displayName || user?.email || 'User'}
                    </span>
                </div>
                <button
                    onClick={signOut}
                    className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors"
                    title="Sign out"
                >
                    <LogOut className="h-4 w-4" />
                </button>
            </div>
        </header>
    );
}
