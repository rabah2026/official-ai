
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { COMPANIES } from '../src/lib/config';
import { Company, UpdateItem, Tag } from '../src/lib/types';
import { subMonths, isBefore } from 'date-fns';

const parser = new Parser();
const DATA_FILE = path.join(process.cwd(), 'data', 'updates.json');

// Smart keyword mapper for tags - analyzes title, URL, and summary
function deduceTag(title: string, link: string, summary?: string): Tag {
    const text = (title + ' ' + link + ' ' + (summary || '')).toLowerCase();

    // High-priority specific matches (keep existing)
    if (/\b(pricing|price|cost|billing|tiers|subscription)\b/.test(text)) return 'Pricing';
    if (/\b(security|cve|vulnerability|exploit|patch|breach|threat)\b/.test(text)) return 'Security';
    if (/\b(policy|terms|privacy|compliance|legal|tos|dpa|governance)\b/.test(text)) return 'Policy';
    if (/\b(doc|docs|documentation|api reference|sdk|guide|tutorial|manual)\b/.test(text)) return 'Docs';

    // Research / Papers - scientific and academic content
    if (/\b(research|paper|arxiv|study|benchmark|evaluation|dataset|training method)\b/.test(text)) return 'Research';
    if (/teaching ai|advancing|new method|novel approach|state-of-the-art/.test(text)) return 'Research';
    if (/\b(diffusion|transformer|neural|model architecture|fine-tuning)\b/.test(text)) return 'Research';

    // Engineering / Technical blogs - infrastructure and performance
    if (/\b(scaling|how we|infrastructure|architecture|performance|optimize|latency)\b/.test(text)) return 'Engineering';
    if (/developer\.nvidia\.com|engineering\.|how to train|building|implementing/.test(link)) return 'Engineering';
    if (/\b(gpu|cuda|inference|deployment|system design)\b/.test(text)) return 'Engineering';

    // Case Studies / Customer stories
    if (/\bpowers\b|\bwith openai\b|\bwith anthropic\b|\bwith google\b/.test(text)) return 'Case Study';
    if (/inside .+'s|how .+ uses|customer story|use case/.test(text)) return 'Case Study';
    if (/\bredefine\b|\btransform\b.*\bwith\b/.test(text)) return 'Case Study';

    // Corporate news - appointments, partnerships, investments
    if (/\b(appoints|appointed|appointment|partnership|investing in|joins|hires|hired)\b/.test(text)) return 'Corporate';
    if (/managing director|chief|ceo|cto|director|executive|trust|board/.test(text)) return 'Corporate';
    if (/\b(acquisition|merger|funding|valuation|investment)\b/.test(text)) return 'Corporate';

    // Product launches vs News
    // STRICT RELEASE: "Available now", "Inserting", "Launches"
    if (/\b(now available|available today|launching|launches|released|release|rolling out)\b/.test(text)) return 'Release';
    if (/\b(introducing|announcing)\b/.test(text) && /\b(new model|gpt-|claude|gemini|feature|api)\b/.test(text)) return 'Release';
    if (/\b(v\d+\.\d+|version \d+)\b/.test(text)) return 'Release';

    // NEWS: General product news, "approach to", "update on"
    if (/\b(introducing|announcing|update|approach to|future of|expanding|bringing)\b/.test(text)) return 'News';

    // Default fallback
    return 'News';
}

const COMMON_TERMS_AR: Record<string, string> = {
    "Introducing": "نُقدم لكم",
    "Announcing": "إعلان عن",
    "How to": "كيفية",
    "Scaling": "توسيع نطاق",
    "Advancing": "تعزيز",
    "Building": "بناء",
    "Accelerating": "تسريع",
    "The future of": "مستقبل",
    "Inside": "نظرة داخل",
    "Our approach to": "نهجنا تجاه",
    "Investing in": "الاستثمار في",
    "Partnership": "شراكة",
    "Available now": "متاح الآن",
    "New": "جديد",
    "Update": "تحديث",
    "Research": "أبحاث",
    "Engineering": "هندسة",
    "Model": "نموذج",
    "System": "نظام",
    "Tool": "أداة",
    "Library": "مكتبة",
    "Agent": "وكيل",
    "Human": "بشري",
    "Intelligence": "ذكاء",
    "Artificial": "اصطناعي",
    "Global": "عالمي",
    "Network": "شبكة",
    "Infrastructure": "بنية تحتية",
    "Training": "تدريب",
    "Inference": "استنتاج",
    "Cloud": "سحابة",
    "Safety": "سلامة",
    "Policy": "سياسة",
    "Security": "أمن",
    "Case Study": "دراسة حالة",
    "Performance": "أداء",
    "Compute": "حوسبة",
    "Memory": "ذاكرة",
    "Storage": "تخزين",
    "Platform": "منصة",
    "Language": "لغة",
    "Video": "فيديو",
    "Audio": "صوت",
    "Vision": "رؤية",
    "Multimodal": "متعدد الأنماط",
    "Open Source": "مصدر مفتوح",
    "Release": "إصدار",
    "Beta": "تجريبي",
    "Preview": "معاينة",
    "Enterprise": "مؤسسات",
    "Developer": "مطور",
    "Toolkit": "مجموعة أدوات"
};

function autoTranslate(text: string): string {
    if (!text) return "";
    let translated = text;

    // Sort keys by length descending to match longest phrases first
    const sortedKeys = Object.keys(COMMON_TERMS_AR).sort((a, b) => b.length - a.length);

    for (const en of sortedKeys) {
        const ar = COMMON_TERMS_AR[en];
        const regex = new RegExp(`\\b${en}\\b`, 'gi');
        translated = translated.replace(regex, ar);
    }

    // Fallback if still mostly English
    if (translated === text || !/[\u0600-\u06FF]/.test(translated)) {
        if (text.toLowerCase().includes('report')) return "تقرير جديد حول " + text;
        return "تحديث رسمي: " + text;
    }

    return translated;
}


async function fetchUpdates() {
    console.log('Starting official content fetch...');

    let allUpdates: UpdateItem[] = [];

    // Extraction function for consistency
    async function enrichItem(item: UpdateItem, companyName: string) {
        try {
            await new Promise(r => setTimeout(r, 1000));
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const pageRes = await fetch(item.url, {
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
                    'Sec-Ch-Ua-Mobile': '?0',
                    'Sec-Ch-Ua-Platform': '"Windows"',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'none',
                    'Sec-Fetch-User': '?1',
                    'Upgrade-Insecure-Requests': '1'
                }
            }).finally(() => clearTimeout(timeoutId));

            if (pageRes.ok) {
                const pageHtml = await pageRes.text();
                const page$ = cheerio.load(pageHtml);

                // Clean Title: Prefer og:title or h1
                const ogTitle = page$('meta[property="og:title"]').attr('content') || page$('meta[name="og:title"]').attr('content');
                const h1Title = page$('h1').first().text().trim();

                if (ogTitle && ogTitle.length > 5) {
                    // Remove site suffix
                    item.title = ogTitle.replace(new RegExp(`\\s*[|\\\\-–—]\\s*(${companyName}|Official|Meta AI|Meta).*$`, 'i'), '').trim();
                } else if (h1Title && h1Title.length > 5) {
                    item.title = h1Title;
                }

                // Extract Image: Prefer og:image or twitter:image
                const ogImage = page$('meta[property="og:image"]').attr('content') ||
                    page$('meta[name="og:image"]').attr('content') ||
                    page$('meta[name="twitter:image"]').attr('content');

                if (ogImage) {
                    // Ensure absolute URL
                    item.image = ogImage.startsWith('http') ? ogImage : new URL(ogImage, item.url).toString();
                }

                // Clean Date: Multiple extraction strategies
                let extractedDate: Date | null = null;

                // Strategy 1: JSON-LD Schema (most reliable for modern sites)
                const jsonLdScript = page$('script[type="application/ld+json"]').text();
                if (jsonLdScript) {
                    try {
                        const jsonLd = JSON.parse(jsonLdScript);
                        const datePublished = jsonLd.datePublished || jsonLd['@graph']?.[0]?.datePublished;
                        if (datePublished) extractedDate = new Date(datePublished);
                    } catch { /* ignore parse errors */ }
                }

                // Strategy 2: time element with datetime
                if (!extractedDate) {
                    const timeEl = page$('time[datetime]').first().attr('datetime');
                    if (timeEl) extractedDate = new Date(timeEl);
                }

                // Strategy 3: meta article:published_time
                if (!extractedDate) {
                    const metaDate = page$('meta[property="article:published_time"]').attr('content') || page$('meta[name="article:published_time"]').attr('content');
                    if (metaDate) extractedDate = new Date(metaDate);
                }

                // Strategy 4: ISO date pattern in HTML (YYYY-MM-DD)
                if (!extractedDate) {
                    const isoMatch = pageHtml.match(/(\d{4}-\d{2}-\d{2})/);
                    if (isoMatch) extractedDate = new Date(isoMatch[1]);
                }

                // Strategy 5: Human-readable date (e.g., "January 22, 2026")
                if (!extractedDate) {
                    const humanDateMatch = pageHtml.match(/(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/i);
                    if (humanDateMatch) extractedDate = new Date(humanDateMatch[0]);
                }

                // Debug logging for Meta AI to understand failure
                if (item.url.includes('ai.meta.com')) {
                    console.log(`[Meta Debug] Enriched ${item.url}`);
                    console.log(`  - Title found: ${item.title}`);
                    console.log(`  - Date extracted: ${extractedDate}`);
                    if (!extractedDate) {
                        console.log(`  - HTML Preview: ${pageHtml.substring(0, 500).replace(/\n/g, ' ')}...`);
                        if (pageHtml.includes('challenge') || pageHtml.includes('captcha') || pageHtml.includes('Cloudflare')) {
                            console.log(`  - BLOCK DETECTED!`);
                        }
                    }
                }

                // Only update if we found a valid date (not NaN)
                if (extractedDate && !isNaN(extractedDate.getTime())) {
                    // Check if it's way in the future (e.g. parsed wrong year) - allow 1 year slack
                    if (extractedDate.getFullYear() <= new Date().getFullYear() + 1) {
                        item.date = extractedDate.toISOString();
                    }
                }

                // Summary: Meta description or og:description
                let summary = page$('meta[name="description"]').attr('content') || '';
                if (!summary) summary = page$('meta[property="og:description"]').attr('content') || page$('meta[name="og:description"]').attr('content') || '';

                // Handle generic meta descriptions (Hugging Face, Anthropic)
                const genericSummaries = [
                    "We’re on a journey to advance and democratize artificial intelligence",
                    "Anthropic is an AI safety and research company",
                    "A Blog post by",
                    "Read more about this post on",
                    "Mistral AI is a research lab building the best open source models"
                ];

                const isGeneric = genericSummaries.some(s => summary.includes(s));

                if (!summary || isGeneric) {
                    // Try first paragraph in article or main content
                    // Enhanced selectors for specific blogs
                    const contentSelectors = [
                        '.prose > p', // Generic prose
                        'article .content > p', // Generic article content
                        'main p', // Main tag
                        'div[class*="content"] > p', // Content divs
                        '.blog-post-content p', // Common blog class
                        'p' // Fallback to any paragraph (risky but better than empty)
                    ];

                    for (const selector of contentSelectors) {
                        page$(selector).each((i, el) => {
                            const text = page$(el).text().trim();
                            // Skip empty, short, or cookie/newsletter warnings
                            if (text.length > 50 && !text.includes('cookie') && !text.includes('newsletter') && !text.includes('Subscribe')) {
                                if (!summary || isGeneric) { // Only override if still empty or generic
                                    summary = text;
                                    return false; // Break loop
                                }
                            }
                        });
                        if (summary && !genericSummaries.some(s => summary.includes(s))) break;
                    }
                }

                if (summary && summary.length > 160) summary = summary.substring(0, 157) + '...';

                // If we found a better summary, use it. Otherwise keep existing RSS summary if available.
                if (summary && summary.length > 10 && summary !== item.summary) {
                    item.summary = summary;
                }

                // Re-tag with summary for better classification
                item.tag = deduceTag(item.title, item.url, item.summary);

                // Placeholder for future automated translation
                // For now, we use a simple heuristic for auto-translation
                if (!item.title_ar) item.title_ar = autoTranslate(item.title);
                if (!item.summary_ar) item.summary_ar = autoTranslate(item.summary || '');
            } else {
                console.log(`  -> Failed to fetch URL ${item.url}: ${pageRes.status}`);
            }
        } catch (e) {
            console.log(`  -> Exception in enrichItem for ${item.url}:`, e);
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

                        const title = feedConfig.titlePrefix && !item.title.startsWith(feedConfig.titlePrefix)
                            ? `${feedConfig.titlePrefix} ${item.title}`
                            : item.title;

                        const update: UpdateItem = {
                            id: item.guid || item.link,
                            company: company.name,
                            title: title,
                            date: item.isoDate || new Date().toISOString(),
                            url: item.link,
                            tag: deduceTag(title, item.link),
                            summary: item.contentSnippet?.slice(0, 150),
                            image: (item as any).enclosure?.url || (item as any).image?.url
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
                            'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand);v="24", "Google Chrome";v="122"',
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

                    // Common navigation/footer text to exclude
                    const excludedTitles = ['the latest', 'featured', 'about', 'careers', 'research',
                        'resources', 'blog', 'newsletter', 'subscribe', 'sign up', 'explore',
                        'privacy policy', 'terms', 'cookies', 'get llama', 'try meta ai',
                        'get meta ai', 'ai studio', 'meta ai', 'foundational models', 'our approach',
                        'latest news', 'demos', 'infrastructure', 'people', 'llama'];

                    $('a').each((_: any, el: any) => {
                        const $el = $(el);
                        const href = $el.attr('href');
                        const title = $el.text().trim();

                        if (!href || !title || title.length < 10) return;

                        // Exclude navigation links
                        if (excludedTitles.includes(title.toLowerCase())) return;

                        // Must be an article-like path
                        const isContent = href.includes('/index/') || href.includes('/news/') ||
                            href.includes('/research/') || href.includes('/blog/') || href.includes('/hub/') ||
                            href.includes('/announcements/');
                        if (!isContent) return;

                        // For Meta AI specifically, the path should have a slug after /blog/
                        // e.g., /blog/sam-audio/ is valid, but /blog/ alone is not
                        if (href.includes('/blog/')) {
                            const blogSlug = href.split('/blog/')[1];
                            if (!blogSlug || blogSlug.length < 3 || blogSlug === '/') return;
                        }

                        const fullUrl = href.startsWith('http') ? href : new URL(href, feedConfig.url).toString();
                        if (scrapedItems.find(i => i.url === fullUrl)) return;

                        scrapedItems.push({
                            id: fullUrl,
                            company: company.name,
                            title: title,
                            date: new Date().toISOString(), // Will be enriched
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

fetchUpdates().catch(async (err) => {
    console.error('Fatal Error in fetchUpdates:', err);
    // Still try to update metadata to show we tried
    try {
        const metadata = {
            lastUpdated: new Date().toISOString(),
            status: 'failed',
            error: err.message
        };
        await fs.writeFile(path.join(process.cwd(), 'data', 'metadata.json'), JSON.stringify(metadata, null, 2));
    } catch (e) {
        console.error('Could not write metadata after error', e);
    }
    process.exit(1);
});
