'use client'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import DashboardPage from '@/components/misc/DashboardPage'
import Clients from './Clients'
import { Report } from '@/lib/tools/report'
import { Recycle } from 'lucide-react'
import Link from 'next/link'
import PendingAliases from './PendingAliases'
import { Tabs, TabsTrigger, TabsList, TabsContent } from '@/components/ui/tabs'

const ReportingCenter = () => {

  const reports: Report[] = [
    { id: 1, name: 'Clients', report: <Clients /> },
    { id: 2, name: 'Pending Aliases', report: <PendingAliases /> }
  ]
  return (
    <DashboardPage title='Reporting Center' description='Download, transform and backup daily reports.'>
      <Button asChild className='w-fit'>
        <Link href='/dashboard/reporting/generate' className='flex flex-row gap-2'>
          <Recycle className='h-4 w-4' />
          Generate Reports
        </Link>
      </Button>
      <Tabs defaultValue={reports[0].id.toString()} className='w-full'>
        <TabsList>
          {reports.map((report:Report) => (
            <TabsTrigger key={report.id} value={report.id.toString()}>{report.name}</TabsTrigger>
          ))}
        </TabsList>
        {reports.map((report:Report) => (
          <TabsContent key={report.id} value={report.id.toString()}>
            {report.report}
          </TabsContent>
        ))}
      </Tabs>
    </DashboardPage>
  )
}

export default ReportingCenter