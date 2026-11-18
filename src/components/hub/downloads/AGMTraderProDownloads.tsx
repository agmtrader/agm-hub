'use client'
import { formatURL } from '@/utils/language/lang';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { AGMTraderProDownloads as downloadOptions } from '@/lib/public/products';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const AGMTraderProDownloads = () => {
  
  const {lang, t} = useTranslationProvider();

  return (
    <div className="w-full relative bg-background">

      {/* Content with higher z-index */}
      <div className="container py-8 my-2 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col my-4 sm:my-10">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t('main.products.trader.title')}
            </h1>
            <p className="text-lg max-w-xl mx-auto text-subtitle mb-10">
              {t('main.products.trader.description')}
            </p>
          </div>

          <div className="flex flex-col gap-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">{t('main.products.download.platforms')}</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {downloadOptions.map((option) => (
                  <Card
                    key={option.os}
                    className="hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  >
                    <Link href={option.download_url} target="_blank" rel="noopener noreferrer" className="block h-full rounded-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-center mb-4">
                          <option.icon className="h-12 w-12 text-primary" aria-hidden="true" />
                        </div>
                        <h2 className="text-xl font-semibold text-center text-foreground mb-4">
                          {option.os}
                        </h2>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 text-center text-subtitle">
            <p>
              {t('main.products.download.by_downloading')}
              <a
                href={formatURL('/disclosures', lang)}
                className="text-primary hover:text-primary/90 underline"
                tabIndex={0}
              >
                {t('main.products.download.terms_of_service')}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AGMTraderProDownloads;
