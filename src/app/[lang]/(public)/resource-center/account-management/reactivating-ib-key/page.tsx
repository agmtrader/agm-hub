import { ResourceGuidePage } from '@/components/hub/learning/ResourceGuidePage'

const guideContent = {
  en: {
    eyebrow: 'Account Management',
    title: 'Reactivating IB Key',
    description:
      'This guide follows the IBKR Mobile iPhone instructions for reactivating IB Key after reinstalling the app or changing phones.',
    back: 'Back to Resource Center',
    sections: [
      {
        title: 'Before you start',
        steps: [
          {
            title: 'When self-service reactivation is allowed',
            body: 'IBKR says you can reactivate IB Key without contacting Client Services if you can still receive SMS messages on the same mobile number used during the original activation.',
          },
        ],
      },
      {
        title: 'Reactivating on the same phone after reinstalling the app',
        steps: [
          {
            title: 'Launch the app',
            body: 'Open the IBKR Mobile app.',
          },
          {
            title: 'Recover the previous setup',
            body: 'When asked about recovering your setup, tap Yes.',
          },
          {
            title: 'Use the original phone security method',
            body: 'Enter the security element originally used to secure the app, such as Fingerprint, Face ID, or PIN, and follow the on-screen prompts.',
          },
          {
            title: 'Finish the process',
            body: 'If successful, you will receive a confirmation message and then tap Done to complete the process.',
          },
        ],
      },
      {
        title: 'Moving IB Key to a different phone',
        steps: [
          {
            title: 'Open the app and start sign-in',
            body: 'Open the IBKR Mobile app, tap I have an Account, enter your username and password, and select Log In.',
          },
          {
            title: 'Choose migration',
            body: 'Select Migrate IB Key and then confirm by tapping Migrate IB Key again.',
          },
          {
            title: 'Review the instructions',
            body: 'Review the instructions and tap Continue.',
          },
          {
            title: 'Sign in again to continue',
            body: 'Enter your username and password again and tap Log In.',
          },
        ],
      },
    ],
  },
  es: {
    eyebrow: 'Gestión de Cuenta',
    title: 'Reactivar IB Key',
    description:
      'Esta guía sigue las instrucciones de IBKR Mobile para iPhone para reactivar IB Key después de reinstalar la app o cambiar de teléfono.',
    back: 'Volver al Centro de Recursos',
    sections: [
      {
        title: 'Antes de empezar',
        steps: [
          {
            title: 'Cuándo se permite la reactivación por cuenta propia',
            body: 'IBKR indica que puede reactivar IB Key sin contactar a Client Services si todavía puede recibir mensajes SMS en el mismo número móvil usado durante la activación original.',
          },
        ],
      },
      {
        title: 'Reactivación en el mismo teléfono después de reinstalar la app',
        steps: [
          {
            title: 'Abra la app',
            body: 'Abra la aplicación IBKR Mobile.',
          },
          {
            title: 'Recupere la configuración anterior',
            body: 'Cuando le pregunten si desea recuperar la configuración, toque Yes.',
          },
          {
            title: 'Use el método de seguridad original del teléfono',
            body: 'Ingrese el elemento de seguridad usado originalmente para proteger la app, como Fingerprint, Face ID o PIN, y siga las instrucciones en pantalla.',
          },
          {
            title: 'Termine el proceso',
            body: 'Si todo sale bien, verá un mensaje de confirmación y luego debe tocar Done para terminar.',
          },
        ],
      },
      {
        title: 'Mover IB Key a otro teléfono',
        steps: [
          {
            title: 'Abra la app y comience el acceso',
            body: 'Abra la aplicación IBKR Mobile, toque I have an Account, ingrese su username y password y seleccione Log In.',
          },
          {
            title: 'Elija la migración',
            body: 'Seleccione Migrate IB Key y luego confirme tocando Migrate IB Key otra vez.',
          },
          {
            title: 'Revise las instrucciones',
            body: 'Revise las instrucciones y toque Continue.',
          },
          {
            title: 'Vuelva a iniciar sesión para continuar',
            body: 'Ingrese otra vez su username y password y toque Log In.',
          },
        ],
      },
    ],
  },
} as const

const ReactivatingIbKeyPage = () => {
  return <ResourceGuidePage sectionAnchor="account-management" content={guideContent} />
}

export default ReactivatingIbKeyPage
