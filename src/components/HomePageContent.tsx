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

            <TrustedSources />

            {/* Core Value Links (Features) - Hidden on Mobile */}
            <div className="hidden md:block">
                <FeatureGrid />
            </div>

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
                <div className="section-header justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse"></span>
                        <h2 className="!m-0 text-[var(--color-foreground)] tracking-[0.12em] font-bold text-xs md:text-sm uppercase before:hidden">
                            {t('updates_badge')}
                        </h2>
                        <span className="text-sm font-normal text-[var(--color-muted-foreground)] border border-[var(--color-border)] px-2 py-0.5 rounded-full ml-2">
                            {filteredUpdates.length}
                        </span>
                    </div>

                    {/* Search & Company Filter Controls */}
                    <div className="flex flex-wrap md:flex-nowrap gap-4 items-center">

                        {/* Company Filter */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-muted-foreground)]"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                            </div>
                            <select
                                className="h-11 pl-10 pr-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 min-w-[200px] appearance-none cursor-pointer hover:border-[var(--color-primary)]/50 transition-colors w-full"
                                value={selectedCompany}
                                onChange={(e) => {
                                    setSelectedCompany(e.target.value);
                                    setVisibleCount(25);
                                }}
                            >
                                <option value="All">{t('all') ? `${t('all')} Companies` : 'All Companies'}</option>
                                {companies.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-muted-foreground)] opacity-50"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>

                        {/* Category/Tag Filter */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-muted-foreground)]"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
                            </div>
                            <select
                                className="h-11 pl-10 pr-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 min-w-[200px] appearance-none cursor-pointer hover:border-[var(--color-primary)]/50 transition-colors w-full"
                                value={tag || ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val) router.push(`/?tag=${val}`, { scroll: false });
                                    else router.push('/', { scroll: false });
                                    setVisibleCount(25);
                                }}
                            >
                                <option value="">{t('all_count') ? `${t('all_count')} Categories` : 'All Categories'}</option>
                                {tags.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-muted-foreground)] opacity-50"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-auto min-w-[240px]">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-muted-foreground)]"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                            </div>
                            <input
                                type="text"
                                placeholder={isRTL ? "بحث في التحديثات..." : "Search updates..."}
                                className="h-11 w-full pl-10 pr-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 placeholder:text-[var(--color-muted-foreground)] hover:border-[var(--color-primary)]/50 transition-colors"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setVisibleCount(25); // Reset pagination
                                }}
                            />
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
            </section >
        </>
    );
}
