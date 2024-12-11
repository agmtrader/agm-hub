import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import { formatURL } from '@/utils/lang'
import { AlarmClockPlusIcon, ArrowLeft, Bell, BellIcon, Database, FileText, Plus, RefreshCcw, Table, Ticket, Users } from 'lucide-react'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

import { cn } from '@/lib/utils'
import { Separator } from '../ui/separator'

const tools = [
  {
    name: 'Risk profiles',
    url: '/dashboard/risk',
    icon: AlarmClockPlusIcon,
  },
  {
    name: 'Trade tickets',
    url: '/dashboard/trade-tickets',
    icon: Ticket,
  }, 
  {
    name: 'Account Applications',
    url: '/dashboard/open-account',
    icon: Plus,
  },
  {
    name: 'Account Management',
    url: '/dashboard/account-management',
    icon: Users,
  },
  {
    name: 'Generate reports',
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
  }
]

const Sidebar = () => {

  const {lang, setLang} = useTranslationProvider();

  return (
    <nav className="flex flex-col justify-center items-center text-foreground w-fit h-fit gap-y-10 bg-background">
      <NavigationMenu className="px-3 py-2 h-fit">
        <NavigationMenuList className="w-full gap-y-2 flex flex-col h-full justify-between">
            <NavigationMenuItem key={'dashboard'} className="flex w-full h-fit">
              <Link href={formatURL('/dashboard', lang)} legacyBehavior passHref>
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-start justify-start w-full")}>
                  <BellIcon className="mr-2 h-4 w-4" />
                  Overview
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          <Separator orientation="horizontal" className="w-full"/>
          {tools.map((item, index) => (
            <NavigationMenuItem key={index} className="flex w-full h-fit">
              <Link href={formatURL(item.url, lang)} legacyBehavior passHref>
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "justify-start text-start w-full whitespace-nowrap")}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  )
}

export default Sidebar