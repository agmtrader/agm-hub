'use client'

import { useEffect, useLayoutEffect } from 'react'
import type { ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import { ReadApplicationProvider } from '@/utils/clients/application-provider'

const colorKeys = ['primary', 'primary-dark', 'secondary', 'secondary-dark', 'background', 'foreground']
const colorPattern = /^(#[0-9a-f]{3,8}|(?:rgb|hsl)a?\(\s*[\d.%\s,]+\))$/i
const IMPROSA_PROVIDER_ID = '8c0f8a6f-4c4c-4a1f-9e7c-6de9d7d3f3a1'
const IMPROSA_COLORS = {
  primary: '#c4942f',
  'primary-dark': '#a8791f',
  secondary: '#1f294d',
  'secondary-dark': '#16203d',
  background: '#ffffff',
  foreground: '#1f294d',
}
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

export default function ApplicationProviderTheme({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  const providerId = searchParams.get('provider_id') || searchParams.get('provider') || searchParams.get('application_provider') || searchParams.get('id')

  useIsomorphicLayoutEffect(() => {
    let active = true
    const root = document.documentElement
    if (!providerId) {
      colorKeys.forEach((key) => root.style.removeProperty(`--agm-${key}`))
      delete root.dataset.applicationProvider
      return
    }

    // Apply the known provider palette synchronously so the title screen never
    // flashes AGM orange while the public API lookup is loading.
    if (providerId.toLowerCase() === IMPROSA_PROVIDER_ID) {
      Object.entries(IMPROSA_COLORS).forEach(([key, value]) => root.style.setProperty(`--agm-${key}`, value))
      root.style.setProperty('--agm-grid-accent', 'rgba(196, 148, 47, 0.32)')
      root.style.setProperty('--agm-grid-highlight', 'rgba(31, 41, 77, 0.20)')
      root.dataset.applicationProvider = providerId
    }

    ReadApplicationProvider(providerId).then((provider) => {
      if (!active || !provider?.color_scheme) return
      colorKeys.forEach((key) => {
        const value = provider.color_scheme[key] || provider.color_scheme[key.replace('-', '_')]
      if (typeof value === 'string' && colorPattern.test(value)) root.style.setProperty(`--agm-${key}`, value)
      })
      const secondary = provider.color_scheme.secondary || provider.color_scheme.secondary_color
      const foreground = provider.color_scheme.foreground
      if (typeof secondary === 'string' && colorPattern.test(secondary)) root.style.setProperty('--agm-grid-accent', secondary)
      if (typeof foreground === 'string' && colorPattern.test(foreground)) root.style.setProperty('--agm-grid-highlight', foreground)
      root.dataset.applicationProvider = providerId
    }).catch(() => undefined)

    return () => {
      active = false
      colorKeys.forEach((key) => document.documentElement.style.removeProperty(`--agm-${key}`))
      document.documentElement.style.removeProperty('--agm-grid-accent')
      document.documentElement.style.removeProperty('--agm-grid-highlight')
      delete document.documentElement.dataset.applicationProvider
    }
  }, [providerId])

  return children
}
