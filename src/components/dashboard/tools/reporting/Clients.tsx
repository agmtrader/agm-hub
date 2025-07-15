'use client'

import { toast } from '@/hooks/use-toast'
import React, { useEffect, useState } from 'react'
import { DataTable } from '../../../misc/DataTable'
import LoadingComponent from '@/components/misc/LoadingComponent'
import DashboardPage from '@/components/misc/DashboardPage'
import { ReadClientsReport } from '@/utils/tools/reporting'
import { Account } from '@/lib/entities/account'

const Clients = () => {
  
    const [accounts, setAccounts] = useState<Account[] | null>(null)
    const [clients, setClients] = useState<any[] | null>(null)

    useEffect(() => {
      async function fetchData() {
        try {
        
          // Fetch files in resources folder
          let report = await ReadClientsReport()
          setAccounts(report['accounts'])
          setClients(report['clients'])

        } catch (error:any) {
          toast({
            title: 'Error fetching clients',
            description: error.message,
            variant: 'destructive',
          })
        }
      }
      fetchData()
    }, [])

    if (!accounts || !clients) return <LoadingComponent />

  return (
    <DashboardPage
      title='Clients Report'
      description='View and manage clients and their accounts.'
    >
    <div className='w-full h-full flex flex-col gap-5'>
        <div className='w-1/2'>

        </div>
        <div className='w-1/2'>
          <DataTable 
            data={accounts}
            enablePagination
            pageSize={5}
          />
        </div>
        <div className='w-1/2'>
          <DataTable 
            data={clients}
            enablePagination
            pageSize={5}
          />
        </div>
      </div>
    </DashboardPage>
  )
}

export default Clients