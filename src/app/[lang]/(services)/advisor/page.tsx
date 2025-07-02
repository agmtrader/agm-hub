'use client'

import Title from "@/components/public/title/Title";
import { Introduction } from "@/components/public/introduction/Introduction"
import Services from "@/components/public/services/Services";
import FAQ from "@/components/public/faq/FAQ";

import Team from "@/components/public/team/Team";
import { Handshake, BarChart2, PieChart, TrendingUp, Clock, Database, LayoutDashboard, FileText, MessageCircle } from "lucide-react";
import { useTranslationProvider } from "@/utils/providers/TranslationProvider";

export default function Home() {

  const { t } = useTranslationProvider()
  
  const titleProps = {
    backgroundImage: '/assets/backgrounds/agm-advisor.webp',
    logoSrc: '/assets/brand/agm-logo-white.png',
    title: t('agm-advisor.title.title'),
    subtitle: t('agm-advisor.title.subtitle'),
    ctaText: t('agm-advisor.title.action_text'),
    ctaLink: '/apply'
  }

  const introductionProps = {
    title: t('agm-advisor.introduction.title'),
    description: [
      t('agm-advisor.introduction.description.0'),
      t('agm-advisor.introduction.description.1'),
    ],
    cards: [
      {
        title: t('agm-advisor.introduction.cards.0.title'),
        description: t('agm-advisor.introduction.cards.0.description'),
        items: [
          { icon: <BarChart2 />, label: t('agm-advisor.introduction.cards.0.item_labels.0') },
          { icon: <PieChart />, label: t('agm-advisor.introduction.cards.0.item_labels.1') },
          { icon: <TrendingUp />, label: t('agm-advisor.introduction.cards.0.item_labels.2') }
        ]
      },
      {
        title: t('agm-advisor.introduction.cards.1.title'),
        description: t('agm-advisor.introduction.cards.1.description'),
        items: [
          { icon: <Handshake />, label: t('agm-advisor.introduction.cards.1.item_labels.0') },
          { icon: <MessageCircle />, label: t('agm-advisor.introduction.cards.1.item_labels.1') },
          { icon: <FileText />, label: t('agm-advisor.introduction.cards.1.item_labels.2') }
        ]
      },
      {
        title: t('agm-advisor.introduction.cards.2.title'),
        description: t('agm-advisor.introduction.cards.2.description'),
        items: [
          { icon: <Clock />, label: t('agm-advisor.introduction.cards.2.item_labels.0') },
          { icon: <LayoutDashboard />, label: t('agm-advisor.introduction.cards.2.item_labels.1') },
          { icon: <Database />, label: t('agm-advisor.introduction.cards.2.item_labels.2') }
        ]
      }
    ],
    actionText: t('agm-advisor.introduction.action_text'),
    ctaLink: '/apply/risk'
  }

  const services = [
    {
      name: t('shared.services.agm_trader.title'),
      image: '/assets/backgrounds/agm-trader.jpg',
      description: t('shared.services.agm_trader.description'),
      url: '/trader'
    },
    {
      name: t('shared.services.agm_institutional.title'),
      image: '/assets/backgrounds/agm-institutional.jpg',
      description: t('shared.services.agm_institutional.description'),
      url:'/institutional'
    }
  ]

  return (
    <div className="flex flex-col h-full w-full gap-y-20">
      <Title {...titleProps} />
      <Introduction {...introductionProps} />
      <Services services={services} />
      <Team />
      <FAQ />
    </div>
  )
}
