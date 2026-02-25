
import React from 'react';
import { extractArticleContent } from '@/lib/content-extractor';
import { COMPANIES } from '@/lib/config';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Globe } from 'lucide-react';
import { ReaderActions } from '@/components/ReaderActions';

export default async function ArticlePage({
    searchParams
}: {
    searchParams: Promise<{ url?: string }>;
}) {
    const { url } = await searchParams;

    if (!url) {
        return (
            <div className="container-max py-20 text-center">
                <h1 className="hero-title mb-4">No URL provided</h1>
                <Link href="/" className="inline-flex items-center gap-2 text-[var(--color-accent)] hover:underline">
                    <ArrowLeft size={16} /> Back to Updates
                </Link>
            </div>
        );
    }

    const article = await extractArticleContent(url);

    // Enrich article with company data from updates.json
    const { promises: fs } = require('fs');
    const path = require('path');
    let allUpdates: any[] = [];
    try {
        const fileContents = await fs.readFile(path.join(process.cwd(), 'data', 'updates.json'), 'utf8');
        allUpdates = JSON.parse(fileContents);
        const matchingUpdate = allUpdates.find((u: any) => u.url === url);
        if (matchingUpdate && article) {
            article.company = matchingUpdate.company;
        }
    } catch (e) {
        console.error('Error reading updates.json:', e);
    }

    const readingTime = article ? Math.ceil(article.content.split(/\s+/).length / 200) : 0;
    const formattedDate = article?.date ? new Date(article.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : null;

    if (!article) {
        // ... handling existing logic ...
        return (
            <div className="container-max py-20 text-center">
                <h1 className="hero-title mb-4">Could not load article</h1>
                <p className="mb-8 text-[var(--color-muted-foreground)]">The content could not be extracted automatically.</p>
                <div className="flex justify-center gap-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">
                        <ArrowLeft size={16} /> Back
                    </Link>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[var(--color-accent)] hover:underline">
                        Read at source <ExternalLink size={16} />
                    </a>
                </div>
            </div>
        );
    }

    const relatedArticles = article.company
        ? allUpdates
            .filter((u: any) => u.company === article.company && u.url !== url)
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3)
        : [];

    return (
        <main className="container-max py-12 md:py-20 animate-fade-in-up">
            <div className="max-w-2xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors mb-16 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Updates
                </Link>

                <header className="mb-12 md:mb-16">
                    <div className="flex items-center gap-3 text-[10px] md:text-xs font-mono uppercase tracking-widest text-[var(--color-primary)] mb-6">
                        <span className="bg-[var(--color-primary)]/10 px-2 py-0.5 rounded">Official Announcement</span>
                        {readingTime > 0 && <span>• {readingTime} min read</span>}
                    </div>

                    <h1 className="text-3xl md:text-6xl font-display leading-tight mb-8">
                        {article.title}
                    </h1>

                    <div className="flex items-center gap-4 py-8 border-y border-[var(--color-border)]">
                        <div className="flex-1">
                            <div className="text-sm font-bold text-[var(--color-foreground)] mb-1">
                                {article.author || (article.company ? `${article.company} News` : 'Official Lab News')}
                            </div>
                            <div className="text-xs text-[var(--color-muted-foreground)]">
                                {formattedDate || new URL(url).hostname}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <ReaderActions url={url} title={article.title} />

                            <div className="h-4 w-px bg-[var(--color-border)] mx-2 hidden md:block" />

                            <a href={url} target="_blank" rel="noopener noreferrer"
                                className="bg-[var(--color-foreground)] text-[var(--color-background)] px-5 py-2 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
                                Read Original
                            </a>
                        </div>
                    </div>
                </header>

                {article.image && (
                    <div className="mb-16 rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-2xl">
                        <img src={article.image} alt={article.title} className="w-full h-auto object-cover" />
                    </div>
                )}

                <div className="article-content prose prose-slate dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.content }} />

                {/* More from this Lab */}
                {relatedArticles.length > 0 && (
                    <section className="mt-24 pt-12 border-t border-[var(--color-border)]">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl md:text-2xl font-display font-bold">More from {article.company || 'this Lab'}</h2>
                            {(() => {
                                const companyConfig = COMPANIES.find((c: any) => c.name === article.company);
                                if (companyConfig) {
                                    return (
                                        <Link href={`/companies/${companyConfig.id}`} className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] hover:underline">
                                            View all
                                        </Link>
                                    );
                                }
                                return null;
                            })()}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedArticles.map((item: any) => (
                                <Link key={item.id} href={`/updates/article?url=${encodeURIComponent(item.url)}`} className="group">
                                    <div className="aspect-video rounded-xl overflow-hidden border border-[var(--color-border)] mb-4 bg-[var(--color-surface)]">
                                        {item.image ? (
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[var(--color-muted-foreground)]">
                                                <Globe size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-sm font-bold leading-snug group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <div className="text-[10px] text-[var(--color-muted-foreground)] mt-2 font-mono">
                                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <footer className="mt-20 pt-12 border-t border-[var(--color-border)]">
                    <div className="glass-panel p-8 text-center italic text-[var(--color-muted-foreground)] mb-12">
                        "Official AI provides a direct, distraction-free view into the latest breakthroughs from top AI labs."
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <a href={url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[var(--color-accent)] font-bold text-sm uppercase tracking-widest hover:underline">
                            View Official Source <ExternalLink size={16} />
                        </a>
                        <Link href="/" className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] underline underline-offset-4 decoration-[var(--color-border)]">
                            Explore more updates
                        </Link>
                    </div>
                </footer>
            </div>
        </main>
    );
}
