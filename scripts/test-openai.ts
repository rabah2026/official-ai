
import * as cheerio from 'cheerio';

async function testOpenAI() {
    const url = 'https://openai.com/news';
    console.log(`Fetching ${url}...`);
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        console.log(`Status: ${res.status}`);
        if (!res.ok) return;

        const html = await res.text();
        const $ = cheerio.load(html);

        // Check for news items
        // OpenAI's structure changes often. Looking for common patterns.
        // Usually lists are in <ul> or <div> grid.
        // Let's print out some probable classes to debug.

        const links = $('a');
        console.log(`Found ${links.length} links.`);

        links.each((i, el) => {
            const href = $(el).attr('href');
            const text = $(el).text().trim();
            if (href && (href.includes('/index') || href.includes('news') || href.includes('blog'))) {
                if (i < 5) {
                    console.log(`\nLink: [${text}](${href})`);
                    // Check parent and siblings for potential summary
                    const parent = $(el).parent();
                    console.log(`Parent tag: ${parent.get(0)?.tagName}`);
                    console.log(`Parent text: ${parent.text().trim().substring(0, 100)}...`);
                    console.log(`Next Sibling text: ${$(el).next().text().trim().substring(0, 100)}...`);
                    // Check if it's in a grid card
                    const card = $(el).closest('div');
                    console.log(`Closest DIV text (card?): ${card.text().trim().substring(0, 100)}...`);
                }
            }
        });

    } catch (e) {
        console.error("Error:", e);
    }
}

async function testGitHub() {
    const url = 'https://github.com/openai/openai-python/releases.atom';
    console.log(`\nFetching ${url}...`);
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        console.log(`Status: ${res.status}`);
    } catch (e) {
        console.error("Error git:", e);
    }
}

testOpenAI();
testGitHub();
