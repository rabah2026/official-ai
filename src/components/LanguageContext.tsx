'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface Translations { [key: string]: string; }

const translations: Record<Language, Translations> = {
    en: {
        app_title: 'Official.ai',
        tagline: 'Signal over noise',
        last_updated: 'Last Updated',
        companies: 'Companies',
        digest: 'Waitlist',
        waitlist_title: 'Waitlist',
        waitlist_subtitle: 'Join the waitlist to get early access to our premium features and upcoming tools.',
        waitlist_button: 'Join the Waitlist',
        waitlist_priority: 'Priority',
        waitlist_insider: 'Insider',
        waitlist_secure: 'Secure',
        featured_releases: 'Featured Releases',
        all_count: 'All',
        subscribe: 'Join Waitlist',
        all_companies: 'All Companies',
        hero_title_companies: 'AI Labs<br />We Track',
        hero_subtitle_companies: 'Official announcements from the world\'s leading artificial intelligence research labs and companies.',
        article_count_one: 'article',
        article_count_many: 'articles',
        no_updates: 'No updates found. System initializing...',
        no_filter_results: 'No updates found for this filter.',
        signal_over_noise: 'Signal over noise',
        aggregates_note: 'aggregates only verified announcements from the world\'s leading AI labs. No rumors. No opinions. Just the facts.',
        more: 'more',
        updates_badge: 'Updates',
        hero_line1: 'The Signal',
        hero_line2: 'in the Noise',
        official_announcements: 'Official announcements from',
        official_announcements_short: 'From',
        recent: 'Recent',
        tag_Release: 'Release',
        tag_News: 'News',
        tag_Research: 'Research',
        tag_Engineering: 'Engineering',
        tag_Case_Study: 'Case Study',
        tag_Corporate: 'Corporate',
        tag_Pricing: 'Pricing',
        tag_Policy: 'Policy',
        tag_Security: 'Security',
        tag_Docs: 'Docs',
        footer_qa: 'Q&A',
        footer_legal: 'Legal',
        footer_about: 'About',
        footer_made_by: 'Made with love by',
        footer_rabah: 'Rabah Madani'
    },
    ar: {
        app_title: 'أوفيشال',
        tagline: 'المصدر الرسمي لأخبار ومستجدات مختبرات الذكاء الاصطناعي',
        last_updated: 'آخر تحديث',
        companies: 'الشركات',
        digest: 'قائمة الانتظار',
        waitlist_title: 'قائمة الانتظار',
        waitlist_subtitle: 'انضم إلى قائمة الانتظار للحصول على وصول مبكر للميزات المتقدمة والأدوات القادمة.',
        waitlist_button: 'انضم إلى قائمة الانتظار',
        waitlist_priority: 'أولوية',
        waitlist_insider: 'مطلع',
        waitlist_secure: 'آمن',
        featured_releases: 'إصدارات مميزة',
        all_count: 'الكل',
        subscribe: 'انضم للقائمة',
        all_companies: 'جميع الشركات',
        hero_title_companies: 'مختبرات الذكاء الاصطناعي<br />التي نتابعها',
        hero_subtitle_companies: 'الإعلانات الرسمية من رواد أبحاث وشركات الذكاء الاصطناعي في العالم.',
        article_count_one: 'مقال',
        article_count_many: 'مقال',
        no_updates: 'لا توجد تحديثات حالياً.. النظام قيد المزامنة',
        no_filter_results: 'لم يتم العثور على نتائج لهذا القسم',
        signal_over_noise: 'المعلومة من مصدرها',
        aggregates_note: 'منصة متخصصة ترصد الإعلانات الموثقة فقط من رواد صناعة الذكاء الاصطناعي عالمياً. لا مكان للشائعات أو التكهنات؛ نوفر لك المعلومة من مصدرها الرسمي مباشرة.',
        more: 'تحديثات أخرى',
        updates_badge: 'تحديث',
        hero_line1: 'المصدر الرسمي',
        hero_line2: 'لأحدث تقنيات الذكاء الاصطناعي',
        official_announcements: 'الإعلانات الرسمية من',
        official_announcements_short: 'من',
        recent: 'حديثاً',
        tag_Release: 'إصدار',
        tag_News: 'أخبار',
        tag_Research: 'أبحاث',
        tag_Engineering: 'هندسة',
        tag_Case_Study: 'دراسة حالة',
        tag_Corporate: 'أخبار الشركات',
        tag_Pricing: 'الأسعار',
        tag_Policy: 'سياسة',
        tag_Security: 'أمن',
        tag_Docs: 'وثائق',
        footer_qa: 'أسئلة وأجوبة',
        footer_legal: 'قانوني',
        footer_about: 'عن الموقع',
        footer_made_by: 'صنع بحب من قبل',
        footer_rabah: 'رابح مدني'
    }
};

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: string) => string;
    isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Language>('en');

    useEffect(() => {
        const saved = localStorage.getItem('lang') as Language;
        if (saved && (saved === 'en' || saved === 'ar')) {
            setLangState(saved);
        }
    }, []);

    const setLang = (newLang: Language) => {
        setLangState(newLang);
        localStorage.setItem('lang', newLang);
    };

    const t = (key: string) => translations[lang][key] || key;

    const isRTL = lang === 'ar';

    return (
        <LanguageContext.Provider value={{ lang, setLang, t, isRTL }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
