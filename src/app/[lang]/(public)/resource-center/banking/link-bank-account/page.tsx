'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatURL } from '@/utils/language/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const OFFICIAL_GUIDE_URL = 'https://ibkrguides.com/fundingreference/usd.htm#Link_a_Bank_Account'

const guideContent = {
  en: {
    eyebrow: 'Banking',
    title: 'Link a Bank Account',
    description:
      'Use this option to set up your bank as a linked funding destination or source in IBKR. This page is based on the USD Funding Reference summary, so it is intentionally concise.',
    back: 'Back to Resource Center',
    openGuide: 'Open official guide',
    detailsTitle: 'Funding method summary',
    rows: [
      { label: 'Purpose', value: 'One-time setup of bank details so IBKR knows where to send or receive funds electronically.' },
      { label: 'Availability', value: 'Varies by account entity, country, and bank support.' },
      { label: 'Required Information', value: 'Your bank account details and any ownership or verification information IBKR requests.' },
      { label: 'Speed', value: 'Setup and verification time depend on the method used and the bank involved.' },
      { label: 'Limits', value: 'Transaction limits may apply depending on the linked method and your secure login setup.' },
      { label: 'Fee(s)', value: 'Fees depend on the underlying transfer method and bank used.' },
    ],
    noteTitle: 'Practical note',
    noteBody:
      'The funding reference page is not a detailed Client Portal walkthrough. It is a method summary, so the exact onboarding screens can vary by transfer type, region, and bank.',
  },
  es: {
    eyebrow: 'Banca',
    title: 'Vincular una cuenta bancaria',
    description:
      'Use esta opción para configurar su banco como origen o destino de fondos vinculado en IBKR. Esta página se basa en el resumen de USD Funding Reference, por eso es intencionalmente breve.',
    back: 'Volver al Centro de Recursos',
    openGuide: 'Abrir guía oficial',
    detailsTitle: 'Resumen del método de fondeo',
    rows: [
      { label: 'Propósito', value: 'Configuración única de los datos bancarios para que IBKR sepa dónde enviar o desde dónde recibir fondos electrónicamente.' },
      { label: 'Disponibilidad', value: 'Varía según la entidad de la cuenta, el país y el soporte del banco.' },
      { label: 'Información requerida', value: 'Los datos de su cuenta bancaria y cualquier información de titularidad o verificación que IBKR solicite.' },
      { label: 'Velocidad', value: 'El tiempo de configuración y verificación depende del método usado y del banco involucrado.' },
      { label: 'Límites', value: 'Pueden aplicar límites de transacción según el método vinculado y su nivel de seguridad de acceso.' },
      { label: 'Cargo(s)', value: 'Los cargos dependen del método de transferencia subyacente y del banco utilizado.' },
    ],
    noteTitle: 'Nota práctica',
    noteBody:
      'La página de funding reference no es una guía detallada paso a paso de Client Portal. Es un resumen del método, por lo que las pantallas exactas pueden variar según el tipo de transferencia, la región y el banco.',
  },
} as const

const LinkBankAccountPage = () => {
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

export default LinkBankAccountPage
