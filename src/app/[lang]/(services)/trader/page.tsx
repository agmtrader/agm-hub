'use client'
import Title from "../../../../components/public/title/Title";
import { TraderIntroduction } from "../../../../components/public/introduction/Introduction"
import Services from "../../../../components/public/services/Services";
import FAQ from "../../../../components/public/faq/FAQ";
import { Monitor, Smartphone, Globe, Headphones, Shield, BarChart, BookOpen } from "lucide-react";
import { useTranslationProvider } from "@/utils/providers/TranslationProvider";
import DownloadsCarousel from "@/components/public/download/DownloadsCarousel";

export default function Home() {

  const {t} = useTranslationProvider()

  const titleProps = {
    backgroundImage: '/assets/backgrounds/agm-trader.jpg',
    logoSrc: '/assets/brand/agm-logo-white.png',
    title: t('agm-trader.title.title'),
    subtitle: t('agm-trader.title.subtitle'),
    ctaText: t('agm-trader.title.action_text'),
    ctaLink: '/downloads' 
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
    actionText: t('agm-trader.introduction.action_text'),
    ctaLink: '/trader#download'
  }

  const services = [
    {
      name: t('shared.services.agm_advisor.title'),
      image: '/assets/backgrounds/agm-advisor.webp',
      description:t('shared.services.agm_advisor.description'),
      url:'/advisor'
    },
    {
      name: t('shared.services.agm_institutional.title'),
      image: '/assets/backgrounds/agm-institutional.jpg',
      description:t('shared.services.agm_institutional.description'),
      url:'/institutional'
    }
  ]
  
  return (
    <div className="flex flex-col h-full w-full gap-y-20">
      <Title {...titleProps} />
      <TraderIntroduction {...introductionProps} />
      <Services services={services} />
      <DownloadsCarousel />
      <FAQ />
    </div>
  )
}
