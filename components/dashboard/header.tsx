'use client';

import { UserButton } from "@clerk/nextjs";

export function Header() {
    return (
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-8 shadow-sm">
            <div className="flex items-center gap-4">
                {/* Placeholder for future breadcrumbs or title */}
                <span className="text-zinc-400 text-sm font-medium">Dashboard</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="h-9 w-9 flex items-center justify-center rounded-full bg-zinc-100 ring-2 ring-white shadow-sm">
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "h-9 w-9"
                            }
                        }}
                    />
                </div>
            </div>
        </header>
    );
}
