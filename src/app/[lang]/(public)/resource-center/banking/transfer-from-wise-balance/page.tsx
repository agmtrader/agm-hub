'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatURL } from '@/utils/language/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const OFFICIAL_GUIDE_URL = 'https://ibkrguides.com/clientportal/transferandpay/wise-transfer.htm'

const guideContent = {
  en: {
    eyebrow: 'Banking',
    title: 'Transfer from Wise Balance',
    description:
      'This version follows the cleaner IBKR Client Portal guide flow: go to Transfer Funds, choose Deposit Funds, select Wise, authorize Wise if needed, then complete the quote and transfer setup.',
    back: 'Back to Resource Center',
    openGuide: 'Open official guide',
    instructionsTitle: 'Instructions',
    intro: 'To initiate a Wise transfer, follow the steps below.',
    steps: [
      {
        title: 'Open Transfer Funds',
        body: 'Click Transfer & Pay, then Transfer Funds.',
        note: 'Alternative path: click Menu in the top-left corner, then Transfer & Pay, then Transfer Funds.',
      },
      {
        title: 'Select the account',
        body: 'If you manage multiple accounts, use the Account Selector search to choose the account you want, then click Continue.',
      },
      {
        title: 'Choose Deposit Funds',
        body: 'From the Transfer Funds screen, select Deposit Funds.',
      },
      {
        title: 'Use a new deposit method if prompted',
        body: 'If IBKR asks which deposit method to use, choose Use a new deposit method.',
      },
      {
        title: 'Pick currency and Wise',
        body: 'In the Currency list, select the currency of your deposit, then choose Transfer from Wise Balance.',
      },
      {
        title: 'Authorize Wise',
        body: 'The first time you use Wise in Portal, IBKR redirects you to the Wise website for authorization. If you do not already have a Wise account, you will be asked to create one and complete the onboarding documents.',
      },
      {
        title: 'Review the quote and finish the transfer',
        body: 'After linking Wise, the Quote screen appears. Choose a deposit currency supported by IBKR, then continue with either Bank Transfer via Wise or Transfer from Wise Balance.',
      },
    ],
    optionsTitle: 'What the quote screen lets you do',
    options: [
      {
        title: 'Bank Transfer via Wise',
        body: 'If you send money to your Wise bank account in a supported local currency, Wise can convert it and deposit it into your IBKR account in a supported target currency. The quote shows fees, conversion rate, expected arrival amount, and arrival time.',
      },
      {
        title: 'Transfer from Wise Balance',
        body: 'You can use balances already held in your multi-currency Wise account. If the current balance currency is not supported, you must first convert it to a supported currency before transferring it to IBKR.',
      },
    ],
    supportedTitle: 'Supported currency note',
    supportedBody:
      'The guide explicitly mentions examples such as EUR, USD, GBP, AUD, HUF, CHF, SGD and NZD, with some entity-specific restrictions for SGD and NZD.',
  },
  es: {
    eyebrow: 'Banca',
    title: 'Transferir desde saldo de Wise',
    description:
      'Esta versión sigue el flujo más claro de la guía de IBKR Client Portal: entrar a Transfer Funds, elegir Deposit Funds, seleccionar Wise, autorizar Wise si hace falta y luego completar la cotización y la transferencia.',
    back: 'Volver al Centro de Recursos',
    openGuide: 'Abrir guía oficial',
    instructionsTitle: 'Instrucciones',
    intro: 'Para iniciar una transferencia con Wise, siga estos pasos.',
    steps: [
      {
        title: 'Abra Transfer Funds',
        body: 'Haga clic en Transfer & Pay y luego en Transfer Funds.',
        note: 'Ruta alternativa: haga clic en Menu en la esquina superior izquierda, luego en Transfer & Pay y después en Transfer Funds.',
      },
      {
        title: 'Seleccione la cuenta',
        body: 'Si administra varias cuentas, use la búsqueda del Account Selector para elegir la cuenta correcta y luego haga clic en Continue.',
      },
      {
        title: 'Elija Deposit Funds',
        body: 'Desde la pantalla de Transfer Funds, seleccione Deposit Funds.',
      },
      {
        title: 'Use un nuevo método de depósito si se lo piden',
        body: 'Si IBKR le pide escoger el método de depósito, seleccione Use a new deposit method.',
      },
      {
        title: 'Elija la moneda y Wise',
        body: 'En la lista Currency, seleccione la moneda del depósito y luego elija Transfer from Wise Balance.',
      },
      {
        title: 'Autorice Wise',
        body: 'La primera vez que use Wise en Portal, IBKR lo redirigirá al sitio de Wise para autorizarlo. Si todavía no tiene cuenta en Wise, deberá crearla y completar el proceso de incorporación con sus documentos.',
      },
      {
        title: 'Revise la cotización y termine la transferencia',
        body: 'Después de vincular Wise, aparecerá la pantalla de Quote. Allí debe elegir una moneda de depósito soportada por IBKR y continuar con Bank Transfer via Wise o Transfer from Wise Balance.',
      },
    ],
    optionsTitle: 'Qué permite hacer la pantalla de cotización',
    options: [
      {
        title: 'Bank Transfer via Wise',
        body: 'Si envía dinero a su cuenta bancaria de Wise en una moneda local soportada, Wise puede convertirlo y depositarlo en su cuenta de IBKR en una moneda objetivo soportada. La cotización muestra cargos, tasa de conversión, monto esperado y tiempo estimado de llegada.',
      },
      {
        title: 'Transfer from Wise Balance',
        body: 'Puede usar saldos ya disponibles en su cuenta multidivisa de Wise. Si la moneda del saldo no está soportada, primero debe convertirla a una moneda soportada antes de transferirla a IBKR.',
      },
    ],
    supportedTitle: 'Nota sobre monedas soportadas',
    supportedBody:
      'La guía menciona ejemplos como EUR, USD, GBP, AUD, HUF, CHF, SGD y NZD, con algunas restricciones por entidad para SGD y NZD.',
  },
} as const

const TransferFromWiseBalancePage = () => {
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
                  {'note' in step && step.note ? (
                    <p className="text-sm text-subtitle">{step.note}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{copy.optionsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          {copy.options.map((option) => (
            <div key={option.title} className="rounded-lg border border-border/60 p-5 bg-muted/20">
              <p className="font-semibold mb-2">{option.title}</p>
              <p className="text-subtitle leading-7">{option.body}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{copy.supportedTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-subtitle leading-7">{copy.supportedBody}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default TransferFromWiseBalancePage
