'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatURL } from '@/utils/language/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const OFFICIAL_GUIDE_URL = 'https://www.ibkrguides.com/clientportal/transferandpay/transferinternal.htm'

const guideContent = {
  en: {
    eyebrow: 'Banking',
    title: 'Internal Transfer',
    description:
      'This guide follows the IBKR Client Portal internal transfer flow for moving cash, positions, or a full account between IBKR accounts.',
    back: 'Back to Resource Center',
    openGuide: 'Open official guide',
    instructionsTitle: 'Enter an Internal Funds Transfer',
    intro: 'Use the Fund Transfers page to transfer funds internally from your account to another IBKR account.',
    steps: [
      {
        title: 'Open Transfer Funds',
        body: 'Click Transfer & Pay, then Transfer Funds.',
        note: 'Alternative path: click Menu in the top-left corner, then Transfer & Pay, then Transfer Funds.',
      },
      {
        title: 'Select the source account',
        body: 'If the Account Selector opens, choose the account you want to use for the transaction, or search for it, then click Continue.',
      },
      {
        title: 'Choose Internal Transfer',
        body: 'From the tab menu, select Internal Transfer.',
      },
      {
        title: 'Pick transfer type and destination account',
        body: 'Select Position Transfer, Cash Transfer, or Full Account Transfer. Then choose the Destination Account and press Continue.',
      },
      {
        title: 'Enter currency and amount',
        body: 'Select the Currency and enter the Amount to transfer.',
      },
      {
        title: 'Continue and verify',
        body: 'Click Continue. If prompted, enter your username and password.',
      },
      {
        title: 'Confirm the transfer',
        body: 'IBKR sends an email with a confirmation number. Enter that number on the Internal Funds Transfer page, then click Confirm.',
      },
      {
        title: 'Resend if needed',
        body: 'If the confirmation number does not arrive, use Resend Confirmation Number to request a new one.',
      },
    ],
    associationTitle: 'If the destination account does not appear',
    associationIntro:
      'If the destination account does not populate in the drop-down list, IBKR says to request a new Transfer Association using the flow below.',
    associationSteps: [
      'Go back to Transfer & Pay > Transfer Funds and select the source account.',
      'Open Internal Transfer from the tab menu.',
      'Manually enter the destination account number and provide a reason for the transfer, then press Continue.',
      'Select the Currency and enter the Amount.',
      'If prompted, verify your identity using your login details and two-factor security device, or enter the emailed confirmation number and continue.',
      'Go to Transfer & Pay > Saved Information > Pending to review the pending request.',
    ],
    noteTitle: 'Practical note',
    noteBody:
      'IBKR explicitly says you can click Cancel at any time while entering the transaction.',
  },
  es: {
    eyebrow: 'Banca',
    title: 'Transferencia Interna',
    description:
      'Esta guía sigue el flujo de IBKR Client Portal para mover efectivo, posiciones o una cuenta completa entre cuentas de IBKR.',
    back: 'Volver al Centro de Recursos',
    openGuide: 'Abrir guía oficial',
    instructionsTitle: 'Ingresar una transferencia interna de fondos',
    intro: 'Use la página Fund Transfers para transferir fondos internamente desde su cuenta hacia otra cuenta de IBKR.',
    steps: [
      {
        title: 'Abra Transfer Funds',
        body: 'Haga clic en Transfer & Pay y luego en Transfer Funds.',
        note: 'Ruta alternativa: haga clic en Menu en la esquina superior izquierda, luego en Transfer & Pay y después en Transfer Funds.',
      },
      {
        title: 'Seleccione la cuenta de origen',
        body: 'Si aparece el Account Selector, elija la cuenta que desea usar para la transacción, o búsquela, y luego haga clic en Continue.',
      },
      {
        title: 'Elija Internal Transfer',
        body: 'Desde el menú de pestañas, seleccione Internal Transfer.',
      },
      {
        title: 'Defina el tipo de transferencia y la cuenta destino',
        body: 'Seleccione Position Transfer, Cash Transfer o Full Account Transfer. Luego elija la Destination Account y presione Continue.',
      },
      {
        title: 'Ingrese moneda y monto',
        body: 'Seleccione la Currency e ingrese el Amount a transferir.',
      },
      {
        title: 'Continúe y verifique',
        body: 'Haga clic en Continue. Si se lo piden, ingrese su usuario y contraseña.',
      },
      {
        title: 'Confirme la transferencia',
        body: 'IBKR enviará un correo con un número de confirmación. Ingrese ese número en la página Internal Funds Transfer y luego haga clic en Confirm.',
      },
      {
        title: 'Reenvíe si hace falta',
        body: 'Si no recibe el número de confirmación, use Resend Confirmation Number para solicitar uno nuevo.',
      },
    ],
    associationTitle: 'Si la cuenta destino no aparece',
    associationIntro:
      'Si la cuenta de destino no aparece en la lista desplegable, IBKR indica solicitar una nueva Transfer Association con este flujo.',
    associationSteps: [
      'Vuelva a Transfer & Pay > Transfer Funds y seleccione la cuenta de origen.',
      'Abra Internal Transfer desde el menú de pestañas.',
      'Ingrese manualmente el número de cuenta destino y el motivo de la transferencia, luego presione Continue.',
      'Seleccione la Currency e ingrese el Amount.',
      'Si se lo piden, verifique su identidad con sus credenciales y el dispositivo de doble factor, o ingrese el número de confirmación enviado por correo y continúe.',
      'Vaya a Transfer & Pay > Saved Information > Pending para revisar la solicitud pendiente.',
    ],
    noteTitle: 'Nota práctica',
    noteBody:
      'IBKR indica de forma explícita que puede hacer clic en Cancel en cualquier momento mientras está ingresando la transacción.',
  },
} as const

const InternalTransferPage = () => {
  const { lang } = useTranslationProvider()
  const copy = guideContent[lang as keyof typeof guideContent] ?? guideContent.en

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto py-14 px-6 flex flex-col gap-8"
    >
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
          <CardTitle className="text-2xl">{copy.associationTitle}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <p className="text-base text-subtitle leading-7">{copy.associationIntro}</p>
          <ol className="space-y-4">
            {copy.associationSteps.map((step, index) => (
              <li key={step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-muted text-foreground flex items-center justify-center shrink-0 font-semibold">
                  {index + 1}
                </div>
                <p className="text-subtitle leading-7">{step}</p>
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

export default InternalTransferPage
