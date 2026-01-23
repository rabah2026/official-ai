'use client';

import { useLanguage } from './LanguageContext';

export function LanguageToggle() {
    const { lang, setLang } = useLanguage();

    return (
        <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            style={{
                background: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: '4px',
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                color: 'var(--color-muted-foreground)',
                transition: 'all 0.2s ease',
                marginLeft: lang === 'en' ? '0.5rem' : '0',
                marginRight: lang === 'ar' ? '0.5rem' : '0',
            }}
            className="lang-toggle"
        >
            {lang === 'en' ? 'العربية' : 'English'}
        </button>
    );
}
