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

const AccountsPage = () => {

  const {lang} = useTranslationProvider()
  const [accounts, setAccounts] = useState<Account[] | null>(null)
  const [clients, setClients] = useState<any[] | null>(null)

  const [navReport, setNavReport] = useState<any[] | null>(null)

  useEffect(() => {

    async function fetchData () {

      try {
        const [accounts, clients, navReport] = await Promise.all([
          ReadAccounts(),
          ReadClientsReport(),
          ReadNavReport()
        ])
        setAccounts(accounts.sort((a, b) => b.created.localeCompare(a.created)))
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

  const columns = [
    {
      header: 'Master Account',
      accessorKey: 'master_account_id',
      cell: ({ row }: any) => {
        const client = clients.find(client => client['Account ID'] === row.original.ibkr_account_number)
        return client ? client['sheet_name'] : '-'
      }
    },
    {
      header: 'Account Number',
      accessorKey: 'ibkr_account_number',
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
  ] as ColumnDefinition<Account>[]

  const rowActions: any[] = [
    {
      label: 'View',
      onClick: (row: Account) => {
        redirect(formatURL(`/dashboard/accounts/${row.id}`, lang))
      }
    }
  ]

  return (
    <motion.div variants={itemVariants} className="w-full">
      <DataTable 
        data={accounts}
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