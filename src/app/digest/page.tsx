'use client';

export default function DigestPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container-max" style={{ textAlign: 'center' }}>
                    <h1 className="hero-title" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                        Weekly<br />Digest
                    </h1>
                    <p className="hero-subtitle" style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: '480px' }}>
                        A curated summary of the week's most important AI announcements, delivered to your inbox every Monday.
                    </p>
                </div>
            </section>

            {/* Signup Section - Centered */}
            <section className="container-max" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
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
                                width: '48px',
                                height: '48px',
                                background: '#1a1a1a',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.25rem',
                                margin: '0 auto 0.75rem'
                            }}>📧</div>
                            <div style={{
                                fontFamily: "'Instrument Serif', Georgia, serif",
                                fontSize: '1rem',
                                fontWeight: 400,
                                color: '#1a1a1a'
                            }}>Weekly</div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: '#1a1a1a',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.25rem',
                                margin: '0 auto 0.75rem'
                            }}>🎯</div>
                            <div style={{
                                fontFamily: "'Instrument Serif', Georgia, serif",
                                fontSize: '1rem',
                                fontWeight: 400,
                                color: '#1a1a1a'
                            }}>Signal Only</div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: '#1a1a1a',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.25rem',
                                margin: '0 auto 0.75rem'
                            }}>🔒</div>
                            <div style={{
                                fontFamily: "'Instrument Serif', Georgia, serif",
                                fontSize: '1rem',
                                fontWeight: 400,
                                color: '#1a1a1a'
                            }}>No Spam</div>
                        </div>
                    </div>

                    {/* Signup Form */}
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        style={{ marginBottom: '1rem' }}
                    >
                        <input
                            type="email"
                            placeholder="you@company.com"
                            required
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1rem',
                                border: '2px solid #1a1a1a',
                                background: '#fff',
                                outline: 'none',
                                marginBottom: '0.75rem',
                                textAlign: 'center'
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '1rem 2rem',
                                fontSize: '0.875rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                background: '#ff4f00',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            Subscribe to Weekly Digest
                        </button>
                    </form>

                    <p style={{ fontSize: '0.8rem', color: '#737373' }}>
                        Join 2,000+ AI professionals. Unsubscribe anytime.
                    </p>
                </div>
            </section>
        </>
    );
}
