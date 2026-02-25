
import { extractArticleContent } from '../src/lib/content-extractor';
import fs from 'fs';

async function test() {
    const urls = [
        'https://blog.google/innovation-and-ai/products/responsible-ai-2026-report-ongoing-work/',
        'https://www.anthropic.com/news/anthropic-infosys',
        'https://developer.nvidia.com/blog/build-ai-ready-knowledge-systems-using-5-essential-multimodal-rag-capabilities/'
    ];

    for (const url of urls) {
        console.log('Testing extraction for:', url);
        const article = await extractArticleContent(url);
        if (!article) {
            console.error('Extraction failed for:', url);
            continue;
        }
        console.log('Title:', article.title);
        console.log('Content Length:', article.content?.length || 0);
        console.log('---');
    }
}

test();
