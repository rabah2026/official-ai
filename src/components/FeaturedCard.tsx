import { format, parseISO } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';
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
    const { t, isRTL } = useLanguage();
    const formattedDate = (() => {
        try {
            return format(parseISO(item.date), 'd MMM yyyy', {
                locale: isRTL ? arSA : enUS
            });
        } catch {
            return t('recent');
        }
    })();

    const displayTitle = (isRTL && item.title_ar) ? item.title_ar : item.title;
    const displaySummary = (isRTL && item.summary_ar) ? item.summary_ar : item.summary;


    return (
        <article className="featured-card" dir={isRTL ? 'rtl' : 'ltr'}>
            <CategoryLabel tag={item.tag} />

            <h2 className="featured-title" style={{ fontFamily: isRTL ? 'Amiri, serif' : undefined }}>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {displayTitle}
                </a>
            </h2>

            <div className="featured-meta">
                <span className="company">{item.company}</span>
                <span className="divider">·</span>
                <time dateTime={item.date}>{formattedDate}</time>
            </div>

            {displaySummary && (
                <p className="featured-summary" style={{ fontFamily: isRTL ? 'Noto Sans Arabic, sans-serif' : undefined }}>
                    {displaySummary}
                </p>
            )}
        </article>
    );
}
