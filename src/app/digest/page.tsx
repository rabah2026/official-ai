'use client';

import { useLanguage } from '@/components/LanguageContext';

export default function DigestPage() {
    const { t, isRTL } = useLanguage();

    return (
        <>
            {/* Hero Section */}
            <section className="hero-section" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="container-max" style={{ textAlign: 'center' }}>
                    <h1 className="hero-title" style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        fontFamily: isRTL ? 'Amiri, serif' : undefined
                    }}>
                        {t('waitlist_title')}
                    </h1>
                    <p className="hero-subtitle" style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        maxWidth: '480px',
                        fontFamily: isRTL ? 'Noto Sans Arabic, sans-serif' : undefined
                    }}>
                        {t('waitlist_subtitle')}
                    </p>
                </div>
            </section>

            {/* Signup Section - Centered */}
            <section className="container-max" style={{ paddingTop: '2rem', paddingBottom: '4rem' }} dir={isRTL ? 'rtl' : 'ltr'}>
                <div style={{
                    maxWidth: '500px',
                    margin: '0 auto',
                    textAlign: 'center'
                }}>
                    {/* Benefits */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2rem',
                        marginBottom: '2.5rem',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                border: '1px solid var(--color-border)',
                                background: 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                margin: '0 auto 1rem',
                                borderRadius: '4px'
                            }}>⭐</div>
                            <div style={{
                                fontFamily: isRTL ? 'Noto Sans Arabic, sans-serif' : "var(--font-display)",
                                fontSize: '1.25rem',
                                color: 'var(--color-foreground)'
                            }}>{t('waitlist_priority')}</div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                border: '1px solid var(--color-border)',
                                background: 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                margin: '0 auto 1rem',
                                borderRadius: '4px'
                            }}>💎</div>
                            <div style={{
                                fontFamily: isRTL ? 'Noto Sans Arabic, sans-serif' : "var(--font-display)",
                                fontSize: '1.25rem',
                                color: 'var(--color-foreground)'
                            }}>{t('waitlist_insider')}</div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                border: '1px solid var(--color-border)',
                                background: 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                margin: '0 auto 1rem',
                                borderRadius: '4px'
                            }}>🛡️</div>
                            <div style={{
                                fontFamily: isRTL ? 'Noto Sans Arabic, sans-serif' : "var(--font-display)",
                                fontSize: '1.25rem',
                                color: 'var(--color-foreground)'
                            }}>{t('waitlist_secure')}</div>
                        </div>
                    </div>

                    {/* Signup Form */}
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        style={{ marginBottom: '1.5rem' }}
                    >
                        <input
                            type="email"
                            placeholder={isRTL ? "بريدك الإلكتروني" : "you@company.com"}
                            required
                            style={{
                                width: '100%',
                                padding: '1.1rem',
                                fontSize: '1.1rem',
                                border: '2px solid var(--color-foreground)',
                                background: 'var(--color-surface)',
                                color: 'var(--color-foreground)',
                                outline: 'none',
                                marginBottom: '0.75rem',
                                textAlign: 'center',
                                fontFamily: isRTL ? 'Noto Sans Arabic, sans-serif' : undefined
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '1.25rem 2rem',
                                fontSize: '0.95rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                background: 'var(--color-accent)',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontFamily: isRTL ? 'Amiri, serif' : undefined
                            }}
                        >
                            {t('waitlist_button')}
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}

