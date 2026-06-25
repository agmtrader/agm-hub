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
    title: 'Withdraw Funds',
    description:
      'This guide follows the IBKR Client Portal withdrawal flow for sending funds out of your account using saved or newly entered withdrawal instructions.',
    back: 'Back to Resource Center',
    snapshotTitle: 'Method snapshot',
    speed: {
      label: 'Speed',
      value: 'Depends on destination',
      detail:
        'Withdrawals can be fast for supported electronic destinations, but the final arrival time still depends on the bank, currency, and withdrawal rail.',
    },
    fees: {
      label: 'Fees',
      value: 'Method-specific',
      detail:
        'IBKR charges depend on the withdrawal type. For bank wires, IBKR commonly gives one free withdrawal per calendar month and then applies charges.',
    },
    stepsSummary: {
      label: 'Steps',
      value: 'Around 3 main actions',
      detail:
        'Choose or add destination instructions, enter the amount, then pass the security check and submit the request.',
    },
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
  },
  es: {
    eyebrow: 'Banca',
    title: 'Retirar Fondos',
    description:
      'Esta guía sigue el flujo de retiros de IBKR Client Portal para enviar fondos fuera de su cuenta usando instrucciones guardadas o nuevas instrucciones de retiro.',
    back: 'Volver al Centro de Recursos',
    snapshotTitle: 'Resumen del método',
    speed: {
      label: 'Velocidad',
      value: 'Depende del destino',
      detail:
        'Los retiros pueden ser rápidos para destinos electrónicos soportados, pero el tiempo final depende del banco, la moneda y la vía de retiro.',
    },
    fees: {
      label: 'Cargos',
      value: 'Dependen del método',
      detail:
        'Los cargos de IBKR dependen del tipo de retiro. Para transferencias bancarias, IBKR normalmente da un retiro gratis por mes calendario y luego cobra.',
    },
    stepsSummary: {
      label: 'Pasos',
      value: 'Unas 3 acciones principales',
      detail:
        'Elija o agregue las instrucciones de destino, ingrese el monto y luego pase la validación de seguridad para enviar la solicitud.',
    },
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
  },
} as const

const WithdrawFundsPage = () => <ResourceGuidePage sectionAnchor="banking" content={guideContent} />

export default WithdrawFundsPage
