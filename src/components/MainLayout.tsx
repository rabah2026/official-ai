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
                            className="hide-mobile"
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
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: isRTL ? '0' : '0.5rem', marginRight: isRTL ? '0.5rem' : '0' }}>
                            <ThemeToggle />
                            {/* <LanguageToggle /> Hidden per user request */}
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
                    <div className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Link href="/companies">{t('all_companies')}</Link>
                            <Link href="/about">{t('footer_about')}</Link>
                            <Link href="/qa">{t('footer_qa')}</Link>
                            <Link href="/legal">{t('footer_legal')}</Link>
                        </div>

                        <div style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span>{t('footer_made_by')}</span>
                            <a
                                href="https://github.com/rabah2026"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[var(--color-primary)] transition-colors font-medium"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                            >
                                {t('footer_rabah')}
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
