import { Map } from '@/lib/public/types';
import { _t, Dict, Lang} from '@/utils/language/i18n'

interface D {
  en : () => Promise<Map>,
  es : () => Promise<Map>,
}

const dictionaries:D = {
  en: () => import('./en.json').then(module => module.default),
  es: () => import('./es.json').then(module => module.default),
};

export const getDictionary = async (lang: string) => dictionaries[lang as keyof typeof dictionaries]()

export type Translator = (key:string) => string

export const getTranslations = async (lang: string): Promise<Translator> => {
  const dict = await getDictionary(lang)
  return (key: string) => _t(key, dict)
}