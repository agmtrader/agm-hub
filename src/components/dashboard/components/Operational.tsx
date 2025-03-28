import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Ticket, ShieldCheck, MessageSquare, HeadphonesIcon, LucideIcon } from 'lucide-react'
import { containerVariants, itemVariants } from '@/lib/anims'
import Link from 'next/link'

type CardData = {
  title: string
  value: number
  change: number
  Icon: LucideIcon
  url?: string
}

const operationalData: CardData[] = [
  {
    title: 'Leads',
    value: 1248,
    change: 12,
    Icon: Users,
    url: '/dashboard/leads'
  },
  {
    title: 'Tickets',
    value: 42,
    change: -15,
    Icon: Ticket,
    url: '/dashboard/open-account'
  },
  {
    title: 'Approved Accounts',
    value: 873,
    change: 24,
    Icon: ShieldCheck,
    url: '/dashboard/accounts'
  },
  {
    title: 'Communications',
    value: 156,
    change: 8,
    Icon: MessageSquare
  },
  {
    title: 'Support',
    value: 24,
    change: -5,
    Icon: HeadphonesIcon
  }
]

const Operational = () => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full"
    >
      {operationalData.map((card) => (
        <motion.div 
          key={card.title}
          variants={itemVariants} 
          className="h-full"
        >
            <Link 
              href={card.url || ''}
              className="block h-full transition-transform hover:scale-[1.02] hover:cursor-pointer"
            >
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
                  <card.Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-bold">
                    {card.value.toLocaleString()}
                  </div>
                  <p className="text-md text-muted-foreground">
                    {card.change > 0 ? '+' : ''}{card.change}% from last month
                  </p>
                </CardContent>
              </Card>
            </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default Operational