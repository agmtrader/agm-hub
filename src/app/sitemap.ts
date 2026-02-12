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
    '/downloads/mobile',
    '/downloads/trader',
    '/fees',
    '/learning',
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

  // Generate entries for each learning chapter per language
  const learningEntries = languages.flatMap((lang) =>
    chapters.map((chapter) => ({
      url: `${BASE_URL}/${lang}/learning/${chapter.id}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  return [...staticEntries, ...learningEntries]
}
