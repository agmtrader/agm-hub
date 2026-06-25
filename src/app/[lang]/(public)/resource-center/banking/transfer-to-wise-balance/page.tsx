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

const guideContent = {
  en: {
    eyebrow: 'Banking',
    title: 'Transfer to Wise Balance',
    description:
      'This page summarizes the Wise withdrawal method shown in the USD Funding Reference and presents it as a practical withdrawal guide.',
    back: 'Back to Resource Center',
    snapshotTitle: 'Method snapshot',
    snapshotDescription:
      'This withdrawal path is a dedicated Wise destination rather than the generic withdrawal flow.',
    speed: {
      label: 'Speed',
      value: 'Next day',
      detail: 'IBKR states that supported Wise withdrawals are typically received the next day.',
    },
    fees: {
      label: 'Fees',
      value: 'One free monthly withdrawal',
      detail:
        'IBKR gives one free withdrawal per calendar month. Additional withdrawals can trigger IBKR charges.',
    },
    stepsSummary: {
      label: 'Steps',
      value: '2 main steps',
      detail:
        'Set up Wise as the withdrawal destination, then submit the withdrawal request using that saved destination.',
    },
    instructionsTitle: 'Send funds to your Wise balance',
    intro: 'This is the practical flow to use Wise as the withdrawal destination from your IBKR account.',
    steps: [
      {
        title: 'Open Transfer Funds',
        body: 'Go to Transfer & Pay and then open Transfer Funds.',
      },
      {
        title: 'Choose Withdraw Funds',
        body: 'Select the IBKR account you want to withdraw from and choose Withdraw Funds.',
      },
      {
        title: 'Select or add Wise as the destination',
        body: 'Use your saved Wise withdrawal destination or add Wise as a new withdrawal destination if it has not been set up yet.',
      },
      {
        title: 'Enter amount and review',
        body: 'Select the currency, enter the amount, and review the withdrawal details carefully.',
      },
      {
        title: 'Pass the security check and submit',
        body: 'Complete any required security verification and then submit the withdrawal request to Wise.',
      },
    ],
  },
  es: {
    eyebrow: 'Banca',
    title: 'Transferir a saldo de Wise',
    description:
      'Esta página resume el método de retiro hacia Wise mostrado en USD Funding Reference y lo presenta como una guía práctica de retiro.',
    back: 'Volver al Centro de Recursos',
    snapshotTitle: 'Resumen del método',
    snapshotDescription:
      'Esta vía de retiro usa a Wise como destino específico, no el flujo genérico de retiro.',
    speed: {
      label: 'Velocidad',
      value: 'Al día siguiente',
      detail: 'IBKR indica que los retiros soportados hacia Wise normalmente se reciben al día siguiente.',
    },
    fees: {
      label: 'Cargos',
      value: 'Un retiro mensual gratis',
      detail:
        'IBKR da un retiro gratis por mes calendario. Los retiros adicionales pueden generar cargos de IBKR.',
    },
    stepsSummary: {
      label: 'Pasos',
      value: '2 pasos principales',
      detail:
        'Configure Wise como destino de retiro y luego envíe la solicitud usando ese destino guardado.',
    },
    instructionsTitle: 'Enviar fondos a su saldo de Wise',
    intro: 'Este es el flujo práctico para usar Wise como destino de retiro desde su cuenta de IBKR.',
    steps: [
      {
        title: 'Abra Transfer Funds',
        body: 'Vaya a Transfer & Pay y luego abra Transfer Funds.',
      },
      {
        title: 'Elija Withdraw Funds',
        body: 'Seleccione la cuenta de IBKR desde la que quiere retirar y elija Withdraw Funds.',
      },
      {
        title: 'Seleccione o agregue Wise como destino',
        body: 'Use su destino de retiro Wise ya guardado o agregue Wise como nuevo destino si todavía no está configurado.',
      },
      {
        title: 'Ingrese el monto y revise',
        body: 'Seleccione la moneda, ingrese el monto y revise con cuidado los detalles del retiro.',
      },
      {
        title: 'Pase la validación y envíe la solicitud',
        body: 'Complete cualquier validación de seguridad requerida y luego envíe la solicitud de retiro hacia Wise.',
      },
    ],
  },
} as const

const TransferToWiseBalancePage = () => <ResourceGuidePage sectionAnchor="banking" content={guideContent} />

export default TransferToWiseBalancePage
