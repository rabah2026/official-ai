
import * as cheerio from 'cheerio';

export interface ExtractedArticle {
    title: string;
    content: string;
    company?: string;
    date?: string;
    author?: string;
    image?: string;
}

export async function extractArticleContent(url: string): Promise<ExtractedArticle | null> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml',
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            console.error(`Failed to fetch article: ${url}, status: ${response.status}`);
            return null;
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // --- STEP 1: INITIAL METADATA EXTRACTION ---
        // We need this early for deduplication later
        const title = ($('h1').first().text() || $('title').text() || '').trim();
        const image = $('meta[property="og:image"]').attr('content') || '';
        const author = ($('meta[name="author"]').attr('content') || $('.author-name').first().text() || '').trim();
        const date = ($('meta[property="article:published_time"]').attr('content') || $('time').first().attr('datetime') || $('time').first().text() || '').trim();

        // Remove noise
        $('script, style, nav, footer, iframe, noscript, .cookie-banner, #cookie-banner, .newsletter-signup, .related-posts, .social-share, aside, .article-hero, .article-meta, .audio-player-tts, .uni-social-share, .uni-blog-article-tags').remove();

        // Target content selectors common in AI blog sites
        const contentSelectors = [
            '.rich-text',
            '.article-container__content',
            '.post-content',
            '.blog-post-content',
            'article',
            '.prose',
            '.content-body',
            'main',
            '.main-content',
            '.article-body',
            '#content',
            '.post-body',
            '.entry-content',
            '.post-content-inner',
            '.article-content',
            '.blog-post-body'
        ];

        let $content: any = null;

        for (const selector of contentSelectors) {
            const el = $(selector);
            if (el.length > 0) {
                // Pick the one with the most text
                if (!$content || el.text().trim().length > $content.text().trim().length) {
                    $content = el;
                }
                if (el.text().trim().length > 1000) break;
            }
        }

        // Fallback to body if no container found
        if (!$content) $content = $('body');

        // --- STEP 2: AGGRESSIVE CLEANUP ---
        const noiseSelectors = [
            'script', 'style', 'nav', 'footer', 'iframe', 'noscript', 'svg',
            '.cookie-banner', '#cookie-banner', '.newsletter-signup', '.related-posts',
            '.social-share', 'aside', '.article-hero', '.article-meta', '.audio-player-tts',
            '.uni-social-share', '.uni-blog-article-tags', '.share-buttons', '.author-box',
            '.newsletter', '.sidebar', '.comments-area', '.sidebar-right', '.sidebar-left',
            '.banner', '.ad', '.advertisement', '[role="complementary"]',
            '.share', '.social', '.feedback-buttons', '.reaction-buttons', '.comment-count',
            '.blog-post-meta', '.article-utility', '.post-header-meta', '.entry-meta',
            '.related-articles', '.more-from', '.previous-next', '.post-navigation',
            '.tags-links', '.cat-links', '.entry-footer'
        ];
        $content.find(noiseSelectors.join(', ')).remove();

        // Remove links/buttons that look like social sharing or navigational noise
        $content.find('a, button, span, div, h1, h2, h3, h4, time').each((_: any, el: any) => {
            const $el = $(el);
            const text = $el.text().trim();
            const textLower = text.toLowerCase();

            // 1. FILTER TITLES (Deduplication)
            // Remove text that matches the article title to avoid duplication in reader
            if (text.length > 5 && (title.toLowerCase().includes(textLower) || textLower.includes(title.toLowerCase()))) {
                $el.remove();
                return;
            }

            // 2. FILTER INTERACTIVE/METADATA NOISE
            const forbiddenPhrases = [
                'share on', 'tweet', 'facebook', 'linkedin', 'like this',
                'comment', 'post a comment', 'follow us', 'subscribe',
                'read more', 'related content', 'privacy policy', 'terms of use',
                'loading...', 'productreleasecompany', 'productrelease', 'companyrelease',
                'share', 'likes', 'comments', 'retweets', 'previous post', 'next post',
                'read next', 'more from', 'back to blog', 'latest updates'
            ];

            if (forbiddenPhrases.some(phrase => textLower === phrase || textLower.startsWith(phrase) || (text.length < 20 && textLower.includes(phrase)))) {
                $el.remove();
                return;
            }

            // 3. FILTER STANDALONE DATES
            if (/^[A-Z][a-z]+ \d{1,2}, \d{4}$/.test(text) || /^\d{4}-\d{2}-\d{2}$/.test(text)) {
                $el.remove();
            }
        });

        // Strip attributes except for limited whitelist
        $content.find('*').each((_: any, el: any) => {
            const attributes = el.attribs || {};
            const whitelisted = ['src', 'href', 'alt', 'target', 'rel'];
            Object.keys(attributes).forEach(attr => {
                if (!whitelisted.includes(attr)) {
                    $(el).removeAttr(attr);
                }
            });
        });

        let contentHtml = $content.html() || '';

        // --- STEP 3: POST-PROCESSING ---
        contentHtml = contentHtml
            .replace(/<p>\s*<\/p>/g, '')
            .replace(/<div>\s*<\/div>/g, '')
            .replace(/<p>\s*&nbsp;\s*<\/p>/g, '')
            .replace(/\s+/g, ' ')
            .trim();

        return {
            title,
            content: contentHtml,
            image,
            author,
            date,
            company: '' // Will be populated in the page component from updates.json
        };
    } catch (error) {
        console.error('Error extracting article content:', error);
        return null;
    }
}
