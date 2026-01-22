
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { COMPANIES } from '../src/lib/config';
import { Company, UpdateItem, Tag } from '../src/lib/types';
import { subMonths, isBefore } from 'date-fns';

const parser = new Parser();
const DATA_FILE = path.join(process.cwd(), 'data', 'updates.json');

// Simple keyword mapper for tags
function deduceTag(title: string, link: string): Tag {
    const text = (title + ' ' + link).toLowerCase();

    // Use word boundaries to avoid false positives (e.g. "pic" in "anthropic" matching "pricing")
    if (/\b(pricing|price|cost|billing|tiers|subscription)\b/.test(text)) return 'Pricing';
    if (/\b(security|cve|vulnerability|vulnerabilities|exploit|patch|breach|threat|safety)\b/.test(text)) return 'Security';
    if (/\b(policy|terms|privacy|compliance|legal|tos|dpa|governance)\b/.test(text)) return 'Policy';
    if (/\b(doc|docs|documentation|api|sdk|reference|guide|tutorial|examples|manual)\b/.test(text)) return 'Docs';

    return 'Release'; // Default to Release as it's the most common "news"
}

async function fetchUpdates() {
    console.log('Starting official content fetch...');

    let allUpdates: UpdateItem[] = [];

    // Extraction function for consistency
    async function enrichItem(item: UpdateItem, companyName: string) {
        try {
            await new Promise(r => setTimeout(r, 300)); // small delay
            const pageRes = await fetch(item.url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' }
            });
            if (pageRes.ok) {
                const pageHtml = await pageRes.text();
                const page$ = cheerio.load(pageHtml);

                // Clean Title: Prefer og:title or h1
                const ogTitle = page$('meta[property="og:title"]').attr('content');
                const h1Title = page$('h1').first().text().trim();

                if (ogTitle && ogTitle.length > 5) {
                    // Remove site suffix
                    item.title = ogTitle.replace(new RegExp(`\\s*[|\\\\-–—]\\s*(${companyName}|Official).*$`, 'i'), '').trim();
                } else if (h1Title && h1Title.length > 5) {
                    item.title = h1Title;
                }

                // Clean Date: Look for time element or meta date
                const timeEl = page$('time[datetime]').first().attr('datetime');
                const metaDate = page$('meta[property="article:published_time"]').attr('content');
                const dateMatch = pageHtml.match(/(\d{4}-\d{2}-\d{2})/); // ISO date pattern

                if (timeEl) {
                    item.date = new Date(timeEl).toISOString();
                } else if (metaDate) {
                    item.date = new Date(metaDate).toISOString();
                } else if (dateMatch) {
                    item.date = new Date(dateMatch[1]).toISOString();
                }

                // Summary: Meta description
                let summary = page$('meta[name="description"]').attr('content') || '';
                if (!summary) summary = page$('meta[property="og:description"]').attr('content') || '';
                if (!summary) {
                    const firstP = page$('article p, main p, .content p').first().text().trim();
                    if (firstP.length > 50) summary = firstP;
                }

                if (summary && summary.length > 160) summary = summary.substring(0, 157) + '...';
                item.summary = summary;
            }
        } catch (e) {
            // Ignore fetch errors for individual pages
        }
    }

    for (const company of COMPANIES) {
        console.log(`Fetching ${company.name}...`);
        for (const feedConfig of company.feeds) {
            if (feedConfig.type === 'rss') {
                try {
                    const feed = await parser.parseURL(feedConfig.url);

                    const items = feed.items.map(item => {
                        if (!item.title || !item.link) return null;

                        const update: UpdateItem = {
                            id: item.guid || item.link,
                            company: company.name,
                            title: item.title,
                            date: item.isoDate || new Date().toISOString(),
                            url: item.link,
                            tag: deduceTag(item.title, item.link),
                            summary: item.contentSnippet?.slice(0, 150)
                        };
                        return update;
                    }).filter(Boolean) as UpdateItem[];

                    // Enrichment for RSS items missing summary (limit to first 10 for performance)
                    const missingSummary = items.filter(i => !i.summary || i.summary.length < 5).slice(0, 10);
                    if (missingSummary.length > 0) {
                        console.log(`  -> Enriching ${missingSummary.length} RSS items for ${company.name}...`);
                        for (const item of missingSummary) {
                            await enrichItem(item, company.name);
                        }
                    }

                    allUpdates = [...allUpdates, ...items];
                } catch (e: any) {
                    if (e.message?.includes('403') || e.message?.includes('404')) {
                        try {
                            console.log(`  -> Retrying ${company.name} with custom headers...`);
                            const response = await fetch(feedConfig.url, {
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                                    'Accept': 'application/rss+xml,application/xml;q=0.9,*/*;q=0.8'
                                }
                            });
                            if (!response.ok) throw new Error(`Status ${response.status}`);
                            const text = await response.text();
                            const feed = await parser.parseString(text);
                            const items = feed.items.map(item => {
                                if (!item.title || !item.link) return null;
                                return {
                                    id: item.guid || item.link,
                                    company: company.name,
                                    title: item.title,
                                    date: item.isoDate || new Date().toISOString(),
                                    url: item.link,
                                    tag: deduceTag(item.title, item.link),
                                    summary: item.contentSnippet?.slice(0, 150)
                                } as UpdateItem;
                            }).filter(Boolean) as UpdateItem[];

                            const missingSummary = items.filter(i => !i.summary || i.summary.length < 5).slice(0, 10);
                            for (const item of missingSummary) {
                                await enrichItem(item, company.name);
                            }

                            allUpdates = [...allUpdates, ...items];
                            console.log(`  -> Recovered ${items.length} items.`);
                            continue;
                        } catch (retryErr) {
                            console.error(`  -> Retry failed for ${company.name}:`, retryErr);
                        }
                    } else {
                        console.error(`Failed to fetch ${company.name} feed: ${feedConfig.url}`, e);
                    }
                }
            } else if (feedConfig.type === 'html') {
                try {
                    console.log(`  -> Scraping ${feedConfig.url}...`);
                    const res = await fetch(feedConfig.url, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                            'Accept-Language': 'en-US,en;q=0.9',
                            'Cache-Control': 'no-cache',
                            'Pragma': 'no-cache',
                            'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand)";v="24", "Google Chrome";v="122"',
                            'Sec-Ch-Ua-Mobile': '?0',
                            'Sec-Ch-Ua-Platform': '"Windows"',
                            'Sec-Fetch-Dest': 'document',
                            'Sec-Fetch-Mode': 'navigate',
                            'Sec-Fetch-Site': 'none',
                            'Sec-Fetch-User': '?1',
                            'Upgrade-Insecure-Requests': '1'
                        }
                    });

                    if (!res.ok) throw new Error(`Status ${res.status}`);
                    const html = await res.text();
                    const $ = cheerio.load(html);

                    const scrapedItems: UpdateItem[] = [];

                    $('a').each((_: any, el: any) => {
                        const $el = $(el);
                        const href = $el.attr('href');
                        const title = $el.text().trim();

                        if (!href || !title || title.length < 5) return;

                        const isContent = href.includes('/index/') || href.includes('/news/') || href.includes('/research/') || href.includes('/blog/');
                        if (!isContent) return;

                        const fullUrl = href.startsWith('http') ? href : new URL(href, feedConfig.url).toString();
                        if (scrapedItems.find(i => i.url === fullUrl)) return;

                        scrapedItems.push({
                            id: fullUrl,
                            company: company.name,
                            title: title,
                            date: new Date().toISOString(),
                            url: fullUrl,
                            tag: deduceTag(title, fullUrl),
                            summary: ''
                        });
                    });

                    const itemsToEnrich = scrapedItems.slice(0, 10);
                    for (const item of itemsToEnrich) {
                        await enrichItem(item, company.name);
                    }

                    allUpdates = [...allUpdates, ...scrapedItems.slice(0, 10)];
                    console.log(`  -> Scraped ${scrapedItems.slice(0, 10).length} items.`);

                } catch (e) {
                    console.error(`Failed to scrape ${company.name}:`, e);
                }
            }
        }
    }

    // Sort by date desc
    allUpdates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Filter out very old stuff (older than 6 months)
    const cutoff = subMonths(new Date(), 6);
    allUpdates = allUpdates.filter(u => !isBefore(new Date(u.date), cutoff));

    await fs.writeFile(DATA_FILE, JSON.stringify(allUpdates, null, 2));

    // Save metadata
    const metadata = {
        lastUpdated: new Date().toISOString(),
        totalArticles: allUpdates.length
    };
    await fs.writeFile(path.join(process.cwd(), 'data', 'metadata.json'), JSON.stringify(metadata, null, 2));

    console.log('Saved to data/updates.json and data/metadata.json');
}

fetchUpdates().catch(console.error);
