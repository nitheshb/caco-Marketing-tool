import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                        <Video className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">
                        VidMaxx
                    </span>
                </Link>
                <div className="hidden items-center gap-8 md:flex">
                    <Link
                        href="#features"
                        className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                    >
                        Features
                    </Link>
                    <Link
                        href="#pricing"
                        className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                    >
                        Pricing
                    </Link>
                    <Link
                        href="#about"
                        className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                    >
                        About
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <SignedOut>
                        <Link href="/sign-in">
                            <Button
                                variant="ghost"
                                className="hidden text-zinc-400 hover:text-white hover:bg-white/5 sm:flex"
                            >
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/sign-up">
                            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white border-0 shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]">
                                Get Started
                            </Button>
                        </Link>
                    </SignedOut>
                    <SignedIn>
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-white/5">
                                Dashboard
                            </Button>
                        </Link>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </div>
            </div>
        </nav>
    );
}
