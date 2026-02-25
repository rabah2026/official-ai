'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bookmark, BookmarkX, ExternalLink, Clock } from 'lucide-react';

interface SavedArticle {
    url: string;
    title: string;
    date: string;
}

export default function SavedPage() {
    const [saved, setSaved] = useState<SavedArticle[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const bookmarks: SavedArticle[] = JSON.parse(localStorage.getItem('readLater') || '[]');
        // Show newest first
        setSaved(bookmarks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }, []);

    const removeBookmark = (url: string) => {
        const updated = saved.filter(b => b.url !== url);
        localStorage.setItem('readLater', JSON.stringify(updated));
        setSaved(updated);
    };

    const clearAll = () => {
        localStorage.removeItem('readLater');
        setSaved([]);
    };

    if (!mounted) return null;

    return (
        <main className="container-max py-12 md:py-20 animate-fade-in-up">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors mb-8 group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Updates
                    </Link>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-[var(--color-primary)] mb-3">
                                <span className="bg-[var(--color-primary)]/10 px-2 py-0.5 rounded">Your Library</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-display font-bold">
                                Saved Articles
                            </h1>
                            <p className="text-[var(--color-muted-foreground)] mt-3 text-sm">
                                {saved.length} article{saved.length !== 1 ? 's' : ''} saved
                            </p>
                        </div>

                        {saved.length > 0 && (
                            <button
                                onClick={clearAll}
                                className="text-xs font-bold uppercase tracking-widest text-[var(--color-muted-foreground)] hover:text-red-400 transition-colors border border-[var(--color-border)] px-3 py-1.5 rounded-full"
                            >
                                Clear all
                            </button>
                        )}
                    </div>
                </div>

                {saved.length === 0 ? (
                    /* Empty state */
                    <div className="text-center py-24 border border-dashed border-[var(--color-border)] rounded-2xl">
                        <Bookmark size={40} className="mx-auto mb-4 text-[var(--color-muted-foreground)] opacity-30" />
                        <p className="text-[var(--color-foreground)] font-bold text-lg mb-2">No saved articles yet</p>
                        <p className="text-[var(--color-muted-foreground)] text-sm mb-6">
                            Tap the <strong>Read Later</strong> button in any article to save it here.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
                        >
                            Browse Articles
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {saved.map((article) => {
                            const hostname = (() => {
                                try { return new URL(article.url).hostname.replace('www.', ''); }
                                catch { return article.url; }
                            })();
                            const savedDate = new Date(article.date).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric'
                            });

                            return (
                                <div
                                    key={article.url}
                                    className="group flex gap-4 p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] transition-all"
                                >
                                    {/* Content */}
                                    <Link
                                        href={`/updates/article?url=${encodeURIComponent(article.url)}`}
                                        className="flex-1 min-w-0"
                                    >
                                        <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-foreground)] mb-2">
                                            {hostname}
                                        </div>
                                        <h2 className="font-bold text-sm leading-snug line-clamp-3 group-hover:text-[var(--color-primary)] transition-colors mb-3">
                                            {article.title}
                                        </h2>
                                        <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-muted-foreground)]">
                                            <Clock size={10} />
                                            Saved {savedDate}
                                        </div>
                                    </Link>

                                    {/* Actions */}
                                    <div className="flex flex-col items-end justify-between shrink-0">
                                        <button
                                            onClick={() => removeBookmark(article.url)}
                                            className="p-1.5 rounded-full text-[var(--color-muted-foreground)] hover:text-red-400 hover:bg-red-400/10 transition-all"
                                            title="Remove from saved"
                                        >
                                            <BookmarkX size={16} />
                                        </button>
                                        <a
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 rounded-full text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-hover)] transition-all"
                                            title="Open original"
                                        >
                                            <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
