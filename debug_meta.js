
const cheerio = require('cheerio');
const fs = require('fs');

const html = fs.readFileSync('temp_meta.html', 'utf8');
const $ = cheerio.load(html);

console.log('--- Debugging Meta AI HTML Extraction ---');

// 1. Title
const ogTitle = $('meta[property="og:title"]').attr('content');
const h1Title = $('h1').first().text().trim();
console.log('OG Title:', ogTitle);
console.log('H1 Title:', h1Title);

// 2. Description
const metaDesc = $('meta[name="description"]').attr('content');
const ogDesc = $('meta[property="og:description"]').attr('content');
console.log('Meta Description:', metaDesc);
console.log('OG Description:', ogDesc);

// 3. Date
const dateMatch = html.match(/(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/i);
console.log('Regex Date Match:', dateMatch ? dateMatch[0] : 'No match');

// 4. Content Text (fallback for summary)
const firstP = $('article p, main p, .content p').first().text().trim();
console.log('First P:', firstP);
