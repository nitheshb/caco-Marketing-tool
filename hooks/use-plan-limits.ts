'use client';

import { useUser, useAuth } from "@clerk/nextjs";

export type PlanType = 'free_user' | 'basic' | 'unlimited';

// We still keep the mapping for UI/Limits logic that isn't just "has/doesn't have"
export const PLAN_LIMITS = {
    free_user: {
        name: 'Free User',
        price: 0,
        maxSeries: 1,
        maxVideos: 2,
        canExecuteWorkflow: false,
        allowedPlatforms: ['youtube', 'linkedin', 'email'],
    },
    basic: {
        name: 'Basic',
        price: 9.99,
        maxSeries: 3,
        maxVideos: Infinity,
        canExecuteWorkflow: true,
        allowedPlatforms: ['youtube', 'email'],
    },
    unlimited: {
        name: 'Unlimited',
        price: 29.99,
        maxSeries: Infinity,
        maxVideos: Infinity,
        canExecuteWorkflow: true,
        allowedPlatforms: ['youtube', 'linkedin', 'instagram', 'tiktok', 'email'],
    }
};

export function usePlanLimits() {
    const { user, isLoaded: isUserLoaded } = useUser();
    const { has, isLoaded: isAuthLoaded } = useAuth();

    const isLoaded = isUserLoaded && isAuthLoaded;

    // Determine current plan using the official 'has' method
    const isUnlimited = has?.({ plan: 'unlimited' });
    const isBasic = has?.({ plan: 'basic' });

    const currentPlan: PlanType = isUnlimited ? 'unlimited' : isBasic ? 'basic' : 'free_user';
    const limits = PLAN_LIMITS[currentPlan];

    const canCreateSeries = (currentCount: number) => {
        return currentCount < limits.maxSeries;
    };

    const canCreateVideo = (currentCount: number) => {
        return currentCount < limits.maxVideos;
    };

    const isPlatformAllowed = (platform: string) => {
        // Can also use has({ feature: platform }) if defined in Clerk
        return limits.allowedPlatforms.includes(platform.toLowerCase());
    };

    return {
        isLoaded,
        currentPlan,
        planName: limits.name,
        limits,
        canCreateSeries,
        canCreateVideo,
        canExecuteWorkflow: limits.canExecuteWorkflow,
        isPlatformAllowed,
        hasFeature: (feature: string) => has?.({ feature })
    };
}
