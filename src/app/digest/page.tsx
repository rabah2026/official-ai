'use client';

export default function DigestPage() {
    return (
        <div className="pb-20">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container-max text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] mb-8 animate-fade-in-up">
                        <span className="pulse-dot" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-muted)]">
                            Beta Access Open
                        </span>
                    </div>
                    <h1 className="hero-title animate-fade-in-up">
                        The Weekly Signal
                    </h1>
                    <p className="hero-subtitle animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        Get a high-signal digest of the most important AI developments, delivered to your inbox every Sunday.
                    </p>
                </div>
            </section>

            {/* Signup Section - Centered */}
            <section className="container-max">
                <div className="max-w-xl mx-auto">
                    {/* Benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="text-center p-6 featured-card">
                            <div className="text-3xl mb-4">⭐</div>
                            <div className="font-bold text-sm uppercase tracking-widest text-[var(--color-foreground)]">Priority Access</div>
                        </div>

                        <div className="text-center p-6 featured-card">
                            <div className="text-3xl mb-4">💎</div>
                            <div className="font-bold text-sm uppercase tracking-widest text-[var(--color-foreground)]">Lab Insiders</div>
                        </div>

                        <div className="text-center p-6 featured-card">
                            <div className="text-3xl mb-4">🛡️</div>
                            <div className="font-bold text-sm uppercase tracking-widest text-[var(--color-foreground)]">Zero Noise</div>
                        </div>
                    </div>

                    {/* Signup Form */}
                    <div className="featured-card p-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="flex flex-col gap-4"
                        >
                            <input
                                type="email"
                                placeholder="you@company.com"
                                required
                                className="w-full px-6 py-4 text-center text-lg bg-[var(--color-background)] border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] rounded-xl outline-none transition-all"
                            />
                            <button
                                type="submit"
                                className="w-full px-8 py-4 bg-[var(--color-foreground)] text-[var(--color-background)] font-bold uppercase tracking-[0.2em] text-xs rounded-xl hover:opacity-90 transition-all shadow-lg active:scale-[0.98]"
                            >
                                Join the Signal Waitlist
                            </button>
                        </form>
                        <p className="mt-6 text-center text-[10px] text-[var(--color-muted-foreground)] uppercase tracking-widest">
                            No spam. Unsubscribe any time.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
