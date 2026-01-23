
import { format, parseISO } from 'date-fns';
import { UpdateItem, Tag } from '@/lib/types';
import clsx from 'clsx';

function CategoryLabel({ tag }: { tag: Tag }) {
    const tagClasses: Record<Tag, string> = {
        Product: 'product',
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
            {tag === 'Product' ? 'Release' : tag}
        </span>
    );
}

export function FeaturedCard({ item }: { item: UpdateItem }) {
    const formattedDate = (() => {
        try {
            return format(parseISO(item.date), 'MMM d, yyyy');
        } catch {
            return 'Recent';
        }
    })();

    return (
        <article className="featured-card">
            <CategoryLabel tag={item.tag} />

            <h2 className="featured-title">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.title}
                </a>
            </h2>

            <div className="featured-meta">
                <span className="company">{item.company}</span>
                <span className="divider">·</span>
                <time dateTime={item.date}>{formattedDate}</time>
            </div>

            {item.summary && (
                <p className="featured-summary">
                    {item.summary}
                </p>
            )}
        </article>
    );
}
