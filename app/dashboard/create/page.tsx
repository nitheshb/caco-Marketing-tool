'use client';

import { useState, useEffect, Suspense } from 'react';
import { Stepper } from '@/components/dashboard/create-flow/stepper';
import { StepFooter } from '@/components/dashboard/create-flow/step-footer';
import { NicheSelection } from '@/components/dashboard/create-flow/steps/niche-selection';
import { LanguageVoiceSelection } from '@/components/dashboard/create-flow/steps/language-voice-selection';
import { VideoStyleSelection } from '@/components/dashboard/create-flow/steps/video-style-selection';
import { CaptionStyleSelection } from '@/components/dashboard/create-flow/steps/caption-style-selection';
import { BackgroundMusicSelection } from '@/components/dashboard/create-flow/steps/background-music-selection';
import { SeriesDetailsSelection } from '@/components/dashboard/create-flow/steps/series-details-selection';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { usePlanLimits } from '@/hooks/use-plan-limits';
import { UpgradeModal } from '@/components/dashboard/upgrade-modal';

const TOTAL_STEPS = 6;

function CreateSeriesForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const seriesId = searchParams.get('id');
    const isEditMode = !!seriesId;

    const { currentPlan, limits, canCreateSeries, isLoaded: isPlanLoaded } = usePlanLimits();
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [currentSeriesCount, setCurrentSeriesCount] = useState(0);

    const [currentStep, setCurrentStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true); // Default to true for plan/data check

    const [formData, setFormData] = useState({
        niche: '',
        isCustomNiche: false,
        language: 'English',
        voice: '',
        modelName: 'deepgram',
        modelLangCode: 'en-US',
        videoStyle: '',
        captionStyle: '',
        backgroundMusic: [] as string[],
        seriesName: '',
        duration: '',
        platforms: [] as string[],
        publishTime: ''
    });

    useEffect(() => {
        const checkLimitsAndFetchData = async () => {
            try {
                setIsLoadingData(true);

                // 1. Fetch current series count for limit check
                if (!isEditMode) {
                    const seriesRes = await fetch('/api/series');
                    if (seriesRes.ok) {
                        const seriesData = await seriesRes.json();
                        setCurrentSeriesCount(seriesData.length);

                        // Check if limit is reached (only for new series)
                        if (isPlanLoaded && seriesData.length >= limits.maxSeries) {
                            setIsUpgradeModalOpen(true);
                        }
                    }
                }

                // 2. Fetch series data if in edit mode
                if (seriesId) {
                    const response = await fetch(`/api/series/${seriesId}`);
                    if (!response.ok) throw new Error('Failed to fetch series data');
                    const data = await response.json();

                    setFormData({
                        niche: data.niche,
                        isCustomNiche: data.is_custom_niche,
                        language: data.language,
                        voice: data.voice,
                        modelName: data.model_name,
                        modelLangCode: data.model_lang_code,
                        videoStyle: data.video_style,
                        captionStyle: data.caption_style,
                        backgroundMusic: data.background_music || [],
                        seriesName: data.series_name,
                        duration: data.duration,
                        platforms: data.platforms || [],
                        publishTime: data.publish_time
                    } as any);
                }
            } catch (error) {
                console.error("Initialization Error:", error);
                toast.error("Failed to initialize creation flow");
            } finally {
                setIsLoadingData(false);
            }
        };

        if (isPlanLoaded) {
            checkLimitsAndFetchData();
        }
    }, [seriesId, isPlanLoaded, limits.maxSeries, isEditMode]);

    const updateFormData = (updates: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const handleContinue = async () => {
        if (currentStep < TOTAL_STEPS) {
            setCurrentStep(prev => prev + 1);
        } else {
            try {
                setIsSaving(true);
                const url = isEditMode ? `/api/series/${seriesId}` : '/api/series';
                const method = isEditMode ? 'PATCH' : 'POST';

                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) throw new Error('Failed to save series');

                toast.success(isEditMode ? 'Series updated successfully!' : 'Series scheduled successfully!');
                router.push('/dashboard');
            } catch (error) {
                console.error("Submit Error:", error);
                toast.error('Failed to schedule series. Please try again.');
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const canContinue = () => {
        if (currentStep === 1) {
            return !!formData.niche.trim();
        }
        if (currentStep === 2) {
            return !!formData.voice;
        }
        if (currentStep === 3) {
            return formData.backgroundMusic.length > 0;
        }
        if (currentStep === 4) {
            return !!formData.videoStyle;
        }
        if (currentStep === 5) {
            return !!formData.captionStyle;
        }
        if (currentStep === 6) {
            return !!formData.seriesName.trim() && !!formData.duration && formData.platforms.length > 0 && !!formData.publishTime;
        }
        return true;
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <NicheSelection
                        data={formData}
                        updateData={updateFormData}
                    />
                );
            case 2:
                return (
                    <LanguageVoiceSelection
                        data={formData}
                        updateData={updateFormData}
                    />
                );
            case 3:
                return (
                    <BackgroundMusicSelection
                        data={formData}
                        updateData={updateFormData}
                    />
                );
            case 4:
                return (
                    <VideoStyleSelection
                        data={formData}
                        updateData={updateFormData}
                    />
                );
            case 5:
                return (
                    <CaptionStyleSelection
                        data={formData}
                        updateData={updateFormData}
                    />
                );
            case 6:
                return (
                    <SeriesDetailsSelection
                        data={formData}
                        updateData={updateFormData}
                    />
                );
            default:
                return (
                    <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 text-zinc-400">
                        Step {currentStep} coming soon...
                    </div>
                );
        }
    };

    return (
        <div className="relative pb-24">
            <div className="mx-auto max-w-4xl space-y-8 mt-0">
                {/* Stepper Header */}
                <div className="sticky top-0 z-20 -mx-8 bg-gray-50/80 px-8 py-4 backdrop-blur-md border-b border-zinc-100 mb-2">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[12px] font-bold uppercase tracking-widest text-indigo-600">
                            {isEditMode ? 'Editing Series' : `Step ${currentStep} of ${TOTAL_STEPS}`}
                        </span>
                    </div>
                    <Stepper currentStep={currentStep} totalSteps={TOTAL_STEPS} />
                </div>

                {/* Content */}
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {isLoadingData ? (
                        <div className="flex h-64 flex-col items-center justify-center gap-4">
                            <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-zinc-500 font-medium">Checking plan & series data...</p>
                        </div>
                    ) : (
                        renderStep()
                    )}
                </div>
            </div>

            {/* Footer */}
            <StepFooter
                onBack={handleBack}
                onContinue={handleContinue}
                isFirstStep={currentStep === 1}
                isLastStep={currentStep === TOTAL_STEPS}
                canContinue={canContinue() && !isSaving && !isUpgradeModalOpen}
            />

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => {
                    setIsUpgradeModalOpen(false);
                    router.push('/dashboard');
                }}
                title={`Upgrade to Create More Series`}
                description={`You can create up to ${limits.maxSeries} series on the ${currentPlan} plan. Upgrade to Basic or Unlimited to create more!`}
            />

            {isSaving && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white shadow-2xl border border-zinc-100">
                        <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-zinc-600 font-bold animate-pulse">Scheduling your series...</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function CreateSeriesPage() {
    return (
        <Suspense fallback={
            <div className="flex h-64 flex-col items-center justify-center gap-4">
                <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-zinc-500 font-medium">Loading creation flow...</p>
            </div>
        }>
            <CreateSeriesForm />
        </Suspense>
    );
}
