'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatURL } from '@/utils/language/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const OFFICIAL_GUIDE_URL = 'https://www.ibkrguides.com/clientportal/tradingpermissions.htm?Highlight=Trading%20Permissions'

const guideContent = {
  en: {
    eyebrow: 'Trading',
    title: 'Trading Permissions',
    description:
      'This guide follows the IBKR Client Portal Trading Permissions flow for requesting or modifying product and country permissions.',
    back: 'Back to Resource Center',
    openGuide: 'Open official guide',
    overviewTitle: 'What this controls',
    overviewBody:
      'Trading permissions define what products you can trade and in which countries you can trade them. IBKR may also require risk disclosures and can limit permissions based on your investment objectives or financial profile.',
    instructionsTitle: 'How to manage trading permissions',
    steps: [
      {
        title: 'Open Trading Permissions',
        body: 'Click the User menu in the top-right corner, then Settings > Trading > Trading Permissions.',
      },
      {
        title: 'Review current permissions',
        body: 'The Trading Permissions panel shows the permissions you already have.',
      },
      {
        title: 'Edit or request access',
        body: 'Use Edit to modify an existing permission or Request to add a new one.',
      },
      {
        title: 'Filter by product if needed',
        body: 'Permissions are grouped first by product and then by country. Use the drop-down selectors at the top of the page to focus on specific products.',
      },
      {
        title: 'Save your changes',
        body: 'After updating the desired permissions, click Save.',
      },
    ],
    noteTitle: 'Practical note',
    noteBody:
      'IBKR notes that you can request permissions across all countries and products with a single click, and each product or market may include additional details through the information icon.',
  },
  es: {
    eyebrow: 'Trading',
    title: 'Permisos de Trading',
    description:
      'Esta guía sigue el flujo de Trading Permissions en IBKR Client Portal para solicitar o modificar permisos por producto y por país.',
    back: 'Volver al Centro de Recursos',
    openGuide: 'Abrir guía oficial',
    overviewTitle: 'Qué controla esto',
    overviewBody:
      'Los permisos de trading definen qué productos puede negociar y en qué países puede hacerlo. IBKR también puede exigir divulgaciones de riesgo y limitar permisos según sus objetivos de inversión o su perfil financiero.',
    instructionsTitle: 'Cómo administrar los permisos de trading',
    steps: [
      {
        title: 'Abra Trading Permissions',
        body: 'Haga clic en el User menu en la parte superior derecha y luego vaya a Settings > Trading > Trading Permissions.',
      },
      {
        title: 'Revise sus permisos actuales',
        body: 'El panel Trading Permissions muestra los permisos que ya tiene activos.',
      },
      {
        title: 'Edite o solicite acceso',
        body: 'Use Edit para modificar un permiso existente o Request para agregar uno nuevo.',
      },
      {
        title: 'Filtre por producto si hace falta',
        body: 'Los permisos están agrupados primero por producto y luego por país. Use los selectores desplegables de la parte superior para enfocarse en productos específicos.',
      },
      {
        title: 'Guarde los cambios',
        body: 'Después de actualizar los permisos deseados, haga clic en Save.',
      },
    ],
    noteTitle: 'Nota práctica',
    noteBody:
      'IBKR indica que puede solicitar permisos para todos los países y productos con un solo clic, y que cada producto o mercado puede mostrar detalles adicionales mediante el icono de información.',
  },
} as const

const ManageTradingPermissionsPage = () => {
  const { lang } = useTranslationProvider()
  const copy = guideContent[lang as keyof typeof guideContent] ?? guideContent.en

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-6xl mx-auto py-14 px-6 flex flex-col gap-8">
      <div className="flex justify-start">
        <Button asChild variant="ghost">
          <Link href={formatURL('/resource-center#trading', lang)}>
            <ArrowLeft className="w-4 h-4 text-foreground" />
            {copy.back}
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{copy.eyebrow}</p>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex flex-col gap-3 max-w-5xl">
            <h1 className="text-4xl md:text-5xl font-bold">{copy.title}</h1>
            <p className="text-lg text-subtitle leading-8">{copy.description}</p>
          </div>
          <Button asChild className="w-fit">
            <a href={OFFICIAL_GUIDE_URL} target="_blank" rel="noopener noreferrer">
              {copy.openGuide}
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{copy.overviewTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-subtitle leading-7">{copy.overviewBody}</p>
        </CardContent>
      </Card>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{copy.instructionsTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            {copy.steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-background flex items-center justify-center shrink-0 font-semibold">{index + 1}</div>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">{step.title}</p>
                  <p className="text-subtitle leading-7">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{copy.noteTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-subtitle leading-7">{copy.noteBody}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ManageTradingPermissionsPage
