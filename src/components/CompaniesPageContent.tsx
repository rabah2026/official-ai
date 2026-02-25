'use client';

import Link from 'next/link';
import { UpdateItem } from '@/lib/types';
import { COMPANIES } from '@/lib/config';
import { COMPANY_ACCENTS } from '@/lib/companyAccents';
import clsx from 'clsx';

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
                        const accentColor = COMPANY_ACCENTS[company.name] || 'var(--color-primary)';
                        return (
                            <Link
                                key={company.id}
                                href={`/companies/${company.id}`}
                                className="group featured-card !p-6 animate-fade-in-up transition-all hover:shadow-xl"
                                style={{
                                    animationDelay: `${0.2 + (i * 0.05)}s`,
                                    borderTopColor: accentColor,
                                    borderTopWidth: 3
                                } as React.CSSProperties}
                            >
                                <h3
                                    className={clsx("text-xl font-bold mb-2 transition-colors group-hover:text-[var(--hover-color)]")}
                                    style={{ '--hover-color': accentColor } as React.CSSProperties}
                                >
                                    {company.name}
                                </h3>
                                <p className="text-xs text-[var(--color-muted-foreground)] mb-4 font-mono">
                                    {company.url.replace('https://', '').replace('www.', '')}
                                </p>
                                <div className="mt-auto pt-4 border-t border-[var(--color-border)] flex justify-between items-center">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted-foreground)]">
                                        Active Signals
                                    </span>
                                    <span className="text-sm font-bold" style={{ color: accentColor }}>
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
