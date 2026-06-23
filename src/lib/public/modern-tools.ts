import { Calculator, FileText } from 'lucide-react'

type ModernTool = {
  title: string
  description: string
  buttonText?: string
  badgeText?: string
  link?: string
  icon: typeof Calculator
  image?: string
  isWip: boolean
}

export const modernTools = (t: (key: string) => string): ModernTool[] => [
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
