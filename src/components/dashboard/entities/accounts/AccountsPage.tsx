"use client"
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DataTable, ColumnDefinition } from '@/components/misc/DataTable';
import { itemVariants } from '@/lib/anims';
import { Checkbox } from '@/components/ui/checkbox';
import { ReadAccounts } from '@/utils/entities/account';
import LoadingComponent from '@/components/misc/LoadingComponent';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { redirect } from 'next/navigation';
import { formatURL } from '@/utils/language/lang';
import { Account } from '@/lib/entities/account';
import { InternalApplication } from '@/lib/entities/application';
import { ReadApplications } from '@/utils/entities/application';
import { formatDateFromTimestamp } from '@/utils/dates';
import { Badge } from '@/components/ui/badge';

const AccountsPage = () => {

  const {lang} = useTranslationProvider()
  const [accounts, setAccounts] = useState<Account[] | null>(null)
  const [applications, setApplications] = useState<InternalApplication[] | null>(null)

  const handleRowClick = (row: Account) => {
    redirect(formatURL(`/dashboard/accounts/${row.id}`, lang))
  }

  async function fetchApplications() {
    try {
      const fetchedApplications = await ReadApplications()
      setApplications(fetchedApplications)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {

    async function fetchData () {

      try {
        const accounts = await ReadAccounts()
        setAccounts(accounts)
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
  
  console.log(accounts)

  if (!accounts || !applications) return <LoadingComponent className='w-full h-full' />

  const columns = [
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
      header: 'Has Application',
      accessorKey: 'application_id',
      cell: ({ row }: any) => {
        const application = applications.find(app => app.id === row.original.application_id)
        return application ? (
          <Badge variant="success">Yes</Badge>
        ) : (
          <Badge variant="outline">No</Badge>
        )
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
    },
    {
      header: 'Updated',
      accessorKey: 'updated',
      cell: ({ row }: any) => {
        return row.original.updated ? formatDateFromTimestamp(row.original.updated) : '-'
      }
    }
  ] as ColumnDefinition<Account>[]

  return (
    <div>
      <motion.div variants={itemVariants} className="w-full">
        <DataTable 
          data={accounts}
          columns={columns}
          infiniteScroll
          enableFiltering
          enableRowActions
          rowActions={[
            {
              label: 'View',
              onClick: (row: Account) => handleRowClick(row)
            },
            {
              label: 'View Application',
              onClick: (row: Account) => {
                if (row.application_id) {
                  redirect(formatURL(`/dashboard/applications/${row.application_id}`, lang))
                }
              },
            }
          ]}
        />
      </motion.div>
    </div>
  )
}

export default AccountsPage