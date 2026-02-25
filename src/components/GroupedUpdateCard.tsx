'use client';

import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Tag } from '@/lib/types';
import { UpdateGroup } from '@/lib/grouping';
import clsx from 'clsx';
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

export function GroupedUpdateCard({ group }: { group: UpdateGroup }) {
    const latest = group.items[0];
    const accentColor = COMPANY_ACCENTS[group.company] || 'var(--color-primary)';

    return (
        <div
            className="group-card"
            style={{ borderLeftColor: accentColor, borderLeftWidth: 4 } as React.CSSProperties}
        >
            <div className="card-header pb-3 mb-3 border-b border-[var(--color-border)] flex justify-between items-center">
                <CategoryLabel tag={group.tag} />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-foreground)] bg-[var(--color-surface-hover)] px-2 py-0.5 rounded">
                    {group.items.length} Signals
                </span>
            </div>

            <h3 className="update-title">
                <Link
                    href={`/updates/article?url=${encodeURIComponent(latest.url)}`}
                    style={{ '--hover-color': accentColor } as React.CSSProperties}
                    className="hover:text-[var(--hover-color)] transition-colors"
                >
                    {group.title}
                </Link>
            </h3>

            <div className="update-meta">
                <span className="company" style={{ color: accentColor }}>{group.company}</span>
                <span className="divider"></span>
                <span className="date">{format(parseISO(latest.date), 'd MMM yyyy', { locale: enUS })}</span>
            </div>

            <div className="group-list">
                {group.items.slice(0, 5).map((item, i) => {
                    const displayItemTitle = (item.title.replace(group.title, '').trim() || item.title);

                    return (
                        <Link key={item.id} href={`/updates/article?url=${encodeURIComponent(item.url)}`} className="group-item" title={item.title}>
                            <span className="group-item-title">
                                {displayItemTitle}
                            </span>
                            <span className="group-item-date">{format(parseISO(item.date), 'd MMM', { locale: enUS })}</span>
                        </Link>
                    );
                })}
                {group.items.length > 5 && (
                    <div className="group-more">
                        + {group.items.length - 5} More
                    </div>
                )}
            </div>
        </div>
    );
}
