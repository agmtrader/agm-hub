import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import { formatURL } from '@/utils/lang'
import { AlarmClockPlusIcon, ArrowLeft, Bell, BellIcon, FileText, Plus, RefreshCcw, Table, Ticket, Users } from 'lucide-react'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

import { cn } from '@/lib/utils'

const navbarContent = [
  {
    name: 'Overview',
    url: '/dashboard',
    icon: BellIcon,  
  },
  {
    name: 'Document Center',
    url: '/dashboard/document-center',
    icon: FileText,
  }
]

const tools = [
  {
    name: 'Generate tickets',
    url: '/dashboard/trade-tickets',
    icon: Ticket,
  }, 
  {
    name: 'Open an account',
    url: '/dashboard/open-account',
    icon: Plus,
  },
  {
    name: 'Generate reports',
    url: '/dashboard/reporting',
    icon: RefreshCcw,
  }
]

const Sidebar = () => {

  const {lang} = useTranslationProvider();

  return (
          <nav className="flex flex-col justify-center items-center text-foreground w-64 h-fit gap-y-10 bg-background">
            <Button asChild className='w-full justify-start'>
                <Link href={formatURL('/', lang)} legacyBehavior passHref>
                    <Image src={'/images/brand/agm-logo.png'} alt='logo' width={150} height={100}/>
                </Link>
            </Button>
          <NavigationMenu className="px-3 py-2 h-fit">
            <NavigationMenuList className="w-full gap-y-2 flex flex-col h-full justify-between">
              {navbarContent.map((item, index) => (
                <NavigationMenuItem key={index} className="flex w-full h-fit">
                  <Link href={formatURL(item.url, lang)} legacyBehavior passHref>
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "justify-start w-full")}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
              {tools.map((item, index) => (
                <NavigationMenuItem key={index} className="flex w-full h-fit">
                  <Link href={formatURL(item.url, lang)} legacyBehavior passHref>
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "justify-start w-full")}>
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