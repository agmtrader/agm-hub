'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatURL } from '@/utils/language/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const OFFICIAL_GUIDE_URL = 'https://www.ibkrguides.com/clientportal/transferandpay/transpositions.htm'

const guideContent = {
  en: {
    eyebrow: 'Account Management',
    title: 'Transfer Positions',
    description:
      'This page follows the IBKR Client Portal Transfer Positions guide for moving securities into or out of your account.',
    back: 'Back to Resource Center',
    openGuide: 'Open official guide',
    instructionsTitle: 'Instructions',
    intro: 'The Transfer Positions screen supports both incoming and outgoing position transfers.',
    steps: [
      {
        title: 'Open Transfer Positions',
        body: 'Click Transfer & Pay > Transfer Positions.',
        note: 'Alternative path: click Menu in the top-left corner > Transfer & Pay > Transfer Positions.',
      },
    ],
    inboundTitle: 'Inbound position transfers',
    inboundItems: [
      'Automated Customer Account Transfer Service (ACATS)',
      'Account Transfer on Notification (ATON) for Canadian securities',
      'DRS - Transfer Shares Held at Transfer Agent',
      'DWAC - Deposit/Withdraw at Custodian',
      'Free of Payment (FOP) for US stocks',
      'Free of Payment Transfer of Global Securities',
      'Internal Position Transfer',
      'Transfer Positions Between Master and Sub Accounts',
      'Crypto Deposit',
    ],
    outboundTitle: 'Outbound position transfers',
    outboundItems: [
      'DRS - Deliver Shares to the issuer transfer agent / registrar',
      'DWAC - Deposit/Withdraw at Custodian',
      'Free of Payment Transfer of US Securities',
      'Free of Payment Transfer of Global Securities',
      'Internal position transfers',
      'Position Transfer Between Master and Sub Accounts',
    ],
    noteTitle: 'Practical note',
    noteBody:
      'IBKR states that ACATS, ATON, and FOP transfers can use a Position Instruction if you want to create or reuse one during the request.',
  },
  es: {
    eyebrow: 'Gestión de Cuenta',
    title: 'Transferir posiciones',
    description:
      'Esta página sigue la guía de IBKR Client Portal para mover valores hacia su cuenta o fuera de ella.',
    back: 'Volver al Centro de Recursos',
    openGuide: 'Abrir guía oficial',
    instructionsTitle: 'Instrucciones',
    intro: 'La pantalla Transfer Positions soporta tanto transferencias de entrada como de salida.',
    steps: [
      {
        title: 'Abra Transfer Positions',
        body: 'Haga clic en Transfer & Pay > Transfer Positions.',
        note: 'Ruta alternativa: haga clic en Menu en la esquina superior izquierda > Transfer & Pay > Transfer Positions.',
      },
    ],
    inboundTitle: 'Transferencias de entrada',
    inboundItems: [
      'Automated Customer Account Transfer Service (ACATS)',
      'Account Transfer on Notification (ATON) para valores canadienses',
      'DRS - Transfer Shares Held at Transfer Agent',
      'DWAC - Deposit/Withdraw at Custodian',
      'Free of Payment (FOP) para acciones de EE. UU.',
      'Free of Payment Transfer of Global Securities',
      'Internal Position Transfer',
      'Transfer Positions Between Master and Sub Accounts',
      'Crypto Deposit',
    ],
    outboundTitle: 'Transferencias de salida',
    outboundItems: [
      'DRS - Deliver Shares to the issuer transfer agent / registrar',
      'DWAC - Deposit/Withdraw at Custodian',
      'Free of Payment Transfer of US Securities',
      'Free of Payment Transfer of Global Securities',
      'Internal position transfers',
      'Position Transfer Between Master and Sub Accounts',
    ],
    noteTitle: 'Nota práctica',
    noteBody:
      'IBKR indica que las transferencias ACATS, ATON y FOP pueden usar una Position Instruction si desea crearla o reutilizarla durante la solicitud.',
  },
} as const

const TransferPositionsPage = () => {
  const { lang } = useTranslationProvider()
  const copy = guideContent[lang as keyof typeof guideContent] ?? guideContent.en

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-6xl mx-auto py-14 px-6 flex flex-col gap-8">
      <div className="flex justify-start">
        <Button asChild variant="ghost">
          <Link href={formatURL('/resource-center#account-management', lang)}>
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
          <CardTitle className="text-2xl">{copy.instructionsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <p className="text-base text-subtitle leading-7">{copy.intro}</p>
          <ol className="space-y-4">
            {copy.steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-background flex items-center justify-center shrink-0 font-semibold">
                  {index + 1}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">{step.title}</p>
                  <p className="text-subtitle leading-7">{step.body}</p>
                  {'note' in step && step.note ? <p className="text-sm text-subtitle">{step.note}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{copy.inboundTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid md:grid-cols-2 gap-3">
            {copy.inboundItems.map((item) => (
              <li key={item} className="list-disc ml-5 text-subtitle leading-7">{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{copy.outboundTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid md:grid-cols-2 gap-3">
            {copy.outboundItems.map((item) => (
              <li key={item} className="list-disc ml-5 text-subtitle leading-7">{item}</li>
            ))}
          </ul>
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

export default TransferPositionsPage
