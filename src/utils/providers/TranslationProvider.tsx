'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getTranslations } from "../../app/[lang]/dictionaries";
import type { Translator } from "../../app/[lang]/dictionaries";
import LoadingComponent from '@/components/misc/LoadingComponent';

// Laserfocus provider
export type TranslatorType = {
    lang: string;
    setLang?: React.Dispatch<React.SetStateAction<string>>;
    t: Translator;
};
  
export const TranslationContext = createContext<TranslatorType | undefined>(undefined);

export const TranslationProvider = ({ children, lang }: { children: React.ReactNode, lang:string }) => {
    const [translator, setTranslator] = useState<Translator | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTranslations = async () => {
            try {
                const translatorFn = await getTranslations(lang);
                setTranslator(() => translatorFn);
                setError(null);
            } catch (err) {
                console.error('Failed to load translations:', err);
                setError(err instanceof Error ? err.message : 'Failed to load translations');
            }
        };
        loadTranslations();
    }, [lang]);

    if (error) {
        return <div>Error loading translations: {error}</div>;
    }

    if (!translator) {
        return <LoadingComponent className='h-full w-full flex items-center justify-center' />
    }

    return (
        <TranslationContext.Provider value={{ lang, t: translator }}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslationProvider = () => {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslationProvider must be used within a TranslationProvider');
    }
    return context;
};