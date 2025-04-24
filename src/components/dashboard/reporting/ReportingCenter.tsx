'use client'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import DashboardPage from '@/components/misc/DashboardPage'
import ClientFees from './ClientFees'
import { Separator } from '@/components/ui/separator'
import { Report } from '@/lib/entities/report'
import { Recycle } from 'lucide-react'
import Link from 'next/link'

const Page = () => {

  const reports: Report[] = [
    { id: 1, name: 'Clients', report: <ClientFees /> }
  ]

  const [selectedReport, setSelectedReport] = useState<Report | null>(reports[0])

  return (
    <DashboardPage title='Reporting Center' description='Download, transform and backup daily reports.'>
      <Button asChild className='w-fit'>
        <Link href='/dashboard/reporting/generate' className='flex flex-row gap-2'>
          <Recycle className='h-4 w-4' />
          Generate Reports
        </Link>
      </Button>
      <div className='flex flex-col gap-2 w-fit'>
        {reports.map((report:Report) => (
          <Button 
            variant={selectedReport?.id === report.id ? 'primary' : 'ghost'}
            onClick={() => setSelectedReport(report)} 
            key={report.id} 
            className='w-fit whitespace-nowrap'
          >
            {report.name}
          </Button>
        ))}
      </div>
      <Card className='w-full h-full'>
        <CardContent className='flex flex-col gap-2 p-4 w-full h-full'>
          {selectedReport && selectedReport.report}
        </CardContent>
      </Card>
    </DashboardPage>
  )
}

export default Page