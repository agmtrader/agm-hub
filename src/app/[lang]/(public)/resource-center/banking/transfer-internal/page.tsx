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
    title: 'Internal Transfer',
    description:
      'This guide follows the IBKR Client Portal internal transfer flow for moving cash, positions, or a full account between IBKR accounts.',
    back: 'Back to Resource Center',
    snapshotTitle: 'Method snapshot',
    speed: {
      label: 'Speed',
      value: 'Usually fast after confirmation',
      detail:
        'Internal transfers avoid an external bank, but timing still depends on the transfer type, destination account setup, and confirmation steps.',
    },
    fees: {
      label: 'Fees',
      value: 'Not the main constraint',
      detail:
        'IBKR emphasizes association and confirmation requirements more than fees here. If a fee applies, it depends on the transfer type and account setup.',
    },
    stepsSummary: {
      label: 'Steps',
      value: '3 main actions',
      detail:
        'Choose the transfer type and destination account, enter the amount, then confirm the request with the emailed code or security prompt.',
    },
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
      {
        title: 'Return to Transfer Funds',
        body: 'Go back to Transfer & Pay > Transfer Funds and select the source account.',
      },
      {
        title: 'Open Internal Transfer again',
        body: 'Open Internal Transfer from the tab menu.',
      },
      {
        title: 'Enter the destination account manually',
        body: 'Manually enter the destination account number and provide a reason for the transfer, then press Continue.',
      },
      {
        title: 'Enter currency and amount',
        body: 'Select the Currency and enter the Amount.',
      },
      {
        title: 'Verify the request',
        body: 'If prompted, verify your identity using your login details and two-factor security device, or enter the emailed confirmation number and continue.',
      },
      {
        title: 'Review the pending request',
        body: 'Go to Transfer & Pay > Saved Information > Pending to review the pending request.',
      },
    ],
  },
  es: {
    eyebrow: 'Banca',
    title: 'Transferencia Interna',
    description:
      'Esta guía sigue el flujo de IBKR Client Portal para mover efectivo, posiciones o una cuenta completa entre cuentas de IBKR.',
    back: 'Volver al Centro de Recursos',
    snapshotTitle: 'Resumen del método',
    speed: {
      label: 'Velocidad',
      value: 'Normalmente rápido tras la confirmación',
      detail:
        'La transferencia interna evita un banco externo, pero el tiempo igual depende del tipo de movimiento, de la cuenta destino y de los pasos de confirmación.',
    },
    fees: {
      label: 'Cargos',
      value: 'No suelen ser la principal limitante',
      detail:
        'IBKR pone más foco en la asociación y la confirmación que en los cargos. Si existe algún cargo, depende del tipo de transferencia y de la cuenta.',
    },
    stepsSummary: {
      label: 'Pasos',
      value: '3 acciones principales',
      detail:
        'Elija el tipo de transferencia y la cuenta destino, ingrese el monto y luego confirme la solicitud con el código por correo o la validación de seguridad.',
    },
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
      {
        title: 'Vuelva a Transfer Funds',
        body: 'Vuelva a Transfer & Pay > Transfer Funds y seleccione la cuenta de origen.',
      },
      {
        title: 'Abra Internal Transfer otra vez',
        body: 'Abra Internal Transfer desde el menú de pestañas.',
      },
      {
        title: 'Ingrese manualmente la cuenta destino',
        body: 'Ingrese manualmente el número de cuenta destino y el motivo de la transferencia, luego presione Continue.',
      },
      {
        title: 'Ingrese moneda y monto',
        body: 'Seleccione la Currency e ingrese el Amount.',
      },
      {
        title: 'Verifique la solicitud',
        body: 'Si se lo piden, verifique su identidad con sus credenciales y el dispositivo de doble factor, o ingrese el número de confirmación enviado por correo y continúe.',
      },
      {
        title: 'Revise la solicitud pendiente',
        body: 'Vaya a Transfer & Pay > Saved Information > Pending para revisar la solicitud pendiente.',
      },
    ],
  },
} as const

const InternalTransferPage = () => <ResourceGuidePage sectionAnchor="banking" content={guideContent} />

export default InternalTransferPage
