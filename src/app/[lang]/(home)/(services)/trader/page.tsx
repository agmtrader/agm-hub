import Title from "../../../../../components/home/title/Title";
import Introduction from "../../../../../components/home/introduction/Introduction"
import Services from "@/components/home/services/Services";
import FAQ from "@/components/home/faq/FAQ";
import Team from "@/components/home/team/Team";
import Footer from "@/components/Footer";
import { Building, Clock, Database, TrendingUp, Monitor, DollarSign, Smartphone, Globe, Headphones, Shield, BarChart, BookOpen, Lock } from "lucide-react";
import { GraphUpArrow } from "react-bootstrap-icons";
import { Handshake } from "lucide-react";
import Download from "@/components/home/download/Download";

export default function Home() {

  const titleProps = {
    backgroundImage: '/images/nyse_floor.jpg',
    logoSrc: '/images/brand/agm-logo-white.png',
    title: 'AGM Trader',
    subtitle: 'Trade assets any time, anywhere using our advanced trading platform and apps.',
    ctaText: 'Apply for an account',
    ctaLink: '/apply'
  };
  
  const services = [
    {
      name: 'AGM Advisor',
      icon: <Handshake className='text-white h-[12vw] w-[12vw]'/>,
      description:'We also provide Advisory services for those clients that would like to delegate a portion of their financial assets or wealth through our advisory division.',
      url:'https://agm-advisor.vercel.app'
    },
    {
      name: 'AGM Institutional',
      icon: <Building className='text-white h-[12vw] w-[12vw]'/>,
      description:'Our Institutional division provides world class execution services to the most sophisticated institutions like Advisory Firms, Hedge Funds, Broker/Dealers, Wealth Management firms, Insurance companies and more.',
      url:'https://agm-institutional.vercel.app'
    }
  ]
  
  const introductionProps = {
    title: "Innovating on a Global Scale",
    description: [
      "AGM Trader lets you trade and invest 24/7 in a wide range of financial instruments across more than 150 markets and 20 different currencies from a single account.",
    ],
    cards: [
      {
        title: "Trade Any Time, Anywhere",
        description: "Access global markets and diverse financial instruments through our advanced trading platforms.",
        items: [
          { icon: <TrendingUp />, label: 'Stocks, bonds, ETFs, options & more' },
          { icon: <Clock />, label: '24/7 trading' },
          { icon: <Database />, label: '150+ markets' },
          { icon: <DollarSign />, label: '20+ currencies' }
        ]
      },
      {
        title: "Choose Your Trading Experience",
        description: "Select the platform that best suits your trading style and needs.",
        items: [
          { icon: <Smartphone />, label: 'AGM Trader (mobile app)' },
          { icon: <Monitor />, label: 'AGM Trader Pro (desktop)' },
          { icon: <Globe />, label: 'AGM Webtrader (web-based)' },
        ]
      },
      {
        title: "Trade with Confidence",
        description: "Our trading platforms are designed to provide you with the tools you need to succeed in the financial markets.",
        items: [
          { icon: <Shield />, label: 'Secure trading' },
          { icon: <BarChart />, label: 'Real-time analytics' },
          { icon: <BookOpen />, label: 'Educational resources' },
          { icon: <Headphones />, label: '24/7 support' },
        ]
      }
    ],
    ctaText: "Ready to start trading anywhere?",
    ctaSubtext: "Download our app now."
  }
  
  return (
    <div className="flex flex-col h-full w-full gap-y-20">
      <Title {...titleProps} />
      <Introduction {...introductionProps} />
      <Services services={services} />
      <Download />
      <FAQ />
      <Footer />
    </div>
  )
}
