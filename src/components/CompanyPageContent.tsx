'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
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
    const { t, isRTL } = useLanguage();

    const filteredUpdates = tag ? updates.filter(u => u.tag === tag) : updates;
    const tags: Tag[] = ['Release', 'News', 'Research', 'Engineering', 'Case Study', 'Corporate', 'Pricing', 'Policy', 'Security', 'Docs'];

    return (
        <>
            <section className="hero-section">
                <div className="container-max">
                    <h1 className="hero-title">
                        {companyName}
                    </h1>
                    <p className="hero-subtitle">
                        {t('official_announcements')}{' '}
                        <a
                            href={companyUrl}
                            target="_blank"
                            style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
                        >
                            {companyUrl.replace('https://', '')} ↗
                        </a>
                    </p>
                </div>
            </section>

            {/* Filters & Updates */}
            <section className="container-max" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                {/* Filter Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap',
                    borderBottom: '2px solid var(--color-foreground)',
                    paddingBottom: '1rem'
                }}>
                    <Link
                        href={`/companies/${companyId}`}
                        scroll={false}
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            textDecoration: 'none',
                            background: !tag ? 'var(--color-foreground)' : 'transparent',
                            color: !tag ? 'var(--color-background)' : 'var(--color-muted-foreground)',
                            border: '1px solid var(--color-foreground)'
                        }}
                    >
                        {t('all_count')} ({updates.length})
                    </Link>
                    {tags.map(tab => {
                        const count = updates.filter(u => u.tag === tab).length;
                        if (count === 0) return null;
                        return (
                            <Link
                                key={tab}
                                href={`/companies/${companyId}?tag=${tab}`}
                                scroll={false}
                                style={{
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    textDecoration: 'none',
                                    background: tag === tab ? 'var(--color-foreground)' : 'transparent',
                                    color: tag === tab ? 'var(--color-background)' : 'var(--color-muted-foreground)',
                                    border: '1px solid var(--color-border)'
                                }}
                            >
                                {tab} ({count})
                            </Link>
                        );
                    })}
                </div>

                {/* Updates List */}
                <div className="updates-list">
                    {filteredUpdates.length === 0 ? (
                        <div style={{ padding: '4rem 0', textAlign: 'center', color: '#737373' }}>
                            {t('no_filter_results')}
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
        </>
    );
}
