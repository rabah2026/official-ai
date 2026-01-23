
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Tag } from '@/lib/types';
import { UpdateGroup } from '@/lib/grouping';
import clsx from 'clsx';

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

export function GroupedUpdateCard({ group }: { group: UpdateGroup }) {
    const latest = group.items[0];

    return (
        <div className="update-card group-card">
            <div className="card-header">
                <CategoryLabel tag={group.tag} />
                <span className="group-badge">{group.items.length} Updates</span>
            </div>

            <h3 className="card-title">
                {group.title}
            </h3>

            <div className="card-meta">
                <span className="company-name">{group.company}</span>
                <span className="bullet">•</span>
                <span className="date">{format(parseISO(latest.date), 'MMM d, yyyy')}</span>
            </div>

            <div className="group-list">
                {group.items.slice(0, 5).map((item, i) => (
                    <a key={item.id} href={item.url} target="_blank" className="group-item" title={item.title}>
                        <span className="group-item-title">{item.title.replace(group.title, '').trim() || item.title}</span>
                        <span className="group-item-date">{format(parseISO(item.date), 'MMM d')}</span>
                    </a>
                ))}
                {group.items.length > 5 && (
                    <div className="group-more">
                        + {group.items.length - 5} more
                    </div>
                )}
            </div>
        </div>
    );
}
