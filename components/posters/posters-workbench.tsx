'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { PostersAiHelpSheet, type AiHelpSelection } from './posters-ai-help-sheet';
import { PostersRegenerateModal, type PosterGenerationRecord } from './posters-regenerate-modal';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Download,
    Image as ImageIcon,
    Upload,
    Wand2,
    Film,
    Sparkles,
    CheckCircle2,
    ThumbsUp,
    RotateCcw,
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
    previewAsVideo,
}: {
    label: string;
    accept: string;
    onFile: (file: File) => void;
    previewUrl?: string | null;
    previewAsVideo?: boolean;
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
                    previewAsVideo ? (
                        <video src={previewUrl} muted playsInline className="absolute inset-0 h-full w-full object-contain" />
                    ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            alt=""
                            src={previewUrl}
                            className="absolute inset-0 h-full w-full object-contain"
                        />
                    )
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
                                <span className="text-zinc-400"> ({accept.includes('video') ? 'MP4, WebM' : 'PNG/JPG'})</span>
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
                        type === 'video' ? (
                            <video src={previewUrl} controls loop playsInline className="h-full w-full object-contain" />
                        ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={previewUrl} alt="" className="h-full w-full object-contain" />
                        )
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
    const [lastGeneration, setLastGeneration] = useState<PosterGenerationRecord | null>(null);
    const [currentGenerations, setCurrentGenerations] = useState<PosterGenerationRecord[]>([]);
    const [projects, setProjects] = useState<Array<{ id: number; referencePreview: string; generations: PosterGenerationRecord[] }>>([]);
    const [previousGenerations, setPreviousGenerations] = useState<PosterGenerationRecord[]>([]);
    const [selectedProjectKey, setSelectedProjectKey] = useState<string>('1');
    const projectIdRef = useRef(0);
    const projectPreviewsRef = useRef<string[]>([]);
    const [aiHelpOpen, setAiHelpOpen] = useState(false);
    const [regenerateModalOpen, setRegenerateModalOpen] = useState(false);

    const previewUrl = useMemo(() => {
        if (!referenceFile) return null;
        return URL.createObjectURL(referenceFile);
    }, [referenceFile]);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    function handleReferenceChange(newFile: File) {
        if (type === 'image' && referenceFile && currentGenerations.length > 0) {
            const refPreview = URL.createObjectURL(referenceFile);
            projectPreviewsRef.current.push(refPreview);
            projectIdRef.current += 1;
            setProjects((prev) => [...prev, { id: projectIdRef.current, referencePreview: refPreview, generations: currentGenerations }]);
        }
        setReferenceFile(newFile);
        setOutputUrl(null);
        setLastGeneration(null);
        setCurrentGenerations([]);
        setDescription('');
        setRequirements('');
    }

    useEffect(() => {
        return () => {
            projectPreviewsRef.current.forEach((url) => URL.revokeObjectURL(url));
            projectPreviewsRef.current = [];
        };
    }, []);

    useEffect(() => {
        const auth = getAuth(app);
        const p = auth.currentUser ? auth.currentUser.getIdToken(true) : Promise.resolve(null);
        p.then((token) => {
            const headers: Record<string, string> = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;
            return fetch(`/api/posters/generations?limit=50&type=${type}`, { headers });
        })
            .then((res) => res.json())
            .then((data) => {
                if (data?.generations) setPreviousGenerations(data.generations);
            })
            .catch(() => {});
    }, [type]);

    const canGenerate = description.trim().length > 0;

    const projectOptions = useMemo(() => {
        const opts: Array<{ key: string; label: string; previewUrl: string | null; generations: PosterGenerationRecord[] }> = [];
        if (previousGenerations.length > 0) {
            opts.push({
                key: '1',
                label: 'Project 1',
                previewUrl: previousGenerations[0]?.output_url ?? null,
                generations: previousGenerations,
            });
        }
        projects.forEach((p, i) => {
            opts.push({
                key: `proj-${p.id}`,
                label: `Project ${(previousGenerations.length > 0 ? 1 : 0) + i + 1}`,
                previewUrl: p.referencePreview,
                generations: p.generations,
            });
        });
        if (currentGenerations.length > 0) {
            opts.push({
                key: 'current',
                label: 'Current project',
                previewUrl: previewUrl ?? currentGenerations[0]?.output_url ?? null,
                generations: currentGenerations,
            });
        }
        return opts;
    }, [previousGenerations, projects, currentGenerations, previewUrl]);

    const selectedProject = useMemo(
        () => projectOptions.find((o) => o.key === selectedProjectKey) ?? projectOptions[0],
        [projectOptions, selectedProjectKey]
    );

    useEffect(() => {
        if (projectOptions.length > 0 && !projectOptions.some((o) => o.key === selectedProjectKey)) {
            setSelectedProjectKey(projectOptions[0]!.key);
        }
    }, [projectOptions, selectedProjectKey]);

    function addGeneration(gen: PosterGenerationRecord) {
        setLastGeneration(gen);
        setOutputUrl(gen.output_url ?? null);
        setCurrentGenerations((prev) => [gen, ...prev]);
    }

    async function doSaveGeneration(id: string) {
        try {
            await fetch(`/api/posters/generations/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ saved: true }),
            });
            setLastGeneration((g) => (g?.id === id ? { ...g, saved: true } : g));
            setCurrentGenerations((prev) => prev.map((g) => (g.id === id ? { ...g, saved: true } : g)));
            setProjects((prev) => prev.map((p) => ({ ...p, generations: p.generations.map((g) => (g.id === id ? { ...g, saved: true } : g)) })));
            toast.success('Saved');
        } catch {
            toast.error('Failed to save');
        }
    }

    async function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
        if (file.type.startsWith('video/')) {
            return videoToFirstFrameBase64(file);
        }
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

    async function videoToFirstFrameBase64(file: File): Promise<{ base64: string; mimeType: string }> {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.muted = true;
            video.playsInline = true;
            video.preload = 'metadata';
            video.onloadeddata = () => {
                video.currentTime = 0.1;
            };
            video.onseeked = () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Could not get canvas context'));
                ctx.drawImage(video, 0, 0);
                const dataUrl = canvas.toDataURL('image/png');
                const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1]! : dataUrl;
                URL.revokeObjectURL(video.src);
                resolve({ base64, mimeType: 'image/png' });
            };
            video.onerror = () => {
                URL.revokeObjectURL(video.src);
                reject(new Error('Failed to load video'));
            };
            video.src = URL.createObjectURL(file);
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
                            hint={type === 'image' ? 'Upload a brand asset or inspiration image.' : 'Upload a video as reference.'}
                            icon={type === 'image' ? <ImageIcon className="h-4 w-4" /> : <Film className="h-4 w-4" />}
                        />
                        <div className="mt-4">
                            <UploadTile
                                label={type === 'image' ? 'Upload image' : 'Upload video'}
                                accept={type === 'image' ? 'image/*' : 'video/*'}
                                previewUrl={previewUrl}
                                previewAsVideo={type === 'video'}
                                onFile={(file) => (type === 'image' ? handleReferenceChange(file) : setReferenceFile(file))}
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

                            {outputUrl && lastGeneration && (
                                <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-3 space-y-2">
                                    <p className="text-sm font-medium text-zinc-800">Did you like the content?</p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-full gap-1.5"
                                            disabled={lastGeneration.saved}
                                            onClick={() => doSaveGeneration(lastGeneration.id)}
                                        >
                                            <ThumbsUp className="h-4 w-4" />
                                            {lastGeneration.saved ? 'Saved' : 'Save'}
                                        </Button>
                                        <Button
                                            size="sm"
                                            className={`rounded-full gap-1.5 ${LANDING_BTN}`}
                                            onClick={() => setRegenerateModalOpen(true)}
                                        >
                                            <RotateCcw className="h-4 w-4" />
                                            Regenerate
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <Button
                                className={`mt-1 w-full h-11 px-6 gap-2 ${LANDING_BTN}`}
                                disabled={!canGenerate || isGenerating || !!outputUrl}
                                onClick={async () => {
                                    setIsGenerating(true);
                                    try {
                                        let referenceImageBase64: string | undefined;
                                        let referenceImageMimeType: string | undefined;
                                        if (referenceFile) {
                                            const { base64, mimeType } = await fileToBase64(referenceFile);
                                            referenceImageBase64 = base64;
                                            referenceImageMimeType = mimeType;
                                        }
                                        const auth = getAuth(app);
                                        const token = await auth.currentUser?.getIdToken(true);
                                        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
                                        if (token) headers['Authorization'] = `Bearer ${token}`;
                                        const res = await fetch('/api/posters/generate', {
                                            method: 'POST',
                                            headers,
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

                                        if (data.generationId && data.outputUrl) {
                                            const gen: PosterGenerationRecord = {
                                                id: data.generationId,
                                                type,
                                                output_url: data.outputUrl,
                                                description: description.trim(),
                                                requirements: requirements.trim() || null,
                                                format,
                                                style,
                                                tone,
                                                parent_id: data.parentId ?? null,
                                                saved: false,
                                            };
                                            addGeneration(gen);
                                        } else {
                                            setOutputUrl(data.outputUrl ?? null);
                                        }

                                        toast.success(type === 'image' ? 'Poster generated' : 'Video generated');
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

                {type === 'image' && (
                    <div className="border-t border-zinc-200 px-5 py-4">
                        <p className="text-sm font-semibold text-zinc-800 mb-1">My generated posters</p>
                        <p className="text-xs text-zinc-500 mb-3">Select a project to view. Click an image to open full size.</p>
                        {projectOptions.length === 0 ? (
                            <p className="text-sm text-zinc-500 py-6 text-center rounded-lg border border-dashed border-zinc-200 bg-zinc-50/50">
                                No posters yet. Generate your first one above.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                <Select value={selectedProjectKey} onValueChange={setSelectedProjectKey}>
                                    <SelectTrigger className="w-full max-w-sm h-11 border-zinc-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {projectOptions.map((opt) => (
                                            <SelectItem key={opt.key} value={opt.key}>
                                                <span className="flex items-center gap-2">
                                                    {opt.previewUrl ? (
                                                        /* eslint-disable-next-line @next/next/no-img-element */
                                                        <img
                                                            src={opt.previewUrl}
                                                            alt=""
                                                            className="h-8 w-8 rounded object-cover shrink-0 border border-zinc-200"
                                                        />
                                                    ) : (
                                                        <div className="h-8 w-8 rounded bg-zinc-200 shrink-0" />
                                                    )}
                                                    <span>{opt.label}</span>
                                                    <span className="text-zinc-400 text-xs">({opt.generations.length})</span>
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {selectedProject && (
                                    <div className="overflow-hidden rounded-lg border border-zinc-200">
                                        <table className="w-full text-left text-sm">
                                            <thead>
                                                <tr className="border-b border-zinc-200 bg-zinc-50/80">
                                                    <th className="px-4 py-2.5 font-semibold text-zinc-700 w-12">#</th>
                                                    <th className="px-4 py-2.5 font-semibold text-zinc-700 w-20">Image</th>
                                                    <th className="px-4 py-2.5 font-semibold text-zinc-700">Prompt</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedProject.generations.map((g, idx) => (
                                                    <tr key={g.id} className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50/50">
                                                        <td className="px-4 py-2.5 text-zinc-500 font-medium">{selectedProject.generations.length - idx}</td>
                                                        <td className="px-4 py-2.5">
                                                            <a href={g.output_url ?? '#'} target="_blank" rel="noreferrer" className="block w-14 h-14 rounded-md overflow-hidden border border-zinc-200 bg-zinc-100 hover:ring-2 hover:ring-[#f2d412] transition-all shrink-0">
                                                                {g.output_url ? (
                                                                    /* eslint-disable-next-line @next/next/no-img-element */
                                                                    <img src={g.output_url} alt="" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full" />
                                                                )}
                                                            </a>
                                                        </td>
                                                        <td className="px-4 py-2.5 text-zinc-600 max-w-md">
                                                            <span className="line-clamp-2">{g.description}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>

        <PostersRegenerateModal
            open={regenerateModalOpen}
            onOpenChange={setRegenerateModalOpen}
            type={type}
            generation={lastGeneration}
            onRegenerate={async (params) => {
                setIsGenerating(true);
                try {
                    let referenceImageBase64: string | undefined;
                    let referenceImageMimeType: string | undefined;
                    if (referenceFile) {
                        const { base64, mimeType } = await fileToBase64(referenceFile);
                        referenceImageBase64 = base64;
                        referenceImageMimeType = mimeType;
                    }
                    const auth = getAuth(app);
                    const token = await auth.currentUser?.getIdToken(true);
                    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
                    if (token) headers['Authorization'] = `Bearer ${token}`;
                    const res = await fetch('/api/posters/generate', {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({
                            type,
                            description: params.description,
                            requirements: params.requirements || undefined,
                            format: params.format,
                            style: params.style,
                            tone: params.tone,
                            referenceImageBase64,
                            referenceImageMimeType,
                            parentId: params.parentId,
                        }),
                    });
                    const data = await res.json().catch(() => ({}));
                    if (!res.ok) throw new Error(data.error || 'Failed to generate');
                    if (data.generationId && data.outputUrl) {
                        const gen: PosterGenerationRecord = {
                            id: data.generationId,
                            type,
                            output_url: data.outputUrl,
                            description: params.description,
                            requirements: params.requirements || null,
                            format: params.format,
                            style: params.style,
                            tone: params.tone,
                            parent_id: params.parentId,
                            saved: false,
                        };
                        addGeneration(gen);
                        setDescription(params.description);
                        setRequirements(params.requirements);
                        setFormat(params.format);
                        setStyle(params.style);
                        setTone(params.tone);
                    }
                    toast.success('Regenerated');
                } catch (e) {
                    toast.error(e instanceof Error ? e.message : 'Failed to regenerate');
                } finally {
                    setIsGenerating(false);
                }
            }}
        />

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

