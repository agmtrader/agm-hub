'use client'
import { cn } from '@/lib/utils';
import { formatURL } from '@/utils/language/lang';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { AGMTraderProDownloads as downloads } from '@/lib/public/downloads';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const AGMTraderProDownloads = () => {
  
  const {lang, t} = useTranslationProvider();
  
  // Split downloads into desktop and mobile platforms
  const desktopDownloads = downloads.slice(0, 3);
  const mobileDownloads = downloads.slice(3);

  return (
    <div className="w-full relative bg-background">

      {/* Content with higher z-index */}
      <div className="container py-8 my-2 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col my-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              {t('agm-trader.download.title')}
            </h1>
            <p className="text-lg max-w-xl mx-auto text-subtitle mb-10">
              {t('agm-trader.download.description')}
            </p>
          </div>

          <div className="flex flex-col gap-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">{t('agm-trader.download.desktop_platforms')}</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {desktopDownloads.map((option) => (
                  <Card
                    key={option.os}
                    className="hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  >
                    <Link href={option.download_url} target="_blank" rel="noopener noreferrer">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-center mb-4">
                          <option.icon className="h-12 w-12 text-primary" />
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

            {/* Mobile Section */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">{t('agm-trader.download.mobile_platforms')}</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {mobileDownloads.map((option) => (
                  <Card
                    key={option.os}
                    className="hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  >
                    <Link href={option.download_url} target="_blank" rel="noopener noreferrer">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-center mb-4">
                          <option.icon className="h-12 w-12 text-primary" />
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
              {t('agm-trader.download.by_downloading')} {' '}
              <a
                href={formatURL('/disclosures', lang)}
                className="text-primary hover:text-primary/90 underline"
                tabIndex={0}
              >
                {t('agm-trader.download.terms_of_service')}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AGMTraderProDownloads;
