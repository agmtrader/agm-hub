'use client'

import Link from 'next/link'
import { Download as DownloadIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { products } from '@/lib/public/products'
import { formatURL } from '@/utils/language/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const AGMDownloads = () => {
  const { lang, t } = useTranslationProvider()

  const downloadableApps = products(t).filter(
    (app) => !app.isExternal && app.downloadOptions?.length
  )

  return (
    <div className="w-full relative bg-background">
      <div className="container py-8 my-2 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col my-10 gap-y-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              {t('sitemap.downloads')}
            </h1>
            <p className="text-lg max-w-2xl mx-auto text-subtitle">
              {t('main.products.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {downloadableApps.map((app) => (
              <Card key={app.name} className="hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 flex flex-col h-full gap-6">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-semibold text-foreground">
                      {app.name}
                    </h2>
                    <p className="text-subtitle">{app.title}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    {app.platforms.map((platform) => (
                      <platform.icon
                        key={platform.type}
                        className="h-5 w-5 text-primary"
                        aria-label={platform.type}
                        title={platform.type}
                      />
                    ))}
                  </div>

                  <div className="mt-auto">
                    <Link href={formatURL(app.download_url, lang)}>
                      <Button className="w-fit flex gap-2">
                        {t('main.products.download_now')}
                        <DownloadIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AGMDownloads
