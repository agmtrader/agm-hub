'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatURL } from '@/utils/language/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const OFFICIAL_GUIDE_URL = 'https://www.ibkrguides.com/clientportal/transferandpay/enterwithdrawal.htm'

const guideContent = {
  en: {
    eyebrow: 'Banking',
    title: 'Withdraw Funds',
    description:
      'This guide follows the IBKR Client Portal withdrawal flow for sending funds out of your account using saved or newly entered withdrawal instructions.',
    back: 'Back to Resource Center',
    openGuide: 'Open official guide',
    instructionsTitle: 'Enter a Withdrawal Request',
    intro: 'Use the Transfer Funds area in Client Portal to submit a withdrawal request.',
    steps: [
      {
        title: 'Open Transfer Funds',
        body: 'Click Transfer & Pay, then Transfer Funds.',
        note: 'Alternative path: click Menu in the top-left corner, then Transfer & Pay, then Transfer Funds.',
      },
      {
        title: 'Select the account',
        body: 'If you manage multiple accounts, choose the account you want to withdraw from and click Continue.',
      },
      {
        title: 'Choose Withdraw Funds',
        body: 'From the Transfer Funds screen, select Withdraw Funds.',
      },
      {
        title: 'Select or add withdrawal instructions',
        body: 'Choose existing saved withdrawal information, or enter new withdrawal instructions if needed.',
      },
      {
        title: 'Enter withdrawal details',
        body: 'Select the currency, enter the amount, and complete any requested destination or bank details.',
      },
      {
        title: 'Review and continue',
        body: 'Review the withdrawal details carefully, then click Continue.',
      },
      {
        title: 'Verify your identity',
        body: 'If prompted, complete the required security check using your login credentials, two-factor device, or confirmation code.',
      },
      {
        title: 'Submit the request',
        body: 'Confirm the withdrawal request and wait for IBKR to show the final submission status.',
      },
    ],
    noteTitle: 'Practical note',
    noteBody:
      'Exact fields and withdrawal methods can vary depending on your entity, currency, destination country, and whether the withdrawal instructions are already saved.',
  },
  es: {
    eyebrow: 'Banca',
    title: 'Retirar Fondos',
    description:
      'Esta guía sigue el flujo de retiros de IBKR Client Portal para enviar fondos fuera de su cuenta usando instrucciones guardadas o nuevas instrucciones de retiro.',
    back: 'Volver al Centro de Recursos',
    openGuide: 'Abrir guía oficial',
    instructionsTitle: 'Ingresar una solicitud de retiro',
    intro: 'Use el área de Transfer Funds en Client Portal para enviar una solicitud de retiro.',
    steps: [
      {
        title: 'Abra Transfer Funds',
        body: 'Haga clic en Transfer & Pay y luego en Transfer Funds.',
        note: 'Ruta alternativa: haga clic en Menu en la esquina superior izquierda, luego en Transfer & Pay y después en Transfer Funds.',
      },
      {
        title: 'Seleccione la cuenta',
        body: 'Si administra varias cuentas, elija la cuenta desde la cual desea retirar fondos y haga clic en Continue.',
      },
      {
        title: 'Elija Withdraw Funds',
        body: 'Desde la pantalla de Transfer Funds, seleccione Withdraw Funds.',
      },
      {
        title: 'Seleccione o agregue instrucciones de retiro',
        body: 'Elija instrucciones de retiro ya guardadas o ingrese nuevas instrucciones si hace falta.',
      },
      {
        title: 'Ingrese los detalles del retiro',
        body: 'Seleccione la moneda, ingrese el monto y complete cualquier dato de destino o datos bancarios que se pidan.',
      },
      {
        title: 'Revise y continúe',
        body: 'Revise con cuidado los detalles del retiro y luego haga clic en Continue.',
      },
      {
        title: 'Verifique su identidad',
        body: 'Si se lo piden, complete la validación de seguridad con sus credenciales, dispositivo de doble factor o código de confirmación.',
      },
      {
        title: 'Envíe la solicitud',
        body: 'Confirme la solicitud de retiro y espere a que IBKR muestre el estado final del envío.',
      },
    ],
    noteTitle: 'Nota práctica',
    noteBody:
      'Los campos exactos y los métodos de retiro pueden variar según la entidad, la moneda, el país de destino y si las instrucciones ya están guardadas.',
  },
} as const

const WithdrawFundsPage = () => {
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
          <CardTitle className="text-2xl">{copy.noteTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-subtitle leading-7">{copy.noteBody}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default WithdrawFundsPage
