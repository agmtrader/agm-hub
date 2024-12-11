'use client'

import Title from "../../../../components/home/title/Title";
import Introduction from "../../../../components/home/introduction/Introduction"
import Services from "../../../../components/home/services/Services";
import FAQ from "../../../../components/home/faq/FAQ";
import Footer from "../../../../components/Footer";

import { Building, Clock, Database, TrendingUp, Monitor, DollarSign, Smartphone, Globe, Headphones, Shield, BarChart, BookOpen } from "lucide-react";
import { Handshake } from "lucide-react";
import Download from "@/components/home/download/Download";
import { useTranslationProvider } from "@/utils/providers/TranslationProvider";

export default function Home() {

  const {t} = useTranslationProvider()

  const titleProps = {
    backgroundImage: '/images/nyse_floor.jpg',
    logoSrc: '/images/brand/agm-logo-white.png',
    title: t('agm-trader.title.title'),
    subtitle: t('agm-trader.title.subtitle'),
    ctaText: t('agm-trader.title.action_text'),
    ctaLink: '/apply' 
  };
  
  const services = [
    {
      name: t('shared.services.agm_advisor.title'),
      icon: <Handshake className='text-white h-[12vw] w-[12vw]'/>,
      description:t('shared.services.agm_advisor.description'),
      url:'/trader'
    },
    {
      name: t('shared.services.agm_institutional.title'),
      icon: <Building className='text-white h-[12vw] w-[12vw]'/>,
      description:t('shared.services.agm_institutional.description'),
      url:'/institutional'
    }
  ]
  
  const introductionProps = {
    title: t('agm-trader.introduction.title'),
    description: [
      t('agm-trader.introduction.description'),
    ],
    cards: [
      {
        title: t('agm-trader.introduction.cards.0.title'),
        description: t('agm-trader.introduction.cards.0.description'),
        items: [
          { icon: <TrendingUp />, label: 'Stocks, bonds, ETFs, options & more' },
          { icon: <Clock />, label: '24/7 trading' },
          { icon: <Database />, label: '150+ markets' },
          { icon: <DollarSign />, label: '20+ currencies' }
        ]
      },
      {
        title: t('agm-trader.introduction.cards.1.title'),
        description: t('agm-trader.introduction.cards.1.description'),
        items: [
          { icon: <Smartphone />, label: 'AGM Trader (mobile app)' },
          { icon: <Monitor />, label: 'AGM Trader Pro (desktop)' },
          { icon: <Globe />, label: 'AGM Webtrader (web-based)' },
        ]
      },
      {
        title: t('agm-trader.introduction.cards.2.title'),
        description: t('agm-trader.introduction.cards.2.description'),
        items: [
          { icon: <Shield />, label: 'Secure trading' },
          { icon: <BarChart />, label: 'Real-time analytics' },
          { icon: <BookOpen />, label: 'Educational resources' },
          { icon: <Headphones />, label: '24/7 support' },
        ]
      }
    ],
    ctaText: t('agm-trader.introduction.cta_text'),
    ctaSubtext: t('agm-trader.introduction.cta_subtext')
  }
  
  return (
    <div className="flex flex-col h-full w-full gap-y-20">
      <Title {...titleProps} />
      <Introduction {...introductionProps} />
      <Services services={services} />
      <Download />
      <FAQ />
    </div>
  )
}
