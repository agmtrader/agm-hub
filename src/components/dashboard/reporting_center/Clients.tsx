'use client'

import { toast } from '@/hooks/use-toast'
import { accessAPI } from '@/utils/api'
import React, { useEffect, useState } from 'react'
import { ColumnDefinition, DataTable } from '../components/DataTable'
import LoadingComponent from '@/components/misc/LoadingComponent'

const Clients = () => {

    const [clients, setClients] = useState<any[] | null>(null)
    const [accounts, setAccounts] = useState<any[] | null>(null)

    useEffect(() => {
      async function fetchData() {
        try {
            const resources_folder_id = '18Gtm0jl1HRfb1B_3iGidp9uPvM5ZYhOF'
            let response = await accessAPI('/drive/get_files_in_folder', 'POST', {
                'parent_id': resources_folder_id,
            })
            if (response['status'] !== 'success') throw new Error('Error fetching clients')
            
            const resources = response['content']
            const clients_file_ids = resources.filter((file: any) => file.name.includes('ibkr_clients.csv')).map((file: any) => file.id)
            if (clients_file_ids.length !== 1) throw new Error('Error with clients file')
            const clients_file_id = clients_file_ids[0]

            let clients_response = await accessAPI('/drive/download_file', 'POST', {
                'file_id': clients_file_id,
                'parse': true,
            })
            setClients(clients_response['content'])

            let account_response = await accessAPI('/database/read', 'POST', {
                'path': 'db/clients/accounts',
                'query': {}
            })
            setAccounts(account_response['content'])

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
        header: 'Master User',
        accessorKey: 'MasterUserID',
      },
      {
        header: 'Account Username',
        accessorKey: 'Username',
      },
      {
        header: 'Master Account',
        accessorKey: 'ClientName',
      },
      {
        header: 'Account Number',
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
        accessorKey: 'DateOpened',
      },
      {
        header: 'Phone',
        accessorKey: 'Phone',
      },
      {
        header: 'SLS',
        accessorKey: 'SLS',
      },
      {
        header: 'Advisor',
        accessorKey: 'Advisor',
      },
      {
        header: 'Advisor GForm',
        accessorKey: 'AdvisorGForm',
      },
    ] as ColumnDefinition<any>[]


  return (
    <div className='w-full h-full gap-5 flex flex-col'>
      <h1 className='text-7xl text-foreground font-bold'>Clients Report</h1>
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
    </div>
  )
}

export default Clients