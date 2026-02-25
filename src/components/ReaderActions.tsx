'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, Share2, Check, Copy, BookmarkCheck } from 'lucide-react';

interface ReaderActionsProps {
    url: string;
    title: string;
}

export function ReaderActions({ url, title }: ReaderActionsProps) {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isShared, setIsShared] = useState(false);
    const [showCopyFeedback, setShowCopyFeedback] = useState(false);

    useEffect(() => {
        // Check if bookmarked in localStorage
        const bookmarks = JSON.parse(localStorage.getItem('readLater') || '[]');
        setIsBookmarked(bookmarks.some((b: any) => b.url === url));
    }, [url]);

    const toggleBookmark = () => {
        const bookmarks = JSON.parse(localStorage.getItem('readLater') || '[]');
        if (isBookmarked) {
            const newBookmarks = bookmarks.filter((b: any) => b.url !== url);
            localStorage.setItem('readLater', JSON.stringify(newBookmarks));
            setIsBookmarked(false);
        } else {
            bookmarks.push({ url, title, date: new Date().toISOString() });
            localStorage.setItem('readLater', JSON.stringify(bookmarks));
            setIsBookmarked(true);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Official AI: ${title}`,
                    url: url,
                });
                setIsShared(true);
                setTimeout(() => setIsShared(false), 2000);
            } catch (err) {
                console.log('Share failed:', err);
                copyToClipboard();
            }
        } else {
            copyToClipboard();
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        setShowCopyFeedback(true);
        setTimeout(() => setShowCopyFeedback(false), 2000);
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={toggleBookmark}
                className={`p-2 rounded-full transition-all flex items-center gap-2 px-3 text-xs font-bold uppercase tracking-widest ${isBookmarked
                        ? 'bg-[var(--color-primary)] text-white shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                        : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
                    }`}
                title={isBookmarked ? "Remove from Read Later" : "Save for later"}
            >
                {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                <span className="hidden md:inline">{isBookmarked ? 'Saved' : 'Read Later'}</span>
            </button>

            <button
                onClick={handleShare}
                className="p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-all flex items-center gap-2 px-3 text-xs font-bold uppercase tracking-widest"
                title="Share this article"
            >
                {showCopyFeedback ? <Check size={18} className="text-green-500" /> : <Share2 size={18} />}
                <span className="hidden md:inline">{showCopyFeedback ? 'Link Copied' : 'Share'}</span>
            </button>
        </div>
    );
}
