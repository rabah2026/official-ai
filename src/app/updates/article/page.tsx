
import React from 'react';
import { extractArticleContent } from '@/lib/content-extractor';
import { COMPANIES } from '@/lib/config';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Globe, BookOpen, Clock } from 'lucide-react';
import { ReaderActions } from '@/components/ReaderActions';

// Extract headings from HTML content for table of contents
function extractHeadings(html: string): { id: string; text: string; level: number }[] {
    const regex = /<h([2-3])[^>]*>(.*?)<\/h[2-3]>/gi;
    const headings: { id: string; text: string; level: number }[] = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
        const text = match[2].replace(/<[^>]+>/g, '').trim();
        if (text.length > 3) {
            headings.push({
                id: `heading-${headings.length}`,
                text: text.slice(0, 60) + (text.length > 60 ? '…' : ''),
                level: parseInt(match[1]),
            });
        }
    }
    return headings.slice(0, 8);
}

// Add IDs to headings in HTML for anchor links
function injectHeadingIds(html: string): string {
    let count = 0;
    return html.replace(/<h([2-3])([^>]*)>/gi, (_match, level, attrs) => {
        return `<h${level}${attrs} id="heading-${count++}">`;
    });
}

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
        year: 'numeric', month: 'long', day: 'numeric'
    }) : null;

    if (!article) {
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
            .slice(0, 4)
        : [];

    const headings = extractHeadings(article.content);
    const contentWithIds = injectHeadingIds(article.content);
    const companyConfig = COMPANIES.find((c: any) => c.name === article.company);

    return (
        <main className="animate-fade-in-up">
            <div className="container-max py-8 md:py-14">
                {/* Back link */}
                <Link href="/" className="inline-flex items-center gap-2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors mb-8 group text-sm">
                    <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Updates
                </Link>

                {/* Two-column layout */}
                <div className="flex gap-12 items-start">

                    {/* ── LEFT: Main content ── */}
                    <article className="flex-1 min-w-0 max-w-[680px]">

                        {/* Article label */}
                        <div className="flex items-center gap-3 text-[10px] md:text-xs font-mono uppercase tracking-widest text-[var(--color-primary)] mb-6">
                            <span className="bg-[var(--color-primary)]/10 px-2 py-0.5 rounded">Official Announcement</span>
                            {readingTime > 0 && <span>• {readingTime} min read</span>}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight mb-8">
                            {article.title}
                        </h1>

                        {/* Meta bar */}
                        <div className="flex items-center justify-between py-5 border-y border-[var(--color-border)] mb-10 gap-4 flex-wrap">
                            <div>
                                <div className="text-sm font-bold text-[var(--color-foreground)] mb-0.5">
                                    {article.author || (article.company ? `${article.company} News` : 'Official Lab News')}
                                </div>
                                <div className="text-xs text-[var(--color-muted-foreground)]">
                                    {formattedDate || new URL(url).hostname}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <ReaderActions url={url} title={article.title} />
                                <a href={url} target="_blank" rel="noopener noreferrer"
                                    className="bg-[var(--color-foreground)] text-[var(--color-background)] px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity">
                                    Read Original
                                </a>
                            </div>
                        </div>

                        {/* Hero image */}
                        {article.image && (
                            <div className="mb-10 rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-lg">
                                <img src={article.image} alt={article.title} className="w-full h-auto object-cover" />
                            </div>
                        )}

                        {/* Article body */}
                        <div className="article-content prose prose-slate dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: contentWithIds }} />

                        {/* Footer */}
                        <footer className="mt-16 pt-10 border-t border-[var(--color-border)] flex flex-col items-center gap-4 text-center">
                            <a href={url} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-[var(--color-accent)] font-bold text-sm uppercase tracking-widest hover:underline">
                                View Official Source <ExternalLink size={16} />
                            </a>
                            <Link href="/" className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] underline underline-offset-4">
                                Explore more updates
                            </Link>
                        </footer>
                    </article>

                    {/* ── RIGHT: Sticky Sidebar ── */}
                    <aside className="hidden lg:block w-[320px] shrink-0 sticky top-24 self-start space-y-6">

                        {/* About this article */}
                        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                            <h2 className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-foreground)] mb-4">About this article</h2>
                            <div className="space-y-3">
                                {article.company && (
                                    <div className="flex items-start gap-3">
                                        <Globe size={14} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                                        <div>
                                            <div className="text-[10px] text-[var(--color-muted-foreground)] uppercase tracking-wider">Lab</div>
                                            <div className="text-sm font-bold mt-0.5">
                                                {companyConfig
                                                    ? <Link href={`/companies/${companyConfig.id}`} className="hover:text-[var(--color-primary)] transition-colors">{article.company}</Link>
                                                    : article.company}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {formattedDate && (
                                    <div className="flex items-start gap-3">
                                        <Clock size={14} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                                        <div>
                                            <div className="text-[10px] text-[var(--color-muted-foreground)] uppercase tracking-wider">Published</div>
                                            <div className="text-sm font-semibold mt-0.5">{formattedDate}</div>
                                        </div>
                                    </div>
                                )}
                                {readingTime > 0 && (
                                    <div className="flex items-start gap-3">
                                        <BookOpen size={14} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                                        <div>
                                            <div className="text-[10px] text-[var(--color-muted-foreground)] uppercase tracking-wider">Reading time</div>
                                            <div className="text-sm font-semibold mt-0.5">{readingTime} min</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Table of Contents */}
                        {headings.length > 1 && (
                            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                                <h2 className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-foreground)] mb-4">In this article</h2>
                                <nav className="space-y-1">
                                    {headings.map((h) => (
                                        <a
                                            key={h.id}
                                            href={`#${h.id}`}
                                            className={`block text-xs leading-snug text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors py-1 ${h.level === 3 ? 'pl-3 border-l border-[var(--color-border)]' : ''}`}
                                        >
                                            {h.text}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        )}

                        {/* More from Lab */}
                        {relatedArticles.length > 0 && (
                            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-foreground)]">
                                        More from {article.company}
                                    </h2>
                                    {companyConfig && (
                                        <Link href={`/companies/${companyConfig.id}`} className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] hover:underline">
                                            View all
                                        </Link>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    {relatedArticles.map((item: any) => (
                                        <Link key={item.id} href={`/updates/article?url=${encodeURIComponent(item.url)}`} className="group flex gap-3">
                                            {item.image && (
                                                <div className="w-14 h-14 rounded-lg overflow-hidden border border-[var(--color-border)] shrink-0 bg-[var(--color-surface-hover)]">
                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                </div>
                                            )}
                                            {!item.image && (
                                                <div className="w-14 h-14 rounded-lg border border-[var(--color-border)] shrink-0 bg-[var(--color-surface-hover)] flex items-center justify-center text-[var(--color-muted-foreground)]">
                                                    <Globe size={16} />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold leading-snug line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                                                    {item.title}
                                                </p>
                                                <div className="text-[10px] text-[var(--color-muted-foreground)] mt-1 font-mono">
                                                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>

                </div>
            </div>
        </main>
    );
}
