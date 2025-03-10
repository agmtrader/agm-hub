'use client'
import DashboardPage from '@/components/misc/DashboardPage'
import React, { useEffect, useState } from 'react'
import { ColumnDefinition, DataTable } from '../../misc/DataTable'
import { toast } from '@/hooks/use-toast'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { ReadAccruedInterest } from '@/utils/entities/report'

const AccruedInterest  = () => {

  const [accruedInterest, setAccruedInterest] = useState<any[] | null>(null)

  useEffect(() => {
    async function fetchAccruedInterest() {
      try {
        const report = await ReadAccruedInterest()
        setAccruedInterest(report)
      } catch (error) {
        toast({
          title: 'Error fetching accrued interest',
          description: error instanceof Error ? error.message : 'Unknown error',
          variant: 'destructive',
        })
      }
    }
    fetchAccruedInterest()
  }, [])

  const columns = [
    {
      accessorKey: 'ClientAccountID',
      header: 'Client Account ID',
    },
    {
      accessorKey: 'Maturity',
      header: 'Maturity',
    },
    {
      accessorKey: 'Description',
      header: 'Description',
    },
    {
      accessorKey: 'Quantity',
      header: 'Quantity',
    },
    {
      accessorKey: 'CostBasis',
      header: 'Cost Basis',
    },
    {
      accessorKey: 'MarketValue',
      header: 'Market Value',
    },
    {
      accessorKey: 'UnrealizedPnL',
      header: 'Unrealized PnL',
    },
    {
      accessorKey: 'AccruedInterestRecieved $',
      header: 'Accrued Interest Recieved $',
    },
  ] as ColumnDefinition<any>[]

  return (
    <DashboardPage title='Accrued Interest' description='View accrued interest up to date'>
      {accruedInterest ? 
        <DataTable 
          data={accruedInterest} 
          columns={columns}
          infiniteScroll={true}
        />
        :
        <LoadingComponent className='w-full h-full'/>
      }
      {
      /*
        <iframe 
            className='w-full h-[80vh] flex-grow'
            title="Accrued Interest Received v1.1.230413" 
            src="https://app.powerbi.com/reportEmbed?reportId=d5481dab-502a-4e26-9077-a2667d765326&autoAuth=true&ctid=34ef35c3-128b-4180-9d21-e764b0c7596d"
            allowFullScreen={true}
        />
      */
      }
    </DashboardPage>
  )
}

export default AccruedInterest