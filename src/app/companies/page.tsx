import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { COMPANIES } from '@/lib/config';
import { UpdateItem } from '@/lib/types';

async function getUpdates(): Promise<UpdateItem[]> {
    const filePath = path.join(process.cwd(), 'data', 'updates.json');
    try {
        const fileContents = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        return [];
    }
}

export default async function CompaniesPage() {
    const updates = await getUpdates();

    // Count updates per company
    const companyCounts: Record<string, number> = {};
    updates.forEach(u => {
        companyCounts[u.company] = (companyCounts[u.company] || 0) + 1;
    });

    return (
        <>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container-max">
                    <h1 className="hero-title">
                        AI Labs<br />We Track
                    </h1>
                    <p className="hero-subtitle">
                        Official announcements from the world's leading artificial intelligence research labs and companies.
                    </p>
                </div>
            </section>

            {/* Companies Grid */}
            <section className="container-max" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                <div className="section-header">
                    <h2>All Companies</h2>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1.5rem',
                    padding: '1.5rem 0'
                }}>
                    {COMPANIES.map((company) => {
                        const articleCount = companyCounts[company.name] || 0;
                        return (
                            <Link
                                key={company.id}
                                href={`/companies/${company.id}`}
                                style={{
                                    display: 'block',
                                    background: '#fff',
                                    border: '1px solid #e5e4e2',
                                    padding: '1.5rem',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    transition: 'all 0.2s ease',
                                    position: 'relative'
                                }}
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: '#ff4f00'
                                }} />
                                <h3 style={{
                                    fontFamily: "'Instrument Serif', Georgia, serif",
                                    fontSize: '1.5rem',
                                    fontWeight: 400,
                                    margin: '0 0 0.5rem',
                                    color: '#1a1a1a'
                                }}>
                                    {company.name}
                                </h3>
                                <p style={{
                                    fontSize: '0.85rem',
                                    color: '#737373',
                                    margin: '0 0 0.75rem'
                                }}>
                                    {company.url.replace('https://', '').replace('www.', '')}
                                </p>
                                <span style={{
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    color: '#ff4f00',
                                    fontWeight: 600
                                }}>
                                    {articleCount} article{articleCount !== 1 ? 's' : ''}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </>
    );
}
