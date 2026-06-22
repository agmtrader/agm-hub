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
    title: 'Link Existing Accounts Under One Username',
    description:
      'This guide follows the IBKR Client Portal process for combining multiple eligible accounts under one username and password.',
    back: 'Back to Resource Center',
    rulesTitle: 'Rules to know first',
    rules: [
      { title: 'You must have an IBKR Secure Login System security device' },
      { title: 'Email addresses, account titles, tax IDs, and physical addresses across the accounts must match' },
      { title: 'You must link all eligible accounts associated with you; IBKR does not allow linking only a subset' },
      { title: 'Once linked, the old usernames and passwords stop working and the kept username becomes the login for all linked accounts' },
      { title: 'The highest-level security device among linked accounts becomes the active device' },
      { title: 'IBKR processes linked accounts every business day after 3:00 PM EST' },
    ],
    instructionsTitle: 'Link existing accounts',
    steps: [
      {
        title: 'Open Manage Account Linking',
        body: 'Click the User menu in the top-right corner, then Settings > Account Configuration > Manage Account Linking.',
      },
      {
        title: 'Choose the single-username option',
        body: 'Click Link All of My Existing Accounts Under a Single Username and Password, then select Continue.',
      },
      {
        title: 'Pick the username to keep',
        body: 'When the Select Username screen opens, choose which username you want to keep for all linked accounts.',
      },
      {
        title: 'Review the security device',
        body: 'IBKR shows the security device for the selected username. Click Continue.',
      },
      {
        title: 'Authenticate each account',
        body: 'Enter the username, password, and required authentication for each account you want to link, advancing through each screen with Continue.',
      },
      {
        title: 'Verify financial and trading information',
        body: 'Review the aggregated financial information and trading experience for all accounts, then click Continue.',
      },
      {
        title: 'Verify account and bank information',
        body: 'Review your account information, then any saved bank information, and continue through the final confirmation screens.',
      },
    ],
    afterTitle: 'After the accounts are linked',
    afterSteps: [
      {
        title: 'You can log in once and use the Account Selector to switch between linked accounts in Client Portal',
      },
      {
        title: 'Client Portal reloads with the selected linked account as the active account',
      },
      {
        title: 'To de-link a linked account, IBKR says you must close the linked account',
      },
    ],
  },
  es: {
    eyebrow: 'Gestión de Cuenta',
    title: 'Vincular cuentas existentes bajo un solo usuario',
    description:
      'Esta guía sigue el proceso de IBKR Client Portal para combinar varias cuentas elegibles bajo un solo usuario y contraseña.',
    back: 'Volver al Centro de Recursos',
    rulesTitle: 'Reglas a tener claras primero',
    rules: [
      { title: 'Debe tener un dispositivo del IBKR Secure Login System' },
      { title: 'Los correos electrónicos, títulos de cuenta, identificaciones fiscales y direcciones físicas de las cuentas deben coincidir' },
      { title: 'Debe vincular todas las cuentas elegibles asociadas con usted; IBKR no permite vincular solo una parte' },
      { title: 'Una vez vinculadas, los usuarios y contraseñas anteriores dejan de funcionar y el usuario conservado pasa a servir para todas las cuentas vinculadas' },
      { title: 'El dispositivo de seguridad de mayor nivel entre las cuentas vinculadas se vuelve el dispositivo activo' },
      { title: 'IBKR procesa estas vinculaciones cada día hábil después de las 3:00 PM EST' },
    ],
    instructionsTitle: 'Vincular cuentas existentes',
    steps: [
      {
        title: 'Abra Manage Account Linking',
        body: 'Haga clic en el User menu en la parte superior derecha y luego vaya a Settings > Account Configuration > Manage Account Linking.',
      },
      {
        title: 'Elija la opción de usuario único',
        body: 'Haga clic en Link All of My Existing Accounts Under a Single Username and Password y luego seleccione Continue.',
      },
      {
        title: 'Elija el usuario que quiere conservar',
        body: 'Cuando se abra la pantalla Select Username, seleccione cuál usuario desea conservar para todas las cuentas vinculadas.',
      },
      {
        title: 'Revise el dispositivo de seguridad',
        body: 'IBKR mostrará el dispositivo de seguridad del usuario seleccionado. Haga clic en Continue.',
      },
      {
        title: 'Autentique cada cuenta',
        body: 'Ingrese el usuario, la contraseña y la autenticación requerida para cada cuenta que desea vincular, avanzando con Continue en cada pantalla.',
      },
      {
        title: 'Verifique la información financiera y de experiencia',
        body: 'Revise la información financiera agregada y la experiencia de trading de todas las cuentas, luego haga clic en Continue.',
      },
      {
        title: 'Verifique la información de cuenta y bancaria',
        body: 'Revise su información de cuenta y luego cualquier información bancaria guardada, avanzando por las pantallas finales de confirmación.',
      },
    ],
    afterTitle: 'Después de vincular las cuentas',
    afterSteps: [
      {
        title: 'Podrá iniciar sesión una sola vez y usar el Account Selector para cambiar entre cuentas vinculadas dentro de Client Portal',
      },
      {
        title: 'Client Portal se recarga con la cuenta vinculada seleccionada como cuenta activa',
      },
      {
        title: 'Para desvincular una cuenta, IBKR indica que debe cerrarla',
      },
    ],
  },
} as const

const LinkExistingAccountsPage = () => {
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
      <BankingStepsCard title={copy.afterTitle} steps={copy.afterSteps} />
    </motion.div>
  )
}

export default LinkExistingAccountsPage
