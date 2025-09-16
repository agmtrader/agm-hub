"use client"
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DataTable, ColumnDefinition } from '@/components/misc/DataTable';
import { itemVariants } from '@/lib/anims';
import { ReadAccounts } from '@/utils/entities/account';
import LoadingComponent from '@/components/misc/LoadingComponent';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { toast } from '@/hooks/use-toast';
import { redirect } from 'next/navigation';
import { formatURL } from '@/utils/language/lang';
import { Account } from '@/lib/entities/account';
import { formatDateFromTimestamp } from '@/utils/dates';
import { Badge } from '@/components/ui/badge';
import { ReadClientsReport, ReadNavReport } from '@/utils/tools/reporting';

type ExtendedAccount = Account & { 
  alias: string
  status: string
  nav: string
  master_account_id: string
}

const AccountsPage = () => {

  const {lang} = useTranslationProvider()
  const [accounts, setAccounts] = useState<ExtendedAccount[] | null>(null)
  const [clients, setClients] = useState<any[] | null>(null)

  const [navReport, setNavReport] = useState<any[] | null>(null)

  const [hideCompleted, setHideCompleted] = useState(false)

  useEffect(() => {

    async function fetchData () {

      try {
        const [accounts, clients, navReport] = await Promise.all([
          ReadAccounts(),
          ReadClientsReport(),
          ReadNavReport()
        ])
        // Enhance accounts with additional derived fields for easier filtering/searching
        const enhancedAccounts = accounts.map(acc => {
          const client = clients.find((c: any) => c["Account ID"] === acc.ibkr_account_number)
          return {
            ...acc,
            alias: client ? client["Alias"] : "-",
            status: client ? client["Status"] : "-",
            nav: navReport ? navReport.find((n: any) => n["ClientAccountID"] === acc.ibkr_account_number) ? navReport.find((n: any) => n["ClientAccountID"] === acc.ibkr_account_number)["Total"] : "-" : "-",
            master_account_id: client ? client["sheet_name"] : "-",
          }
        })
        setAccounts(enhancedAccounts.sort((a, b) => b.created.localeCompare(a.created)))
        setClients(clients)
        setNavReport(navReport)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch accounts",
          variant: "destructive"
        })
      }
    }

    fetchData()

  }, [])

  if (!accounts || !clients || !navReport) return <LoadingComponent className='w-full h-full' />

  const filteredAccounts = hideCompleted ?
    accounts.filter(acc => !(acc.alias !== '-' && acc.status !== '-' && acc.master_account_id)) :
    accounts

  const columns = [
    {
      header: 'Alias',
      accessorKey: 'alias',
      cell: ({ row }: any) => {
        return row.original.alias || '-'
      }
    },
    {
      header: 'Master Account',
      accessorKey: 'master_account',
      enableSorting: false,
      cell: ({ row }: any) => {
        return row.original.master_account || '-'
      }
    },
    {
      header: 'Account Number',
      accessorKey: 'ibkr_account_number',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }: any) => {
        return row.original.status || '-'
      }
    },
    {
      header: 'NAV',
      accessorKey: 'nav',
      cell: ({ row }: any) => {
        return row.original.nav || '-'
      }
    },
    {
      header: 'IBKR Username',
      accessorKey: 'ibkr_username',
      cell: ({ row }: any) => {
        return row.original.ibkr_username || '-'
      }
    },
    {
      header: 'IBKR Password',
      accessorKey: 'ibkr_password',
      cell: ({ row }: any) => {
        return row.original.ibkr_password || '-'
      }
    },
    {
      header: 'Temporal Email',
      accessorKey: 'temporal_email',
      cell: ({ row }: any) => {
        return row.original.temporal_email || '-'
      }
    },
    {
      header: 'Temporal Password',
      accessorKey: 'temporal_password',
      cell: ({ row }: any) => {
        return row.original.temporal_password || '-'
      }
    },
    {
      header: 'Fee Template',
      accessorKey: 'fee_template',
      cell: ({ row }: any) => {
        return row.original.fee_template ? (
          <Badge variant="success">Yes</Badge>
        ) : (
          <Badge variant="outline">No</Badge>
        )
      }
    },
    {
      header: 'Created',
      accessorKey: 'created',
      cell: ({ row }: any) => {
        return row.original.created ? formatDateFromTimestamp(row.original.created) : '-'
      }
    }
  ] as ColumnDefinition<ExtendedAccount>[]

  const rowActions: any[] = [
    {
      label: 'View',
      onClick: (row: ExtendedAccount) => {
        redirect(formatURL(`/dashboard/accounts/${row.id}`, lang))
      }
    }
  ]

  return (
    <motion.div variants={itemVariants} className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="hideCompleted"
          checked={hideCompleted}
          onChange={(e) => setHideCompleted(e.target.checked)}
        />
        <label htmlFor="hideCompleted" className="text-sm">Hide accounts with Alias, Status and Master Account</label>
      </div>
      <DataTable 
        data={filteredAccounts}
        columns={columns}
        infiniteScroll
        enableFiltering
        enableRowActions
        rowActions={rowActions}
      />
    </motion.div>
  )
}

export default AccountsPage