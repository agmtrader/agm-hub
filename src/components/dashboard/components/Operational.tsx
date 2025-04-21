import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Ticket, ShieldCheck, MessageSquare, HeadphonesIcon, LucideIcon } from 'lucide-react'
import { containerVariants, itemVariants } from '@/lib/anims'
import Link from 'next/link'
import { formatURL } from '@/utils/language/lang'

type CardData = {
  title: string
  Icon: LucideIcon
  url?: string
}

const operationalData: CardData[] = [
  {
    title: 'Leads',
    Icon: Users,
    url: '/dashboard/leads'
  },
  {
    title: 'Tickets',
    Icon: Ticket,
    url: '/dashboard/open-account'
  },
  {
    title: 'Accounts',
    Icon: ShieldCheck,
    url: '/dashboard/accounts'
  }
]

const Operational = () => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap justify-start items-center gap-4 max-w-full mx-auto p-4"
    >
      {operationalData.map((card) => (
        <motion.div 
          key={card.title}
          variants={itemVariants} 
          className="w-[280px]"
        >
            <Link 
              href={formatURL(card.url || '', 'en')}
              className="block h-full transition-transform hover:scale-[1.02] hover:cursor-pointer"
            >
              <Card className="h-full aspect-square flex flex-col items-center justify-center p-6">
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                  <card.Icon className="h-16 w-16 text-muted-foreground" />
                  <CardTitle className="text-lg font-medium text-center">{card.title}</CardTitle>
                </div>
              </Card>
            </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default Operational