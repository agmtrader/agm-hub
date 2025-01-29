'use client'
import Title from "@/components/home/title/Title";
import {Introduction} from "@/components/home/introduction/Introduction"
import Services from "@/components/home/services/Services";
import FAQ from "@/components/home/faq/FAQ";
import Team from "@/components/home/team/Team";
import { Building, BarChart2, Briefcase, Banknote, PieChart, TrendingUp, FileText, Mail, Phone, MessageCircle, DollarSign, Zap, Globe } from "lucide-react";
import { useTranslationProvider } from "@/utils/providers/TranslationProvider";

export default function Home() {

  const { t, lang } = useTranslationProvider()
  
  const titleProps = {
    backgroundImage: '/assets/backgrounds/agm-institutional.jpg',
    logoSrc: '/assets/brand/agm-logo-white.png',
    title: t('agm-institutional.title.title'),
    subtitle: t('agm-institutional.title.subtitle'),
    ctaText: t('agm-institutional.title.action_text'),
    ctaLink: '/apply'
  }

  const introductionProps = {
    title: t('agm-institutional.introduction.title'),
    description: [
      t('agm-institutional.introduction.description.0'),
      t('agm-institutional.introduction.description.1')
    ],
    cards: [
      {
        title: t('agm-institutional.introduction.cards.0.title'),
        description: t('agm-institutional.introduction.cards.0.description'),
        items: [
          { icon: <Building />, label: t('agm-institutional.introduction.cards.0.item_labels.0') },
          { icon: <TrendingUp />, label: t('agm-institutional.introduction.cards.0.item_labels.1') },
          { icon: <Briefcase />, label: t('agm-institutional.introduction.cards.0.item_labels.2') },
          { icon: <PieChart />, label: t('agm-institutional.introduction.cards.0.item_labels.3') },
          { icon: <Banknote />, label: t('agm-institutional.introduction.cards.0.item_labels.4') },
          { icon: <FileText />, label: t('agm-institutional.introduction.cards.0.item_labels.5') }
        ]
      },
      {
        title: t('agm-institutional.introduction.cards.1.title'),
        description: t('agm-institutional.introduction.cards.1.description'),
        items: [
          { icon: <Globe />, label: t('agm-institutional.introduction.cards.1.item_labels.0') },
          { icon: <BarChart2 />, label: t('agm-institutional.introduction.cards.1.item_labels.1') },
          { icon: <Zap />, label: t('agm-institutional.introduction.cards.1.item_labels.2') },
          { icon: <DollarSign />, label: t('agm-institutional.introduction.cards.1.item_labels.3') }
        ]
      },
      {
        title: t('agm-institutional.introduction.cards.2.title'),
        description: t('agm-institutional.introduction.cards.2.description'),
        items: [
          { icon: <Mail />, label: t('agm-institutional.introduction.cards.2.item_labels.0') },
          { icon: <Phone />, label: t('agm-institutional.introduction.cards.2.item_labels.1') },
          { icon: <MessageCircle />, label: t('agm-institutional.introduction.cards.2.item_labels.2') }
        ]
      }
    ],
    ctaText: t('agm-institutional.introduction.cta_text'),
    ctaSubtext: t('agm-institutional.introduction.cta_subtext'),
    ctaLink: '/apply'
  }

  const services = [
    {
      name: t('shared.services.agm_trader.title'),
      image: '/assets/backgrounds/agm-trader.jpg',
      description: t('shared.services.agm_trader.description'),
      url: '/trader'
    },
    {
      name: t('shared.services.agm_advisor.title'),
      image: '/assets/backgrounds/agm-advisor.webp',
      description: t('shared.services.agm_advisor.description'),
      url:'/advisor'
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
