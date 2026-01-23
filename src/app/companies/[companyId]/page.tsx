
import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { COMPANIES } from '@/lib/config';
import { UpdateItem, Tag } from '@/lib/types';
import { UpdateCard } from '@/components/UpdateCard';

export const revalidate = 60;

async function getUpdates(companyName: string): Promise<UpdateItem[]> {
    const filePath = path.join(process.cwd(), 'data', 'updates.json');
    try {
        const fileContents = await fs.readFile(filePath, 'utf8');
        const all: UpdateItem[] = JSON.parse(fileContents);
        return all.filter(u => u.company === companyName);
    } catch (error) {
        return [];
    }
}

type Props = {
    params: Promise<{ companyId: string }>;
    searchParams: Promise<{ tag?: string }>;
};

export default async function CompanyPage({ params, searchParams }: Props) {
    const { companyId } = await params;
    const { tag } = await searchParams;

    const companyConfig = COMPANIES.find(c => c.id === companyId);
    if (!companyConfig) return notFound();

    const updates = await getUpdates(companyConfig.name);
    const filteredUpdates = tag ? updates.filter(u => u.tag === tag) : updates;
    const tags: Tag[] = ['Product', 'Research', 'Engineering', 'Case Study', 'Corporate', 'Pricing', 'Policy', 'Security', 'Docs'];

    return (
        <>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container-max">
                    <h1 className="hero-title">
                        {companyConfig.name}
                    </h1>
                    <p className="hero-subtitle">
                        Official announcements from{' '}
                        <a
                            href={companyConfig.url}
                            target="_blank"
                            style={{ color: '#ff4f00', textDecoration: 'none' }}
                        >
                            {companyConfig.url.replace('https://', '')} ↗
                        </a>
                    </p>
                </div>
            </section>

            {/* Filters & Updates */}
            <section className="container-max" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                {/* Filter Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap',
                    borderBottom: '2px solid #1a1a1a',
                    paddingBottom: '1rem'
                }}>
                    <Link
                        href={`/companies/${companyId}`}
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            textDecoration: 'none',
                            background: !tag ? '#1a1a1a' : 'transparent',
                            color: !tag ? '#fff' : '#737373',
                            border: '1px solid #1a1a1a'
                        }}
                    >
                        All ({updates.length})
                    </Link>
                    {tags.map(t => {
                        const count = updates.filter(u => u.tag === t).length;
                        if (count === 0) return null;
                        return (
                            <Link
                                key={t}
                                href={`/companies/${companyId}?tag=${t}`}
                                style={{
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    textDecoration: 'none',
                                    background: tag === t ? '#1a1a1a' : 'transparent',
                                    color: tag === t ? '#fff' : '#737373',
                                    border: '1px solid #e5e4e2'
                                }}
                            >
                                {t} ({count})
                            </Link>
                        );
                    })}
                </div>

                {/* Updates List */}
                <div className="updates-list">
                    {filteredUpdates.length === 0 ? (
                        <div style={{ padding: '4rem 0', textAlign: 'center', color: '#737373' }}>
                            No updates found for this filter.
                        </div>
                    ) : (
                        filteredUpdates.map(item => (
                            <UpdateCard key={item.id} item={item} />
                        ))
                    )}
                </div>
            </section>
        </>
    );
}
