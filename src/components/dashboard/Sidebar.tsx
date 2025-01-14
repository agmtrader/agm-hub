import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import { formatURL } from '@/utils/lang'
import { AlarmClockPlusIcon, ArrowLeft, Bell, BellIcon, ChevronLeft, ChevronRight, Database, FileText, Plus, RefreshCcw, Table, Ticket, Users } from 'lucide-react'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

import { cn } from '@/lib/utils'
import { Separator } from '../ui/separator'

const tools = [
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
    name: 'Account Applications',
    url: '/dashboard/open-account',
    icon: Plus,
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
    name: 'Database Center',
    url: '/dashboard/database-center',
    icon: Database,
  },
  {
    name: 'Investment Proposals',
    url: '/dashboard/investment-proposals',
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
    icon: Users,
  }
]

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const {lang, setLang} = useTranslationProvider()

  return (
    <nav className="flex flex-col justify-center items-center text-foreground px-5 h-full gap-y-10 w-fit">
      <NavigationMenu className="py-2 h-fit flex flex-col justify-between items-start">
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
        <Button
            variant="ghost"
            size="icon"
            className="p-0"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
      </NavigationMenu>
    </nav>
  )
}

export default Sidebar