'use client';

import Link from 'next/link';
import { UpdateItem } from '@/lib/types';
import { COMPANIES } from '@/lib/config';

interface CompaniesPageContentProps {
    updates: UpdateItem[];
}

export function CompaniesPageContent({ updates }: CompaniesPageContentProps) {
    // Count updates per company
    const companyCounts: Record<string, number> = {};
    updates.forEach(u => {
        companyCounts[u.company] = (companyCounts[u.company] || 0) + 1;
    });

    return (
        <div className="pb-20">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container-max text-center">
                    <h1 className="hero-title animate-fade-in-up">
                        AI Labs & Research Centers
                    </h1>
                    <p className="hero-subtitle animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        Direct signal from the sources we monitor.
                    </p>
                </div>
            </section>

            {/* Companies Grid */}
            <section className="container-max">
                <div className="section-header">
                    <h2 className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        Monitored Entities
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {COMPANIES.map((company, i) => {
                        const articleCount = companyCounts[company.name] || 0;
                        return (
                            <Link
                                key={company.id}
                                href={`/companies/${company.id}`}
                                className="group featured-card !p-6 animate-fade-in-up"
                                style={{ animationDelay: `${0.2 + (i * 0.05)}s` }}
                            >
                                <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                                    {company.name}
                                </h3>
                                <p className="text-xs text-[var(--color-muted-foreground)] mb-4 font-mono">
                                    {company.url.replace('https://', '').replace('www.', '')}
                                </p>
                                <div className="mt-auto pt-4 border-t border-[var(--color-border)] flex justify-between items-center">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted-foreground)]">
                                        Active Signals
                                    </span>
                                    <span className="text-sm font-bold text-[var(--color-primary)]">
                                        {articleCount}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
