'use client'
import DashboardPage from '@/components/misc/DashboardPage'
import { DataTable } from '@/components/misc/DataTable'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { ReadAccounts } from '@/utils/entities/account'
import { formatURL } from '@/utils/language/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const AccountsPage = () => {

    const [accounts, setAccounts] = useState<any>(null)
    const router = useRouter()
    const { lang } = useTranslationProvider()

    useEffect(() => {
        const fetchAccounts = async () => {
            const accounts = await ReadAccounts()
            setAccounts(accounts)
        }
        fetchAccounts()
    }, [])

    const columns = [
      {
        header: 'Timestamp',
        accessorKey: 'AccountID',
      },
      {
          header: 'Account Number',
          accessorKey: 'AccountNumber',
      },
      { 
          header: 'IBKR Username',
          accessorKey: 'IBKRUsername',
      },
      {
        header: 'Advisor',
        accessorKey: 'Advisor',
      },
      {
        header: 'Master Account',
        accessorKey: 'MasterAccount',
      }
    ]

    const rowActions = [
      {
        label: 'View',
        onClick: (row: any) => {
          router.push(formatURL(`/dashboard/accounts/${row.AccountNumber}`, lang))
        }
      }
    ]

    if (!accounts) return <LoadingComponent className='w-full h-full'/>
    
  return (
    <DashboardPage title="Accounts" description="Manage accounts related to AGM">
      <DataTable data={accounts} infiniteScroll columns={columns} rowActions={rowActions} enableRowActions filterColumns={['AccountNumber', 'IBKRUsername', 'Advisor', 'MasterAccount']} enableFiltering/>
    </DashboardPage>
  )
}

export default AccountsPage