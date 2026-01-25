
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Q&A - Official.ai',
    description: 'Frequently asked questions about Official.ai'
};

export default function QAPage() {
    return (
        <div className="container-max py-32 animate-fade-in-up">
            <h1 className="text-3xl font-display font-medium mb-12 text-[var(--color-foreground)]">Frequently Asked Questions</h1>

            <div className="space-y-8 max-w-3xl">
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-[var(--color-foreground)] mb-3">What is Official.ai?</h3>
                    <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                        Official.ai is a dedicated aggregator for official news, research, and product announcements from the world's leading Artificial Intelligence labs. We filter out speculation, rumors, and third-party commentary to provide a clean signal of what's actually happening.
                    </p>
                </div>

                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-[var(--color-foreground)] mb-3">Which sources do you track?</h3>
                    <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                        We currently track official blogs, press releases, and verified social media channels of major AI companies including OpenAI, Google DeepMind, Anthropic, Meta AI, Microsoft, Mistral, and others. The list is constantly expanding.
                    </p>
                </div>

                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-[var(--color-foreground)] mb-3">How often is the data updated?</h3>
                    <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                        Our system indexes new announcements every few hours. We prioritize major releases to ensure they appear on the site as quickly as possible.
                    </p>
                </div>

                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-[var(--color-foreground)] mb-3">Is this a free service?</h3>
                    <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                        Yes, Official.ai is currently free to use. Our mission is to democratize access to high-quality information about AI progress.
                    </p>
                </div>
            </div>
        </div>
    );
}
