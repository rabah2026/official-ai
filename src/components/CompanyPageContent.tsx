'use client';

import Link from 'next/link';
import { FeaturedCard } from '@/components/FeaturedCard';
import { GroupedUpdateCard } from '@/components/GroupedUpdateCard';
import { UpdateItem, Tag } from '@/lib/types';
import { groupUpdates } from '@/lib/grouping';
import { UpdateCard } from '@/components/UpdateCard';

interface CompanyPageContentProps {
    companyName: string;
    companyUrl: string;
    companyId: string;
    updates: UpdateItem[];
    tag?: string;
}

export function CompanyPageContent({ companyName, companyUrl, companyId, updates, tag }: CompanyPageContentProps) {
    const filteredUpdates = tag ? updates.filter(u => u.tag === tag) : updates;
    const tags: Tag[] = ['Release', 'News', 'Research', 'Engineering', 'Case Study', 'Corporate', 'Pricing', 'Policy', 'Security', 'Docs'];

    return (
        <div className="pb-20">
            <section className="hero-section">
                <div className="container-max">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] mb-6 animate-fade-in-up">
                        <span className="pulse-dot" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-muted)]">
                            Filtering Lab Context
                        </span>
                    </div>

                    <h1 className="hero-title animate-fade-in-up">
                        {companyName}
                    </h1>
                    <p className="hero-subtitle animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        Official updates from{' '}
                        <a
                            href={companyUrl}
                            target="_blank"
                            className="text-[var(--color-primary)] hover:underline"
                        >
                            {companyUrl.replace('https://', '')} ↗
                        </a>
                    </p>
                </div>
            </section>

            {/* Filters & Updates */}
            <section className="container-max">
                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-[var(--color-border)] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <Link
                        href={`/companies/${companyId}`}
                        scroll={false}
                        className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all rounded-full ${!tag
                                ? 'bg-[var(--color-foreground)] text-[var(--color-background)] border-[var(--color-foreground)]'
                                : 'bg-transparent text-[var(--color-muted-foreground)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                            }`}
                    >
                        ALL SIGNALS ({updates.length})
                    </Link>
                    {tags.map(tab => {
                        const count = updates.filter(u => u.tag === tab).length;
                        if (count === 0) return null;
                        return (
                            <Link
                                key={tab}
                                href={`/companies/${companyId}?tag=${tab}`}
                                scroll={false}
                                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all rounded-full ${tag === tab
                                        ? 'bg-[var(--color-foreground)] text-[var(--color-background)] border-[var(--color-foreground)]'
                                        : 'bg-transparent text-[var(--color-muted-foreground)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                                    }`}
                            >
                                {tab.toUpperCase()} ({count})
                            </Link>
                        );
                    })}
                </div>

                {/* Updates List */}
                <div className="updates-list">
                    {filteredUpdates.length === 0 ? (
                        <div className="py-20 text-center text-[var(--color-muted-foreground)] border border-dashed border-[var(--color-border)] rounded-xl">
                            <p>No signals found for this specific filter.</p>
                        </div>
                    ) : (
                        groupUpdates(filteredUpdates).map(item => {
                            if ('type' in item && item.type === 'group') {
                                return <GroupedUpdateCard key={item.id} group={item} />;
                            }
                            return <UpdateCard key={item.id} item={item as UpdateItem} />;
                        })
                    )}
                </div>
            </section>
        </div>
    );
}
