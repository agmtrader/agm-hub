'use client'
import { toast } from '@/hooks/use-toast'
import React, { useEffect, useState } from 'react'
import { DataTable } from '../../../misc/DataTable'
import LoadingComponent from '@/components/misc/LoadingComponent'
import DashboardPage from '@/components/misc/DashboardPage'
import { CashReport } from '@/utils/tools/reporting'

const Cash = () => {
    const [report, setReport] = useState<any[] | null>(null)
    console.log(report)

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

    const columns = [
      {
        header: 'Account ID',
        accessorKey: 'ClientAccountID',
      },
      {
        header: 'Title',
        accessorKey: 'AccountAlias',
      },
      {
        header: 'Cash',
        accessorKey: 'Cash',
      },
      {
        header: 'Cash %',
        accessorKey: 'CashPercentage',
      },
      {
        header: 'NAV',
        accessorKey: 'NAV',
      },
      {
        header: '5% Cash',
        accessorKey: 'FivePercentCash',
      },
      {
        header: 'Report Date',
        accessorKey: 'ReportDate',
      }
    ]

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
            columns={columns}
          />
        </div>
      </div>
    </DashboardPage>
  )
}

export default Cash 