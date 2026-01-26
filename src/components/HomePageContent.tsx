'use client';

import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
    const router = useRouter();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedCompany, setSelectedCompany] = React.useState('All');
    const [visibleCount, setVisibleCount] = React.useState(25);

    // Filter for featured items (Model releases)
    const modelKeywords = ['GPT', 'Claude', 'Gemini', 'Llama', 'Mistral', 'Sora', 'introducing', 'launch', 'announcing', 'new model', 'release'];

    // First get all candidates matching keywords AND 'Release' tag
    const candidates = updates.filter(u => {
        const titleLower = u.title.toLowerCase();
        return modelKeywords.some(kw => titleLower.includes(kw.toLowerCase())) && u.tag === 'Release';
    });

    // Deduplicate items by normalized title
    const uniqueFeatured = new Map();
    candidates.forEach(item => {
        const key = item.title.trim().toLowerCase();
        if (!uniqueFeatured.has(key)) {
            uniqueFeatured.set(key, item);
        }
    });

    const featured = Array.from(uniqueFeatured.values()).slice(0, 3);

    // Extract unique companies for filter
    const companies = React.useMemo(() => {
        const unique = new Set(updates.map(u => u.company));
        return Array.from(unique).sort();
    }, [updates]);

    // Main Filter Logic
    const filteredUpdates = React.useMemo(() => {
        return updates.filter(u => {
            // Tag filtering (from URL)
            if (tag && u.tag !== tag) return false;

            // Company filtering
            if (selectedCompany !== 'All' && u.company !== selectedCompany) return false;

            // Search filtering
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchTitle = (u.title || '').toLowerCase().includes(query);
                const matchSummary = (u.summary || '').toLowerCase().includes(query);
                const matchTitleAr = (u.title_ar || '').toLowerCase().includes(query);
                return matchTitle || matchSummary || matchTitleAr;
            }

            return true;
        });
    }, [updates, tag, selectedCompany, searchQuery]);

    const visibleUpdates = filteredUpdates.slice(0, visibleCount);
    const hasMore = visibleUpdates.length < filteredUpdates.length;

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 25);
    };

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

            {/* Latest Update Banner */}
            {
                updates.length > 0 && (
                    <div className="container-max -mt-8 relative z-20 mb-12">
                        <Link href={updates[0].url} target="_blank" className="block group">
                            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-1 flex items-center gap-4 hover:border-[var(--color-primary)]/50 transition-colors shadow-lg">
                                <div className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                                    {t('latest') || 'Latest'}
                                </div>
                                <div className="flex-1 min-w-0 py-2">
                                    <h3 className="text-sm md:text-base font-medium truncate pr-4 group-hover:text-[var(--color-primary)] transition-colors">
                                        {isRTL && updates[0].title_ar ? updates[0].title_ar : updates[0].title}
                                    </h3>
                                </div>
                                <div className="pr-4 text-[var(--color-muted-foreground)] text-xs whitespace-nowrap hidden sm:block">
                                    {updates[0].company} &bull; {new Date(updates[0].date).toLocaleDateString()}
                                </div>
                            </div>
                        </Link>
                    </div>
                )
            }

            <TrustedSources />

            {/* Core Value Links (Features) */}
            <FeatureGrid />

            {/* Featured Section - Top 3 Releases */}
            {
                featured.length > 0 && !searchQuery && selectedCompany === 'All' && !tag && (
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
                )
            }

            {/* All Updates Feed */}
            <section id="updates" className="container-max py-16">
                <div className="flex flex-col gap-6 mb-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="section-header !mb-0 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)]"></span>
                            <h2>{t('updates_badge')}</h2>
                            <span className="text-sm font-normal text-[var(--color-muted-foreground)] ml-2 border border-[var(--color-border)] px-2 py-0.5 rounded-full">
                                {filteredUpdates.length}
                            </span>
                        </div>

                        {/* Search & Company Filter Controls */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">

                            {/* Company Filter */}
                            <select
                                className="h-10 px-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 min-w-[160px]"
                                value={selectedCompany}
                                onChange={(e) => {
                                    setSelectedCompany(e.target.value);
                                    setVisibleCount(25); // Reset pagination
                                }}
                            >
                                <option value="All">{t('all') || 'All Companies'}</option>
                                {companies.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>

                            {/* Category/Tag Filter */}
                            <select
                                className="h-10 px-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 min-w-[160px]"
                                value={tag || ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val) router.push(`/?tag=${val}`, { scroll: false });
                                    else router.push('/', { scroll: false });
                                    setVisibleCount(25);
                                }}
                            >
                                <option value="">{t('all_count') || 'All Categories'}</option>
                                {tags.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>

                            {/* Search Input */}
                            <div className="relative w-full sm:w-auto">
                                <input
                                    type="text"
                                    placeholder={isRTL ? "بحث..." : "Search..."}
                                    className="h-10 w-full sm:w-64 px-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 placeholder:text-[var(--color-muted-foreground)]"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setVisibleCount(25); // Reset pagination
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {filteredUpdates.length === 0 ? (
                    <div className="py-20 text-center text-[var(--color-muted-foreground)] border border-dashed border-[var(--color-border)] rounded-xl">
                        <p>{t('no_updates')}</p>
                        {(searchQuery || selectedCompany !== 'All') && (
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedCompany('All'); }}
                                className="mt-4 text-[var(--color-primary)] hover:underline text-sm"
                            >
                                {isRTL ? 'مسح الفلاتر' : 'Clear filters'}
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="updates-list">
                            {/* Only group updates if we are NOT searching/filtering heavily, 
                                as grouping breaks when items are sparse. 
                                Actually grouping is fine, but pagination cuts groups. 
                                Let's just render flat list if searching, or keep grouping. 
                                Grouping logic handles partial lists? 
                                groupUpdates expects a list. 
                            */}
                            {groupUpdates(visibleUpdates).map((item) => {
                                if ('type' in item && item.type === 'group') {
                                    return <GroupedUpdateCard key={item.id} group={item} />;
                                }
                                return <UpdateCard key={item.id} item={item as UpdateItem} />;
                            })}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="mt-12 flex justify-center">
                                <button
                                    onClick={handleLoadMore}
                                    className="px-6 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-muted)] transition-colors text-sm font-medium"
                                >
                                    {isRTL ? 'تحميل المزيد' : 'Load More'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </>
    );
}
