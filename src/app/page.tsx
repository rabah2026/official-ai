
import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { UpdateCard } from '@/components/UpdateCard';
import { FeaturedCard } from '@/components/FeaturedCard';
import { UpdateItem, Tag } from '@/lib/types';

export const revalidate = 60;

async function getUpdates(): Promise<UpdateItem[]> {
  const filePath = path.join(process.cwd(), 'data', 'updates.json');
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.warn("Could not read data/updates.json", error);
    return [];
  }
}

type Props = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const { tag } = await searchParams;
  const updates = await getUpdates();

  // Find actual model releases by looking for key terms in title
  const modelKeywords = ['GPT', 'Claude', 'Gemini', 'Llama', 'Mistral', 'Sora', 'introducing', 'launch', 'announcing', 'new model', 'release'];
  const featured = updates
    .filter(u => {
      const titleLower = u.title.toLowerCase();
      return modelKeywords.some(kw => titleLower.includes(kw.toLowerCase())) && u.tag === 'Release';
    })
    .slice(0, 3);

  // Filter updates by tag if selected
  const filteredUpdates = tag ? updates.filter(u => u.tag === tag) : updates;

  // Exclude featured from feed
  const featuredIds = new Set(featured.map(f => f.id));
  const feedUpdates = filteredUpdates.filter(u => !featuredIds.has(u.id)).slice(0, 25);

  const tags: Tag[] = ['Release', 'News', 'Research', 'Engineering', 'Case Study', 'Corporate', 'Pricing', 'Policy', 'Security', 'Docs'];

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container-max">
          <h1 className="hero-title">
            The Signal<br />in the Noise
          </h1>
          <p className="hero-subtitle">
            <span className="hero-accent">Official.ai</span> aggregates only verified announcements from the world's leading AI labs. No rumors. No opinions. Just the facts.
          </p>
        </div>
      </section>

      {/* Featured Section - Top 3 Releases */}
      {featured.length > 0 && (
        <section className="container-max" style={{ paddingTop: '2rem' }}>
          <div className="section-header">
            <h2>Featured Releases</h2>
          </div>
          <div className="featured-grid">
            {featured.map((item) => (
              <FeaturedCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* All Updates Feed */}
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
            href="/"
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
                href={`/?tag=${t}`}
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

        {feedUpdates.length === 0 ? (
          <div style={{ padding: '4rem 0', textAlign: 'center', color: '#737373' }}>
            <p>No updates found. System initializing...</p>
          </div>
        ) : (
          <div className="updates-list">
            {feedUpdates.map((item) => (
              <UpdateCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
