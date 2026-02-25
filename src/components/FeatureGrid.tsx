
import { ShieldCheck, Zap, Radio } from 'lucide-react';

export function FeatureGrid() {
    const features = [
        {
            icon: <ShieldCheck className="w-6 h-6" />,
            title: 'Verified Sources',
            desc: 'We monitor official company blogs and press releases directly. No Twitter rumors or speculation.'
        },
        {
            icon: <Radio className="w-6 h-6" />,
            title: 'Real-time Signal',
            desc: 'Updates are indexed within minutes of publication. Be the first to know about new models and research.'
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: 'Zero Noise',
            desc: 'We filter out marketing fluff. Only engineering, research, and major product announcements make the cut.'
        }
    ];

    return (
        <section className="container-max py-16 border-b border-[var(--color-border)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((f, i) => (
                    <div key={i} className="flex flex-col gap-4 p-6 rounded-xl hover:bg-[var(--color-muted)]/10 transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-foreground)] shadow-sm">
                            {f.icon}
                        </div>
                        <h3 className="text-xl font-display font-bold text-[var(--color-foreground)]">
                            {f.title}
                        </h3>
                        <p className="text-[var(--color-muted-foreground)] leading-relaxed text-sm">
                            {f.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
