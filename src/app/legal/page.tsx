
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Legal - Official.ai',
    description: 'Legal information and terms of service for Official.ai'
};

export default function LegalPage() {
    return (
        <div className="container-max py-16 animate-fade-in-up">
            <h1 className="text-3xl font-display font-medium mb-10 text-[var(--color-foreground)]">Legal Information</h1>

            <div className="prose dark:prose-invert max-w-none text-[var(--color-muted-foreground)]">
                <section className="mb-10">
                    <h2 className="text-xl font-medium text-[var(--color-foreground)] mb-4">Disclaimer</h2>
                    <p className="mb-4">
                        Official.ai is an independent aggregator of public information. We are not affiliated with, endorsed by, or sponsored by any of the companies or organizations mentioned on this website (including but not limited to OpenAI, Google DeepMind, Anthropic, Meta, Microsoft, etc.).
                    </p>
                    <p>
                        All trademarks, logos, and brand names are the property of their respective owners. Content displayed on this site is for informational purposes only and references public announcements.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-xl font-medium text-[var(--color-foreground)] mb-4">Terms of Use</h2>
                    <p className="mb-4">
                        By using Official.ai, you agree to use the information provided responsibly. We strive for accuracy but do not guarantee the real-time precision of all aggregated data.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-medium text-[var(--color-foreground)] mb-4">Privacy Policy</h2>
                    <p>
                        We respect your privacy. Official.ai does not collect personal data or use cookies for tracking purposes without explicit consent. The site functions as a read-only aggregator.
                    </p>
                </section>
            </div>
        </div>
    );
}
