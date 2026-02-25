
import { CompanyConfig } from './types';

export const COMPANIES: CompanyConfig[] = [
    {
        id: 'openai',
        name: 'OpenAI',
        url: 'https://openai.com',
        logo: '/logos/openai.svg',
        feeds: [
            { url: 'https://openai.com/news/rss.xml', type: 'rss' },
        ]
    },
    {
        id: 'anthropic',
        name: 'Anthropic',
        url: 'https://www.anthropic.com',
        logo: '/logos/anthropic.svg',
        feeds: [
            { url: 'https://www.anthropic.com/index.xml', type: 'rss' },
            { url: 'https://www.anthropic.com/news', type: 'html' },
        ]
    },
    {
        id: 'google-gemini',
        name: 'Google / Gemini',
        url: 'https://blog.google/technology/ai/',
        logo: '/logos/google-gemini.svg',
        feeds: [
            { url: 'https://deepmind.google/blog/rss.xml', type: 'rss' },
            { url: 'https://blog.google/technology/ai/rss/', type: 'rss' },
        ]
    },
    {
        id: 'meta-ai',
        name: 'Meta AI',
        url: 'https://ai.meta.com',
        logo: '/logos/meta-ai.svg',
        feeds: [
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
        id: 'stability-ai',
        name: 'Stability AI',
        url: 'https://stability.ai',
        logo: '/logos/stability-ai.svg',
        feeds: [
            { url: 'https://stability.ai/news?format=rss', type: 'rss' }
        ]
    },
    {
        id: 'x-ai',
        name: 'X.AI',
        url: 'https://x.ai',
        logo: '/logos/x-ai.svg',
        feeds: [
            { url: 'https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_xainews.xml', type: 'rss' }
        ]
    },
    {
        // Removed: Microsoft, Cohere, DeepSeek, Perplexity — 0 articles fetched successfully
        // Kept for future re-introduction when feeds are confirmed working
        id: 'amazon-aws',
        name: 'Amazon',
        url: 'https://aws.amazon.com/blogs/machine-learning/',
        logo: '/logos/amazon.svg',
        feeds: [
            { url: 'https://aws.amazon.com/blogs/machine-learning/feed/', type: 'rss' }
        ]
    },
    {
        id: 'apple',
        name: 'Apple',
        url: 'https://machinelearning.apple.com',
        logo: '/logos/apple.svg',
        feeds: [
            { url: 'https://machinelearning.apple.com/rss.xml', type: 'rss' }
        ]
    },
];
