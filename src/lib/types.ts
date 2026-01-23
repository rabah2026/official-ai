
export type Tag =
    | 'Product'      // Actual launches, new features, model releases
    | 'Research'     // Papers, studies, benchmarks
    | 'Engineering'  // Technical blogs, infrastructure
    | 'Case Study'   // Customer stories, use cases
    | 'Corporate'    // Appointments, partnerships, investments
    | 'Pricing'
    | 'Policy'
    | 'Security'
    | 'Docs';


export type Company =
    | 'OpenAI'
    | 'Anthropic'
    | 'Google DeepMind'
    | 'Meta AI'
    | 'Mistral AI'
    | 'Hugging Face'
    | 'NVIDIA'
    | 'Microsoft'
    | 'Stability AI'
    | 'Cohere'
    | 'Midjourney'
    | 'X.AI';

export interface UpdateItem {
    id: string; // Unique ID (hash or URL)
    company: Company;
    title: string;
    date: string; // ISO string
    url: string;
    tag: Tag;
    summary?: string; // Optional one-line summary
}

export interface CompanyConfig {
    id: string; // internal slug e.g. 'openai'
    name: Company;
    url: string; // Official homepage
    logo: string; // Path to logo asset or partial
    feeds: FeedConfig[];
}

export interface FeedConfig {
    url: string;
    type: 'rss' | 'html';
    tagDefault?: Tag;
}
