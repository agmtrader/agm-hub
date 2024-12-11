import Title from "@/components/home/title/Title";
import Introduction from "@/components/home/introduction/Introduction"
import Services from "@/components/home/services/Services";
import FAQ from "@/components/home/faq/FAQ";

import Team from "@/components/home/team/Team";
import { GraphUpArrow } from "react-bootstrap-icons";
import { Building, Handshake, BarChart2, PieChart, TrendingUp, Clock, Database, LayoutDashboard, FileText, MessageCircle } from "lucide-react";

export default function Home() {
  
  const titleProps = {
    backgroundImage: '/images/advisor.webp',
    logoSrc: '/images/brand/agm-logo-white.png',
    title: 'Advisor',
    subtitle: 'Help reach your financial goals with industry leading tools and experts.',
    ctaText: 'Apply for an account',
    ctaLink: '/apply'
  };

  const introductionProps = {
    title: "Your Legacy Matters.",
    description: [
      "AGM Advisor, our Advisory services firm, provides individual portfolio investment strategies that are tailored made for each client (Segregated Portfolio Accounts).",
      "Any client that would like to delegate a portion of their financial assets or wealth through our advisory division, gets one on one service from one of our Advisors that is assigned. We strive to provide best in class service to each of our advisory clients!",
      "Get to know your risk profile as an investor and the proposed investment portfolio that matches your profile."
    ],
    cards: [
      {
        title: "Personalized Investment Strategies",
        description: "We create tailored investment portfolios designed to meet your unique financial goals and risk tolerance.",
        items: [
          { icon: <BarChart2 />, label: 'Custom portfolios' },
          { icon: <PieChart />, label: 'Risk assessment' },
          { icon: <TrendingUp />, label: 'Goal-oriented planning' }
        ]
      },
      {
        title: "One-on-One Advisory Service",
        description: "Experience dedicated support with a personal advisor assigned to manage your financial assets and wealth.",
        items: [
          { icon: <Handshake />, label: 'Dedicated advisor' },
          { icon: <MessageCircle />, label: 'Personalized communication' },
          { icon: <FileText />, label: 'Regular portfolio reviews' }
        ]
      },
      {
        title: "Best-in-Class Service",
        description: "Benefit from our commitment to providing exceptional service and support to each of our advisory clients.",
        items: [
          { icon: <Clock />, label: 'Responsive support' },
          { icon: <LayoutDashboard />, label: 'Comprehensive reporting' },
          { icon: <Database />, label: 'Market insights' }
        ]
      }
    ],
    ctaText: "Discover Your Investment Profile",
    ctaSubtext: "Take our risk assessment to get started with a tailored investment strategy."
  };

  const services = [
    {
      name: 'AGM Trader',
      icon: <TrendingUp className='text-white h-[12vw] w-[12vw]'/>,
      description: 'We provide easy trading and investing access through our mobile, desktop and web applications connected to more than 150 financial markets worldwide.',
      url: 'https://agmtrader.com'
    },
    {
      name: 'AGM Institutional',
      icon: <Building className='text-white h-[12vw] w-[12vw]'/>,
      description:'Our Institutional division provides world class execution services to the most sophisticated institutions like Advisory Firms, Hedge Funds, Broker/Dealers, Wealth Management firms, Insurance companies and more.',
      url:'https://agm-institutional.vercel.app'
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
