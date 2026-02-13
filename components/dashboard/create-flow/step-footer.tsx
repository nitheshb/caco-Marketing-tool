'use client';

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StepFooterProps {
    onBack?: () => void;
    onContinue: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
    canContinue: boolean;
}

export function StepFooter({
    onBack,
    onContinue,
    isFirstStep,
    isLastStep,
    canContinue
}: StepFooterProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 md:left-72 flex h-20 items-center justify-between border-t border-zinc-200 bg-white px-8 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
            <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
                <div>
                    {!isFirstStep && (
                        <Button
                            variant="ghost"
                            onClick={onBack}
                            className="text-zinc-600 hover:text-zinc-900"
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    )}
                </div>

                <Button
                    onClick={onContinue}
                    disabled={!canContinue}
                    className="min-w-[140px] bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all active:scale-95"
                >
                    {isLastStep ? "Schedule" : "Continue"}
                    {!isLastStep && <ChevronRight className="ml-2 h-4 w-4" />}
                </Button>
            </div>
        </div>
    );
}
