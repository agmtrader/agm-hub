'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

import { ResourceSnapshot } from '@/components/hub/resource-center/ResourceSnapshot'
import { ResourceSteps } from '@/components/hub/resource-center/ResourceSteps'
import { ResourceGuidePage } from '@/components/hub/resource-center/ResourceGuidePage'
import { Button } from '@/components/ui/button'
import { formatURL } from '@/utils/language/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const depositGuideContent = {
  en: {
    eyebrow: 'Banking',
    title: 'How to deposit funds into your account',
    description:
      'This page only covers the two deposit methods we actually use with IBKR Org Portal: Bank Wire and Direct ACH Transfer from your Bank.',
    back: 'Back to Resource Center',
    snapshotTitle: 'Method snapshot',
    snapshotDescription:
      'This deposit page is intentionally limited to Bank Wire and Direct ACH, not every IBKR funding option.',
    speed: {
      label: 'Speed',
      value: 'Fast rails only',
      detail:
        'Wire is typically the faster manual option. Direct ACH is simpler after setup, but availability still depends on your bank and IBKR access.',
    },
    fees: {
      label: 'Fees',
      value: 'Mostly bank-driven',
      detail:
        'Bank wire fees are usually charged by your bank. Direct ACH is generally cheaper, but that depends on your bank and account setup.',
    },
    stepsSummary: {
      label: 'Steps',
      value: '2 different flows',
      detail:
        'Wire requires a deposit notification plus a separate bank transfer. Direct ACH requires signing the ACH agreement first, then initiating the transfer from your bank.',
    },
    stepsTitle: 'Shared navigation in Org Portal',
    stepsIntro: 'Both deposit methods start from the same place in IBKR Org Portal.',
    steps: [
      {
        title: 'Open Transfer Funds',
        body: 'Click Transfer & Pay > Transfer Funds.',
        note: 'Alternative path: open Menu in the top-left corner, then go to Transfer & Pay > Transfer Funds.',
      },
      {
        title: 'Select the account',
        body: 'If needed, choose the correct account and click Continue.',
      },
      {
        title: 'Select Deposit Funds',
        body: 'From the Transfer Funds area, select Deposit Funds.',
      },
    ],
    wireTitle: 'Bank Wire',
    wireIntro:
      'A wire deposit notification does not move money by itself. After creating the notification in IBKR, you still need to instruct your bank or broker to send the wire.',
    wireSteps: [
      {
        title: 'Use a new deposit method if prompted',
        body: 'If IBKR prompts you, select Use a new deposit method.',
      },
      {
        title: 'Select Bank Wire',
        body: 'Choose Bank Wire as the deposit method.',
      },
      {
        title: 'Choose whether to save the bank information',
        body: 'Select whether you want to save the bank information for future deposits.',
      },
      {
        title: 'Enter sending bank details',
        body: 'Enter the sending institution and an account nickname. The account number is optional.',
      },
      {
        title: 'Enter the deposit amount',
        body: 'Type the amount you plan to deposit.',
      },
      {
        title: 'Set recurrence if needed',
        body: 'If this should repeat, mark it as a recurring transaction and complete the recurring fields.',
      },
      {
        title: 'Get wire instructions and send the wire',
        body: 'Click Get Wire Instructions and then send the wire from your bank using those instructions.',
      },
    ],
    achTitle: 'Direct ACH Transfer from your Bank',
    achIntro:
      'Direct ACH requires signing the ACH agreement inside IBKR first. After that, you initiate the transfer from your bank.',
    achSteps: [
      {
        title: 'Use a new deposit method',
        body: 'Select Use a new deposit method.',
      },
      {
        title: 'Choose currency and Direct ACH',
        body: 'Choose the deposit currency and select Direct ACH Transfer from your Bank.',
      },
      {
        title: 'Review and sign the ACH agreement',
        body: 'Click Review and Sign to sign the agreement and finish the ACH setup.',
      },
      {
        title: 'Initiate the transfer from your bank',
        body: 'Once the agreement is complete, initiate the Direct ACH transfer from your bank.',
      },
    ],
  },
  es: {
    eyebrow: 'Banca',
    title: 'Cómo depositar fondos en su cuenta',
    description:
      'Esta página solo cubre los dos métodos de depósito que sí usamos en IBKR Org Portal: Bank Wire y Direct ACH Transfer from your Bank.',
    back: 'Volver al Centro de Recursos',
    snapshotTitle: 'Resumen del método',
    snapshotDescription:
      'Esta página de depósitos está limitada de forma intencional a Bank Wire y Direct ACH, no a todas las opciones de fondeo de IBKR.',
    speed: {
      label: 'Velocidad',
      value: 'Solo vías rápidas',
      detail:
        'Wire normalmente es la opción manual más rápida. Direct ACH es más simple después de la configuración, pero igual depende del banco y del acceso en IBKR.',
    },
    fees: {
      label: 'Cargos',
      value: 'Principalmente dependen del banco',
      detail:
        'Los cargos de wire normalmente los cobra el banco. Direct ACH suele ser más barato, pero eso depende de su banco y de la configuración de la cuenta.',
    },
    stepsSummary: {
      label: 'Pasos',
      value: '2 flujos distintos',
      detail:
        'Wire requiere una notificación de depósito más una transferencia separada desde el banco. Direct ACH exige firmar primero el acuerdo ACH y luego iniciar la transferencia desde el banco.',
    },
    stepsTitle: 'Navegación compartida en Org Portal',
    stepsIntro: 'Ambos métodos de depósito empiezan en el mismo lugar dentro de IBKR Org Portal.',
    steps: [
      {
        title: 'Abra Transfer Funds',
        body: 'Haga clic en Transfer & Pay > Transfer Funds.',
        note: 'Ruta alternativa: abra Menu en la esquina superior izquierda y luego vaya a Transfer & Pay > Transfer Funds.',
      },
      {
        title: 'Seleccione la cuenta',
        body: 'Si hace falta, elija la cuenta correcta y haga clic en Continue.',
      },
      {
        title: 'Seleccione Deposit Funds',
        body: 'Desde el área de Transfer Funds, seleccione Deposit Funds.',
      },
    ],
    wireTitle: 'Bank Wire',
    wireIntro:
      'Una notificación de wire deposit no mueve dinero por sí sola. Después de crear la notificación en IBKR, todavía debe instruir a su banco o broker para que envíe el wire.',
    wireSteps: [
      {
        title: 'Use un nuevo método de depósito si se lo piden',
        body: 'Si IBKR se lo pide, seleccione Use a new deposit method.',
      },
      {
        title: 'Seleccione Bank Wire',
        body: 'Elija Bank Wire como método de depósito.',
      },
      {
        title: 'Defina si quiere guardar la información bancaria',
        body: 'Seleccione si desea guardar la información bancaria para futuros depósitos.',
      },
      {
        title: 'Ingrese los datos del banco emisor',
        body: 'Ingrese la institución emisora y un apodo para la cuenta. El número de cuenta es opcional.',
      },
      {
        title: 'Ingrese el monto del depósito',
        body: 'Escriba el monto que planea depositar.',
      },
      {
        title: 'Configure recurrencia si hace falta',
        body: 'Si esto se va a repetir, márquelo como transacción recurrente y complete esos campos.',
      },
      {
        title: 'Obtenga las instrucciones y envíe el wire',
        body: 'Haga clic en Get Wire Instructions y luego envíe el wire desde su banco usando esas instrucciones.',
      },
    ],
    achTitle: 'Direct ACH Transfer from your Bank',
    achIntro:
      'Direct ACH exige firmar primero el acuerdo ACH dentro de IBKR. Después de eso, la transferencia se inicia desde su banco.',
    achSteps: [
      {
        title: 'Use un nuevo método de depósito',
        body: 'Seleccione Use a new deposit method.',
      },
      {
        title: 'Elija la moneda y Direct ACH',
        body: 'Elija la moneda del depósito y seleccione Direct ACH Transfer from your Bank.',
      },
      {
        title: 'Revise y firme el acuerdo ACH',
        body: 'Haga clic en Review and Sign para firmar el acuerdo y terminar la configuración de ACH.',
      },
      {
        title: 'Inicie la transferencia desde su banco',
        body: 'Una vez completado el acuerdo, inicie la transferencia Direct ACH desde su banco.',
      },
    ],
  },
} as const

const DepositFundsGuidePage = () => <ResourceGuidePage sectionAnchor="banking" content={depositGuideContent} />

export default DepositFundsGuidePage
