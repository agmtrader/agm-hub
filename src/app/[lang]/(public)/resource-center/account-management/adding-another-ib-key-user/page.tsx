import { ResourceGuidePage } from '@/components/hub/learning/ResourceGuidePage'

const guideContent = {
  en: {
    eyebrow: 'Account Management',
    title: 'Adding Another IB Key User',
    description:
      'This guide follows the IBKR Mobile iPhone instructions for adding another user to an active IB Key on the same Apple device.',
    back: 'Back to Resource Center',
    sections: [
      {
        title: 'Requirement',
        steps: [
          {
            title: 'IB Key must already be active on the device',
            body: 'IBKR says an additional user can only be added if IB Key Authentication is already activated on the Apple device.',
          },
        ],
      },
      {
        title: 'Add another user',
        steps: [
          {
            title: 'Open IB Key Authentication from the login screen',
            body: 'Open the IBKR Mobile app and select IB Key Authentication from the login screen.',
          },
          {
            title: 'Start the add-user flow',
            body: 'Select Add User, read the instructions, and tap Continue.',
          },
          {
            title: 'Enter the new user credentials',
            body: 'Enter the new user’s username and password, then tap Continue.',
          },
          {
            title: 'Complete SMS verification',
            body: 'IBKR sends an SMS message to the mobile phone number associated with the account. Enter the authentication code and tap Activate.',
          },
          {
            title: 'Confirm with the phone security method',
            body: 'Enter the security element used to secure the phone, such as passcode, Touch ID, or Face ID.',
          },
          {
            title: 'Finish the setup',
            body: 'If successful, a confirmation screen appears. Tap Done to complete the process.',
          },
        ],
      },
    ],
  },
  es: {
    eyebrow: 'Gestión de Cuenta',
    title: 'Agregar Otro Usuario de IB Key',
    description:
      'Esta guía sigue las instrucciones de IBKR Mobile para iPhone para agregar otro usuario a un IB Key activo en el mismo dispositivo Apple.',
    back: 'Volver al Centro de Recursos',
    sections: [
      {
        title: 'Requisito',
        steps: [
          {
            title: 'IB Key ya debe estar activo en el dispositivo',
            body: 'IBKR indica que solo se puede agregar un usuario adicional si IB Key Authentication ya está activado en el dispositivo Apple.',
          },
        ],
      },
      {
        title: 'Agregar otro usuario',
        steps: [
          {
            title: 'Abra IB Key Authentication desde la pantalla de acceso',
            body: 'Abra la aplicación IBKR Mobile y seleccione IB Key Authentication desde la pantalla de acceso.',
          },
          {
            title: 'Inicie el flujo para agregar usuario',
            body: 'Seleccione Add User, lea las instrucciones y toque Continue.',
          },
          {
            title: 'Ingrese las credenciales del nuevo usuario',
            body: 'Ingrese el username y password del nuevo usuario y luego toque Continue.',
          },
          {
            title: 'Complete la verificación por SMS',
            body: 'IBKR envía un SMS al número móvil asociado con la cuenta. Ingrese el código de autenticación y toque Activate.',
          },
          {
            title: 'Confirme con el método de seguridad del teléfono',
            body: 'Ingrese el elemento de seguridad usado para proteger el teléfono, como passcode, Touch ID o Face ID.',
          },
          {
            title: 'Termine la configuración',
            body: 'Si todo sale bien, aparece una pantalla de confirmación. Toque Done para terminar el proceso.',
          },
        ],
      },
    ],
  },
} as const

const AddingAnotherIbKeyUserPage = () => {
  return <ResourceGuidePage sectionAnchor="account-management" content={guideContent} />
}

export default AddingAnotherIbKeyUserPage
