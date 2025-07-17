'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import DashboardPage from '@/components/misc/DashboardPage'
import Clients from './Clients'
import { Report } from '@/lib/tools/report'
import { Recycle } from 'lucide-react'
import PendingAliases from './PendingAliases'
import { Tabs, TabsTrigger, TabsList, TabsContent } from '@/components/ui/tabs'
import { GenerateReports } from '@/utils/tools/reporting'

const ReportingCenter = () => {

  const reports: Report[] = [
    { id: 1, name: 'Clients', report: <Clients /> },
    { id: 2, name: 'Pending Aliases', report: <PendingAliases /> }
  ]

  function generateReports() {
    GenerateReports()
  }

  return (
    <DashboardPage title='Reporting Center' description='Download, transform and backup daily reports.'>
      <Button onClick={generateReports} className='w-fit'>
        <Recycle className='h-4 w-4' />
        Generate Reports
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