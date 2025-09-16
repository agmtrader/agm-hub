'use client'

import { toast } from '@/hooks/use-toast'
import React, { useEffect, useState } from 'react'
import { ColumnDefinition, DataTable } from '../../../misc/DataTable'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { ReadClientsReport } from '@/utils/tools/reporting'
import { Button } from '@/components/ui/button'
import { UpdateAccountAlias } from '@/utils/entities/account'

const PendingAliases = () => {

  const [data, setData] = useState<any[] | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

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
        return <div className='text-sm text-gray-500'>{row.original['Account ID']} {row.original.Title}</div>
      }
    },
    {
      header: 'Status',
      accessorKey: 'Status'
    },
    {
      header: 'Current Alias',
      accessorKey: 'Alias',
    },
    
  ] as ColumnDefinition<any>[]

  useEffect(() => {
    async function fetchData() {
      try {
        let [clients] = await Promise.all([ReadClientsReport()])
        setData(clients.filter((client: any) => client.Alias === '' && (client.Status !== 'Rejected' && client.Status !== 'Closed' && client.Status !== 'Funded Pending')))
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

  async function handleUpdateAliases() {
    if (!data || data.length === 0) return

    setIsUpdating(true)

    try {
      await Promise.all(
        data.map(account => {
          const accountId = account['Account ID']
          const title = account.Title
          const newAlias = `${accountId} ${title}`
          return UpdateAccountAlias(accountId, newAlias, 'br')
        })
      )

      toast({
        title: 'Aliases updated',
        description: 'All pending aliases have been updated successfully.',
        variant: 'success',
      })

      // Refresh data after updating
      setData(prev => prev ? prev.filter(acc => false) : []) // clear immediately
      // Re-fetch to get updated state
      try {
        let [clients] = await Promise.all([ReadClientsReport()])
        setData(clients.filter((client: any) => client.Alias === '' && (client.Status !== 'Rejected' && client.Status !== 'Closed' && client.Status !== 'Funded Pending')))
      } catch (error: any) {
        toast({
          title: 'Error refreshing clients',
          description: error.message,
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error updating aliases',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (!data) return <LoadingComponent className='h-full w-full'/>

  return (
    <div className='w-full h-full flex flex-col gap-5'>
      <div className='flex justify-end'>
        <Button
          onClick={handleUpdateAliases}
          disabled={isUpdating || data.length === 0}
          className='bg-primary text-background hover:bg-primary/90'
        >
          {isUpdating ? 'Updating Aliases...' : 'Update All Aliases'}
        </Button>
      </div>
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