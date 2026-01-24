import { format, parseISO } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';
import { UpdateItem, Tag } from '@/lib/types';
import clsx from 'clsx';
import { useLanguage } from './LanguageContext';
import { Rocket, Newspaper, FlaskConical, Wrench, Briefcase, Shield, FileText, Tag as TagIcon, Zap } from 'lucide-react';

const TagIcons: Record<Tag, React.ElementType> = {
    Release: Rocket,
    News: Newspaper,
    Research: FlaskConical,
    Engineering: Wrench,
    'Case Study': Briefcase,
    Corporate: Briefcase,
    Pricing: TagIcon,
    Policy: FileText,
    Security: Shield,
    Docs: FileText,
};

export function FeaturedCard({ item }: { item: UpdateItem }) {
    const { t, isRTL } = useLanguage();
    const formattedDate = (() => {
        try {
            return format(parseISO(item.date), 'MMM d, yyyy', {
                locale: isRTL ? arSA : enUS
            });
        } catch {
            return t('recent');
        }
    })();

    const displayTitle = (isRTL && item.title_ar) ? item.title_ar : item.title;
    const displaySummary = (isRTL && item.summary_ar) ? item.summary_ar : item.summary;
    const Icon = TagIcons[item.tag] || Zap;

    return (
        <article className="featured-card" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="featured-icon-wrapper">
                <Icon size={20} />
            </div>

            <div className="featured-meta">
                <span className="company">{item.company}</span>
                <span style={{ margin: '0 0.5rem', opacity: 0.5 }}>/</span>
                <time dateTime={item.date}>{formattedDate}</time>
            </div>

            <h2 className="featured-title">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {displayTitle}
                </a>
            </h2>

            {displaySummary && (
                <p className="featured-summary">
                    {displaySummary}
                </p>
            )}
        </article>
    );
}
