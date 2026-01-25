
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Q&A - Official.ai',
    description: 'Frequently asked questions about Official.ai'
};

export default function QAPage() {
    return (
        <div className="container-max py-16">
            <h1 className="text-3xl font-display font-medium mb-8">Frequently Asked Questions</h1>
            <div className="prose dark:prose-invert max-w-none">
                <p className="text-[var(--color-muted-foreground)]">
                    Content coming soon...
                </p>
            </div>
        </div>
    );
}
