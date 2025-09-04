import { iso31661Alpha3ToAlpha2, iso31662, iso31661 } from 'iso-3166'

export interface Subdivision {
  code: string
  name: string
}

// Build quick lookup tables at module load
const alpha3ToAlpha2 = iso31661Alpha3ToAlpha2 as Record<string, string>

const countriesWithSubdivisionsSet = new Set<string>()
iso31662.forEach((sub) => {
  // `parent` of top-level subdivisions is an alpha-2 code
  if (sub.parent.length === 2) countriesWithSubdivisionsSet.add(sub.parent)
})

export const countriesWithSubdivisions = iso31661
  .filter((c) => countriesWithSubdivisionsSet.has(c.alpha2))
  .map((c) => ({ alpha2: c.alpha2, alpha3: c.alpha3, name: c.name }))

/**
 * Return ISO-3166-2 subdivisions for a given country.
 * Accepts alpha-2 or alpha-3 codes. Returns an empty array when none exist.
 */
export function getSubdivisions(countryCode: string | null | undefined): Subdivision[] {
  if (!countryCode) return []
  let alpha2 = countryCode.toUpperCase()
  if (alpha2.length === 3) {
    alpha2 = alpha3ToAlpha2[alpha2] || ''
  }
  if (alpha2.length !== 2) return []

  return iso31662
    .filter((sub) => sub.parent === alpha2)
    .map((sub) => ({ code: sub.code, name: sub.name }))
}
