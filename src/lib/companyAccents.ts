/**
 * Official.ai — Company Brand Accent Colors
 * Single source of truth for per-lab accent colors used across:
 *  - HomePageContent.tsx (Latest From Each Lab cards)
 *  - article/page.tsx (sidebar border, progress bar, meta bar)
 *  - CompaniesPageContent.tsx (company grid cards)
 *
 * When adding a new lab, add its accent here.
 */
export const COMPANY_ACCENTS: Record<string, string> = {
    'OpenAI': '#10a37f', // OpenAI brand green
    'Anthropic': '#c96442', // Anthropic terracotta
    'Google / Gemini': '#4285F4', // Google blue
    'Meta AI': '#0866FF', // Meta blue
    'Mistral AI': '#F54E42', // Mistral red
    'Hugging Face': '#FFB800', // HF yellow (darkened for readability)
    'Microsoft': '#00A4EF', // Microsoft blue
    'NVIDIA': '#76B900', // NVIDIA green
    'X.AI': '#a3a3a3', // Grok neutral gray
    'DeepSeek': '#4D6BFE', // DeepSeek blue
    'Stability AI': '#8B5CF6', // Stability purple
    'Perplexity': '#20B2AA', // Perplexity teal
    'Amazon': '#FF9900', // Amazon orange
    'Apple': '#555555', // Apple gray
    'Cohere': '#39594D', // Cohere dark teal
};
