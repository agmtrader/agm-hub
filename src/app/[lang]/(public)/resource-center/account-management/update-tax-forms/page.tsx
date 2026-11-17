import { ResourceGuidePage } from '@/components/hub/resource-center/ResourceGuidePage'

const guideContent = {
  en: {
    eyebrow: 'Account Management',
    title: 'Update your tax forms',
    description: 'Review and update W-8 or W-9 information in IBKR Client Portal.',
    back: 'Back to Resource Center',
    sections: [
      {
        title: 'Update Tax Forms',
        steps: [
          { title: 'Open account settings', body: 'User menu → Settings → Account Profile.' },
          { title: 'Select Profile' },
          { title: 'Edit the entity', body: 'Use its pencil icon.' },
          { title: 'Choose Tax Forms' },
          { title: 'Check profile details', body: 'Correct them as needed; select Continue.' },
          { title: 'Update the tax form' },
          { title: 'Review your entries', body: 'Continue, or Back to correct them.' },
          {
            title: 'Confirm by email if prompted',
            body: 'Without Secure Login System two-factor authentication, enter the emailed code and Continue. Request Confirmation Number resends it.',
          },
          { title: 'Select Ok' },
          { title: 'Review entity details', body: 'Make any changes and Continue.' },
        ],
      },
    ],
  },
  es: {
    eyebrow: 'Gestión de Cuenta',
    title: 'Actualizar sus formularios fiscales',
    description: 'Revise y actualice información W-8 o W-9 en Client Portal de IBKR.',
    back: 'Volver al Centro de Recursos',
    sections: [
      {
        title: 'Actualizar formularios fiscales',
        steps: [
          { title: 'Abra la configuración', body: 'Menú de usuario → Settings → Account Profile.' },
          { title: 'Seleccione Profile' },
          { title: 'Edite la entidad', body: 'Use su ícono de lápiz.' },
          { title: 'Elija Tax Forms' },
          { title: 'Revise el perfil', body: 'Corrija lo necesario; seleccione Continue.' },
          { title: 'Actualice el formulario fiscal' },
          { title: 'Verifique los datos', body: 'Continue, o Back para corregirlos.' },
          {
            title: 'Confirme por correo si se solicita',
            body: 'Sin autenticación de dos factores de Secure Login System, ingrese el código recibido y seleccione Continue. Request Confirmation Number lo reenvía.',
          },
          { title: 'Seleccione Ok' },
          { title: 'Revise la entidad', body: 'Realice ajustes y seleccione Continue.' },
        ],
      },
    ],
  },
} as const

export default function UpdateTaxFormsPage() {
  return <ResourceGuidePage sectionAnchor="account-management" content={guideContent} />
}
