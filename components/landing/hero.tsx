'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { app } from "@/lib/firebase";
import Link from "next/link";

export function Hero() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const auth = getAuth(app);
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setIsLoaded(true);
        });
        return () => unsub();
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-50 pt-16">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-multiply" />
                <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-multiply" />
            </div>

            <div className="container relative z-10 px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-1.5 text-sm font-medium text-indigo-700 backdrop-blur-sm">
                        <Sparkles className="h-4 w-4" />
                        <span>AI-Powered Video Generation</span>
                    </div>

                    <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-zinc-900 sm:text-7xl">
                        The AI Strategy platform <br />
                        <span className="bg-linear-to-r text-6xl from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            for smarter, faster revenue growth
                        </span>
                    </h1>

                    <p className="max-w-2xl text-lg text-zinc-600 sm:text-xl">
                        Create engaging shorts for YouTube, Instagram, and TikTok in seconds.
                        Automate your content calendar with our intelligent scheduler.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                        {isLoaded && !user && (
                            <Link href="/sign-up">
                                <Button size="lg" className="h-12 px-8 text-base bg-white text-black hover:bg-zinc-200 transition-all hover:scale-105">
                                    Start Creating for Free
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                        {isLoaded && user && (
                            <Link href="/dashboard">
                                <Button size="lg" className="h-12 px-8 text-base bg-white text-black hover:bg-zinc-200 transition-all hover:scale-105">
                                    Go to Dashboard
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-12 px-8 text-base border-black/10 text-zinc-900 bg-black/5 hover:bg-black/10"
                        >
                            <Play className="mr-2 h-4 w-4" />
                            Watch Demo
                        </Button>
                    </div>

                    {/* Social Proof / Platforms */}
                    <div className="pt-12 flex flex-col items-center gap-4">
                        <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
                            Trusted by creators on
                        </p>
                        <div className="flex items-center gap-8 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                            <span className="text-xl font-bold text-zinc-900">YouTube Shorts</span>
                            <span className="text-xl font-bold text-zinc-900">Instagram Reels</span>
                            <span className="text-xl font-bold text-zinc-900">TikTok</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
