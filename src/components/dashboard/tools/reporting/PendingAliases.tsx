'use client'

import { toast } from '@/hooks/use-toast'
import React, { useEffect, useState } from 'react'
import { ColumnDefinition, DataTable } from '../../../misc/DataTable'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { GetDimensionalTable } from '@/utils/tools/reporting'

const PendingAliases = () => {
  
    const [data, setData] = useState<any[] | null>(null)

    const columns = [
      {
        header: 'Account User',
        accessorKey: 'Username',
      },
      {
        header: 'Master Account',
        accessorKey: 'master_account_id',
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
        header: 'Alias (Standard to type into IBKR)',
        accessorKey: 'account_alias',
        cell: ({ row }: { row: any }) => {
          return <div className='text-sm text-gray-500'>{row.original['Account ID']} + {row.original.Title}</div>
        }
      },
      {
        header: 'Status',
        accessorKey: 'Status',
      },
      {
        header: 'Current Alias',
        accessorKey: 'Alias',
      },
      
    ] as ColumnDefinition<any>[]

    useEffect(() => {
      async function fetchData() {
        try {
          let report = await GetDimensionalTable()
          setData(report['consolidated'].filter((item: any) => item.Alias === '' && (item.Status !== 'Rejected' && item.Status !== 'Closed')))
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

    if (!data) return <LoadingComponent className='h-full w-full'/>

  return (
    <div className='w-full h-full flex flex-col gap-5'>
      <DataTable 
          data={data}
          enablePagination
          infiniteScroll
          pageSize={5}
          columns={columns}
        />
    </div>
  )
}

export default PendingAliases