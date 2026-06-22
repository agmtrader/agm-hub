export interface ResourceSlide {
  id: string
  title: string
  image: string
  href?: string
  external?: boolean
  eyebrow?: string
}

export interface ResourceSection {
  id: string
  titleKey: string
  descriptionKey: string
  slides: ResourceSlide[]
}

const chapterImages = [
  '/assets/resource-center/chapters/1.jpeg',
  '/assets/resource-center/chapters/2.jpeg',
  '/assets/resource-center/chapters/3.jpeg',
  '/assets/resource-center/chapters/4.jpeg',
  '/assets/resource-center/chapters/5.JPG',
  '/assets/resource-center/chapters/coming-soon.jpeg',
]

const buildSlides = (items: Omit<ResourceSlide, 'image'>[]): ResourceSlide[] =>
  items.map((item, index) => ({
    ...item,
    image: chapterImages[index % chapterImages.length],
  }))

export const resourceCenterSections: ResourceSection[] = [
  {
    id: 'banking',
    titleKey: 'learning.sections.banking.title',
    descriptionKey: 'learning.sections.banking.description',
    slides: [
      {
        id: '01',
        title: 'How to deposit funds into your account',
        image: '/assets/resource-center/banking/deposit.png',
        href: '/resource-center/banking/deposit-funds',
        eyebrow: 'Funding',
      },
      {
        id: '02',
        title: 'How to withdraw funds from your account',
        image: '/assets/resource-center/banking/withdraw.png',
        href: '/resource-center/banking/withdraw-funds',
        eyebrow: 'Funding',
      },
      {
        id: '03',
        title: 'How to link a bank account',
        image: '/assets/resource-center/banking/link.png',
        href: '/resource-center/banking/link-bank-account',
        eyebrow: 'Funding',
      },
      {
        id: '04',
        title: 'How to transfer funds from Wise into your account',
        image: '/assets/resource-center/banking/from-wise.png',
        href: '/resource-center/banking/transfer-from-wise-balance',
        eyebrow: 'Funding',
      },
      {
        id: '05',
        title: 'How to transfer funds to Wise from your account',
        image: '/assets/resource-center/banking/to-wise.png',
        href: '/resource-center/banking/transfer-to-wise-balance',
        eyebrow: 'Funding',
      },
      {
        id: '06',
        title: 'How to do an internal transfer between same-name accounts',
        image: '/assets/resource-center/banking/internal-same-banks.png',
        href: '/resource-center/banking/transfer-internal',
        eyebrow: 'Funding',
      },
    ],
  },
  {
    id: 'account-management',
    titleKey: 'learning.sections.account_management.title',
    descriptionKey: 'learning.sections.account_management.description',
    slides: [
      {
        id: '01',
        title: 'How to transfer positions',
        image: '/assets/resource-center/account-management/transfer-positions.png',
        href: '/resource-center/account-management/transfer-positions',
        eyebrow: 'Account Management',
      },
      {
        id: '02',
        title: 'How to link an existing account to AGM',
        image: '/assets/resource-center/account-management/link-account.png',
        href: '/resource-center/account-management/link-account-to-agm',
        eyebrow: 'Account Management',
      },
      {
        id: '03',
        title: 'How to link all existing accounts under one single username',
        image: '/assets/resource-center/account-management/link-all.png',
        href: '/resource-center/account-management/link-existing-accounts',
        eyebrow: 'Account Management',
      },
      {
        id: '04',
        title: 'IB Key Authentication',
        image: '/assets/resource-center/account-management/ib-key-authentication.png',
        href: '/resource-center/account-management/ib-key-authentication',
        eyebrow: 'Account Management',
      },
      {
        id: '05',
        title: 'Reactivating IB Key',
        image: '/assets/resource-center/account-management/reactivating-ib-key.png',
        href: '/resource-center/account-management/reactivating-ib-key',
        eyebrow: 'Account Management',
      },
      {
        id: '06',
        title: 'Adding another IB Key user',
        image: '/assets/resource-center/account-management/adding-ibkey-user.png',
        href: '/resource-center/account-management/adding-another-ib-key-user',
        eyebrow: 'Account Management',
      },
      {
        id: '07',
        title: 'Message Center',
        image: '/assets/resource-center/account-management/message-center.png',
        href: '/resource-center/account-management/message-center',
        eyebrow: 'Account Management',
      },
    ],
  },
  {
    id: 'trading',
    titleKey: 'learning.sections.trading.title',
    descriptionKey: 'learning.sections.trading.description',
    slides: [
      {
        id: '01',
        image: '/assets/resource-center/trading/trading-permissions.png',
        title: 'How to manage your trading permissions',
        href: '/resource-center/trading/manage-trading-permissions',
        eyebrow: 'Trading',
      },
      {
        id: '02',
        title: 'How to set up options trading permissions',
        image: '/assets/resource-center/trading/options-permissions.png',
        href: '/resource-center/trading/options-trading-permissions',
        eyebrow: 'Trading',
      },
      {
        id: '03',
        title: 'How to subscribe to market data',
        image: '/assets/resource-center/trading/market-data.png',
        href: '/resource-center/trading/market-data-subscriptions',
        eyebrow: 'Trading',
      },
      {
        id: '04',
        title: 'Options Trading - Client Portal',
        image: '/assets/resource-center/trading/options-trading-portal.png',
        href: '/resource-center/trading/options-trading-client-portal',
        eyebrow: 'Trading',
      },
    ],
  },
  {
    id: 'learning',
    titleKey: 'learning.sections.learning.title',
    descriptionKey: 'learning.sections.learning.description',
    slides: buildSlides([
      { id: '01', title: 'Market basics for new investors', eyebrow: 'Learning' },
      { id: '02', title: 'Fundamental analysis essentials', eyebrow: 'Learning' },
      { id: '03', title: 'Technical analysis starter guide', eyebrow: 'Learning' },
      { id: '04', title: 'Bonds and fixed income overview', eyebrow: 'Learning' },
      { id: '05', title: 'Economic events that move markets', eyebrow: 'Learning' },
    ]),
  }
]

