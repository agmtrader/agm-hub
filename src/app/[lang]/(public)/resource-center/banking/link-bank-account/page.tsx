'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

import { BankingMethodSnapshot } from '@/components/hub/learning/BankingMethodSnapshot'
import { BankingStepsCard } from '@/components/hub/learning/BankingStepsCard'
import { Button } from '@/components/ui/button'
import { formatURL } from '@/utils/language/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const guideContent = {
  en: {
    eyebrow: 'Banking',
    title: 'Link a Bank Account',
    description:
      'Use this option to set up your bank as a linked funding destination or source in IBKR.',
    back: 'Back to Resource Center',
    snapshotTitle: 'Method snapshot',
    snapshotDescription:
      'This is the setup layer for later deposits or withdrawals, so timing mostly depends on bank verification.',
    speed: {
      label: 'Speed',
      value: 'Depends on verification',
      detail:
        'The link itself can be quick, but full activation depends on the bank, ownership checks, and the transfer method behind the link.',
    },
    fees: {
      label: 'Fees',
      value: 'Depends on the linked rail',
      detail:
        'IBKR points back to the underlying transfer method. Wire, ACH, and bank-specific fees are not uniform here.',
    },
    stepsSummary: {
      label: 'Steps',
      value: '2 main steps',
      detail:
        'Enter the bank details IBKR asks for, then complete any ownership or verification checks before using the account.',
    },
    instructionsTitle: 'Link a bank account',
    intro: 'Use this flow when you need to add a bank as a future funding source or withdrawal destination in IBKR.',
    steps: [
      {
        title: 'Open Transfer Funds',
        body: 'Go to Transfer & Pay and then open Transfer Funds.',
      },
      {
        title: 'Choose the bank-linking flow',
        body: 'Select the option to add or link a new bank account from the available funding methods.',
      },
      {
        title: 'Enter the bank account details',
        body: 'Provide the bank information IBKR requests, including the account details needed for the link.',
      },
      {
        title: 'Complete ownership or verification checks',
        body: 'Finish any ownership confirmation, verification, or security steps IBKR requires before activating the linked bank account.',
      },
      {
        title: 'Use the linked bank for future deposits or withdrawals',
        body: 'Once the setup is approved, the linked bank can be reused for supported funding actions.',
      },
    ],
  },
  es: {
    eyebrow: 'Banca',
    title: 'Vincular una cuenta bancaria',
    description:
      'Use esta opción para configurar su banco como origen o destino de fondos vinculado en IBKR.',
    back: 'Volver al Centro de Recursos',
    snapshotTitle: 'Resumen del método',
    snapshotDescription:
      'Esta es la capa de configuración para futuros depósitos o retiros, así que el tiempo depende sobre todo de la verificación bancaria.',
    speed: {
      label: 'Velocidad',
      value: 'Depende de la verificación',
      detail:
        'La vinculación puede ser rápida, pero la activación completa depende del banco, de las validaciones de titularidad y del método de transferencia detrás del vínculo.',
    },
    fees: {
      label: 'Cargos',
      value: 'Dependen de la vía vinculada',
      detail:
        'IBKR remite al método subyacente. Los cargos de wire, ACH y del banco no son uniformes aquí.',
    },
    stepsSummary: {
      label: 'Pasos',
      value: '2 pasos principales',
      detail:
        'Ingrese los datos bancarios que IBKR pida y luego complete cualquier validación de titularidad o verificación antes de usar la cuenta.',
    },
    instructionsTitle: 'Vincular una cuenta bancaria',
    intro: 'Use este flujo cuando necesite agregar un banco como origen futuro de fondos o como destino de retiro en IBKR.',
    steps: [
      {
        title: 'Abra Transfer Funds',
        body: 'Vaya a Transfer & Pay y luego abra Transfer Funds.',
      },
      {
        title: 'Elija el flujo para vincular el banco',
        body: 'Seleccione la opción para agregar o vincular una nueva cuenta bancaria desde los métodos de fondeo disponibles.',
      },
      {
        title: 'Ingrese los datos de la cuenta bancaria',
        body: 'Proporcione la información bancaria que IBKR pida, incluidos los datos necesarios para crear el vínculo.',
      },
      {
        title: 'Complete las validaciones de titularidad o verificación',
        body: 'Termine cualquier confirmación de titularidad, verificación o validación de seguridad que IBKR requiera antes de activar la cuenta bancaria vinculada.',
      },
      {
        title: 'Use el banco vinculado para futuros movimientos',
        body: 'Una vez aprobada la configuración, el banco vinculado se puede reutilizar para acciones de fondeo soportadas.',
      },
    ],
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
        <h1 className="text-4xl md:text-5xl font-bold">{copy.title}</h1>
        <p className="text-lg text-subtitle leading-8 max-w-5xl">{copy.description}</p>
      </div>

      <BankingMethodSnapshot
        title={copy.snapshotTitle}
        description={copy.snapshotDescription}
        speed={copy.speed}
        fees={copy.fees}
        steps={copy.stepsSummary}
      />

      <BankingStepsCard title={copy.instructionsTitle} intro={copy.intro} steps={copy.steps} />
    </motion.div>
  )
}

export default LinkBankAccountPage
