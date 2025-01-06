'use client'

import Title from "../../../../components/home/title/Title";
import Introduction from "../../../../components/home/introduction/Introduction"
import Services from "../../../../components/home/services/Services";
import FAQ from "../../../../components/home/faq/FAQ";

import { Clock, Database, TrendingUp, Monitor, DollarSign, Smartphone, Globe, Headphones, Shield, BarChart, BookOpen } from "lucide-react";
import { useTranslationProvider } from "@/utils/providers/TranslationProvider";
import Download from "@/components/home/download/Download";

export default function Home() {

  const {t} = useTranslationProvider()

  const titleProps = {
    backgroundImage: '/images/agm-trader.jpg',
    logoSrc: '/images/brand/agm-logo-white.png',
    title: t('agm-trader.title.title'),
    subtitle: t('agm-trader.title.subtitle'),
    ctaText: t('agm-trader.title.action_text'),
    ctaLink: '/trader#download' 
  }
  
  const introductionProps = {
    title: t('agm-trader.introduction.title'),
    description: [
      t('agm-trader.introduction.description'),
    ],
    cards: [
      {
        title: t('agm-trader.introduction.cards.1.title'),
        description: t('agm-trader.introduction.cards.1.description'),
        items: [
          { icon: <Smartphone />, label: t('agm-trader.introduction.cards.1.item_labels.0') },
          { icon: <Monitor />, label: t('agm-trader.introduction.cards.1.item_labels.1') },
          { icon: <Globe />, label: t('agm-trader.introduction.cards.1.item_labels.2') },
        ]
      },
      {
        title: t('agm-trader.introduction.cards.2.title'),
        description: t('agm-trader.introduction.cards.2.description'),
        items: [
          { icon: <Shield />, label: t('agm-trader.introduction.cards.2.item_labels.0') },
          { icon: <BarChart />, label: t('agm-trader.introduction.cards.2.item_labels.1') },
          { icon: <BookOpen />, label: t('agm-trader.introduction.cards.2.item_labels.2') },
          { icon: <Headphones />, label: t('agm-trader.introduction.cards.2.item_labels.3') },
        ]
      }
    ],
    ctaText: t('agm-trader.introduction.cta_text'),
    ctaSubtext: t('agm-trader.introduction.cta_subtext'),
    ctaLink: '/apply'
  }

  const services = [
    {
      name: t('shared.services.agm_advisor.title'),
      image: '/images/agm-advisor.webp',
      description:t('shared.services.agm_advisor.description'),
      url:'/advisor'
    },
    {
      name: t('shared.services.agm_institutional.title'),
      image: '/images/agm-institutional.jpg',
      description:t('shared.services.agm_institutional.description'),
      url:'/institutional'
    }
  ]
  
  return (
    <div className="flex flex-col h-full w-full gap-y-20">
      <Title {...titleProps} />
      <Introduction {...introductionProps} phone />
      <Services services={services} />
      <Download />
      <FAQ />
    </div>
  )
}
