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
    title: 'Link My Existing Account to AGM',
    description:
      'This guide follows the IBKR Client Portal flow for moving an existing account to an Advisor or Broker relationship.',
    back: 'Back to Resource Center',
    rulesTitle: 'Rules to know first',
    rules: [
      { title: 'All cash and positions move together' },
      { title: 'Moving the entire account to an Advisor removes direct TWS login and cancels current market data subscriptions' },
      { title: 'Moving the entire account to a Broker still allows TWS login and keeps current market data subscriptions active' },
      { title: 'Advisor or Broker fees may be debited after the move' },
      { title: 'IBKR processes these moves every business day after 3:00 PM EST' },
    ],
    instructionsTitle: 'Moving your account',
    steps: [
      {
        title: 'Open Manage Account Linking',
        body: 'Click the User menu in the top-right corner, then Settings > Account Configuration > Manage Account Linking.',
      },
      {
        title: 'Choose the advisor or broker linking option',
        body: 'Click Link My Existing Account to an Advisor/Broker, then press Continue.',
      },
      {
        title: 'Enter the destination account information',
        body: 'Enter the Account ID and Title of the Advisor or Broker account you want to link to, then press Continue.',
      },
      {
        title: 'Sign the agreements',
        body: 'Type your signature into each agreement shown and click I Agree after signing each one.',
      },
      {
        title: 'Wait for approval',
        body: 'IBKR sends a message to the Advisor or Broker. They must approve the request in Pending Items before the linked relationship is opened.',
      },
    ],
    familyTitle: 'Family Office or FAM requests',
    familySteps: [
      {
        title: 'Standalone client accounts can also request linkage to FAM and Family Office master accounts',
      },
      {
        title: 'IBKR presents an additional questionnaire for that case',
      },
      {
        title: 'The master account holder must consent before the request moves forward for review',
      },
    ],
  },
  es: {
    eyebrow: 'Gestión de Cuenta',
    title: 'Vincular mi cuenta existente a AGM',
    description:
      'Esta guía sigue el flujo de IBKR Client Portal para mover una cuenta existente a una relación con un Advisor o Broker.',
    back: 'Volver al Centro de Recursos',
    rulesTitle: 'Reglas a tener claras primero',
    rules: [
      { title: 'Todo el efectivo y las posiciones se mueven a la cuenta administrada por el Advisor o Broker' },
      { title: 'Si mueve la cuenta completa a un Advisor, ya no podrá entrar directamente a TWS y sus suscripciones actuales de market data se cancelan' },
      { title: 'Si mueve la cuenta completa a un Broker, todavía podrá entrar a TWS y sus suscripciones actuales de market data no se cancelan' },
      { title: 'Una vez movida, se pueden debitar cargos según lo establecido por el Advisor o Broker' },
      { title: 'IBKR procesa estos movimientos cada día hábil después de las 3:00 PM EST' },
    ],
    instructionsTitle: 'Mover su cuenta',
    steps: [
      {
        title: 'Abra Manage Account Linking',
        body: 'Haga clic en el User menu en la parte superior derecha y luego vaya a Settings > Account Configuration > Manage Account Linking.',
      },
      {
        title: 'Elija la opción de vínculo con advisor o broker',
        body: 'Haga clic en Link My Existing Account to an Advisor/Broker y luego presione Continue.',
      },
      {
        title: 'Ingrese la información de la cuenta destino',
        body: 'Ingrese el Account ID y el Title de la cuenta del Advisor o Broker a la que quiere vincularse y luego presione Continue.',
      },
      {
        title: 'Firme los acuerdos',
        body: 'Escriba su firma en cada acuerdo mostrado y haga clic en I Agree después de firmar cada uno.',
      },
      {
        title: 'Espere la aprobación',
        body: 'IBKR envía un mensaje al Advisor o Broker. Esa persona o entidad debe aprobar la solicitud en Pending Items antes de que la relación vinculada quede abierta.',
      },
    ],
    familyTitle: 'Solicitudes Family Office o FAM',
    familySteps: [
      {
        title: 'Las cuentas standalone también pueden solicitar vínculo con cuentas maestras FAM y Family Office',
      },
      {
        title: 'IBKR presenta un cuestionario adicional en ese caso',
      },
      {
        title: 'El titular de la cuenta master debe dar su consentimiento antes de que la solicitud avance a revisión',
      },
    ],
  },
} as const

const LinkAccountToAgmPage = () => {
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

      <BankingStepsCard title={copy.rulesTitle} steps={copy.rules} />
      <BankingStepsCard title={copy.instructionsTitle} steps={copy.steps} />
      <BankingStepsCard title={copy.familyTitle} steps={copy.familySteps} />
    </motion.div>
  )
}

export default LinkAccountToAgmPage
