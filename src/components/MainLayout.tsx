'use client';

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface MainLayoutProps {
    children: React.ReactNode;
    lastUpdated: string; // ISO string
}

export function MainLayout({ children, lastUpdated }: MainLayoutProps) {
    // Format date in English
    const dateObj = new Date(lastUpdated);
    const formattedDate = format(dateObj, 'PP p', { locale: enUS });

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="site-header">
                <div className="header-inner">
                    <div className="flex flex-col">
                        <Link href="/" className="site-logo">
                            Official.ai
                        </Link>
                        <span
                            className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] mt-1 hidden md:block"
                            suppressHydrationWarning
                        >
                            Sync: {formattedDate}
                        </span>
                    </div>
                    <nav className="site-nav items-center">
                        <Link href="/companies">Labs</Link>
                        <div className="flex items-center gap-2 border-l border-[var(--color-border)] pl-4 ml-2">
                            <ThemeToggle />
                        </div>
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="site-footer">
                <div className="container-max">
                    <div className="flex flex-col items-center gap-12">
                        <div className="text-center">
                            <p className="footer-tagline">The Signal in the Noise</p>
                            <div className="footer-links">
                                <Link href="/companies">Labs</Link>
                                <Link href="/about">About</Link>
                                <Link href="/legal">Privacy</Link>
                            </div>
                        </div>

                        <div className="text-[11px] font-mono text-[var(--color-muted-foreground)] flex items-center gap-2">
                            <span>OPERATED BY</span>
                            <a
                                href="https://github.com/rabah2026"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors font-bold"
                            >
                                RABAH MADANI
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
