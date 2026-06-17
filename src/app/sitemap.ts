import { MetadataRoute } from 'next'
import { chapters } from '@/lib/public/resource-center'

const BASE_URL = 'https://agm-hub.vercel.app'

const languages = ['en', 'es']

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  // Static routes under /[lang]/
  const staticRoutes = [
    '', // home
    '/apply',
    '/disclosures',
    '/downloads',
    '/downloads/mobile',
    '/downloads/trader',
    '/fees',
    '/resource-center',
    '/resource-center/account-management/link-account-to-agm',
    '/resource-center/account-management/link-existing-accounts',
    '/resource-center/account-management/transfer-positions',
    '/resource-center/banking/deposit-funds',
    '/resource-center/banking/link-bank-account',
    '/resource-center/banking/transfer-to-wise-balance',
    '/resource-center/banking/withdraw-funds',
    '/resource-center/banking/transfer-internal',
    '/resource-center/banking/transfer-from-wise-balance',
    '/resource-center/trading/manage-trading-permissions',
    '/resource-center/trading/options-trading-permissions',
    '/resource-center/trading/market-data-subscriptions',
    '/requirements',
    '/risk',
    '/sitemap',
  ]

  // Generate entries for each language + static route combination
  const staticEntries = languages.flatMap((lang) =>
    staticRoutes.map((route) => ({
      url: `${BASE_URL}/${lang}${route}`,
      lastModified,
      changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  )

  const resourceLearningEntries = languages.flatMap((lang) =>
    chapters.map((chapter) => ({
      url: `${BASE_URL}/${lang}/resource-center/learning/${chapter.id}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  return [...staticEntries, ...resourceLearningEntries]
}
