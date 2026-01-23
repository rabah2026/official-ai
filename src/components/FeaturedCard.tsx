import { format, parseISO } from 'date-fns';
import { UpdateItem, Tag } from '@/lib/types';
import clsx from 'clsx';
import { useLanguage } from './LanguageContext';

function CategoryLabel({ tag }: { tag: Tag }) {
    const { t } = useLanguage();
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

    const translationKey = `tag_${tag.replace(' ', '_')}`;

    return (
        <span className={clsx('category-label', tagClasses[tag])}>
            {t(translationKey)}
        </span>
    );
}

export function FeaturedCard({ item }: { item: UpdateItem }) {
    const { t } = useLanguage();
    const formattedDate = (() => {
        try {
            return format(parseISO(item.date), 'MMM d, yyyy');
        } catch {
            return t('recent');
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
