'use client';

import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';
import { Tag } from '@/lib/types';
import { UpdateGroup } from '@/lib/grouping';
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

export function GroupedUpdateCard({ group }: { group: UpdateGroup }) {
    const latest = group.items[0];
    const { t, isRTL } = useLanguage();
    const dateLocale = isRTL ? arSA : enUS;

    const displayGroupTitle = (isRTL && latest.title_ar) ? latest.title_ar : group.title;

    return (
        <div className="update-card group-card" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="card-header">
                <CategoryLabel tag={group.tag} />
                <span className="group-badge">{group.items.length} {t('updates_badge')}</span>
            </div>

            <h3 className="update-title" style={{ fontFamily: isRTL ? 'Amiri, serif' : undefined }}>
                <Link href={latest.url} target="_blank">{displayGroupTitle}</Link>
            </h3>

            <div className="update-meta">
                <span className="company">{group.company}</span>
                <span className="divider"></span>
                <span className="date">{format(parseISO(latest.date), 'd MMM yyyy', { locale: dateLocale })}</span>
            </div>

            <div className="group-list">
                {group.items.slice(0, 5).map((item, i) => {
                    const displayItemTitle = (isRTL && item.title_ar)
                        ? (item.title_ar.replace(displayGroupTitle, '').trim() || item.title_ar)
                        : (item.title.replace(group.title, '').trim() || item.title);

                    return (
                        <a key={item.id} href={item.url} target="_blank" className="group-item" title={item.title}>
                            <span className="group-item-title" style={{ fontFamily: isRTL ? 'Noto Sans Arabic, sans-serif' : undefined }}>
                                {displayItemTitle}
                            </span>
                            <span className="group-item-date">{format(parseISO(item.date), 'd MMM', { locale: dateLocale })}</span>
                        </a>
                    );
                })}
                {group.items.length > 5 && (
                    <div className="group-more">
                        + {group.items.length - 5} {t('more')}
                    </div>
                )}
            </div>
        </div>
    );
}
