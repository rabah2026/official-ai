
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Legal - Official.ai',
    description: 'Legal information and terms of service for Official.ai'
};

export default function LegalPage() {
    return (
        <div className="container-max py-16">
            <h1 className="text-3xl font-display font-medium mb-8">Legal Information</h1>
            <div className="prose dark:prose-invert max-w-none">
                <p className="text-[var(--color-muted-foreground)]">
                    Content coming soon...
                </p>
            </div>
        </div>
    );
}
