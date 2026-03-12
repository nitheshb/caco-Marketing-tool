import { PostersWorkbench } from '@/components/posters/posters-workbench';

export default function PostersPage() {
    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto">
            <div className="bg-white p-6 rounded-[10px] border border-zinc-200 shadow-sm">
                <div className="space-y-1">
                    <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 leading-tight">
                        Posters
                    </h1>
                    <p className="text-base leading-relaxed text-zinc-500 max-w-2xl">
                        Describe what you want to generate. We’ll turn it into a powerful prompt and produce the final content.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <PostersWorkbench
                    type="image"
                    title="Image Editing"
                    subtitle="Upload an image, describe your edit, and generate a new poster-ready result."
                />
                <PostersWorkbench
                    type="video"
                    title="Video Generation"
                    subtitle="Turn an idea into a short video concept with the right format and motion direction."
                />
            </div>
        </div>
    );
}