export const chapters = [
  {
    title: 'Introduction to International Markets',
    id: '1',
    image: '/assets/resource-center/chapters/1.jpeg',
  },
  {
    title: 'Introduction to Fundamental Analysis',
    id: '2',
    image: '/assets/resource-center/chapters/2.jpeg',
  },
  {
    title: 'Introduction to Bonds',
    id: '3',
    image: '/assets/resource-center/chapters/3.jpeg',
  },
  {
    title: 'Introduction to Technical Analysis',
    id: '4',
    image: '/assets/resource-center/chapters/4.jpeg',
  },
  {
    title: 'Introduction to Economic Events',
    id: '5',
    image: '/assets/resource-center/chapters/5.JPG',
  },
]

export const videosDictionary = [
  {
    title: 'Comercio y Análisis Análisis Fundamental',
    id: 'LDxZ8MdPDZo',
    chapter: '1',
  },
  {
    title: 'Introducción a conceptos básicos de los Mercados Internacionales',
    id: 'nxrwD3qRmbM',
    chapter: '1',
  },
  {
    title: 'Introducción al Ciclo de Negocio',
    id: 'fp1T1wgo9yo',
    chapter: '1',
  },
  {
    title: 'Liquidez e Inmediatez',
    id: 'Q0BCvXNQSXk',
    chapter: '1',
  },
  {
    title: 'Mercados de Valores Internacionales',
    id: 'o2Rec5G0aVo',
    chapter: '1',
  },
  {
    title: 'Métodos Fundamentales de Negociación',
    id: 'x_RZmQzWIng',
    chapter: '1',
  },
  {
    title: 'Tipos de Operadores del Mercado',
    id: 'BY-jju_J2h0',
    chapter: '1',
  },
  {
    title: 'Análisis de Ganancias',
    id: 'fMBOvNz3gpM',
    chapter: '2',
  },
  {
    title: 'Analisis Fundamental - Estado de Resultados',
    id: 'dx3N9ew6OJA',
    chapter: '2',
  },
  {
    title: 'Bonos y su Análisis Fundamental',
    id: 'VVM2ql-Dfl8',
    chapter: '2',
  },
  {
    title: 'Introducción al Balance General',
    id: 'Af25tdzojb8',
    chapter: '2',
  },
  {
    title: 'Soporte y Resistencia',
    id: 'K7sZUdAdYi8',
    chapter: '2',
  },
  {
    title: 'Tendencia versus anti tendencia',
    id: '7BzQoARiUHU',
    chapter: '2',
  },
  {
    title: 'Tipos Diferentes de Bonos',
    id: '17pef4ulZWU',
    chapter: '2',
  },
  {
    title: 'Calculo del Rendimiento Corriente',
    id: 'hnRvL_8ex84',
    chapter: '3',
  },
  {
    title: 'Cálculo del Rendimiento para Bonos con Opción de Pago',
    id: '5NdJCtVPEYU',
    chapter: '3',
  },
  {
    title: 'Determinación del Interés Acumulado',
    id: 'SxCIs0VVyMc',
    chapter: '3',
  },
  {
    title: 'Emisores de Bonos',
    id: 'PNAq1APG3ug',
    chapter: '3',
  },
  {
    title: 'Margen por Calidad Crediticia y Duracion de Bonos',
    id: 'HLKmqxWJ_RE',
    chapter: '3',
  },
  {
    title: 'Indicadores de Tendencia',
    id: '6cpe_yujLig',
    chapter: '4',
  },
  {
    title: 'Indicadores Basados en el Volumen',
    id: 'TRKu-3xdWy0',
    chapter: '4',
  },
  {
    title: 'Análisis Técnico - Observacion',
    id: 'wuYxugDCo7M',
    chapter: '4',
  },
  {
    title: 'Análisis Técnico vs Análisis Fundamental',
    id: 'YRkE_s-qEZs',
    chapter: '4',
  },
  {
    title: 'Analisis Tecnico - Candelas Japonesas',
    id: 'pJNapx_qmj0',
    chapter: '4',
  },
  {
    title: 'Analisis Tecnico - Conclusión',
    id: 'W-ckkyZVgGg',
    chapter: '4',
  },
  {
    title: 'Medidores de Oscilación ROC Razón de Cambio',
    id: 'ULyzhmim2xU',
    chapter: '4',
  },
  {
    title: 'Tipo de Dojis',
    id: 'p1n2vQpFDvE',
    chapter: '4',
  },
  {
    title: 'Repaso del Análisis Fundamental y Técnico',
    id: 'dWVxy8ChiUQ',
    chapter: '5',
  },
  {
    title: 'Aprenda Sobre Eventos Económicos Clave',
    id: 'xYcEU9v6eIQ',
    chapter: '5',
  },
  {
    title: 'Otros Eventos Económicos Clave',
    id: 'zdicPcMYCRg',
    chapter: '5',
  },
  {
    title: 'Comprender los Datos de Viviendo de Estados Unidos',
    id: 'N5F0DO9MVV8',
    chapter: '5',
  },
]
