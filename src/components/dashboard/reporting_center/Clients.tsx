'use client'

import { toast } from '@/hooks/use-toast'
import { accessAPI } from '@/utils/api'
import React, { useEffect, useState } from 'react'
import { ColumnDefinition, DataTable } from '../../misc/DataTable'
import LoadingComponent from '@/components/misc/LoadingComponent'
import DashboardPage from '@/components/misc/DashboardPage'

const Clients = () => {

    const [clients, setClients] = useState<any[] | null>(null)
    const [accounts, setAccounts] = useState<any[] | null>(null)
    const [nav, setNav] = useState<any[] | null>(null)

    useEffect(() => {
      async function fetchData() {
        try {
        
          // Fetch files in resources folder
          let response = await accessAPI('/reporting/get_clients_report', 'GET')
          if (response['status'] !== 'success') throw new Error('Error fetching clients')
          
          setClients(response['content']['clients'])
          setAccounts(response['content']['accounts'])

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

    if (!clients || !accounts) return <LoadingComponent />

    const accounts_columns = [
      {
        header: 'Timestamp',
        accessorKey: 'AccountID',
      },
      {
        header: 'Username',
        accessorKey: 'IBKRUsername',
      },
      {
        header: 'Password',
        accessorKey: 'IBKRPassword',
      },
      {
        header: 'Account Number',
        accessorKey: 'AccountNumber',
      },
    ] as ColumnDefinition<any>[]

    const clients_columns = [
      {
        header: 'Account User',
        accessorKey: 'Username',
      },
      {
        header: 'Master Account',
        accessorKey: 'MasterAccount',
      },
      {
        header: 'Account ID',
        accessorKey: 'Account ID',
      },
      {
        header: 'Account Title',
        accessorKey: 'Title',
      },
      {
        header: 'Account Holder',
        accessorKey: 'AccountHolder',
      },
      {
        header: 'Status',
        accessorKey: 'Status',
      },
      {
        header: 'Date Opened',
        accessorKey: 'Date Opened',
      },
      {
        header: 'NAV',
        accessorKey: 'NAV',
      },
      {
        header: 'Account Type',
        accessorKey: 'Account Type',
      },
      {
        header: 'Phone Number',
        accessorKey: 'Phone Number',
      },
      {
        header: 'SLS Devices',
        accessorKey: 'SLS Devices',
      },
      {
        header: 'Advisor Name',
        accessorKey: 'Advisor',
      },
      {
        header: 'Advisor GForm',
        accessorKey: 'AdvisorGForm',
      },
      {
        header: 'Trading Type',
        accessorKey: 'Trading Type',
      },
    ] as ColumnDefinition<any>[]

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
            columns={accounts_columns}
          />
        </div>
      </div>
      <div className='w-full h-full gap-5'>
        <DataTable 
          data={clients}
          enablePagination
          pageSize={5}
          enableFiltering
          columns={clients_columns}
        />
      </div>
    </DashboardPage>
  )
}

export default Clients