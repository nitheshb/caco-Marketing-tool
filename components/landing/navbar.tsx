'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Video, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export function Navbar() {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth(app);
        const unsub = onAuthStateChanged(auth, (user) => {
            setIsSignedIn(!!user);
        });
        return () => unsub();
    }, []);

    const handleSignOut = async () => {
        const auth = getAuth(app);
        await signOut(auth);
        document.cookie = '__session=; path=/; max-age=0';
        router.push('/');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-black/10 bg-white/70 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 overflow-hidden">
                        <Image src="/logo.png" alt="Agent Elephant Logo" width={32} height={32} className="object-cover scale-125" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-zinc-900">
                        Agent Elephant
                    </span>
                </Link>
                <div className="hidden items-center gap-8 md:flex">
                    <Link href="#features" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900">Features</Link>
                    <Link href="#pricing" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900">Pricing</Link>
                    <Link href="/docs" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900">Docs</Link>
                    <Link href="#about" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900">About</Link>
                </div>
                <div className="flex items-center gap-4">
                    {!isSignedIn ? (
                        <>
                            <Link href="/sign-in">
                                <Button variant="ghost" className="hidden text-zinc-700 hover:text-zinc-900 hover:bg-black/5 sm:flex">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/sign-up">
                                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white border-0 shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]">
                                    Get Started
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/dashboard">
                                <Button variant="ghost" className="text-zinc-700 hover:text-zinc-900 hover:bg-black/5">
                                    Dashboard
                                </Button>
                            </Link>
                            <button onClick={handleSignOut} className="flex items-center gap-1.5 text-sm text-zinc-700 hover:text-zinc-900 transition-colors">
                                <LogOut className="h-4 w-4" />
                                Sign out
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
