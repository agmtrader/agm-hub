'use client'
import React, { useEffect, useState } from 'react'
import DashboardPage from '@/components/misc/DashboardPage'
import { DataTable, ColumnDefinition } from '@/components/misc/DataTable'
import { EmailChange } from '@/lib/tools/email_change'
import { ReadEmailChanges } from '@/utils/tools/email_change'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { toast } from '@/hooks/use-toast'

const EmailChangePage = () => {

  const [emailChanges, setEmailChanges] = useState<EmailChange[] | null>(null)

  async function handleReadEmailChanges() {
    try {
      const data = await ReadEmailChanges()
      setEmailChanges(data)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch email changes',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    handleReadEmailChanges()
  }, [])

  const columns = [
    {
      header: 'IBKR Account',
      accessorKey: 'ibkr_account_number',
    },
    {
      header: 'Current Email',
      accessorKey: 'email',
    },
    {
      header: 'Temporal Email',
      accessorKey: 'temporal_email',
    },
    {
      header: 'Title',
      accessorKey: 'Title',
    },
    {
      header: 'Sheet Name',
      accessorKey: 'sheet_name',
    },
    {
      header: 'IBKR Username',
      accessorKey: 'ibkr_username',
    },
  ] as ColumnDefinition<EmailChange>[]

  if (!emailChanges) return (
    <LoadingComponent className="h-full w-full" />
  )

  return (
    <DataTable
        data={emailChanges}
        columns={columns}
        enableFiltering
        infiniteScroll
    />
  )
}

export default EmailChangePage