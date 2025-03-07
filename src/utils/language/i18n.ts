export type Lang = 'en'|'es';

export const LANGS:Array<Lang> = ['en', 'es'];

export const otherLang  = (lang:Lang) => lang === 'en' ? 'es' : 'en';

//const langs:Array<Lang> = i18nConfig.locales as unknown as Array<Lang>;

export type Dict = {
  [key:string]: string|Dict
}

function getFromDictionnary(keys: Array<string>, dict: Dict|string):Dict|string {

  if (typeof dict == "string") {
    return dict;
  }

  if (keys.length === 0) {
    return '';
  }

  if (!dict) {
    return '';
  }

  const key = keys.shift() || '';

  return getFromDictionnary(keys, dict[key]);
}

export const _t = (key: string, dict: Dict): string => {

  if (!key) { return ''; }

  const keys = key.split(".");

  const ret = getFromDictionnary(keys, dict);

  if (!ret) {
    return key;
  }

  if (typeof ret !== 'string') {
    console.error('getFromDict returned a ' + (typeof ret ))
    return key;
  }

  return ret;
}


const baseRoutes = [
  'blog',
  'sitemap', 
  'team'
];


interface transRoutes {
  [key:string]: {
    [key:string]: string
  }
}

const routeTranslations:transRoutes = {
  'about': {
    'fr': 'a-propos-de-kodaps',
    'en': 'about'
  },
  'privacy-policy': {
    'fr': 'politique-de-confidentialite',
    'en': 'privacy-policy'
  }
};

export const routeToHref = (route: Array<string>, lang: Lang) => {

  let base = route.shift();

  if (!base) {
    return `/${lang}/`;
  }

  if (base[0] === '/') {
    base = base.slice(1);
  }


   if (route.length === 0 && base.indexOf('/') > -1) {
    route = base.split('/');
    base = route.shift();
   }

   if (!base) {
    return `/${lang}/`;
  }

  if ( baseRoutes.indexOf(base) > -1) {
    return `/${lang}/${base}/${route.join('/')}`;
  }


  if (routeTranslations[base]) {
    return `/${lang}/${routeTranslations[base][lang]}/${route.join('/')}`;
  }

  // 2. get page corresponding to route in other lang
  return `/${lang}/${base}/${route.join('/')}`;

}