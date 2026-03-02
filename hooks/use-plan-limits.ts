'use client';

export type PlanType = 'free_user' | 'basic' | 'unlimited';

export const PLAN_LIMITS = {
    free_user: {
        name: 'Free User',
        price: 0,
        maxSeries: Infinity,
        maxVideos: Infinity,
        canExecuteWorkflow: true,
        allowedPlatforms: ['youtube', 'linkedin', 'instagram', 'tiktok', 'email', 'facebook'],
    },
    basic: {
        name: 'Basic',
        price: 9.99,
        maxSeries: Infinity,
        maxVideos: Infinity,
        canExecuteWorkflow: true,
        allowedPlatforms: ['youtube', 'linkedin', 'instagram', 'tiktok', 'email', 'facebook'],
    },
    unlimited: {
        name: 'Unlimited',
        price: 29.99,
        maxSeries: Infinity,
        maxVideos: Infinity,
        canExecuteWorkflow: true,
        allowedPlatforms: ['youtube', 'linkedin', 'instagram', 'tiktok', 'email', 'facebook'],
    }
};

export function usePlanLimits() {
    // All features enabled — hardcoded to unlimited
    const currentPlan: PlanType = 'unlimited';
    const limits = PLAN_LIMITS[currentPlan];

    const canCreateSeries = (_currentCount: number) => true;
    const canCreateVideo = (_currentCount: number) => true;
    const isPlatformAllowed = (_platform: string) => true;

    return {
        isLoaded: true,
        currentPlan,
        planName: limits.name,
        limits,
        canCreateSeries,
        canCreateVideo,
        canExecuteWorkflow: limits.canExecuteWorkflow,
        isPlatformAllowed,
        hasFeature: (_feature: string) => true,
    };
}
