'use client'

import React from 'react'
import Link from 'next/link'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { formatURL } from '@/utils/language/lang'
import { chapters } from '@/lib/public/resource-center'
import { ExternalLink } from 'lucide-react'

interface SitemapSection {
  title: string
  links: {
    label: string
    href: string
  }[]
}

const SitemapPage = () => {
  const { lang, t } = useTranslationProvider()

  const sections: SitemapSection[] = [
    {
      title: t('sitemap.general'),
      links: [
        { label: t('sitemap.home'), href: formatURL('/', lang) },
        { label: t('sitemap.apply'), href: formatURL('/apply', lang) },
        { label: t('sitemap.risk'), href: formatURL('/risk', lang) },
      ],
    },
    {
      title: t('sitemap.information'),
      links: [
        { label: t('sitemap.fees'), href: formatURL('/fees', lang) },
        { label: t('sitemap.requirements'), href: formatURL('/requirements', lang) },
        { label: t('sitemap.disclosures'), href: formatURL('/disclosures', lang) },
      ],
    },
    {
      title: t('sitemap.downloads'),
      links: [
        { label: t('sitemap.downloads_mobile'), href: formatURL('/downloads/mobile', lang) },
        { label: t('sitemap.downloads_trader'), href: formatURL('/downloads/trader', lang) },
      ],
    },
    {
      title: t('sitemap.learning_center'),
      links: [
        { label: t('sitemap.learning_overview'), href: formatURL('/learning', lang) },
        ...chapters.map((chapter) => ({
          label: `${t('sitemap.chapter')} ${chapter.id}: ${chapter.title}`,
          href: formatURL(`/learning/${chapter.id}`, lang),
        })),
      ],
    },
  ]

  return (
    <div className="container flex flex-col py-6 gap-8 justify-center items-center">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold">{t('sitemap.title')}</h1>
        <p className="text-muted-foreground max-w-2xl">{t('sitemap.description')}</p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold border-b pb-2">{section.title}</h2>
            <ul className="flex flex-col gap-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-subtitle hover:text-primary transition-colors flex items-center gap-1.5 group"
                  >
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SitemapPage
