import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import { formatURL } from '@/utils/language/lang'
import { AlarmClockPlusIcon, BellIcon, Bot, ChevronLeft, ChevronRight, Cross, FileText, Plus, RefreshCcw, Ticket, Users } from 'lucide-react'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

import { cn } from '@/lib/utils'
import { Separator } from '../ui/separator'

const tools = [
  {
    name: 'Account Applications',
    url: '/dashboard/open-account',
    icon: Plus,
  },
  {
    name: 'Account Management',
    url: '/dashboard/account-management',
    icon: Cross,
  },
  {
    name: 'Risk Profiles',
    url: '/dashboard/risk',
    icon: AlarmClockPlusIcon,
  },
  {
    name: 'Trade Tickets',
    url: '/dashboard/trade-tickets',
    icon: Ticket,
  }, 
  {
    name: 'Investment Proposals',
    url: '/dashboard/investment-proposals',
    icon: FileText,
  },
  {
    name: 'Reporting Center',
    url: '/dashboard/reporting',
    icon: RefreshCcw,
  }, 
  {
    name: 'Document Center',
    url: '/dashboard/document-center',
    icon: FileText,
  },
  {
    name: 'Advisor Center',
    url: '/dashboard/advisors',
    icon: Users,
  },
  {
    name: 'Auto Trader',
    url: '/dashboard/auto-trader',
    icon: Bot,
  },
]

const Sidebar = () => {

  const [isCollapsed, setIsCollapsed] = useState(false)
  const { lang } = useTranslationProvider()

  return (
    <NavigationMenu className="px-3 py-8 h-full flex flex-col gap-10 justify-between items-start">
      <div className='flex flex-col items-center justify-center gap-10'>
        <Button variant="ghost" className='w-fit h-fit'>
          <Link href={formatURL('/', lang)} legacyBehavior passHref>
            <Image src="/assets/brand/agm-logo.png" priority={true} alt="AGM Logo" className="w-[150px] h-[50px] object-contain" width={150} height={50} /> 
          </Link>
        </Button>
        <NavigationMenuList className="w-full flex flex-col gap-2">
          <NavigationMenuItem key={'dashboard'} className="flex w-full h-fit">
            <Link href={formatURL('/dashboard', lang)} legacyBehavior passHref>
              <NavigationMenuLink className={cn(
                navigationMenuTriggerStyle(),
                "text-start justify-start w-full",
              )}>
                <BellIcon className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">Overview</span>}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <Separator />
          {tools.map((item, index) => (
            <NavigationMenuItem key={index} className="flex w-full h-fit">
              <Link href={formatURL(item.url, lang)} legacyBehavior passHref>
                <NavigationMenuLink className={cn(
                  navigationMenuTriggerStyle(),
                  "justify-start text-start w-full whitespace-nowrap",
                )}>
                  <item.icon className="h-4 w-4" />
                  {!isCollapsed && <span className="ml-2">{item.name}</span>}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </div>
      <Button
          variant="ghost"
          size="icon"
          className="p-0"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
  </NavigationMenu>
  )
}

export default Sidebar