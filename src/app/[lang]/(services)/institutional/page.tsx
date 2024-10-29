import Title from "@/components/home/title/Title";
import Introduction from "@/components/home/introduction/Introduction"
import Services from "@/components/home/services/Services";
import FAQ from "@/components/home/faq/FAQ";

import Team from "@/components/home/team/Team";
import Footer from "@/components/Footer";
import { GraphUpArrow } from "react-bootstrap-icons";
import { Building, Handshake, BarChart2, Briefcase, Banknote, PieChart, TrendingUp, CandlestickChart, Clock, Database, LayoutDashboard, FileText, Mail, Phone, MessageCircle, DollarSign, Zap, Globe } from "lucide-react";

export default function Home() {
  
  const titleProps = {
    backgroundImage: '/images/nasdaq.jpg',
    logoSrc: '/images/brand/agm-logo-white.png',
    title: 'AGM Institutional',
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
    }
  ]
  
  const introductionProps = {
    title: "Your Business Matters",
    description: [
      "Our Institutional division provides world-class execution services to the most sophisticated institutions.",
      "Our dedicated team of professionals ensures that any need or requirement is met, providing the best execution and pricing in over 150 markets worldwide across all asset classes."
    ],
    cards: [
      {
        title: "Who We Serve",
        description: "We cater to a wide range of institutional clients, including:",
        items: [
          { icon: <Building />, label: 'Advisory Firms' },
          { icon: <TrendingUp />, label: 'Hedge Funds' },
          { icon: <Briefcase />, label: 'Broker/Dealers' },
          { icon: <PieChart />, label: 'Wealth Management Firms' },
          { icon: <Banknote />, label: 'Family Offices' },
          { icon: <FileText />, label: 'Insurance Companies' }
        ]
      },
      {
        title: "Our Services",
        description: "We offer comprehensive execution services across various markets and asset classes.",
        items: [
          { icon: <Globe />, label: '150+ Global Markets' },
          { icon: <BarChart2 />, label: 'Multiple Asset Classes' },
          { icon: <Zap />, label: 'Best Execution' },
          { icon: <DollarSign />, label: 'Competitive Pricing' }
        ]
      },
      {
        title: "Get in Touch",
        description: "Our team is ready to assist you with any inquiries or requirements you may have.",
        items: [
          { icon: <Mail />, label: 'Email Us' },
          { icon: <Phone />, label: 'Call Us' },
          { icon: <MessageCircle />, label: 'Live Chat' }
        ]
      }
    ],
    ctaText: "Learn More",
    ctaSubtext: "Discover how our institutional services can benefit your business."
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
