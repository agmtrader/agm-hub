import { iso31661Alpha3ToAlpha2, iso31662, iso31661 } from 'iso-3166'

export interface Subdivision {
  code: string
  name: string
}

const alpha3ToAlpha2 = iso31661Alpha3ToAlpha2 as Record<string, string>

const countriesWithSubdivisionsSet = new Set<string>()
iso31662.forEach((sub) => {
  if (sub.parent.length === 2) countriesWithSubdivisionsSet.add(sub.parent)
})

export const countriesWithSubdivisions = iso31661
  .filter((c) => countriesWithSubdivisionsSet.has(c.alpha2))
  .map((c) => ({ alpha2: c.alpha2, alpha3: c.alpha3, name: c.name }))

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
