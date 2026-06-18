'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

import { BankingStepsCard } from '@/components/hub/learning/BankingStepsCard'
import { Button } from '@/components/ui/button'
import { formatURL } from '@/utils/language/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const guideContent = {
  en: {
    eyebrow: 'Account Management',
    title: 'Transfer Positions',
    description:
      'This page follows the IBKR Client Portal Transfer Positions guide for moving securities into or out of your account.',
    back: 'Back to Resource Center',
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
    inboundSteps: [
      { title: 'Automated Customer Account Transfer Service (ACATS)' },
      { title: 'Account Transfer on Notification (ATON) for Canadian securities' },
      { title: 'DRS - Transfer Shares Held at Transfer Agent' },
      { title: 'DWAC - Deposit/Withdraw at Custodian' },
      { title: 'Free of Payment (FOP) for US stocks' },
      { title: 'Free of Payment Transfer of Global Securities' },
      { title: 'Internal Position Transfer' },
      { title: 'Transfer Positions Between Master and Sub Accounts' },
      { title: 'Crypto Deposit' },
    ],
    outboundTitle: 'Outbound position transfers',
    outboundSteps: [
      { title: 'DRS - Deliver Shares to the issuer transfer agent or registrar' },
      { title: 'DWAC - Deposit/Withdraw at Custodian' },
      { title: 'Free of Payment Transfer of US Securities' },
      { title: 'Free of Payment Transfer of Global Securities' },
      { title: 'Internal position transfers' },
      { title: 'Position Transfer Between Master and Sub Accounts' },
    ],
    noteTitle: 'Position instruction note',
    noteSteps: [
      {
        title: 'IBKR states that ACATS, ATON, and FOP transfers can use a Position Instruction if you want to create or reuse one during the request',
      },
    ],
  },
  es: {
    eyebrow: 'Gestión de Cuenta',
    title: 'Transferir posiciones',
    description:
      'Esta página sigue la guía de IBKR Client Portal para mover valores hacia su cuenta o fuera de ella.',
    back: 'Volver al Centro de Recursos',
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
    inboundSteps: [
      { title: 'Automated Customer Account Transfer Service (ACATS)' },
      { title: 'Account Transfer on Notification (ATON) para valores canadienses' },
      { title: 'DRS - Transfer Shares Held at Transfer Agent' },
      { title: 'DWAC - Deposit/Withdraw at Custodian' },
      { title: 'Free of Payment (FOP) para acciones de EE. UU.' },
      { title: 'Free of Payment Transfer of Global Securities' },
      { title: 'Internal Position Transfer' },
      { title: 'Transfer Positions Between Master and Sub Accounts' },
      { title: 'Crypto Deposit' },
    ],
    outboundTitle: 'Transferencias de salida',
    outboundSteps: [
      { title: 'DRS - Deliver Shares to the issuer transfer agent or registrar' },
      { title: 'DWAC - Deposit/Withdraw at Custodian' },
      { title: 'Free of Payment Transfer of US Securities' },
      { title: 'Free of Payment Transfer of Global Securities' },
      { title: 'Internal position transfers' },
      { title: 'Position Transfer Between Master and Sub Accounts' },
    ],
    noteTitle: 'Nota sobre Position Instruction',
    noteSteps: [
      {
        title: 'IBKR indica que las transferencias ACATS, ATON y FOP pueden usar una Position Instruction si desea crearla o reutilizarla durante la solicitud',
      },
    ],
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
        <h1 className="text-4xl md:text-5xl font-bold">{copy.title}</h1>
        <p className="text-lg text-subtitle leading-8 max-w-5xl">{copy.description}</p>
      </div>

      <BankingStepsCard title={copy.instructionsTitle} intro={copy.intro} steps={copy.steps} />
      <BankingStepsCard title={copy.inboundTitle} steps={copy.inboundSteps} />
      <BankingStepsCard title={copy.outboundTitle} steps={copy.outboundSteps} />
      <BankingStepsCard title={copy.noteTitle} steps={copy.noteSteps} />
    </motion.div>
  )
}

export default TransferPositionsPage
