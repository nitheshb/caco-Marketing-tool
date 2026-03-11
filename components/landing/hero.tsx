'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { app } from "@/lib/firebase";
import Link from "next/link";

const metrics = [
    { value: "10k+", label: "Strategies Created" },
    { value: "4.9", label: "Avg. rating" },
    { value: "50k+", label: "Postings done" },
    { value: "99.9%", label: "Uptime" },
];

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
        <section className="relative overflow-hidden bg-zinc-50 landing-grain">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl pointer-events-none">
                <div className="absolute -top-40 -left-20 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-[140px] opacity-60" />
                <div className="absolute top-60 -right-40 w-[500px] h-[500px] bg-violet-100 rounded-full blur-[140px] opacity-50" />
                <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-rose-100 rounded-full blur-[140px] opacity-30" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-24 pb-16 sm:pt-28 sm:pb-20">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="animate-fade-up text-sm font-bold tracking-widest uppercase text-[#239047] mb-4">
                        Built for creators who mean business
                    </p>

                    <h1 className="animate-fade-up stagger-1 text-[49px] font-medium leading-[1.2] tracking-tight text-zinc-900">
                        The AI e-com marketing platform for
                        <br />
                         smarter, faster revenue growth
                    </h1>

                    <p className="animate-fade-up stagger-2 mt-6 max-w-2xl mx-auto text-base leading-relaxed text-zinc-900">
                        Build smarter strategy, auto AI postings, auto scheduling,
                        <br />
                        with a unified platform built for modern sales and marketing teams.
                    </p>

                    <div className="animate-fade-up stagger-3 mt-10 flex flex-wrap items-center justify-center gap-4">
                        {isLoaded && !user && (
                            <Link href="/sign-up">
                                <Button
                                    size="lg"
                                    className="h-12 px-7 text-[15px] font-medium bg-[#f2d412] hover:bg-[#f2c112] text-zinc-900 rounded-full shadow-lg shadow-[#ebf212]/30 transition-all hover:-translate-y-0.5"
                                >
                                    Get started free
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                        {isLoaded && user && (
                            <Link href="/dashboard">
                                <Button
                                    size="lg"
                                    className="h-12 px-7 text-[15px] font-medium bg-[#f2d412] text-zinc-900 hover:bg-[#f2c112] rounded-full shadow-lg shadow-[#ebf212]/30 transition-all hover:-translate-y-0.5"
                                >
                                    Go to Dashboard
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-12 px-7 text-[15px] font-medium text-zinc-900 hover:text-zinc-900 hover:bg-[#f2c112]/25 border-zinc-300 rounded-full"
                        >
                            <Play className="mr-2 h-4 w-4 fill-current" />
                            Watch demo
                        </Button>
                    </div>
                </div>

                {/* Metrics cards */}
                <div className="animate-fade-up stagger-5 mt-10 flex flex-wrap justify-center gap-3 sm:gap-4">
                    {metrics.map((m) => (
                        <div key={m.label} className="bg-white rounded-xl border border-zinc-200/80 px-6 py-5 shadow-sm min-w-[140px] sm:min-w-[160px] text-center">
                            <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">{m.value}</p>
                            <p className="mt-0.5 text-sm text-zinc-500">{m.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
