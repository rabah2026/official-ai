
export function TrustedSources() {
    const labs = [
        "OpenAI", "Gemini", "Anthropic", "DeepSeek", "Perplexity", "Meta AI", "Mistral", "Hugging Face",
        "Microsoft", "X.AI", "NVIDIA", "Midjourney", "Stability AI", "Cohere", "Databricks", "Allen Institute"
    ];

    // Duplicate list for seamless loop
    const allLabs = [...labs, ...labs];

    return (
        <section className="w-full border-y border-[var(--color-border)] bg-[var(--color-surface)] py-4 md:py-6 overflow-hidden relative group">
            <div className="container-max flex items-center gap-4 md:gap-8 overflow-hidden">
                <div className="whitespace-nowrap text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--color-muted-foreground)] shrink-0 z-10 bg-[var(--color-surface)] pr-3 md:pr-4 shadow-[10px_0_10px_-5px_var(--color-surface)]">
                    <span className="hidden md:inline">LIVE INTELLIGENCE FEED</span>
                    <span className="md:hidden">LIVE FEED</span>
                </div>

                <div className="flex overflow-hidden w-full mask-linear-gradient">
                    <div className="flex gap-8 md:gap-12 animate-scroll whitespace-nowrap min-w-max">
                        {allLabs.map((lab, i) => (
                            <span key={`${lab}-${i}`} className="text-sm md:text-lg font-display font-medium text-[var(--color-foreground)] opacity-60 hover:opacity-100 transition-opacity cursor-default">
                                {lab}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            {/* Gradient Mask for smooth fade out at edges */}
            <div className="absolute top-0 right-0 h-full w-12 md:w-20 bg-gradient-to-l from-[var(--color-surface)] to-transparent pointer-events-none z-10" />
        </section>
    );
}
