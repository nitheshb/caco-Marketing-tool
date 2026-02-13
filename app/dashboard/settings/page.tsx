'use client';

import { useState, useEffect, Suspense } from 'react';
import { useUser, useClerk } from "@clerk/nextjs";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { usePlanLimits } from '@/hooks/use-plan-limits';
import { UpgradeModal } from '@/components/dashboard/upgrade-modal';
import {
    Youtube,
    Instagram,
    Trash2,
    Link2,
    Unlink,
    ExternalLink,
    AlertTriangle,
    CheckCircle2,
    ShieldAlert,
    Zap,
    Loader2
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Image from "next/image";

interface SocialAccount {
    platform: 'youtube' | 'instagram' | 'tiktok';
    connected: boolean;
    name?: string;
}

function SettingsForm() {
    const { user } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const { isPlatformAllowed, currentPlan, limits } = usePlanLimits();
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    const [isDeleting, setIsDeleting] = useState(false);

    // Handle OAuth callback feedback
    useEffect(() => {
        const connected = searchParams.get('connected');
        const error = searchParams.get('error');

        if (connected) {
            toast.success(`Successfully connected to ${connected}!`);
            router.replace(pathname);
        }

        if (error) {
            if (error === 'suspended') {
                toast.error("Your YouTube account is suspended. Google doesn't allow suspended accounts to use this API.", {
                    duration: 6000,
                });
            } else if (error === 'invalid_grant' || error === 'facebook_token' || error === 'tiktok_token') {
                toast.error("The authorization session expired or failed. Please try connecting again.");
            } else if (error === 'no_instagram_linked') {
                toast.error("No Instagram Business account found linked to your Facebook Pages. Please ensure you have a professional account linked.", {
                    duration: 6000,
                });
            } else {
                toast.error("An error occurred while connecting your account. Please try again.");
            }
            router.replace(pathname);
        }
    }, [searchParams, pathname, router]);

    // Placeholder states for social accounts
    const [accounts, setAccounts] = useState<SocialAccount[]>([
        { platform: 'youtube', connected: false },
        { platform: 'instagram', connected: false },
        { platform: 'tiktok', connected: false },
    ]);

    const [isLoading, setIsLoading] = useState(true);

    const fetchConnections = async () => {
        try {
            const response = await fetch('/api/settings/social');
            if (response.ok) {
                const data = await response.json();
                setAccounts(prev => prev.map(acc => {
                    const found = data.find((d: any) => d.platform === acc.platform);
                    return found ? { ...acc, connected: true, name: found.profile_name } : { ...acc, connected: false, name: undefined };
                }));
            }
        } catch (error) {
            console.error("Failed to fetch connections:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchConnections();
    }, []);

    const handleConnect = async (platform: string) => {
        if (!isPlatformAllowed(platform)) {
            setIsUpgradeModalOpen(true);
            return;
        }

        if (platform === 'youtube') {
            window.location.href = '/api/settings/social/connect/youtube';
            return;
        }

        if (platform === 'instagram') {
            window.location.href = '/api/settings/social/connect/instagram';
            return;
        }

        if (platform === 'tiktok') {
            window.location.href = '/api/settings/social/connect/tiktok';
            return;
        }

        const name = `Connected ${platform.charAt(0).toUpperCase() + platform.slice(1)} Account`;

        try {
            const response = await fetch('/api/settings/social', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ platform, name })
            });

            if (response.ok) {
                setAccounts(prev => prev.map(acc =>
                    acc.platform === platform ? { ...acc, connected: true, name } : acc
                ));
                toast.success(`Connected to ${platform}`);
            } else {
                toast.error(`Failed to connect to ${platform}`);
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        }
    };

    const handleDisconnect = async (platform: string) => {
        try {
            const response = await fetch('/api/settings/social', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ platform })
            });

            if (response.ok) {
                setAccounts(prev => prev.map(acc =>
                    acc.platform === platform ? { ...acc, connected: false, name: undefined } : acc
                ));
                toast.success(`Disconnected from ${platform}`);
            } else {
                toast.error(`Failed to disconnect from ${platform}`);
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch('/api/settings/account/delete', {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete account');
            }

            toast.success('Account and data deleted successfully');

            setTimeout(() => {
                signOut();
            }, 1000);
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete account. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-3xl font-black tracking-tight text-zinc-900 mt-2">Settings</h1>
                <p className="text-zinc-500 font-medium">Manage your profile, social connections, and account security.</p>
            </div>

            {/* Profile Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-xl font-bold text-zinc-900">Profile Information</h2>
                </div>
                <Card className="border-zinc-200/60 shadow-sm bg-white overflow-hidden">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                            <div className="relative group">
                                <div className="h-24 w-24 rounded-2xl overflow-hidden ring-4 ring-indigo-50 transition-all group-hover:ring-indigo-100">
                                    <Image
                                        src={user?.imageUrl || "/placeholder-user.png"}
                                        alt="Profile"
                                        width={96}
                                        height={96}
                                        className="object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-lg shadow-md border border-zinc-100">
                                    <Badge className="bg-indigo-600 text-[10px] uppercase font-black tracking-tighter">Pro</Badge>
                                </div>
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                <div className="space-y-1.5">
                                    <Label className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Full Name</Label>
                                    <Input value={user?.fullName || ""} disabled className="bg-zinc-50 border-zinc-200 font-medium" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Email Address</Label>
                                    <Input value={user?.primaryEmailAddress?.emailAddress || ""} disabled className="bg-zinc-50 border-zinc-200 font-medium" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Social Integrations Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Link2 className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-xl font-bold text-zinc-900">Social Media Connections</h2>
                </div>
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[250px] rounded-2xl bg-zinc-100/50" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* YouTube */}
                        <SocialPlatformCard
                            platform="youtube"
                            Icon={Youtube}
                            color="text-red-600"
                            bgColor="bg-red-50"
                            account={accounts.find(a => a.platform === 'youtube')}
                            onConnect={() => handleConnect('youtube')}
                            onDisconnect={() => handleDisconnect('youtube')}
                        />

                        {/* Instagram */}
                        <SocialPlatformCard
                            platform="instagram"
                            Icon={Instagram}
                            color="text-pink-600"
                            bgColor="bg-pink-50"
                            account={accounts.find(a => a.platform === 'instagram')}
                            onConnect={() => handleConnect('instagram')}
                            onDisconnect={() => handleDisconnect('instagram')}
                        />

                        {/* TikTok (Custom Placeholder for now) */}
                        <SocialPlatformCard
                            platform="tiktok"
                            Icon={({ className }: any) => (
                                <div className={className}>
                                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
                                    </svg>
                                </div>
                            )}
                            color="text-zinc-900"
                            bgColor="bg-zinc-100"
                            account={accounts.find(a => a.platform === 'tiktok')}
                            onConnect={() => handleConnect('tiktok')}
                            onDisconnect={() => handleDisconnect('tiktok')}
                        />
                    </div>
                )}
                {currentPlan === 'free_user' && (
                    <div className="mt-6 rounded-xl bg-indigo-50 border border-indigo-100 p-4">
                        <p className="text-sm text-indigo-700 font-medium flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            Upgrade to Unlimited to connect Instagram and TikTok accounts and automate your entire social workflow!
                        </p>
                    </div>
                )}
            </section>

            {/* Danger Zone */}
            <section className="space-y-4 pt-4 border-t border-zinc-100">
                <div className="flex items-center gap-2 mb-2 text-rose-600 font-bold">
                    <ShieldAlert className="h-5 w-5" />
                    <h2 className="text-xl">Danger Zone</h2>
                </div>
                <Card className="border-rose-200 bg-rose-50/30 overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-lg text-rose-900">Delete Account</CardTitle>
                        <CardDescription className="text-rose-700/70">
                            Permanently delete your account, your series, and all generated videos. This action is irreversible.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="bg-rose-100/30 py-4 px-6">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="bg-rose-600 hover:bg-rose-700 font-bold px-8 shadow-md">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete My Account
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-2xl border-rose-100">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-rose-900">Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete your account and remove all your data from our servers.
                                        All your active video series will be terminated immediately.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteAccount}
                                        disabled={isDeleting}
                                        className="bg-rose-600 hover:bg-rose-700 rounded-xl"
                                    >
                                        Delete Forever
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                </Card>
            </section>

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                title="Unlock More Platforms"
                description={`Connecting to Instagram & TikTok is a premium feature. Upgrade to Unlimited to access all social integrations!`}
            />
        </div>
    );
}

