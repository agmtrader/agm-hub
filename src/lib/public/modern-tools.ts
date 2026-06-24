import { Calculator, FileText } from 'lucide-react'

export const modernTools = (t: (key: string) => string) => [
  {
    title: t('main.modern_tools.risk_profile.title'),
    description: t('main.modern_tools.risk_profile.description'),
    buttonText: t('main.modern_tools.risk_profile.button'),
    link: '/risk',
    icon: FileText,
    image: '/assets/modern-tools/risk-profile.png',
    isWip: false
  },
  {
    title: t('main.modern_tools.portfolio_calculator.title'),
    description: t('main.modern_tools.portfolio_calculator.description'),
    buttonText: t('main.modern_tools.portfolio_calculator.button'),
    link: '/risk',
    icon: Calculator,
    image: '/assets/modern-tools/portfolio.jpg',
    isWip: false
  }
]
