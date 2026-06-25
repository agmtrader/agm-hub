'use client'

import { ResourceGuidePage } from '@/components/hub/resource-center/ResourceGuidePage'


const guideContent = {
  en: {
    eyebrow: 'Trading',
    title: 'Trading Permissions',
    description:
      'This guide follows the IBKR Client Portal Trading Permissions flow for requesting or modifying product and country permissions.',
    back: 'Back to Resource Center',
    instructionsTitle: 'How to manage trading permissions',
    steps: [
      {
        title: 'Open Trading Permissions',
        body: 'Click the User menu in the top-right corner, then Settings > Trading > Trading Permissions.',
      },
      {
        title: 'Review current permissions',
        body: 'The Trading Permissions panel shows the permissions you already have.',
      },
      {
        title: 'Edit or request access',
        body: 'Use Edit to modify an existing permission or Request to add a new one.',
      },
      {
        title: 'Filter by product if needed',
        body: 'Permissions are grouped first by product and then by country. Use the drop-down selectors at the top of the page to focus on specific products.',
      },
      {
        title: 'Save your changes',
        body: 'After updating the desired permissions, click Save.',
      },
    ],
    rulesTitle: 'What these permissions control',
    rules: [
      { title: 'Trading permissions define what products you can trade and in which countries you can trade them' },
      { title: 'IBKR may require additional risk disclosures before granting access' },
      { title: 'IBKR can limit permissions based on your investment objectives or financial profile' },
      { title: 'IBKR lets you request permissions across all countries and products with a single click' },
      { title: 'Each product or market may include additional details through the information icon' },
    ],
  },
  es: {
    eyebrow: 'Trading',
    title: 'Permisos de Trading',
    description:
      'Esta guía sigue el flujo de Trading Permissions en IBKR Client Portal para solicitar o modificar permisos por producto y por país.',
    back: 'Volver al Centro de Recursos',
    instructionsTitle: 'Cómo administrar los permisos de trading',
    steps: [
      {
        title: 'Abra Trading Permissions',
        body: 'Haga clic en el User menu en la parte superior derecha y luego vaya a Settings > Trading > Trading Permissions.',
      },
      {
        title: 'Revise sus permisos actuales',
        body: 'El panel Trading Permissions muestra los permisos que ya tiene activos.',
      },
      {
        title: 'Edite o solicite acceso',
        body: 'Use Edit para modificar un permiso existente o Request para agregar uno nuevo.',
      },
      {
        title: 'Filtre por producto si hace falta',
        body: 'Los permisos están agrupados primero por producto y luego por país. Use los selectores desplegables de la parte superior para enfocarse en productos específicos.',
      },
      {
        title: 'Guarde los cambios',
        body: 'Después de actualizar los permisos deseados, haga clic en Save.',
      },
    ],
    rulesTitle: 'Qué controlan estos permisos',
    rules: [
      { title: 'Los permisos de trading definen qué productos puede negociar y en qué países puede hacerlo' },
      { title: 'IBKR puede exigir divulgaciones adicionales de riesgo antes de otorgar acceso' },
      { title: 'IBKR puede limitar permisos según sus objetivos de inversión o su perfil financiero' },
      { title: 'IBKR permite solicitar permisos para todos los países y productos con un solo clic' },
      { title: 'Cada producto o mercado puede mostrar detalles adicionales mediante el icono de información' },
    ],
  },
} as const

const ManageTradingPermissionsPage = () => <ResourceGuidePage sectionAnchor="trading" content={guideContent} />

export default ManageTradingPermissionsPage
