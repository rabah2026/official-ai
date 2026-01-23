
import { CompanyConfig } from './types';

export const COMPANIES: CompanyConfig[] = [



    {
        id: 'openai',
        name: 'OpenAI',
        url: 'https://openai.com',
        logo: '/logos/openai.svg',
        feeds: [
            // Official News RSS Feed (primary source for announcements)
            { url: 'https://openai.com/news/rss.xml', type: 'rss' },
            // Official Python SDK Releases (technical updates)
            { url: 'https://github.com/openai/openai-python/releases.atom', type: 'rss', tagDefault: 'Engineering', titlePrefix: 'OpenAI Python Library' }
        ]
    },
    {
        id: 'anthropic',
        name: 'Anthropic',
        url: 'https://www.anthropic.com',
        logo: '/logos/anthropic.svg',
        feeds: [
            // Anthropic main feed is usually /index.xml or /feed
            { url: 'https://www.anthropic.com/index.xml', type: 'rss' },
            { url: 'https://www.anthropic.com/feed', type: 'rss' },
            { url: 'https://www.anthropic.com/news', type: 'html' }
        ]
    },
    {
        id: 'google-deepmind',
        name: 'Google DeepMind',
        url: 'https://deepmind.google',
        logo: '/logos/google-deepmind.svg',
        feeds: [
            { url: 'https://deepmind.google/blog/rss.xml', type: 'rss' }
        ]
    },
    {
        id: 'meta-ai',
        name: 'Meta AI',
        url: 'https://ai.meta.com',
        logo: '/logos/meta-ai.svg',
        feeds: [
            // Meta AI blog HTML scraping (RSS is unreliable)
            { url: 'https://ai.meta.com/blog/', type: 'html' }
        ]
    },
    {
        id: 'mistral-ai',
        name: 'Mistral AI',
        url: 'https://mistral.ai',
        logo: '/logos/mistral-ai.svg',
        feeds: [
            { url: 'https://mistral.ai/news/', type: 'html' }
        ]
    },
    {
        id: 'hugging-face',
        name: 'Hugging Face',
        url: 'https://huggingface.co',
        logo: '/logos/hugging-face.svg',
        feeds: [
            { url: 'https://huggingface.co/blog/feed.xml', type: 'rss' }
        ]
    },
    {
        id: 'nvidia',
        name: 'NVIDIA',
        url: 'https://www.nvidia.com',
        logo: '/logos/nvidia.svg',
        feeds: [
            { url: 'https://developer.nvidia.com/blog/feed', type: 'rss' }
        ]
    },
    {
        id: 'microsoft',
        name: 'Microsoft',
        url: 'https://www.microsoft.com',
        logo: '/logos/microsoft.svg',
        feeds: [
            { url: 'https://blogs.microsoft.com/ai/feed/', type: 'rss' },
            { url: 'https://azure.microsoft.com/en-us/blog/feed/', type: 'rss', tagDefault: 'News' }
        ]
    },
    {
        id: 'stability-ai',
        name: 'Stability AI',
        url: 'https://stability.ai',
        logo: '/logos/stability-ai.svg',
        feeds: [
            { url: 'https://stability.ai/news?format=rss', type: 'rss' }
        ]
    },
    {
        id: 'cohere',
        name: 'Cohere',
        url: 'https://cohere.com',
        logo: '/logos/cohere.svg',
        feeds: [
            { url: 'https://cohere.com/blog/rss.xml', type: 'rss' }
            // Note: Cohere often doesn't have a standard RSS at root, need to verify.
            // If this fails, we might need a more specific one or html parser.
        ]
    },
    {
        // Midjourney notoriously has no public blog feed. 
        // We will target their docs changelog if available or x.ai for now.
        // Actually, let's omit Midjourney if no official feed exists to strict adherance to "No unofficial content".
        // Wait, they have a "Updates" channel on Discord, not web.
        // I will stick to "Signal over Noise". If no web source, don't fake it. 
        // But I will add X.AI.
        id: 'x-ai',
        name: 'X.AI',
        url: 'https://x.ai',
        logo: '/logos/x-ai.svg',
        feeds: [
            // X.AI blog does not have a discovered RSS yet?
            // Usually valid: https://x.ai/blog/rss.xml or similar.
            // If unsure, leave empty and let fetcher fail/warn.
            { url: 'https://x.ai/blog/rss.xml', type: 'rss' }
        ]
    }
];
