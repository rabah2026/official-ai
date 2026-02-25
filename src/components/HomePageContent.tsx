'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FeaturedCard } from '@/components/FeaturedCard';
import { GroupedUpdateCard } from '@/components/GroupedUpdateCard';
import { UpdateItem, Tag } from '@/lib/types';
import { groupUpdates } from '@/lib/grouping';
import { UpdateCard } from '@/components/UpdateCard';
import { TrustedSources } from '@/components/TrustedSources';
import { FeatureGrid } from '@/components/FeatureGrid';
import { COMPANY_ACCENTS } from '@/lib/companyAccents';

interface HomePageContentProps {
    updates: UpdateItem[];
    tag?: string;
}

export function HomePageContent({ updates, tag }: HomePageContentProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedCompany, setSelectedCompany] = React.useState('All');
    const [visibleCount, setVisibleCount] = React.useState(25);

    // ── Latest Release per lab (all labs) ──────────────────────────────
    const latestPerLab = React.useMemo(() => {
        const seen = new Set<string>();
        const result: UpdateItem[] = [];
        // Already sorted by date desc from page.tsx
        for (const u of updates) {
            if (!seen.has(u.company)) {
                seen.add(u.company);
                result.push(u);
            }
        }
        return result;
    }, [updates]);

    // ── Featured top releases (Release tag + model keywords) ─────────
    const modelKeywords = ['GPT', 'Claude', 'Gemini', 'Llama', 'Mistral', 'Sora', 'introducing', 'launch', 'announcing', 'new model', 'release'];
    const candidates = updates.filter(u => {
        const titleLower = u.title.toLowerCase();
        return modelKeywords.some(kw => titleLower.includes(kw.toLowerCase())) && u.tag === 'Release';
    });
    const uniqueFeatured = new Map<string, UpdateItem>();
    candidates.forEach(item => {
        const key = item.title.trim().toLowerCase();
        if (!uniqueFeatured.has(key)) uniqueFeatured.set(key, item);
    });
    const featured = Array.from(uniqueFeatured.values()).slice(0, 3);

    // ── Company filter list ────────────────────────────────────────────
    const companies = React.useMemo(() => {
        const unique = new Set(updates.map(u => u.company));
        return Array.from(unique).sort();
    }, [updates]);

    // ── Main filter logic ──────────────────────────────────────────────
    const filteredUpdates = React.useMemo(() => {
        return updates.filter(u => {
            if (tag && u.tag !== tag) return false;
            if (selectedCompany !== 'All' && u.company !== selectedCompany) return false;
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (u.title || '').toLowerCase().includes(query) ||
                    (u.summary || '').toLowerCase().includes(query);
            }
            return true;
        });
    }, [updates, tag, selectedCompany, searchQuery]);

    const visibleUpdates = filteredUpdates.slice(0, visibleCount);
    const hasMore = visibleUpdates.length < filteredUpdates.length;

    const handleLoadMore = () => setVisibleCount(prev => prev + 25);

    const tags: Tag[] = ['Release', 'News', 'Research', 'Engineering', 'Case Study', 'Corporate', 'Pricing', 'Policy', 'Security', 'Docs'];

    return (
        <>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container-max text-center">
                    <div className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] mb-8 animate-fade-in-up">
                        <span className="pulse-dot" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-muted)]">
                            Signal Feed Active
                        </span>
                    </div>

                    <h1 className="hero-title animate-fade-in-up">
                        Official AI Announcements<br />Direct from the Source
                    </h1>

                    <p className="hero-subtitle mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <span className="text-[var(--color-foreground)] font-bold">Official.ai</span> aggregates verified announcements from the world's leading AI labs. No rumors. No opinions. Just the facts.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <Link href="#updates" className="px-8 py-3 rounded-full bg-[var(--color-foreground)] text-[var(--color-background)] font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
                            View Latest Signal
                        </Link>
                    </div>
                </div>
            </section>

            <TrustedSources />

            {/* Core Value Links (Features) */}
            <div className="hidden md:block">
                <FeatureGrid />
            </div>


            {/* Featured Releases (top 3 model releases) */}
            {featured.length > 0 && !searchQuery && selectedCompany === 'All' && !tag && (
                <section className="bg-[var(--color-surface)]/30 border-b border-[var(--color-border)]">
                    <div className="container-max py-16">
                        <div className="section-header mb-10">
                            <h2>Featured Releases</h2>
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
                <div className="section-header flex-col md:flex-row items-stretch md:items-center justify-between mb-8 md:mb-10 gap-4 md:gap-0">
                    <div className="flex items-center justify-between md:justify-start gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse"></span>
                            <h2 className="!m-0 text-[var(--color-foreground)] tracking-[0.12em] font-bold text-xs md:text-sm uppercase before:!hidden">
                                Latest Updates
                            </h2>
                        </div>
                        <span className="text-sm font-normal text-[var(--color-muted-foreground)] border border-[var(--color-border)] px-2 py-0.5 rounded-full">
                            {filteredUpdates.length}
                        </span>
                    </div>

                    {/* Search & Company Filter Controls */}
                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">

                        {/* Company Filter */}
                        <div className="relative group w-full md:w-auto">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-muted-foreground)]"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                            </div>
                            <select
                                className="h-11 pl-10 pr-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 min-w-[200px] appearance-none cursor-pointer hover:border-[var(--color-primary)]/50 transition-colors w-full"
                                value={selectedCompany}
                                onChange={(e) => { setSelectedCompany(e.target.value); setVisibleCount(25); }}
                            >
                                <option value="All">All Companies</option>
                                {companies.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-muted-foreground)] opacity-50"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>

                        {/* Category/Tag Filter */}
                        <div className="relative group w-full md:w-auto">
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
                                <option value="">All Categories</option>
                                {tags.map(t => <option key={t} value={t}>{t}</option>)}
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
                                placeholder="Search updates..."
                                className="h-11 w-full pl-10 pr-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 placeholder:text-[var(--color-muted-foreground)] hover:border-[var(--color-primary)]/50 transition-colors"
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(25); }}
                            />
                        </div>
                    </div>
                </div>

                {filteredUpdates.length === 0 ? (
                    <div className="py-20 text-center text-[var(--color-muted-foreground)] border border-dashed border-[var(--color-border)] rounded-xl">
                        <p>No updates found. Try adjusting your filters.</p>
                        {(searchQuery || selectedCompany !== 'All') && (
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedCompany('All'); }}
                                className="mt-4 text-[var(--color-primary)] hover:underline text-sm"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="updates-list">
                            {groupUpdates(visibleUpdates).map((item) => {
                                if ('type' in item && item.type === 'group') {
                                    return <GroupedUpdateCard key={item.id} group={item} />;
                                }
                                return <UpdateCard key={item.id} item={item as UpdateItem} />;
                            })}
                        </div>

                        {hasMore && (
                            <div className="mt-12 flex justify-center">
                                <button
                                    onClick={handleLoadMore}
                                    className="px-6 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] transition-colors text-sm font-medium"
                                >
                                    Load More
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </>
    );
}
