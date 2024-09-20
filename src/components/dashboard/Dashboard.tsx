'use client'

import React from 'react'
import { User, Trash, Users, Bell as BellIcon, Ticket, Plus, Bell, ArrowLeft, AlarmClockPlusIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Button } from '../ui/button'
import Link from 'next/link'

import {NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle} from "@/components/ui/navigation-menu"
import { cn } from '@/lib/utils'
import { useTranslationProvider } from '@/utils/TranslationProvider'
import { formatURL } from '@/utils/lang'

const navbarContent = [
  {
    name: 'Overview',
    url: '/dashboard',
    icon: BellIcon,  
  },
  {
    name: 'Users',
    url: '/dashboard/users',
    icon: Users,
  },
  {
    name: 'Open an account',
    url: '/dashboard/open-account',
    icon: Plus,
    badge: 3
  },
  {
    name: 'Trade tickets',
    url: '/dashboard/trade-tickets',
    icon: Ticket,
  }, 
  {
    name: 'Reporting',
    url: '/dashboard/reporting',
    icon: Bell,
  },
  {
    name: 'Accounting',
    url: '/dashboard/accounting',
    icon: AlarmClockPlusIcon,
  }
]

export function Dashboard() {
  
  const {data:session} = useSession();
  const {lang} = useTranslationProvider()

  return (
    <div className="flex w-full h-full">
      
      {/* Sidebar */}
      <nav className="flex flex-col justify-center items-center text-foreground w-64 h-fit gap-y-10 bg-background">
        <Image src={'/images/brand/agm-logo.png'} alt='logo' width={150} height={100}/>
        <NavigationMenu className="px-3 py-2 h-fit">
          <NavigationMenuList className="w-full gap-y-2 flex flex-col h-full justify-between">
            <NavigationMenuItem className='flex w-full h-fit'>
              <Button asChild variant='ghost' className='w-full justify-start'>
                <Link href={formatURL('/', lang)} legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "justify-start w-full")}>
                    <ArrowLeft className='mr-2 h-4 w-4' />
                    Go back home
                  </NavigationMenuLink>
                </Link>
              </Button>
            </NavigationMenuItem>
            {navbarContent.map((item, index) => (
              <NavigationMenuItem key={index} className="flex w-full h-fit">
                <Link href={formatURL(item.url, lang)} legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "justify-start w-full")}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                    {item.badge && (
                      <span className="ml-auto bg-primary text-background rounded-full px-2 py-0.5 text-xs">
                        {item.badge}
                      </span>
                    )}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      {/* Main content */}
      <div className="flex-1">
        <header className="flex items-center justify-between p-4 border-b border-muted">
          <div className="flex items-center text-foreground space-x-4">
            <User className="w-8 h-8" />
            <h2 className="text-xl font-semibold">{session?.user?.name}</h2>
          </div>
          <div className="flex items-center space-x-4">
            <Input type="search" placeholder="Search..." className="w-64" />
            <Bell className="w-6 h-6" />
          </div>
        </header>
        <main className="flex-grow p-6">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-5 grid-rows-5 gap-4">
                <Card className="col-span-1 row-span-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$2,231.89</div>
                    <p className="text-xs">+20.1% from last month</p>
                  </CardContent>
                </Card>
                <Card className="col-span-1 row-span-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New clients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+12</div>
                    <p className="text-xs">+180.1% from last month</p>
                  </CardContent>
                </Card>
                <Card className="col-span-1 row-span-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Commissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+$435</div>
                    <p className="text-xs">+19% from last month</p>
                  </CardContent>
                </Card>
                <Card className="col-span-1 row-span-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Users Trading Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+10</div>
                    <p className="text-xs">+4 since last hour</p>
                  </CardContent>
                </Card>
                <Card className="col-span-3 row-span-2 row-start-2">
                  <CardHeader>
                    <CardTitle>Open account applications</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    
                  </CardContent>
                </Card>
                <Card className="row-span-2 col-start-4 row-start-2">
                  <CardHeader>
                    <CardTitle>Test</CardTitle>
                    <CardContent>
                      <p className="text-sm"></p>
                    </CardContent>
                  </CardHeader>
                  <CardContent>
                  </CardContent>
                </Card>
                <Card className="col-span-2 row-span-2 row-start-4">
                  {/* Add content for the new card in position 13 */}
                </Card>
                <Card className="col-span-2 row-span-2 col-start-3 row-start-4">
                  {/* Add content for the new card in position 14 */}
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}