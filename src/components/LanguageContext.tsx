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
        digest: 'Weekly Digest',
        featured_releases: 'Featured Releases',
        all_count: 'All',
        subscribe: 'Subscribe',
        all_companies: 'All Companies',
        no_updates: 'No updates found. System initializing...',
        no_filter_results: 'No updates found for this filter.',
        signal_over_noise: 'Signal over noise',
        aggregates_note: 'aggregates only verified announcements from the world\'s leading AI labs. No rumors. No opinions. Just the facts.',
        more: 'more',
        updates_badge: 'Updates',
        hero_line1: 'The Signal',
        hero_line2: 'in the Noise',
        official_announcements: 'Official announcements from',
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
        tag_Docs: 'Docs'
    },
    ar: {
        app_title: 'أوفيشال',
        tagline: 'المصدر الرسمي لأخبار ومستجدات مختبرات الذكاء الاصطناعي',
        last_updated: 'آخر تحديث',
        companies: 'الشركات',
        digest: 'الموجز الأسبوعي',
        featured_releases: 'إصدارات مميزة',
        all_count: 'الكل',
        subscribe: 'اشترك الآن',
        all_companies: 'جميع الشركات',
        no_updates: 'لا توجد تحديثات حالياً.. النظام قيد المزامنة',
        no_filter_results: 'لم يتم العثور على نتائج لهذا القسم',
        signal_over_noise: 'المعلومة من مصدرها',
        aggregates_note: 'منصة متخصصة ترصد الإعلانات الموثقة فقط من رواد صناعة الذكاء الاصطناعي عالمياً. لا مكان للشائعات أو التكهنات؛ نوفر لك المعلومة من مصدرها الرسمي مباشرة.',
        more: 'تحديثات أخرى',
        updates_badge: 'تحديث',
        hero_line1: 'المصدر الرسمي',
        hero_line2: 'لأحدث تقنيات الذكاء الاصطناعي',
        official_announcements: 'الإعلانات الرسمية من',
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
        tag_Docs: 'وثائق'
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
