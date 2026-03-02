'use client';

import { useAuth } from "@/lib/auth-context";
import { LogOut, User } from "lucide-react";
import Link from "next/link";

export function Header() {
    const { user, signOut } = useAuth();

    return (
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-8 shadow-sm">
            <div className="flex items-center gap-4">
                <span className="text-zinc-400 text-sm font-medium">Dashboard</span>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100">
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
