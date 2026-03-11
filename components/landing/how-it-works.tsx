const steps = [
    {
        number: "01",
        title: "Describe your video",
        description:
            "Type a prompt or paste a script. Pick a style, duration, and platform — the AI handles the rest.",
    },
    {
        number: "02",
        title: "Review & customize",
        description:
            "Preview the generated video, tweak captions, swap music, or adjust the voiceover until it feels right.",
    },
    {
        number: "03",
        title: "Schedule & publish",
        description:
            "Drop it onto your calendar or publish instantly. Agent Elephant posts to every platform simultaneously.",
    },
];

export function HowItWorks() {
    return (
        <section className="relative bg-zinc-50 landing-grain py-8 sm:py-10">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="max-w-2xl mb-8 sm:mb-10">
                    <p className="text-sm font-bold tracking-widest uppercase text-[#239047] mb-3">
                        How it works
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 leading-tight">
                        Three steps. Zero complexity.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                    {steps.map((step, i) => (
                        <div key={step.number} className={`relative animate-fade-up stagger-${i + 1}`}>
                            <p className="text-6xl sm:text-7xl font-bold text-zinc-300 leading-none select-none">
                                {step.number}
                            </p>
                            <h3 className="mt-4 text-xl font-semibold text-zinc-900">
                                {step.title}
                            </h3>
                            <p className="mt-3 text-[15px] leading-relaxed text-zinc-500">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
