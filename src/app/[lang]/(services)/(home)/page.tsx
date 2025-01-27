'use client'
import Title from "../../../../components/home/title/Title";
import { Introduction } from "../../../../components/home/introduction/Introduction"
import Services from "@/components/home/services/Services";
import FAQ from "@/components/home/faq/FAQ";
import Team from "@/components/home/team/Team";
import Footer from "@/components/Footer";
import { Building, Handshake, BarChart2, Briefcase, Banknote, PieChart, TrendingUp, CandlestickChart, Clock, Database, LayoutDashboard, FileText, Mail, Phone, MessageCircle, LineChart } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslationProvider } from "@/utils/providers/TranslationProvider";
import GeminiChatbot from "@/components/misc/GeminiChat";

export default function Home() {

  const { t } = useTranslationProvider()
  
  const titleProps = {
    backgroundImage: '/images/agm-technology.jpg',
    logoSrc: '/images/brand/agm-logo-white.png',
    title: t('agm-technology.title.title'),
    subtitle: t('agm-technology.title.subtitle'),
    ctaText: t('agm-technology.title.action_text'),
    ctaLink: '/apply'
  }

  const introductionProps = {
    title: t('agm-technology.introduction.title'),
    description: [
      t('agm-technology.introduction.description'),
      t('agm-technology.introduction.description_2')
    ],
    cards: [
      {
        title: t('agm-technology.introduction.cards.0.title'),
        description: t('agm-technology.introduction.cards.0.description'),
        items: [
          { icon: <BarChart2 />, label: 'Stocks' },
          { icon: <Briefcase />, label: 'ETFs' },
          { icon: <Banknote />, label: 'Bonds' },
          { icon: <PieChart />, label: 'Mutual Funds' },
          { icon: <TrendingUp />, label: 'Options' },
          { icon: <CandlestickChart />, label: 'Futures' }
        ]
      },
      {
        title: t('agm-technology.introduction.cards.1.title'),
        description: t('agm-technology.introduction.cards.1.description'),
        items: [
          { icon: <Clock />, label: t('agm-technology.introduction.cards.1.item_labels.0') },
          { icon: <Database />, label: t('agm-technology.introduction.cards.1.item_labels.1') },
          { icon: <LayoutDashboard />, label: t('agm-technology.introduction.cards.1.item_labels.2') },
          { icon: <FileText />, label: t('agm-technology.introduction.cards.1.item_labels.3') }
        ]
      },
      {
        title: t('agm-technology.introduction.cards.2.title'),
        description: t('agm-technology.introduction.cards.2.description'),
        items: [
          { icon: <Mail />, label: t('agm-technology.introduction.cards.2.item_labels.0') },
          { icon: <Phone />, label: t('agm-technology.introduction.cards.2.item_labels.1') },
          { icon: <MessageCircle />, label: t('agm-technology.introduction.cards.2.item_labels.2') }
        ]
      }
    ],
    ctaText: t('agm-technology.introduction.action_text'),
    ctaSubtext: t('agm-technology.introduction.action_subtext'),
    ctaLink: '/apply'
  };

  const services = [
    {
      name: t('shared.services.agm_trader.title'),
      image: '/images/agm-trader.jpg',
      description: t('shared.services.agm_trader.description'),
      url: '/trader'
    },
    {
      name: t('shared.services.agm_advisor.title'),
      image: '/images/agm-advisor.webp',
      description: t('shared.services.agm_advisor.description'),
      url: '/advisor'
    },
    {
      name: t('shared.services.agm_institutional.title'),
      image: '/images/agm-institutional.jpg',
      description: t('shared.services.agm_institutional.description'),
      url: '/institutional'
    }
  ]


  return (
    <motion.div 
      className="flex flex-col h-full w-full gap-y-20"
    >
      <Title {...titleProps} />
      <Introduction {...introductionProps} />
      <Services services={services} />
      <Team />
      <FAQ />
    </motion.div>
  )
}
