'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { FeaturedCard } from '@/components/FeaturedCard';
import { GroupedUpdateCard } from '@/components/GroupedUpdateCard';
import { UpdateItem, Tag } from '@/lib/types';
import { groupUpdates } from '@/lib/grouping';
import { UpdateCard } from '@/components/UpdateCard';
import { TrustedSources } from '@/components/TrustedSources';
import { FeatureGrid } from '@/components/FeatureGrid';

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
    const feedUpdates = filteredUpdates.slice(0, 25);

    const tags: Tag[] = ['Release', 'News', 'Research', 'Engineering', 'Case Study', 'Corporate', 'Pricing', 'Policy', 'Security', 'Docs'];

    return (
        <>
            {/* Hero Section */}
            <section className="hero-section text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--color-primary)]/10 via-[var(--color-background)] to-[var(--color-background)] opacity-50 pointer-events-none" />

                <div className="container-max relative z-10 pt-10 pb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] mb-8 animate-fade-in-up">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-foreground)]">
                            {t('signal_over_noise')}
                        </span>
                    </div>

                    <h1 className="hero-title mb-6" dangerouslySetInnerHTML={{ __html: `${t('hero_line1')}<br />${t('hero_line2')}` }} />

                    <p className="hero-subtitle text-lg md:text-xl text-[var(--color-muted-foreground)] max-w-2xl mx-auto mb-10 leading-relaxed">
                        <span className="text-[var(--color-foreground)] font-medium">{t('app_title')}</span> {t('aggregates_note')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="#updates" className="px-8 py-3 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors">
                            {t('more')}
                        </Link>
                    </div>
                </div>
            </section>

            <TrustedSources />

            {/* Core Value Links (Features) */}
            <FeatureGrid />

            {/* Featured Section - Top 3 Releases */}
            {featured.length > 0 && (
                <section className="bg-[var(--color-surface)]/30 border-y border-[var(--color-border)]">
                    <div className="container-max py-16">
                        <div className="section-header mb-10">
                            <h2>{t('featured_releases')}</h2>
                        </div>
                        <div className="featured-grid">
                            {featured.map((item) => (
                                <FeaturedCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Updates Feed */}
            <section id="updates" className="container-max py-16">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div className="section-header !mb-0 shrink-0">
                        <h2>{t('updates_badge')}</h2>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href="/"
                            scroll={false}
                            className={`filter-btn ${!tag ? 'active' : ''}`}
                        >
                            {t('all_count')}
                        </Link>
                        {tags.map(tab => {
                            const count = updates.filter(u => u.tag === tab).length;
                            if (count === 0) return null;
                            return (
                                <Link
                                    key={tab}
                                    href={`/?tag=${tab}`}
                                    scroll={false}
                                    className={`filter-btn ${tag === tab ? 'active' : ''}`}
                                >
                                    {tab}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {feedUpdates.length === 0 ? (
                    <div className="py-20 text-center text-[var(--color-muted-foreground)] border border-dashed border-[var(--color-border)] rounded-xl">
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


