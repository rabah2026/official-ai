'use client';

import Link from "next/link";
import { useLanguage } from "./LanguageContext";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";

import { format } from 'date-fns';
import { enUS, arSA } from 'date-fns/locale';

interface MainLayoutProps {
    children: React.ReactNode;
    lastUpdated: string; // ISO string
}

export function MainLayout({ children, lastUpdated }: MainLayoutProps) {
    const { t, isRTL } = useLanguage();

    // Format date based on current language
    const dateObj = new Date(lastUpdated);
    const locale = isRTL ? arSA : enUS;

    const formattedDate = format(dateObj, 'PP p', { locale });

    return (
        <div dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Header */}
            <header className="site-header">
                <div className="header-inner">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Link href="/" className="site-logo">
                            {t('app_title')}
                        </Link>
                        <span
                            suppressHydrationWarning
                            style={{
                                fontSize: '0.65rem',
                                color: '#737373',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginTop: '0.25rem'
                            }}>
                            {t('last_updated')}: {formattedDate}
                        </span>
                    </div>
                    <nav className="site-nav" style={{ alignItems: 'center' }}>
                        <Link href="/companies">{t('companies')}</Link>
                        <Link href="/digest">{t('digest')}</Link>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: isRTL ? '0' : '0.5rem', marginRight: isRTL ? '0.5rem' : '0' }}>
                            <ThemeToggle />
                            <LanguageToggle />
                        </div>
                    </nav>
                </div>
            </header>

            <main>
                {children}
            </main>

            {/* Footer */}
            <footer className="site-footer">
                <div className="container-max footer-content">
                    <p className="footer-tagline">{t('tagline')}</p>
                    <div className="footer-links">
                        <Link href="/companies">{t('all_companies')}</Link>
                        <Link href="/digest">{t('subscribe')}</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
