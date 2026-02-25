import { format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { UpdateItem, Tag } from '@/lib/types';
import { Rocket, Newspaper, FlaskConical, Wrench, Briefcase, Shield, FileText, Tag as TagIcon, Zap } from 'lucide-react';
import Link from 'next/link';

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
    const formattedDate = (() => {
        try {
            return format(parseISO(item.date), 'MMM d, yyyy', {
                locale: enUS
            });
        } catch {
            return 'Recent';
        }
    })();

    const displayTitle = item.title;
    const displaySummary = item.summary;
    const Icon = TagIcons[item.tag] || Zap;

    return (
        <article className="featured-card">
            <div className="featured-icon-wrapper">
                <Icon size={20} />
            </div>

            <div className="featured-meta">
                <span className="company">{item.company}</span>
                <span style={{ margin: '0 0.5rem', opacity: 0.5 }}>/</span>
                <time dateTime={item.date}>{formattedDate}</time>
            </div>

            <h2 className="featured-title">
                <Link href={`/updates/article?url=${encodeURIComponent(item.url)}`}>
                    {displayTitle}
                </Link>
            </h2>

            {displaySummary && (
                <p className="featured-summary">
                    {displaySummary}
                </p>
            )}
        </article>
    );
}
