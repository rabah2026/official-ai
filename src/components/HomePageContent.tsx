'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { FeaturedCard } from '@/components/FeaturedCard';
import { GroupedUpdateCard } from '@/components/GroupedUpdateCard';
import { UpdateItem, Tag } from '@/lib/types';
import { groupUpdates } from '@/lib/grouping';
import { UpdateCard } from '@/components/UpdateCard';

interface HomePageContentProps {
    updates: UpdateItem[];
    tag?: string;
}

export function HomePageContent({ updates, tag }: HomePageContentProps) {
    const { t, isRTL } = useLanguage();

    // Filter for featured items (Model releases)
    // Find actual model releases by looking for key terms in title
    const modelKeywords = ['GPT', 'Claude', 'Gemini', 'Llama', 'Mistral', 'Sora', 'introducing', 'launch', 'announcing', 'new model', 'release'];

    // First get all candidates
    const candidates = updates.filter(u => {
        const titleLower = u.title.toLowerCase();
        return modelKeywords.some(kw => titleLower.includes(kw.toLowerCase())) && u.tag === 'Release';
    });

    // Deduplicate by title (ignoring case/whitespace)
    const uniqueFeatured = new Map();
    candidates.forEach(item => {
        const key = item.title.trim().toLowerCase();
        if (!uniqueFeatured.has(key)) {
            uniqueFeatured.set(key, item);
        }
    });

    const featured = Array.from(uniqueFeatured.values()).slice(0, 3);

    // Filter updates by tag if selected
    const filteredUpdates = tag ? updates.filter(u => u.tag === tag) : updates;

    // Include featured items in the feed (User Request)
    // const featuredIds = new Set(featured.map(f => f.id));
    // const feedUpdates = filteredUpdates.filter(u => !featuredIds.has(u.id)).slice(0, 25);
    const feedUpdates = filteredUpdates.slice(0, 25);

    const tags: Tag[] = ['Release', 'News', 'Research', 'Engineering', 'Case Study', 'Corporate', 'Pricing', 'Policy', 'Security', 'Docs'];

    return (
        <>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container-max">
                    <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: `${t('hero_line1')}<br />${t('hero_line2')}` }} />
                    <p className="hero-subtitle">
                        <span className="hero-accent">{t('app_title')}</span> {t('aggregates_note')}
                    </p>
                </div>
            </section>

            {/* Featured Section - Top 3 Releases */}
            {featured.length > 0 && (
                <section className="container-max" style={{ paddingTop: '2rem' }}>
                    <div className="section-header">
                        <h2>{t('featured_releases')}</h2>
                    </div>
                    <div className="featured-grid">
                        {featured.map((item) => (
                            <FeaturedCard key={item.id} item={item} />
                        ))}
                    </div>
                </section>
            )}

            {/* All Updates Feed */}
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
                        href="/"
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
                                href={`/?tag=${tab}`}
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

                {feedUpdates.length === 0 ? (
                    <div style={{ padding: '4rem 0', textAlign: 'center', color: '#737373' }}>
                        <p>{t('no_updates')}</p>
                    </div>
                ) : (
                    <div className="updates-list">
                        {groupUpdates(feedUpdates).map((item) => {
                            if ('type' in item && item.type === 'group') {
                                return <GroupedUpdateCard key={item.id} group={item} />;
                            }
                            return <UpdateCard key={item.id} item={item as UpdateItem} />;
                        })}
                    </div>
                )}
            </section>
        </>
    );
}