function SocialPlatformCard({ platform, Icon, color, bgColor, account, onConnect, onDisconnect }: any) {
    return (
        <Card className="border-zinc-200/60 shadow-sm bg-white group hover:shadow-md transition-all duration-300">
            <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`p-4 rounded-2xl ${bgColor} ${color} transition-transform group-hover:scale-110 duration-300`}>
                        <Icon className="h-10 w-10" />
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-zinc-900 capitalize">{platform}</h3>
                            {platform !== 'youtube' && (
                                <Badge className="bg-amber-50 text-amber-700 border-amber-100 text-[10px] h-5 px-1.5 font-black uppercase tracking-tighter">Pro</Badge>
                            )}
                        </div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400 mt-1">
                            {account?.connected ? "Connected" : "Disconnected"}
                        </p>
                    </div>
                    {account?.connected ? (
                        <div className="w-full space-y-3">
                            <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-[11px] font-medium text-zinc-600 truncate">
                                {account.name}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full rounded-xl border-rose-100 text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                                onClick={onDisconnect}
                            >
                                <Unlink className="mr-2 h-3.5 w-3.5" />
                                Disconnect
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="default"
                            size="sm"
                            className="w-full rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold transition-transform active:scale-95 shadow-sm"
                            onClick={onConnect}
                        >
                            <ExternalLink className="mr-2 h-3.5 w-3.5" />
                            Connect Account
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default function SettingsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-64 flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                <p className="text-zinc-500 font-medium">Loading settings...</p>
            </div>
        }>
            <SettingsForm />
        </Suspense>
    );
}
