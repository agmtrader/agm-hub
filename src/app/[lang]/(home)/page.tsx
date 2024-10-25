import Title from "../../../components/home/title/Title";
import Introduction from "../../../components/home/introduction/Introduction"
import Services from "@/components/home/services/Services";
import FAQ from "@/components/home/faq/FAQ";

import Team from "@/components/home/team/Team";
import Footer from "@/components/Footer";
import { GraphUpArrow } from "react-bootstrap-icons";
import { Building, Handshake, BarChart2, Briefcase, Banknote, PieChart, TrendingUp, CandlestickChart, Clock, Database, LayoutDashboard, FileText, Mail, Phone, MessageCircle } from "lucide-react";

export default function Home() {
  
  const titleProps = {
    backgroundImage: '/images/wall_street.jpg',
    logoSrc: '/images/brand/agm-logo-white.png',
    title: 'Investing. Anywhere. Anytime.',
    subtitle: 'Unlock a world of opportunities with our global investment platform.',
    ctaText: 'Apply for an account',
    ctaLink: '/apply'
  };

  const services = [
    {
      name: 'AGM Trader',
      icon: <GraphUpArrow className='text-white h-[12vw] w-[12vw]'/>,
      description: 'We provide easy trading and investing access through our mobile, desktop and web applications connected to more than 150 financial markets worldwide.',
      url: 'https://agmtrader.com'
    },
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
    title: "Who is AGM?",
    description: [
      "Since 1995, AGM as an International Securities Broker/Dealer has facilitated direct access to more than 150 financial markets (Securities Exchanges) in the US, Europe, Asia and Latin America, otherwise unavailable to certain investors.",
      "AGM Technology offers professional services to maximize your returns:"
    ],
    cards: [
      {
        title: "Trade any time, anywhere",
        description: "Trade stocks, ETFs, bonds, crypto and more from any location at any time with our advanced trading platform and services.",
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
        title: "Professional tools",
        description: "Our trading platform, dashboard and tools is designed to provide you with the tools you need to succeed in the financial markets.",
        items: [
          { icon: <Clock />, label: '24/7 customer support' },
          { icon: <Database />, label: 'Real-time market data' },
          { icon: <LayoutDashboard />, label: 'Advanced trading tools' },
          { icon: <FileText />, label: 'Statements reporting' }
        ]
      },
      {
        title: "Active customer support",
        description: "Our customer support team is always ready and happy to assist you with any questions or concerns you may have.",
        items: [
          { icon: <Mail />, label: 'Email' },
          { icon: <Phone />, label: 'Phone' },
          { icon: <MessageCircle />, label: 'Live chat' }
        ]
      }
    ],
    ctaText: "Interested?",
    ctaSubtext: "See steps on how to get your trading journey started."
  };

  return (
    <div className="flex flex-col h-full w-full gap-y-20">
      <Title {...titleProps} />
      <Introduction {...introductionProps} />
      <Services services={services} />
      <Team />
      <FAQ />
      <Footer />
    </div>
  )
}
