'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { UpdateItem } from '@/lib/types';
import { COMPANIES } from '@/lib/config';

interface CompaniesPageContentProps {
    updates: UpdateItem[];
}

export function CompaniesPageContent({ updates }: CompaniesPageContentProps) {
    const { t, isRTL } = useLanguage();

    // Count updates per company
    const companyCounts: Record<string, number> = {};
    updates.forEach(u => {
        companyCounts[u.company] = (companyCounts[u.company] || 0) + 1;
    });

    return (
        <>
            {/* Hero Section */}
            <section className="hero-section" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="container-max" style={{ textAlign: 'center' }}>
                    <h1 className="hero-title" style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        fontFamily: isRTL ? 'Amiri, serif' : undefined
                    }} dangerouslySetInnerHTML={{ __html: t('hero_title_companies') }} />
                    <p className="hero-subtitle" style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        fontFamily: isRTL ? 'Noto Sans Arabic, sans-serif' : undefined
                    }}>
                        {t('hero_subtitle_companies')}
                    </p>
                </div>
            </section>

            {/* Companies Grid */}
            <section className="container-max" style={{ paddingTop: '2rem', paddingBottom: '4rem' }} dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="section-header">
                    <h2 style={{ fontFamily: isRTL ? 'Amiri, serif' : undefined }}>{t('all_companies')}</h2>
                </div>

                <div className="updates-grid">
                    {COMPANIES.map((company) => {
                        const articleCount = companyCounts[company.name] || 0;
                        return (
                            <Link
                                key={company.id}
                                href={`/companies/${company.id}`}
                                className="group relative block rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all hover:border-[var(--color-accent)]"
                            >
                                <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-accent)] opacity-0 transition-opacity group-hover:opacity-100" />
                                <h3 style={{
                                    fontFamily: "'Instrument Serif', Georgia, serif",
                                    fontSize: '1.5rem',
                                    fontWeight: 400,
                                    margin: '0 0 0.5rem',
                                    color: 'var(--color-foreground)'
                                }}>
                                    {company.name}
                                </h3>
                                <p style={{
                                    fontSize: '0.85rem',
                                    color: 'var(--color-muted-foreground)',
                                    margin: '0 0 0.75rem'
                                }}>
                                    {company.url.replace('https://', '').replace('www.', '')}
                                </p>
                                <span style={{
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    color: 'var(--color-accent)',
                                    fontWeight: 600,
                                    fontFamily: isRTL ? 'Noto Sans Arabic, sans-serif' : undefined
                                }}>
                                    {articleCount} {articleCount === 1 ? t('article_count_one') : t('article_count_many')}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </>
    );
}
