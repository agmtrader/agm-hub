import { ResourceGuidePage } from '@/components/hub/resource-center/ResourceGuidePage'

const guideContent = {
  en: {
    eyebrow: 'Account Management',
    title: 'IB Key Authentication',
    description:
      'This guide follows the IBKR Campus iPhone lesson for configuring and using IB Key as a second-factor authentication method.',
    back: 'Back to Resource Center',
    sections: [
      {
        title: 'What IB Key requires',
        steps: [
          {
            title: 'Phone security must already be enabled',
            body: 'IBKR states that facial recognition, fingerprint, or passcode security must already be enabled on the phone before IB Key can be used.',
          },
        ],
      },
      {
        title: 'Configuring IB Key',
        steps: [
          {
            title: 'Start registration from the login screen',
            body: 'Open IBKR Mobile and tap Register Two Factor from the login screen, review the instructions, and tap Continue.',
          },
          {
            title: 'Sign in to the IBKR account',
            body: 'Enter the username and password for the Interactive Brokers account and tap Continue.',
          },
          {
            title: 'Confirm the phone number and request SMS activation',
            body: 'Review the phone number shown on the account, or add a mobile number if needed, and tap Get Activation SMS.',
          },
          {
            title: 'Enter the activation code',
            body: 'Enter the SMS activation code received on the phone and tap Activate.',
          },
          {
            title: 'Finish with the phone security method',
            body: 'Complete activation with facial recognition, Touch ID, or passcode.',
          },
        ],
      },
      {
        title: 'Using IB Key',
        steps: [
          {
            title: 'Enter username and password on the login platform',
            body: 'The IBKR lesson shows the user first entering account credentials in Client Portal or Trader Workstation.',
          },
          {
            title: 'Open the push notification',
            body: 'When the screen says to open the IBKR notification, tap the push notification on the phone.',
          },
          {
            title: 'Authorize the login',
            body: 'Tap Authorize and complete facial recognition, Touch ID, or passcode on the phone.',
          },
        ],
      },
      {
        title: 'If the notification does not arrive',
        steps: [
          {
            title: 'Resend the notification',
            body: 'Select Resend notification to send the push notification again.',
          },
          {
            title: 'Use QR login instead',
            body: 'Select Log in with QR Code and scan the on-screen QR code with the camera app on the device where IB Key is configured.',
          },
          {
            title: 'Use Challenge/Response if needed',
            body: 'From the QR screen, select Log in with Challenge/Response, enter the challenge code in IB Key Authentication on the phone, tap Generate Passcode, and enter the Response String on the computer.',
          },
        ],
      },
    ],
  },
  es: {
    eyebrow: 'Gestión de Cuenta',
    title: 'Autenticación IB Key',
    description:
      'Esta guía sigue la lección de IBKR Campus para iPhone sobre cómo configurar y usar IB Key como método de autenticación de segundo factor.',
    back: 'Volver al Centro de Recursos',
    sections: [
      {
        title: 'Qué requiere IB Key',
        steps: [
          {
            title: 'La seguridad del teléfono ya debe estar habilitada',
            body: 'IBKR indica que el reconocimiento facial, la huella o el passcode ya deben estar habilitados en el teléfono antes de usar IB Key.',
          },
        ],
      },
      {
        title: 'Configuración de IB Key',
        steps: [
          {
            title: 'Inicie el registro desde la pantalla de acceso',
            body: 'Abra IBKR Mobile y toque Register Two Factor desde la pantalla de acceso, revise las instrucciones y toque Continue.',
          },
          {
            title: 'Inicie sesión en la cuenta de IBKR',
            body: 'Ingrese el username y password de la cuenta de Interactive Brokers y toque Continue.',
          },
          {
            title: 'Confirme el número de teléfono y solicite el SMS',
            body: 'Revise el número de teléfono mostrado en la cuenta, o agregue un número móvil si hace falta, y toque Get Activation SMS.',
          },
          {
            title: 'Ingrese el código de activación',
            body: 'Ingrese el código de activación recibido por SMS y toque Activate.',
          },
          {
            title: 'Termine con el método de seguridad del teléfono',
            body: 'Complete la activación con reconocimiento facial, Touch ID o passcode.',
          },
        ],
      },
      {
        title: 'Uso de IB Key',
        steps: [
          {
            title: 'Ingrese username y password en la plataforma de acceso',
            body: 'La lección de IBKR muestra que primero se ingresan las credenciales en Client Portal o Trader Workstation.',
          },
          {
            title: 'Abra la notificación push',
            body: 'Cuando la pantalla diga que abra la notificación de IBKR, toque la notificación push en el teléfono.',
          },
          {
            title: 'Autorice el acceso',
            body: 'Toque Authorize y complete el reconocimiento facial, Touch ID o passcode en el teléfono.',
          },
        ],
      },
      {
        title: 'Si no llega la notificación',
        steps: [
          {
            title: 'Reenvíe la notificación',
            body: 'Seleccione Resend notification para volver a enviar la notificación push.',
          },
          {
            title: 'Use acceso con QR',
            body: 'Seleccione Log in with QR Code y escanee el código QR en pantalla con la cámara del dispositivo donde está configurado IB Key.',
          },
          {
            title: 'Use Challenge/Response si hace falta',
            body: 'Desde la pantalla QR, seleccione Log in with Challenge/Response, ingrese el challenge code en IB Key Authentication en el teléfono, toque Generate Passcode e ingrese el Response String en la computadora.',
          },
        ],
      },
    ],
  },
} as const

const IbKeyAuthenticationPage = () => {
  return <ResourceGuidePage sectionAnchor="account-management" content={guideContent} />
}

export default IbKeyAuthenticationPage
