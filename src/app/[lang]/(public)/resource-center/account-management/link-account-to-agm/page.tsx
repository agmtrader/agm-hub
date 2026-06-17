'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatURL } from '@/utils/language/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const OFFICIAL_GUIDE_URL = 'https://www.ibkrguides.com/clientportal/moveaccounttoadvisorbroker.htm'

const guideContent = {
  en: {
    eyebrow: 'Account Management',
    title: 'Link My Existing Account to AGM',
    description:
      'This guide follows the IBKR Client Portal flow for moving an existing account to an Advisor or Broker relationship.',
    back: 'Back to Resource Center',
    openGuide: 'Open official guide',
    rulesTitle: 'Rules to know first',
    rules: [
      'All cash and positions move to the Advisor/Broker-managed account.',
      'If you move the entire account to an Advisor, you will no longer log into TWS directly and current market data subscriptions are canceled.',
      'If you move the entire account to a Broker, you can still log into TWS and current market data subscriptions are not canceled.',
      'Once moved, fees may be debited as specified by the Advisor or Broker.',
      'Accounts are moved every business day after 3:00 PM EST.',
    ],
    instructionsTitle: 'Moving your account',
    steps: [
      {
        title: 'Open Manage Account Linking',
        body: 'Click the User menu in the top-right corner, then Settings > Account Configuration > Manage Account Linking.',
      },
      {
        title: 'Choose the advisor/broker linking option',
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
    familyTitle: 'Family Office / FAM note',
    familyBody:
      'IBKR also allows standalone client accounts to request linkage to FAM and Family Office master accounts. In that case, IBKR presents a questionnaire and the master account holder must consent before review.',
  },
  es: {
    eyebrow: 'Gestión de Cuenta',
    title: 'Vincular mi cuenta existente a AGM',
    description:
      'Esta guía sigue el flujo de IBKR Client Portal para mover una cuenta existente a una relación con un Advisor o Broker.',
    back: 'Volver al Centro de Recursos',
    openGuide: 'Abrir guía oficial',
    rulesTitle: 'Reglas a tener claras primero',
    rules: [
      'Todo el efectivo y las posiciones se mueven a la cuenta administrada por el Advisor/Broker.',
      'Si mueve la cuenta completa a un Advisor, ya no podrá entrar directamente a TWS y sus suscripciones actuales de market data se cancelan.',
      'Si mueve la cuenta completa a un Broker, todavía podrá entrar a TWS y sus suscripciones actuales de market data no se cancelan.',
      'Una vez movida, se pueden debitar cargos según lo establecido por el Advisor o Broker.',
      'Las cuentas se mueven cada día hábil después de las 3:00 PM EST.',
    ],
    instructionsTitle: 'Mover su cuenta',
    steps: [
      {
        title: 'Abra Manage Account Linking',
        body: 'Haga clic en el User menu en la parte superior derecha y luego vaya a Settings > Account Configuration > Manage Account Linking.',
      },
      {
        title: 'Elija la opción de vínculo con advisor/broker',
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
    familyTitle: 'Nota sobre Family Office / FAM',
    familyBody:
      'IBKR también permite que cuentas standalone soliciten vincularse a cuentas maestras FAM y Family Office. En ese caso, IBKR presenta un cuestionario y el titular de la cuenta master debe dar su consentimiento antes de la revisión.',
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
          <CardTitle className="text-2xl">{copy.rulesTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {copy.rules.map((rule) => (
              <li key={rule} className="list-disc ml-5 text-subtitle leading-7">{rule}</li>
            ))}
          </ul>
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
          <CardTitle className="text-2xl">{copy.familyTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-subtitle leading-7">{copy.familyBody}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default LinkAccountToAgmPage
