'use client'

import Title from "../../../components/home/title/Title";
import Introduction from "../../../components/home/introduction/Introduction"
import Services from "@/components/home/services/Services";
import FAQ from "@/components/home/faq/FAQ";
import Team from "@/components/home/team/Team";
import Footer from "@/components/Footer";
import { Building, Handshake, BarChart2, Briefcase, Banknote, PieChart, TrendingUp, CandlestickChart, Clock, Database, LayoutDashboard, FileText, Mail, Phone, MessageCircle, LineChart } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslationProvider } from "@/utils/providers/TranslationProvider";

export default function Home() {

  const { t } = useTranslationProvider()
  
  const titleProps = {
    backgroundImage: '/images/wall_street.jpg',
    logoSrc: '/images/brand/agm-logo-white.png',
    title: t('agm-technology.title.title'),
    subtitle: t('agm-technology.title.subtitle'),
    ctaText: t('agm-technology.title.action_text'),
    ctaLink: '/apply'
  };

    
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
          { icon: <Clock />, label: '24/7 customer support' },
          { icon: <Database />, label: 'Real-time market data' },
          { icon: <LayoutDashboard />, label: 'Advanced trading tools' },
          { icon: <FileText />, label: 'Statements reporting' }
        ]
      },
      {
        title: t('agm-technology.introduction.cards.2.title'),
        description: t('agm-technology.introduction.cards.2.description'),
        items: [
          { icon: <Mail />, label: 'Email' },
          { icon: <Phone />, label: 'Phone' },
          { icon: <MessageCircle />, label: 'Live chat' }
        ]
      }
    ],
    ctaText: t('agm-technology.introduction.action_text'),
    ctaSubtext: t('agm-technology.introduction.action_subtext')
  };

  const services = [
    {
      name: t('shared.services.agm_trader.title'),
      icon: <LineChart className='text-background h-[12vw] w-[12vw]'/>,
      description: t('shared.services.agm_trader.description'),
      url: '/trader'
    },
    {
      name: t('shared.services.agm_advisor.title'),
      icon: <Handshake className='text-background h-[12vw] w-[12vw]'/>,
      description: t('shared.services.agm_advisor.description'),
      url: '/advisor'
    },
    {
      name: t('shared.services.agm_institutional.title'),
      icon: <Building className='text-background h-[12vw] w-[12vw]'/>,
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
      <Footer />
    </motion.div>
  )
}
