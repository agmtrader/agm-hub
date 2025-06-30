"use client"
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DataTable } from '@/components/misc/DataTable';
import { itemVariants } from '@/lib/anims';
import { Checkbox } from '@/components/ui/checkbox';
import { ReadAccounts } from '@/utils/entities/account';
import LoadingComponent from '@/components/misc/LoadingComponent';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { redirect } from 'next/navigation';

const AccountsPage = () => {

  const {lang} = useTranslationProvider()
  const [accounts, setAccounts] = useState<any[] | null>(null)
  const [showAll, setShowAll] = useState(false)

  const handleRowClick = (row: any) => {
    toast({
      title: 'Not implemented for now',
      description: 'This feature is not implemented for now',
      variant: 'destructive',
    })
    return
    //redirect(formatURL(`/dashboard/accounts/${row.ibkr_account_number}`, lang))
  }

  useEffect(() => {

    async function fetchData () {

        const accounts = await ReadAccounts()
        setAccounts(accounts)
    }

    fetchData()

  }, [showAll])

  if (!accounts) return <LoadingComponent className='w-full h-full' />

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <Checkbox
          id="showAll"
          checked={showAll}
          onCheckedChange={(checked) => setShowAll(checked as boolean)}
        />
        <Label htmlFor="showAll">Show all accounts</Label>
      </div>
      <motion.div variants={itemVariants} className="w-full">
        <DataTable 
          data={accounts}
          infiniteScroll
          enableRowActions
          rowActions={[
            {
              label: 'View',
              onClick: (row: any) => handleRowClick(row)
            }
          ]}
        />
      </motion.div>
    </div>
  )
}

export default AccountsPage