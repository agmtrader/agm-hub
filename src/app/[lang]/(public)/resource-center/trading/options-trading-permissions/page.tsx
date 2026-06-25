'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

import { ResourceSteps } from '@/components/hub/resource-center/ResourceSteps'
import { ResourceGuidePage } from '@/components/hub/resource-center/ResourceGuidePage'
import { Button } from '@/components/ui/button'
import { formatURL } from '@/utils/language/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const guideContent = {
  en: {
    eyebrow: 'Trading',
    title: 'Options Trading Permissions',
    description:
      'This guide follows the IBKR Client Portal options permissions flow and summarizes the four options approval levels.',
    back: 'Back to Resource Center',
    instructionsTitle: 'How to request an options level',
    steps: [
      {
        title: 'Open Trading Permissions',
        body: 'Click the User menu in the top-right corner, then Settings > Trading > Trading Permissions.',
      },
      {
        title: 'Open the options level selector',
        body: 'On the Trading Permissions panel, select the Options Level control.',
      },
      {
        title: 'Choose the desired level',
        body: 'Select the options trading level you want to request.',
      },
      {
        title: 'Continue to save',
        body: 'Press Continue to save the changes.',
      },
    ],
    levelsTitle: 'Options levels overview',
    levels: [
      { title: 'Level 1', body: 'Covered Call/Covered Basket Call and Buy Write.' },
      { title: 'Level 2', body: 'Everything in Level 1 plus long calls, long puts, protective strategies, long straddles/strangles, conversions, long spreads, long iron condors, long box spreads, collars, and short collars.' },
      { title: 'Level 3', body: 'Everything in Levels 1 and 2 plus short puts, synthetics, reversals, short spreads, short iron condors, butterflies, and debit calendar/diagonal structures.' },
      { title: 'Level 4', body: 'Everything in Levels 1, 2, and 3 plus short naked calls, short straddles, short strangles, short synthetics, credit calendars, and diagonal spreads where the long leg expires first.' },
    ],
    availabilityTitle: 'Availability note',
    availability: [
      { title: 'IBKR states that options level trading permissions are available for all IB entities except IB-IN and IB-CA' },
    ],
  },
  es: {
    eyebrow: 'Trading',
    title: 'Permisos de Trading para Opciones',
    description:
      'Esta guía sigue el flujo de permisos de opciones en IBKR Client Portal y resume los cuatro niveles de aprobación para opciones.',
    back: 'Volver al Centro de Recursos',
    instructionsTitle: 'Cómo solicitar un nivel de opciones',
    steps: [
      {
        title: 'Abra Trading Permissions',
        body: 'Haga clic en el User menu en la parte superior derecha y luego vaya a Settings > Trading > Trading Permissions.',
      },
      {
        title: 'Abra el selector de nivel de opciones',
        body: 'En el panel Trading Permissions, seleccione el control de Options Level.',
      },
      {
        title: 'Elija el nivel deseado',
        body: 'Seleccione el nivel de trading con opciones que desea solicitar.',
      },
      {
        title: 'Continúe para guardar',
        body: 'Presione Continue para guardar los cambios.',
      },
    ],
    levelsTitle: 'Resumen de niveles de opciones',
    levels: [
      { title: 'Nivel 1', body: 'Covered Call/Covered Basket Call y Buy Write.' },
      { title: 'Nivel 2', body: 'Todo lo del Nivel 1 más long calls, long puts, estrategias protectoras, long straddles/strangles, conversions, long spreads, long iron condors, long box spreads, collars y short collars.' },
      { title: 'Nivel 3', body: 'Todo lo de los Niveles 1 y 2 más short puts, synthetics, reversals, short spreads, short iron condors, butterflies y estructuras calendar/diagonal de débito.' },
      { title: 'Nivel 4', body: 'Todo lo de los Niveles 1, 2 y 3 más short naked calls, short straddles, short strangles, short synthetics, calendars de crédito y diagonales donde la pierna larga vence primero.' },
    ],
    availabilityTitle: 'Nota de disponibilidad',
    availability: [
      { title: 'IBKR indica que estos permisos de nivel para opciones están disponibles para todas las entidades de IB excepto IB-IN e IB-CA' },
    ],
  },
} as const

const OptionsTradingPermissionsPage = () => (
  <ResourceGuidePage sectionAnchor="trading" content={guideContent} />
)

export default OptionsTradingPermissionsPage
