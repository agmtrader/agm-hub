'use client'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

import React, { useEffect, useState } from 'react'
import { accessAPI } from '@/utils/api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import { motion } from 'framer-motion'
import { formatURL } from '@/utils/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const Page = () => {

  const router = useRouter()
  const { lang } = useTranslationProvider()
  
  const tables = [
    { id: 'accounts', name: 'Accounts', path: 'db.clients.accounts' },
    { id: 'tickets', name: 'Tickets', path: 'db.clients.tickets' }
  ]

  function redirectToTable(tablePath: string) {
    router.push(formatURL(`/dashboard/database-center/${tablePath}`, lang))
  }

  if (tables && tables.length === 0) return <LoadingComponent/>

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  }

  async function migrateReports() {
    let response = await accessAPI('/reporting/migrate', 'POST')
    console.log(response)
  }
  return (
    <div className="w-full h-full flex flex-col gap-5 items-center justify-start">
      <div className="flex flex-col items-center justify-center gap-5">
        <motion.h1 
          variants={fadeIn}
          className="text-7xl font-bold text-foreground"
        >
          AGM Database Center
        </motion.h1>
        <motion.p className='text-2xl text-subtitle' variants={fadeIn}>
          Check out tables and query data from the database.
        </motion.p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
        {tables.map((table) => (
          <Card 
            key={table.id} 
            className='hover:shadow-lg w-96 transition-shadow cursor-pointer'
            onClick={() => redirectToTable(table.path)}
          >
            <CardHeader className="font-semibold">{table.name}</CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Last modified: {new Date().toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button onClick={migrateReports}>Migrate Reports</Button>
    </div>
  )
}

export default Page