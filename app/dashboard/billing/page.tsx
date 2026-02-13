"use client"
import { PricingTable } from "@clerk/nextjs";
import { CreditCard, Zap, ShieldCheck, Clock, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePlanLimits } from "@/hooks/use-plan-limits";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BillingPage() {
    const { currentPlan, planName, limits, isLoaded } = usePlanLimits();
    const [seriesCount, setSeriesCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsage = async () => {
            try {
                const response = await fetch('/api/series');
                if (response.ok) {
                    const data = await response.json();
                    setSeriesCount(data.length);
                }
            } catch (error) {
                console.error("Error fetching usage:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isLoaded) {
            fetchUsage();
        }
    }, [isLoaded]);

    const usagePercent = limits.maxSeries === Infinity
        ? 100
        : Math.min((seriesCount / limits.maxSeries) * 100, 100);

    return (
        <div className="space-y-10 pb-12 overflow-y-auto">
            {/* Page Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                        <CreditCard className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Billing & Subscription</h1>
                </div>
                <p className="text-zinc-500 text-lg max-w-2xl">
                    Manage your plan, subscription, and billing history. Upgrade your plan to unlock more generations and premium features.
                </p>
            </div>

            {/* Quick Stats / Current Plan Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-zinc-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap className="h-12 w-12 text-indigo-600" />
                    </div>
                    <CardHeader className="pb-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">Current Plan</p>
                        <CardTitle className="text-2xl font-bold text-zinc-900">
                            {planName}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-1 mb-4">
                            <span className="text-3xl font-black text-zinc-900">${limits.price}</span>
                            <span className="text-zinc-400 font-medium pb-1">/month</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                            {isLoading ? (
                                <div className="h-full bg-zinc-200 animate-pulse w-full" />
                            ) : (
                                <div
                                    className="h-full bg-indigo-600 transition-all duration-1000"
                                    style={{ width: `${usagePercent}%` }}
                                />
                            )}
                        </div>
                        <p className="text-xs text-zinc-400 mt-2">
                            {isLoading ? "Fetching usage..." : `${seriesCount} of ${limits.maxSeries === Infinity ? '∞' : limits.maxSeries} monthly series used`}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-zinc-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 mb-1">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Security</p>
                        </div>
                        <CardTitle className="text-xl font-bold text-zinc-900">Verified Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-zinc-500 leading-relaxed"> All transactions are securely processed via Stripe through Clerk Billing infrastructure. </p>
                    </CardContent>
                </Card>

                <Card className="border-zinc-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-indigo-500" />
                            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Next Billing Cycle</p>
                        </div>
                        <CardTitle className="text-xl font-bold text-zinc-900">
                            {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-zinc-500 leading-relaxed"> Your monthly generation quota resets on the {new Date().getDate()}th of every month. </p>
                    </CardContent>
                </Card>
            </div>

            {/* Clerk Pricing Table */}
            <div className="space-y-6">
                <div className="flex flex-col items-center justify-center text-center space-y-3 mb-4">
                    <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-indigo-100 px-4 py-1 text-xs font-bold uppercase tracking-wider">
                        Power Up Your Content
                    </Badge>
                    <h2 className="text-4xl font-black tracking-tight text-zinc-900">Choose the perfect plan</h2>
                    <p className="text-zinc-500 max-w-xl text-lg">
                        Select a plan that fits your content creation needs. All plans include automated scheduling and high-quality AI generations.
                    </p>
                </div>

                <div className="rounded-3xl border border-zinc-200 bg-white p-2 shadow-xl shadow-zinc-200/50">
                    <PricingTable />
                </div>
            </div>

            {/* FAQ / Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                <div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">Can I cancel anytime?</h3>
                    <p className="text-zinc-500">Yes, you can cancel your subscription at any time through this billing portal. You will continue to have access until the end of your billing period.</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">Need help with your plan?</h3>
                    <p className="text-zinc-500">Our support team is always ready to help you choose the right plan for your business needs. Contact us at support@vidmaxx.ai</p>
                </div>
            </div>
        </div>
    );
}
