'use client'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import DashboardPage from '@/components/misc/DashboardPage'
import ClientFees from '@/components/dashboard/reporting_center/ClientFees'
import AccruedInterest from '@/components/dashboard/reporting_center/AccruedInterest'
import { Separator } from '@/components/ui/separator'
import { Report } from '@/lib/types'
import { Recycle } from 'lucide-react'
import Link from 'next/link'


const Page = () => {

  const reports: Report[] = [
    { id: 1, name: 'Client Fees', report: <ClientFees /> },
    { id: 2, name: 'Accrued Interest Report', report: <AccruedInterest /> },
  ]

  const [selectedReport, setSelectedReport] = useState<Report | null>(reports[0])

  return (
    <DashboardPage title='Reporting Center' description='Download, transform and backup daily reports.'>
      <Card className='w-full h-full'>
        <CardContent className='flex flex-col gap-2 p-4 w-full h-full'>

          <div className='flex flex-row gap-2 w-full h-full'>
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
            <Separator orientation='vertical' className='h-full'/>
            <div className='flex flex-col gap-2 w-full'>
              {selectedReport && selectedReport.report}
            </div>
          </div>
          <Button asChild className='w-fit'>
            <Link href='/dashboard/reporting/generate' className='flex flex-row gap-2'>
              <Recycle className='h-4 w-4' />
              Generate Reports
            </Link>
          </Button>

        </CardContent>
      </Card>
    </DashboardPage>
  )
}

export default Page