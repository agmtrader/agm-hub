import { ResourceGuidePage } from '@/components/hub/learning/ResourceGuidePage'

const guideContent = {
  en: {
    eyebrow: 'Account Management',
    title: 'Mobile App - iOS',
    description:
      'This page follows the IBKR Mobile for iPhone getting started guide exactly as presented in the source page.',
    back: 'Back to Resource Center',
    sections: [
      {
        title: 'Guide overview',
        steps: [
          {
            title: 'Main purpose of the app',
            body: 'IBKR Mobile can be used to access your trading account, deposit funds, provide two-factor authentication when logging in, and manage your transactions.',
          },
          {
            title: 'Source page scope',
            body: 'The referenced IBKR guide page is a getting-started overview page for IBKR Mobile on iPhone.',
          },
          {
            title: 'Source page update date',
            body: 'IBKR shows this guide as last updated on January 27, 2026.',
          },
        ],
      },
      {
        title: 'Risk and disclosure notes shown on the page',
        steps: [
          {
            title: 'Trading risk disclosure',
            body: 'The page states that the risk of loss in online trading of stocks, options, futures, currencies, foreign equities, and fixed income can be substantial.',
          },
          {
            title: 'Options disclosure',
            body: 'The page states that options involve risk and are not suitable for all investors and references the Characteristics and Risks of Standardized Options document.',
          },
          {
            title: 'Margin and complex products disclosure',
            body: 'The page also includes margin, security futures, structured products, and fixed income risk disclosures.',
          },
        ],
      },
    ],
  },
  es: {
    eyebrow: 'Gestión de Cuenta',
    title: 'Aplicación Móvil - iOS',
    description:
      'Esta página sigue la guía de inicio de IBKR Mobile para iPhone exactamente como aparece en la página fuente.',
    back: 'Volver al Centro de Recursos',
    sections: [
      {
        title: 'Resumen de la guía',
        steps: [
          {
            title: 'Propósito principal de la app',
            body: 'IBKR Mobile se puede usar para acceder a su cuenta de trading, depositar fondos, proporcionar autenticación de dos factores al iniciar sesión y gestionar sus transacciones.',
          },
          {
            title: 'Alcance de la página fuente',
            body: 'La página de guía referenciada por IBKR es una página general de inicio para IBKR Mobile en iPhone.',
          },
          {
            title: 'Fecha de actualización de la fuente',
            body: 'IBKR muestra esta guía como actualizada por última vez el January 27, 2026.',
          },
        ],
      },
      {
        title: 'Notas de riesgo y divulgación mostradas en la página',
        steps: [
          {
            title: 'Divulgación de riesgo de trading',
            body: 'La página indica que el riesgo de pérdida en el trading en línea de acciones, opciones, futuros, divisas, acciones extranjeras y renta fija puede ser considerable.',
          },
          {
            title: 'Divulgación sobre opciones',
            body: 'La página indica que las opciones implican riesgo y no son adecuadas para todos los inversionistas, y remite al documento Characteristics and Risks of Standardized Options.',
          },
          {
            title: 'Divulgación sobre margen y productos complejos',
            body: 'La página también incluye divulgaciones sobre margen, security futures, productos estructurados y renta fija.',
          },
        ],
      },
    ],
  },
} as const

const MobileAppIosPage = () => {
  return <ResourceGuidePage sectionAnchor="account-management" content={guideContent} />
}

export default MobileAppIosPage
