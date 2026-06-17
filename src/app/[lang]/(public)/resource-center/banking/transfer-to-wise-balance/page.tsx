'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatURL } from '@/utils/language/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const OFFICIAL_GUIDE_URL = 'https://ibkrguides.com/fundingreference/usd.htm#Transfer_to_Wise_Balance_Withdrawal'

const guideContent = {
  en: {
    eyebrow: 'Banking',
    title: 'Transfer to Wise Balance',
    description:
      'This page summarizes the Wise withdrawal method shown in the USD Funding Reference. It is a cleaner method summary, not a full Client Portal walkthrough.',
    back: 'Back to Resource Center',
    openGuide: 'Open official guide',
    detailsTitle: 'Withdrawal method summary',
    rows: [
      { label: 'Purpose', value: 'One-time setup of a withdrawal destination at IBKR so funds can be sent electronically to your Wise account.' },
      { label: 'Availability', value: 'All entities except IBKR Canada and Japan.' },
      { label: 'Speed', value: 'Receive the funds next day.' },
      { label: 'Limits', value: 'Daily limits apply and depend on your secure login setup.' },
      { label: 'Fee(s)', value: 'One free withdrawal per calendar month. Subsequent withdrawals incur a fee at IBKR.' },
    ],
    noteTitle: 'Practical note',
    noteBody:
      'This reference page describes the funding method at a high level. The exact withdrawal screens, validations, and fields can differ based on entity and account setup.',
  },
  es: {
    eyebrow: 'Banca',
    title: 'Transferir a saldo de Wise',
    description:
      'Esta página resume el método de retiro hacia Wise mostrado en USD Funding Reference. Es un resumen limpio del método, no una guía completa paso a paso de Client Portal.',
    back: 'Volver al Centro de Recursos',
    openGuide: 'Abrir guía oficial',
    detailsTitle: 'Resumen del método de retiro',
    rows: [
      { label: 'Propósito', value: 'Configuración única de un destino de retiro en IBKR para que los fondos puedan enviarse electrónicamente a su cuenta de Wise.' },
      { label: 'Disponibilidad', value: 'Todas las entidades excepto IBKR Canada y Japan.' },
      { label: 'Velocidad', value: 'Reciba los fondos al día siguiente.' },
      { label: 'Límites', value: 'Aplican límites diarios y dependen de su configuración de seguridad de acceso.' },
      { label: 'Cargo(s)', value: 'Un retiro gratis por mes calendario. Los retiros posteriores generan un cargo en IBKR.' },
    ],
    noteTitle: 'Nota práctica',
    noteBody:
      'Esta página de referencia describe el método de fondeo a alto nivel. Las pantallas exactas de retiro, validaciones y campos pueden cambiar según la entidad y la configuración de la cuenta.',
  },
} as const

const TransferToWiseBalancePage = () => {
  const { lang } = useTranslationProvider()
  const copy = guideContent[lang as keyof typeof guideContent] ?? guideContent.en

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-6xl mx-auto py-14 px-6 flex flex-col gap-8">
      <div className="flex justify-start">
        <Button asChild variant="ghost">
          <Link href={formatURL('/resource-center#banking', lang)}>
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
          <CardTitle className="text-2xl">{copy.detailsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid">
            {copy.rows.map((row) => (
              <div key={row.label} className="grid md:grid-cols-[240px_minmax(0,1fr)] border-t first:border-t-0 border-border/60">
                <div className="px-4 py-4 font-semibold bg-muted/20">{row.label}:</div>
                <div className="px-4 py-4 text-subtitle leading-7">{row.value}</div>
              </div>
            ))}
          </div>
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

export default TransferToWiseBalancePage
