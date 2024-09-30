"use client";
import React, { createContext, useContext } from 'react';
import { getTranslations } from "../../app/[lang]/dictionaries";

// Laserfocus provider
export type TranslatorType = {
    lang: string;
    setLang?: React.Dispatch<React.SetStateAction<string>>;
    t: any;
};
  
export const TranslationContext = createContext<TranslatorType | undefined>(undefined);

export const TranslationProvider = async ({ children, lang }: { children: React.ReactNode, lang:string }) => {
    
    const t = await getTranslations(lang)

    return (
        <TranslationContext.Provider value={{ lang, t }}>
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