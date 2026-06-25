'use client'

import { ResourceGuidePage } from '@/components/hub/resource-center/ResourceGuidePage'

const guideContent = {
  en: {
    eyebrow: 'Trading',
    title: 'Subscribe to Market Data',
    description:
      'This guide follows the IBKR Client Portal market data subscription flow for viewing, subscribing, unsubscribing, and managing related questionnaire details.',
    back: 'Back to Resource Center',
    instructionsTitle: 'How to view or change market data subscriptions',
    steps: [
      {
        title: 'Open Market Data Subscriptions',
        body: 'Click Settings > Trading Platform > Market Data Subscriptions.',
      },
      {
        title: 'Review the current subscription screen',
        body: 'The page shows your current subscriptions, subscriber status (Non-Professional or Professional), and the billable account ID.',
      },
      {
        title: 'Open Configure',
        body: 'Click the Configure gear icon in the Current Subscriptions panel title bar.',
      },
      {
        title: 'Choose platform and region',
        body: 'Select the platform and region tabs you want. IBKR notes you can choose TWS, Alternative Display, and Non-Display/API-related categories depending on what you need.',
      },
      {
        title: 'Subscribe or unsubscribe',
        body: 'Use the checkboxes to add or remove market data subscriptions across the relevant regions and products.',
      },
      {
        title: 'Continue and review',
        body: 'Click Continue, review the resulting subscription list, and continue again if it is correct.',
      },
      {
        title: 'Confirm if required',
        body: 'If you do not use Secure Login System two-factor authentication, IBKR sends a confirmation number by email. Enter it and continue.',
      },
      {
        title: 'Finish',
        body: 'Click Ok. Under normal circumstances, subscription updates take effect immediately.',
      },
    ],
    terminationTitle: 'Important termination rule',
    termination: [
      {
        title: 'IBKR states that active market data subscriptions are terminated if you have not logged into TWS for 60 days',
      },
      {
        title: 'You can keep them active by using the Continue Subscriptions prompt within the allowed period after IBKR notifies you',
      },
    ],
    questionnaireTitle: 'Non-Professional questionnaire',
    questionnaire: [
      {
        title: 'If your personal circumstances change and you are classified as a Non-Professional subscriber, IBKR lets you update the questionnaire from the same Market Data Subscriptions area',
      },
    ],
  },
  es: {
    eyebrow: 'Trading',
    title: 'Suscribirse a Market Data',
    description:
      'Esta guía sigue el flujo de suscripciones de market data en IBKR Client Portal para ver, suscribirse, cancelar suscripciones y manejar detalles relacionados del cuestionario.',
    back: 'Volver al Centro de Recursos',
    instructionsTitle: 'Cómo ver o cambiar suscripciones de market data',
    steps: [
      {
        title: 'Abra Market Data Subscriptions',
        body: 'Haga clic en Settings > Trading Platform > Market Data Subscriptions.',
      },
      {
        title: 'Revise la pantalla actual',
        body: 'La página muestra sus suscripciones actuales, el estado del suscriptor (Non-Professional o Professional) y el Account ID facturable.',
      },
      {
        title: 'Abra Configure',
        body: 'Haga clic en el icono de engranaje Configure en el encabezado del panel Current Subscriptions.',
      },
      {
        title: 'Elija plataforma y región',
        body: 'Seleccione las pestañas de plataforma y región que necesite. IBKR indica que puede elegir categorías como TWS, Alternative Display y Non-Display/API según su caso.',
      },
      {
        title: 'Suscríbase o cancele suscripciones',
        body: 'Use las casillas para agregar o quitar suscripciones de market data en las regiones y productos correspondientes.',
      },
      {
        title: 'Continúe y revise',
        body: 'Haga clic en Continue, revise la lista resultante y continúe otra vez si está correcta.',
      },
      {
        title: 'Confirme si hace falta',
        body: 'Si no usa Secure Login System con autenticación de dos factores, IBKR enviará un número de confirmación por correo. Ingréselo y continúe.',
      },
      {
        title: 'Finalice',
        body: 'Haga clic en Ok. En condiciones normales, los cambios de suscripción se aplican de inmediato.',
      },
    ],
    terminationTitle: 'Regla importante de terminación',
    termination: [
      {
        title: 'IBKR indica que las suscripciones activas de market data se terminan si no ha iniciado sesión en TWS durante 60 días',
      },
      {
        title: 'Puede mantenerlas activas usando el aviso Continue Subscriptions dentro del plazo permitido después de la notificación',
      },
    ],
    questionnaireTitle: 'Cuestionario Non-Professional',
    questionnaire: [
      {
        title: 'Si sus circunstancias personales cambian y está clasificado como suscriptor Non-Professional, IBKR permite actualizar el cuestionario desde la misma sección de Market Data Subscriptions',
      },
    ],
  },
} as const

const MarketDataSubscriptionsPage = () => (
  <ResourceGuidePage sectionAnchor="trading" content={guideContent} />
)

export default MarketDataSubscriptionsPage
