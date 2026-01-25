
import { Metadata } from 'next';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About - Official.ai',
    description: 'The story behind Official.ai'
};

export default function AboutPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in-up">
            <div className="mb-6 relative">
                <div className="absolute inset-0 bg-red-500 blur-xl opacity-20 rounded-full animate-pulse" />
                <Heart className="w-16 h-16 text-red-500 relative z-10 animate-bounce" fill="currentColor" />
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-medium mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-foreground)] to-[var(--color-muted-foreground)]">
                Made with love
            </h1>

            <div className="flex items-center gap-3 text-xl md:text-2xl text-[var(--color-muted-foreground)] mb-8">
                <span>by</span>
                <a
                    href="https://github.com/rabah2026"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors border-b-2 border-transparent hover:border-[var(--color-primary)]"
                >
                    Rabah Madani
                </a>
            </div>

            <p className="max-w-md text-[var(--color-muted-foreground)] leading-relaxed mb-10">
                Building tools to help you find the signal in the noise.
                Official.ai tracks authentic updates directly from the source.
            </p>

            <Link href="/" className="px-6 py-2 rounded-full border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-all hover:scale-105 active:scale-95 text-sm font-medium uppercase tracking-wider">
                Back to Home
            </Link>
        </div>
    );
}
