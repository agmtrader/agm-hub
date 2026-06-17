'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatURL } from '@/utils/language/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const OFFICIAL_GUIDE_URL = 'https://www.ibkrguides.com/clientportal/transferandpay/deposit.htm'

const depositGuideContent = {
  en: {
    title: 'How to deposit funds into your account',
    description:
      'This page matches the IBKR Client Portal deposit overview and keeps the flow simple before you leave for the official screens.',
    sourceLabel: 'Official IBKR guide',
    sourceUpdated: 'Source updated April 27, 2026',
    overviewTitle: 'What this page does',
    overviewBody:
      'In Client Portal, the Deposit Funds page lets you either use saved deposit information shown at the top of the page or choose a new deposit method.',
    stepsTitle: 'Navigation in Client Portal',
    steps: ['Click Transfer & Pay.', 'Open Transfer Funds.', 'Select Make a Deposit.'],
    alternatePath:
      'Alternative path: open Menu in the top-left corner, then go to Transfer & Pay > Transfer Funds > Deposit Funds.',
    methodsTitle: 'Deposit methods listed by IBKR on this page',
    methods: [
      'ACH Deposit',
      'Direct ACH Transfer',
      'Wire Deposit',
      'Bill Pay Deposit',
      'Fund with Stablecoin',
      'Scan a Check',
      'Mail a Check',
      'Transfer from Wise Balance',
      'Bank Transfer/SEPA',
      'eDDA',
      'Online BPAY',
    ],
    noteTitle: 'What to expect',
    noteBody:
      'The exact methods shown can vary by region, account setup, and what IBKR makes available in your funding settings.',
    back: 'Back to Resource Center',
    openGuide: 'Open official guide',
  },
  es: {
    title: 'Cómo depositar fondos en su cuenta',
    description:
      'Esta página sigue la vista general de depósitos de IBKR Client Portal y mantiene el flujo simple antes de salir a las pantallas oficiales.',
    sourceLabel: 'Guía oficial de IBKR',
    sourceUpdated: 'Fuente actualizada el 27 de abril de 2026',
    overviewTitle: 'Qué hace esta página',
    overviewBody:
      'En Client Portal, la página Deposit Funds le permite usar la información de depósito guardada que aparece en la parte superior o elegir un nuevo método de depósito.',
    stepsTitle: 'Navegación en Client Portal',
    steps: ['Haga clic en Transfer & Pay.', 'Abra Transfer Funds.', 'Seleccione Make a Deposit.'],
    alternatePath:
      'Ruta alternativa: abra Menu en la esquina superior izquierda y luego vaya a Transfer & Pay > Transfer Funds > Deposit Funds.',
    methodsTitle: 'Métodos de depósito que IBKR muestra en esta página',
    methods: [
      'ACH Deposit',
      'Direct ACH Transfer',
      'Wire Deposit',
      'Bill Pay Deposit',
      'Fund with Stablecoin',
      'Scan a Check',
      'Mail a Check',
      'Transfer from Wise Balance',
      'Bank Transfer/SEPA',
      'eDDA',
      'Online BPAY',
    ],
    noteTitle: 'Qué esperar',
    noteBody:
      'Los métodos exactos pueden variar según la región, la configuración de la cuenta y lo que IBKR tenga habilitado en sus opciones de fondeo.',
    back: 'Volver al Centro de Recursos',
    openGuide: 'Abrir guía oficial',
  },
} as const

const DepositFundsGuidePage = () => {
  const { lang } = useTranslationProvider()
  const copy = depositGuideContent[lang as keyof typeof depositGuideContent] ?? depositGuideContent.en

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto py-14 px-6 flex flex-col gap-8"
    >
      <div className="flex justify-start">
        <Button asChild variant="ghost">
          <Link href={formatURL('/resource-center#banking', lang)}>
            <ArrowLeft className="w-4 h-4 text-foreground" />
            {copy.back}
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 text-center items-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Banking</p>
        <h1 className="text-4xl md:text-5xl font-bold max-w-4xl">{copy.title}</h1>
        <p className="text-subtitle max-w-3xl">{copy.description}</p>
        <div className="flex flex-wrap gap-3 justify-center items-center text-sm text-subtitle">
          <span>{copy.sourceLabel}</span>
          <span aria-hidden="true">•</span>
          <span>{copy.sourceUpdated}</span>
        </div>
        <Button asChild>
          <a href={OFFICIAL_GUIDE_URL} target="_blank" rel="noopener noreferrer">
            {copy.openGuide}
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="border border-border/60">
          <CardHeader>
            <CardTitle className="text-2xl">{copy.overviewTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-7">{copy.overviewBody}</p>
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardHeader>
            <CardTitle className="text-2xl">{copy.stepsTitle}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ol className="list-decimal pl-6 space-y-3 text-base leading-7">
              {copy.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="text-sm text-subtitle">{copy.alternatePath}</p>
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardHeader>
            <CardTitle className="text-2xl">{copy.methodsTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-base leading-7">
              {copy.methods.map((method) => (
                <li key={method} className="list-disc ml-5">
                  {method}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardHeader>
            <CardTitle className="text-2xl">{copy.noteTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-7">{copy.noteBody}</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

export default DepositFundsGuidePage
