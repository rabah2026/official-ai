import { format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { UpdateItem, Tag } from '@/lib/types';
import Link from 'next/link';
import clsx from 'clsx';
import { COMPANY_ACCENTS } from '@/lib/companyAccents';

// Same tag pill mapping as UpdateCard — unified design language
function TagPill({ tag }: { tag: Tag }) {
    const tagClasses: Record<Tag, string> = {
        Release: 'release',
        News: 'news',
        Research: 'research',
        Engineering: 'engineering',
        'Case Study': 'case-study',
        Corporate: 'corporate',
        Pricing: 'pricing',
        Policy: 'policy',
        Security: 'security',
        Docs: 'docs',
    };
    return <span className={clsx('category-label', tagClasses[tag])}>{tag}</span>;
}

export function FeaturedCard({ item }: { item: UpdateItem }) {
    const formattedDate = (() => {
        try {
            return format(parseISO(item.date), 'MMM d, yyyy', { locale: enUS });
        } catch {
            return 'Recent';
        }
    })();

    const href = `/updates/article?url=${encodeURIComponent(item.url)}`;

    const accentColor = COMPANY_ACCENTS[item.company] || 'var(--color-primary)';

    return (
        <article
            className="featured-card group"
            style={{ borderLeftColor: accentColor, borderLeftWidth: 4 } as React.CSSProperties}
        >
            {/* Thumbnail */}
            <Link
                href={href}
                className="block overflow-hidden rounded-xl mb-4 border border-[var(--color-border)] aspect-video relative"
            >
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                ) : (
                    <div
                        className="w-full h-full flex flex-col items-start justify-end p-5 group-hover:brightness-110 transition-all duration-300"
                        style={{
                            background: `linear-gradient(135deg, ${accentColor}18 0%, ${accentColor}30 50%, ${accentColor}10 100%)`,
                        }}
                    >
                        <span
                            className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-1"
                            style={{ color: accentColor }}
                        >
                            {item.company}
                        </span>
                        <span className="text-sm font-bold text-[var(--color-foreground)] line-clamp-2 leading-snug opacity-70">
                            {item.title}
                        </span>
                    </div>
                )}
            </Link>

            {/* Top row: tag + date */}
            <div className="flex items-center justify-between mb-3 gap-2">
                <TagPill tag={item.tag} />
                <time dateTime={item.date} className="text-[11px] font-mono text-[var(--color-muted-foreground)] shrink-0">
                    {formattedDate}
                </time>
            </div>

            {/* Title */}
            <h2 className="featured-title">
                <Link href={href} className="group-hover:text-[var(--hover-color)] transition-colors" style={{ '--hover-color': accentColor } as React.CSSProperties}>
                    {item.title}
                </Link>
            </h2>

            {/* Summary */}
            {item.summary && (
                <p className="featured-summary line-clamp-2">
                    {item.summary}
                </p>
            )}

            {/* Lab name — bottom */}
            <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: accentColor }}>
                    {item.company}
                </span>
                <Link href={href} className="text-[11px] font-bold uppercase tracking-widest hover:underline" style={{ color: accentColor }}>
                    Read →
                </Link>
            </div>
        </article>
    );
}
