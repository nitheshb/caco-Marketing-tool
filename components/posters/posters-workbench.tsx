'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { PostersAiHelpSheet, type AiHelpSelection } from './posters-ai-help-sheet';
import { toast } from 'sonner';
import {
    Download,
    Image as ImageIcon,
    Upload,
    Wand2,
    Film,
    Sparkles,
    CheckCircle2,
} from 'lucide-react';

const LANDING_BTN =
    'bg-[#f2d412] hover:bg-[#f2c112] text-zinc-900 rounded-full font-medium text-[15px] shadow-md transition-all';

export type WorkbenchType = 'image' | 'video';

function StepHeader({
    step,
    title,
    hint,
    icon,
}: {
    step: number;
    title: string;
    hint?: string;
    icon: ReactNode;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">
                {step}
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <div className="text-zinc-700">{icon}</div>
                    <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
                </div>
                {hint ? <p className="mt-0.5 text-xs text-zinc-500">{hint}</p> : null}
            </div>
        </div>
    );
}

function UploadTile({
    label,
    accept,
    onFile,
    previewUrl,
}: {
    label: string;
    accept: string;
    onFile: (file: File) => void;
    previewUrl?: string | null;
}) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-2">
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    e.target.value = '';
                    onFile(file);
                }}
            />
            <button
                type="button"
                className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-left transition-colors hover:bg-zinc-100"
                onClick={() => inputRef.current?.click()}
            >
                {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        alt=""
                        src={previewUrl}
                        className="absolute inset-0 h-full w-full object-contain"
                    />
                ) : null}
                <div
                    className={`relative z-10 flex flex-col items-center gap-2 transition-opacity ${
                        previewUrl ? 'opacity-0 group-hover:opacity-100' : ''
                    }`}
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-zinc-200">
                        <Upload className="h-5 w-5 text-zinc-700" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-semibold text-zinc-900">
                            {previewUrl ? 'Click to change' : label}
                        </p>
                        {!previewUrl && (
                            <p className="mt-0.5 text-xs text-zinc-500">
                                Click to upload
                                <span className="text-zinc-400"> (PNG/JPG)</span>
                            </p>
                        )}
                    </div>
                </div>
                <div
                    className={`absolute inset-0 transition-opacity ${
                        previewUrl ? 'bg-black/40 opacity-0 group-hover:opacity-100' : ''
                    }`}
                />
            </button>
        </div>
    );
}

function ResultPreview({ type, previewUrl }: { type: WorkbenchType; previewUrl?: string | null }) {
    const emptyLabel = type === 'image' ? 'Your poster will appear here' : 'Your video will appear here';
    return (
        <div className="space-y-3">
            <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white">
                <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Output
                </div>
                <div className="aspect-video w-full bg-zinc-100">
                    {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={previewUrl} alt="" className="h-full w-full object-contain" />
                    ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                            <Skeleton className="h-24 w-40 rounded-xl" />
                            <p className="text-xs text-zinc-500">{emptyLabel}</p>
                        </div>
                    )}
                </div>
            </div>
            {/* actions are rendered by parent */}
        </div>
    );
}

