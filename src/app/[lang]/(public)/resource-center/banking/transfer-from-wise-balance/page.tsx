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
    title: 'Transfer from Wise Balance',
    description:
      'This version follows the cleaner IBKR Client Portal guide flow: go to Transfer Funds, choose Deposit Funds, select Wise, authorize Wise if needed, then complete the quote and transfer setup.',
    back: 'Back to Resource Center',
    snapshotTitle: 'Method snapshot',
    speed: {
      label: 'Speed',
      value: 'Fast',
      detail:
        'IBKR describes this method as fast. Timing depends on currency and whether you transfer from an existing Wise balance or fund Wise first.',
    },
    fees: {
      label: 'Fees',
      value: 'Wise conversion fees may apply',
      detail:
        'The quote can include Wise conversion costs. The exact fee depends on the source currency, target currency, and transfer path you choose.',
    },
    stepsSummary: {
      label: 'Steps',
      value: '3 main actions',
      detail:
        'Authorize Wise, review the quote, then complete the transfer flow in Client Portal using the supported currency pair.',
    },
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
    optionsTitle: 'Choose how to fund the Wise transfer',
    optionsIntro: 'After Wise is linked and the quote screen appears, IBKR shows two ways to continue.',
    options: [
      {
        title: 'Use Bank Transfer via Wise',
        body: 'Choose this if you will send money to Wise first in a supported local currency so Wise can convert and forward it to IBKR.',
      },
      {
        title: 'Use Transfer from Wise Balance',
        body: 'Choose this if you already hold funds in a supported Wise balance and want to transfer them directly to IBKR.',
      },
      {
        title: 'Review the quote details',
        body: 'Confirm the fees, conversion rate, expected arrival amount, and estimated arrival time before continuing.',
      },
      {
        title: 'Complete the transfer in a supported currency',
        body: 'Finish the transfer using a supported currency pair. If your current Wise balance currency is not supported, convert it first.',
      },
    ],
  },
  es: {
    eyebrow: 'Banca',
    title: 'Transferir desde saldo de Wise',
    description:
      'Esta versión sigue el flujo más claro de la guía de IBKR Client Portal: entrar a Transfer Funds, elegir Deposit Funds, seleccionar Wise, autorizar Wise si hace falta y luego completar la cotización y la transferencia.',
    back: 'Volver al Centro de Recursos',
    snapshotTitle: 'Resumen del método',
    speed: {
      label: 'Velocidad',
      value: 'Rápido',
      detail:
        'IBKR describe este método como rápido. El tiempo depende de la moneda y de si transfiere desde un saldo existente de Wise o si primero fondea Wise.',
    },
    fees: {
      label: 'Cargos',
      value: 'Pueden aplicar cargos de conversión de Wise',
      detail:
        'La cotización puede incluir costos de conversión de Wise. El cargo exacto depende de la moneda de origen, la moneda destino y la ruta elegida.',
    },
    stepsSummary: {
      label: 'Pasos',
      value: '3 acciones principales',
      detail:
        'Autorice Wise, revise la cotización y luego complete la transferencia en Client Portal usando un par de monedas soportado.',
    },
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
    optionsTitle: 'Elija cómo fondear la transferencia con Wise',
    optionsIntro: 'Después de vincular Wise y de que aparezca la pantalla de cotización, IBKR muestra dos formas de continuar.',
    options: [
      {
        title: 'Use Bank Transfer via Wise',
        body: 'Elija esta opción si primero va a enviar dinero a Wise en una moneda local soportada para que Wise lo convierta y lo envíe a IBKR.',
      },
      {
        title: 'Use Transfer from Wise Balance',
        body: 'Elija esta opción si ya tiene fondos en un saldo soportado de Wise y quiere transferirlos directamente a IBKR.',
      },
      {
        title: 'Revise los detalles de la cotización',
        body: 'Confirme los cargos, la tasa de conversión, el monto esperado de llegada y el tiempo estimado antes de continuar.',
      },
      {
        title: 'Complete la transferencia en una moneda soportada',
        body: 'Termine la transferencia usando un par de monedas soportado. Si la moneda actual de su saldo Wise no está soportada, conviértala primero.',
      },
    ],
  },
} as const

const TransferFromWiseBalancePage = () => {
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
        speed={copy.speed}
        fees={copy.fees}
        steps={copy.stepsSummary}
      />

      <BankingStepsCard title={copy.instructionsTitle} intro={copy.intro} steps={copy.steps} />
      <BankingStepsCard title={copy.optionsTitle} intro={copy.optionsIntro} steps={copy.options} />
    </motion.div>
  )
}

export default TransferFromWiseBalancePage
