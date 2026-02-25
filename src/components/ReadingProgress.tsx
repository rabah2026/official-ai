'use client';

import { useEffect, useState } from 'react';

interface ReadingProgressProps {
    accentColor?: string;
}

export function ReadingProgress({ accentColor }: ReadingProgressProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const el = document.documentElement;
            const scrollTop = el.scrollTop || document.body.scrollTop;
            const scrollHeight = el.scrollHeight - el.clientHeight;
            const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            setProgress(Math.min(100, pct));
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 h-[3px] z-[200] bg-transparent pointer-events-none">
            <div
                className="h-full transition-[width] duration-75 ease-out"
                style={{
                    width: `${progress}%`,
                    background: accentColor || 'var(--color-primary)',
                    boxShadow: `0 0 8px ${accentColor || 'var(--color-primary)'}80`,
                }}
            />
        </div>
    );
}