export function PostersWorkbench({
    title,
    subtitle,
    type,
}: {
    title: string;
    subtitle: string;
    type: WorkbenchType;
}) {
    const [referenceFile, setReferenceFile] = useState<File | null>(null);
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState('');
    const [format, setFormat] = useState(type === 'image' ? 'landscape-16-9' : 'reels-9-16');
    const [style, setStyle] = useState('clean-modern');
    const [tone, setTone] = useState('brand-safe');
    const [isGenerating, setIsGenerating] = useState(false);
    const [outputUrl, setOutputUrl] = useState<string | null>(null);
    const [aiHelpOpen, setAiHelpOpen] = useState(false);

    const previewUrl = useMemo(() => {
        if (!referenceFile) return null;
        return URL.createObjectURL(referenceFile);
    }, [referenceFile]);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const canGenerate = description.trim().length > 0;

    async function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                const base64 = result.includes(',') ? result.split(',')[1]! : result;
                resolve({ base64, mimeType: file.type || 'image/png' });
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }

    return (
        <>
        <Card className="overflow-hidden rounded-[14px] border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 bg-zinc-50/60 px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-xs font-bold tracking-widest uppercase text-[#239047]">
                            Content Creation
                        </p>
                        <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-900">
                            {title}
                        </h2>
                        <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-600">
                        <Sparkles className="h-3.5 w-3.5 text-zinc-500" />
                        AI assisted prompt builder
                    </div>
                </div>
            </div>

            <div className="p-5">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Step 1 */ }
                    <Card className="rounded-xl border border-zinc-200 bg-white p-4 shadow-none">
                        <StepHeader
                            step={1}
                            title="Pick your reference"
                            hint={type === 'image' ? 'Upload a brand asset or inspiration image.' : 'Upload a keyframe or inspiration image.'}
                            icon={type === 'image' ? <ImageIcon className="h-4 w-4" /> : <Film className="h-4 w-4" />}
                        />
                        <div className="mt-4">
                            <UploadTile
                                label="Upload image"
                                accept="image/*"
                                previewUrl={previewUrl}
                                onFile={(file) => setReferenceFile(file)}
                            />
                        </div>
                    </Card>

                    {/* Step 2 */ }
                    <Card className="rounded-xl border border-zinc-200 bg-white p-4 shadow-none">
                        <StepHeader
                            step={2}
                            title="What do you want to generate?"
                            hint="Describe your idea or use AI help for suggestions."
                            icon={<Wand2 className="h-4 w-4" />}
                        />
                        <div className="mt-4 space-y-3">
                            <div className="space-y-1.5">
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder={type === 'image' ? 'Example: A clean promo poster for 50% OFF summer sale' : 'Example: A short reel for product launch with smooth zoom-in'}
                                    className="min-h-20"
                                />
                            </div>
                            <Button
                                variant="outline"
                                className="w-full h-10 rounded-full gap-2 text-sm"
                                onClick={() => setAiHelpOpen(true)}
                            >
                                <Sparkles className="h-4 w-4" />
                                AI Help – get prompt suggestions
                            </Button>

                            <Button
                                className={`mt-1 w-full h-11 px-6 gap-2 ${LANDING_BTN}`}
                                disabled={!canGenerate || isGenerating}
                                onClick={async () => {
                                    setIsGenerating(true);
                                    try {
                                        let referenceImageBase64: string | undefined;
                                        let referenceImageMimeType: string | undefined;
                                        if (referenceFile && type === 'image') {
                                            const { base64, mimeType } = await fileToBase64(referenceFile);
                                            referenceImageBase64 = base64;
                                            referenceImageMimeType = mimeType;
                                        }
                                        const res = await fetch('/api/posters/generate', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                type,
                                                description: description.trim(),
                                                requirements: requirements.trim() || undefined,
                                                format,
                                                style,
                                                tone,
                                                referenceImageBase64,
                                                referenceImageMimeType,
                                            }),
                                        });
                                        const data = await res.json().catch(() => ({}));
                                        if (!res.ok) throw new Error(data.error || 'Failed to generate');

                                        setOutputUrl(data.outputUrl || null);

                                        toast.success(type === 'image' ? 'Poster generated' : 'Prompt generated');
                                    } catch (e) {
                                        const msg = e instanceof Error ? e.message : 'Failed to generate';
                                        toast.error(msg);
                                    } finally {
                                        setIsGenerating(false);
                                    }
                                }}
                            >
                                <Sparkles className="h-5 w-5" />
                                {isGenerating ? 'Generating…' : type === 'image' ? 'Generate poster' : 'Generate video'}
                            </Button>
                        </div>
                    </Card>

                    {/* Step 3 */ }
                    <Card className="rounded-xl border border-zinc-200 bg-white p-4 shadow-none">
                        <StepHeader
                            step={3}
                            title="Download result"
                            hint="Preview your output, then download when ready."
                            icon={<Download className="h-4 w-4" />}
                        />
                        <div className="mt-4">
                            <ResultPreview type={type} previewUrl={outputUrl} />
                            <div className="mt-3 flex flex-wrap gap-2">
                                <Button
                                    className="rounded-full"
                                    variant="outline"
                                    disabled={!outputUrl}
                                    asChild={!!outputUrl}
                                >
                                    {outputUrl ? (
                                        <a href={outputUrl} download target="_blank" rel="noreferrer">
                                            <Download className="h-4 w-4" />
                                            Download
                                        </a>
                                    ) : (
                                        <>
                                            <Download className="h-4 w-4" />
                                            Download
                                        </>
                                    )}
                                </Button>
                            </div>

                            {!outputUrl && (
                                <p className="mt-3 text-xs text-zinc-500">
                                    Generate to see your output.
                                </p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </Card>

        <PostersAiHelpSheet
            open={aiHelpOpen}
            onOpenChange={setAiHelpOpen}
            type={type}
            onApply={(sel: AiHelpSelection) => {
                setDescription(sel.description);
                setRequirements(sel.requirements);
                setFormat(sel.format);
                setStyle(sel.style);
                setTone(sel.tone);
            }}
        />
    </>
    );
}

