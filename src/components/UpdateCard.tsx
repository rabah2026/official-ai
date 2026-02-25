import { format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { UpdateItem, Tag } from '@/lib/types';
import clsx from 'clsx';
import Link from 'next/link';
import { COMPANY_ACCENTS } from '@/lib/companyAccents';

function CategoryLabel({ tag }: { tag: Tag }) {
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

    return (
        <span className={clsx('category-label', tagClasses[tag])}>
            {tag}
        </span>
    );
}

export function UpdateCard({ item }: { item: UpdateItem }) {
    const formattedDate = (() => {
        try {
            return format(parseISO(item.date), 'd MMM yyyy', {
                locale: enUS
            });
        } catch {
            return 'Recent';
        }
    })();

    const displayTitle = item.title;
    const displaySummary = item.summary;

    const accentColor = COMPANY_ACCENTS[item.company] || 'var(--color-primary)';

    return (
        <article
            className="update-item group"
            style={{ borderLeftColor: accentColor, borderLeftWidth: 4 } as React.CSSProperties}
        >
            <CategoryLabel tag={item.tag} />

            <h2 className="update-title">
                <Link
                    href={`/updates/article?url=${encodeURIComponent(item.url)}`}
                    style={{ '--hover-color': accentColor } as React.CSSProperties}
                    className="group-hover:text-[var(--hover-color)] transition-colors"
                >
                    {displayTitle}
                </Link>
            </h2>

            <div className="update-meta">
                <span className="company" style={{ color: accentColor }}>{item.company}</span>
                <span className="divider" />
                <time dateTime={item.date}>{formattedDate}</time>
            </div>

            {displaySummary && (
                <p className="update-summary">
                    {displaySummary}
                </p>
            )}
        </article>
    );
}
