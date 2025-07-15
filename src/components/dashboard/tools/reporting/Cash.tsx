'use client'
import { toast } from '@/hooks/use-toast'
import React, { useEffect, useState } from 'react'
import { DataTable } from '../../../misc/DataTable'
import LoadingComponent from '@/components/misc/LoadingComponent'
import DashboardPage from '@/components/misc/DashboardPage'
import { CashReport } from '@/utils/tools/reporting'

const Cash = () => {
    const [report, setReport] = useState<any[] | null>(null)

    useEffect(() => {
      async function fetchData() {
        try {

          let report = await CashReport()
          setReport(report)

        } catch (error:any) {
          toast({
            title: 'Error fetching cash report',
            description: error.message,
            variant: 'destructive',
          })
        }
      }
      fetchData()
    }, [])

    if (!report) return <LoadingComponent />

  return (
    <DashboardPage
      title='Cash Report'
      description='View and manage cash report.'
    >
    <div className='w-full h-full flex flex-col gap-5'>
        <div className='w-1/2'>

        </div>
        <div className='w-1/2'>
          <DataTable
            data={report}
            enablePagination
            pageSize={5}
          />
        </div>
      </div>
    </DashboardPage>
  )
}

export default Cash 