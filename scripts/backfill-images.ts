/**
 * One-time backfill script: fetch og:image for articles missing images.
 * Run with: npx tsx scripts/backfill-images.ts
 */
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'updates.json');

interface UpdateItem {
    id: string;
    company: string;
    title: string;
    date: string;
    url: string;
    tag: string;
    summary?: string;
    image?: string;
}

async function fetchOgImage(url: string): Promise<string | null> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const res = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml',
            }
        }).finally(() => clearTimeout(timeoutId));

        if (!res.ok) return null;

        const html = await res.text();
        const $ = cheerio.load(html);

        const ogImage = $('meta[property="og:image"]').attr('content') ||
            $('meta[name="og:image"]').attr('content') ||
            $('meta[name="twitter:image"]').attr('content');

        if (ogImage) {
            return ogImage.startsWith('http') ? ogImage : new URL(ogImage, url).toString();
        }
        return null;
    } catch {
        return null;
    }
}

async function backfill() {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const updates: UpdateItem[] = JSON.parse(raw);

    const missing = updates.filter(u => !u.image);
    console.log(`Found ${missing.length} articles without images (out of ${updates.length} total).`);

    // Process in batches of 5 with delay
    let filled = 0;
    const batchSize = 5;

    for (let i = 0; i < missing.length; i += batchSize) {
        const batch = missing.slice(i, i + batchSize);
        const results = await Promise.all(
            batch.map(async (item) => {
                const img = await fetchOgImage(item.url);
                if (img) {
                    item.image = img;
                    filled++;
                    console.log(`  ✓ ${item.company}: ${item.title.slice(0, 50)}...`);
                }
                return img;
            })
        );
        // Rate-limit between batches
        if (i + batchSize < missing.length) {
            await new Promise(r => setTimeout(r, 1500));
        }
        console.log(`  Progress: ${Math.min(i + batchSize, missing.length)}/${missing.length}`);
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(updates, null, 2));
    console.log(`\nDone! Filled ${filled} images out of ${missing.length} missing.`);
}

backfill().catch(err => {
    console.error('Backfill failed:', err);
    process.exit(1);
});
