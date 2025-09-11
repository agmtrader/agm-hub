import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import { formatURL } from '@/utils/language/lang'
import { ChevronLeft, ChevronRight, Home, Plus, Ticket, TrendingUp, Users } from 'lucide-react'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

import { cn } from '@/lib/utils'
import { Separator } from '../ui/separator'
import { useSession } from 'next-auth/react'
import { FaChartBar, FaEnvelope, FaQuestion, FaTasks } from 'react-icons/fa'

const tools = [
  {
    name: 'Users',
    url: '/dashboard/users',
    icon: Users,
    id: 'users',
  },
  {
    name: 'Advisors',
    url: '/dashboard/advisors',
    icon: Users,
    id: 'advisors',
  },
  {
    name: 'Leads',
    url: '/dashboard/leads',
    icon: TrendingUp,
    id: 'leads',
  },
  {
    name: 'Applications',
    url: '/dashboard/applications',
    icon: Plus,
    id: 'applications',
  },
  {
    name: 'Accounts',
    url: '/dashboard/accounts',
    icon: Users,
    id: 'accounts',
  }
]

const user_tools = [
  {
    name: 'Pending Tasks',
    url: '/dashboard/pending-tasks',
    icon: FaTasks,
    id: 'pending_tasks',
  },
  {
    name: 'Pending Aliases',
    url: '/dashboard/pending-alias',
    icon: FaQuestion,
    id: 'pending_alias',
  },
  {
    name: 'Trade Tickets',
    url: '/dashboard/trade-tickets',
    icon: Ticket,
    id: 'trade_tickets',
  },
  {
    name: 'Investment Proposals',
    url: '/dashboard/investment-proposals',
    icon: FaChartBar,
    id: 'investment_proposals',
  },
  {
    name: 'Risk Profiles',
    url: '/dashboard/risk-profiles',
    icon: TrendingUp,
    id: 'risk_profiles',
  },
  {
    name: 'Message Center',
    url: '/dashboard/message-center',
    icon: FaEnvelope,
    id: 'message_center',
  }
]

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { lang } = useTranslationProvider()
  const { data: session } = useSession()

  const userScopes = useMemo(() => {
    if (!session?.user?.scopes) return new Set<string>()
    
    // Split scopes by space and extract unique categories (before the /)
    const scopes = session.user.scopes.split(' ')
    
    // If user has "all" scope, return all tools
    if (scopes.includes('all')) return new Set(['all'])
    
    const categories = new Set(
      scopes.map(scope => scope.split('/')[0])
    )
    
    return categories
  }, [session?.user?.scopes])

  const filteredTools = useMemo(() => {
    // Admins (with "all" scope) can see admin tools; others cannot
    if (userScopes.has('all')) return tools
    return []
  }, [userScopes])

  const filteredUserTools = useMemo(() => {
    // If user has "all" scope, return all user tools
    if (userScopes.has('all')) return user_tools
    // Otherwise, only user tools that match user's scopes (by id)
    return user_tools.filter(tool => userScopes.has(tool.id))
  }, [userScopes])

  return (
    <NavigationMenu className="px-3 py-8 h-full flex flex-col gap-10 justify-between items-start">
      <div className='flex flex-col items-center justify-center gap-10'>
        <Button variant="ghost" className='w-fit h-fit'>
          <Link href={formatURL('/', lang)} legacyBehavior passHref>
            <Image src="/assets/brand/agm-logo.png" priority={true} alt="AGM Logo" className="w-[150px] h-[50px] object-contain" width={150} height={50} /> 
          </Link>
        </Button>
        <NavigationMenuList className="w-full flex flex-col gap-2 items-start justify-center">
          <NavigationMenuItem className="flex w-full h-fit">
            <Link href={formatURL('/dashboard', lang)} legacyBehavior passHref>
              <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "justify-start text-start w-full whitespace-nowrap")}>
                <Home className="h-4 w-4" />
                <span className="ml-2">Home</span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {filteredTools.map((item, index) => (
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
          <Separator />
          {filteredUserTools.map((item, index) => (
            <NavigationMenuItem key={index} className="flex w-full h-fit">
              <Link href={formatURL(item.url, lang)} legacyBehavior passHref>
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "justify-start text-start w-full whitespace-nowrap")}>
                  <item.icon className="h-4 w-4" />
                  {!isCollapsed && <span className="ml-2">{item.name}</span>}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
          <Button
            variant="ghost"
            className="w-fit h-fit"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </NavigationMenuList>
      </div>
    </NavigationMenu>
  )
}

export default Sidebar