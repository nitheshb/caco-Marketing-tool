'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Zap, Crown } from "lucide-react";
import { useRouter } from "next/navigation";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
}

export function UpgradeModal({
    isOpen,
    onClose,
    title = "Upgrade Your Plan",
    description = "You've reached the limit of your current plan. Upgrade to unlock more features and generations."
}: UpgradeModalProps) {
    const router = useRouter();

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="max-w-md rounded-2xl border-indigo-100 shadow-2xl">
                <AlertDialogHeader className="items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
                        <Crown className="h-8 w-8" />
                    </div>
                    <AlertDialogTitle className="text-2xl font-black tracking-tight text-zinc-900">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base text-zinc-500">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="my-6 space-y-4 rounded-xl bg-zinc-50 p-4 border border-zinc-100">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-indigo-100 p-1">
                            <Zap className="h-3 w-3 text-indigo-600" />
                        </div>
                        <p className="text-sm font-medium text-zinc-700">Unlock unlimited series creation</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-indigo-100 p-1">
                            <Zap className="h-3 w-3 text-indigo-600" />
                        </div>
                        <p className="text-sm font-medium text-zinc-700">Connect Instagram & TikTok accounts</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-indigo-100 p-1">
                            <Zap className="h-3 w-3 text-indigo-600" />
                        </div>
                        <p className="text-sm font-medium text-zinc-700">Prioritized high-speed rendering</p>
                    </div>
                </div>
                <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
                    <AlertDialogAction
                        onClick={() => router.push('/dashboard/billing')}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 shadow-lg shadow-indigo-200"
                    >
                        Go to Billing
                    </AlertDialogAction>
                    <AlertDialogCancel className="w-full border-none text-zinc-400 hover:text-zinc-600 hover:bg-transparent">
                        Maybe later
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
