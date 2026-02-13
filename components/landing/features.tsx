import { Calendar, Clapperboard, Mail, Wand2 } from "lucide-react";

const features = [
    {
        name: "AI Video Generation",
        description: "Turn text prompts into engaging short-form videos instantly. Our AI handles the visuals, captions, and voiceovers.",
        icon: Wand2,
        color: "text-pink-500",
        bg: "bg-pink-500/10",
    },
    {
        name: "Smart Scheduling",
        description: "Plan your content calendar ahead of time. Drag and drop simplicity with powerful automation tools.",
        icon: Calendar,
        color: "text-indigo-500",
        bg: "bg-indigo-500/10",
    },
    {
        name: "Multi-Platform Support",
        description: "Publish directly to YouTube Shorts, Instagram Reels, and TikTok from a single dashboard.",
        icon: Clapperboard,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
    {
        name: "Email Integration",
        description: "Notify your subscribers automatically when new content goes live. Keep your audience engaged.",
        icon: Mail,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
];

export function Features() {
    return (
        <section id="features" className="bg-zinc-950 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-indigo-400">Everything you need</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Create, Schedule, Dominate
                    </p>
                    <p className="mt-6 text-lg leading-8 text-zinc-400">
                        VidMaxx gives you the superpowers to scale your video content without hiring a team.
                        Focus on ideas, let AI handle the rest.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
                        {features.map((feature) => (
                            <div key={feature.name} className="flex flex-col">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.bg} ${feature.color}`}>
                                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    {feature.name}
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-400">
                                    <p className="flex-auto">{feature.description}</p>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
}
