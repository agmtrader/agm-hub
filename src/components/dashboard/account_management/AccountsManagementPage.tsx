'use client'
import DashboardPage from '@/components/misc/DashboardPage'
import { ColumnDefinition, DataTable } from '@/components/misc/DataTable'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { ReadAccounts } from '@/utils/entities/account-management'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const AccountManagementPage = () => {

    const [accounts, setAccounts] = useState<any>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchAccounts = async () => {
            const accounts = await ReadAccounts()
            setAccounts(accounts['accounts' as keyof typeof accounts])
        }
        fetchAccounts()
    }, [])

    const columns = [
      {
        header: 'Account Number',
        accessorKey: 'accountId',
      },
      {
        header: 'Status',
        accessorKey: 'description',
      },
      {
        header: 'Master Account',
        accessorKey: 'masterAccountId',
      },
      {
        header: 'Date Opened',
        accessorKey: 'dateOpened',
      }      
    ] as ColumnDefinition<any>[]

    const rowActions = [
      {
        label: 'View',
        onClick: (row: any) => {
          router.push(`/dashboard/account-management/${row.accountId}`)
        }
      }
    ]

    if (!accounts) return <LoadingComponent className='w-full h-full'/>
    
  return (
    <DashboardPage title="Account Management" description="Manage accounts related to AGM">
      <DataTable data={accounts} infiniteScroll columns={columns} rowActions={rowActions} enableRowActions/>
    </DashboardPage>
  )
}

export default AccountManagementPage