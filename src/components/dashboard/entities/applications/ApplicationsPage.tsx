"use client"
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DataTable, ColumnDefinition } from '@/components/misc/DataTable';
import { itemVariants } from '@/lib/anims';
import { Checkbox } from '@/components/ui/checkbox';
import LoadingComponent from '@/components/misc/LoadingComponent';
import { redirect } from 'next/navigation';
import { formatURL } from '@/utils/language/lang';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { Label } from '@/components/ui/label';
import { ReadApplications } from '@/utils/entities/application';
import { ReadAccounts } from '@/utils/entities/account';
import { InternalApplication } from '@/lib/entities/application';
import { Account } from '@/lib/entities/account';
import { Advisor } from '@/lib/entities/advisor';
import { ReadAdvisors } from '@/utils/entities/advisor';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { formatDateFromTimestamp } from '@/utils/dates';
import { ReadUsers } from '@/utils/entities/user';
import { User } from 'next-auth';

const ApplicationsPage = () => {

  const {lang} = useTranslationProvider()
  const [applications, setApplications] = useState<InternalApplication[] | null>(null)
  const [allApplications, setAllApplications] = useState<InternalApplication[] | null>(null)
  const [accounts, setAccounts] = useState<Account[] | null>(null)
  const [advisors, setAdvisors] = useState<Advisor[] | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [users, setUsers] = useState<User[] | null>(null)

  const handleRowClick = (row: InternalApplication) => {
    redirect(formatURL(`/dashboard/applications/${row.id}`, lang))
  }

  async function fetchAdvisors() {
    try {
      const fetchedAdvisors = await ReadAdvisors()
      setAdvisors(fetchedAdvisors)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch advisors",
        variant: "destructive"
      })
    }
  }

  async function fetchAccounts() {
    try {
      const fetchedAccounts = await ReadAccounts()
      setAccounts(fetchedAccounts)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch accounts",
        variant: "destructive"
      })
    }
  }

  async function fetchApplications() {
    try {
      const fetchedApplications = await ReadApplications()
      setAllApplications(fetchedApplications.sort((a, b) => b.created.localeCompare(a.created)))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive"
      })
    }
  }

  async function fetchUsers() {
    try {
      const fetchedUsers = await ReadUsers()
      setUsers(fetchedUsers)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      })
    }
  }

  // Fetch data once on component mount
  useEffect(() => {
    fetchAdvisors()
    fetchAccounts()
    fetchApplications()
    fetchUsers()
  }, [])

  // Filter applications based on showAll and showIncomplete states
  useEffect(() => {
    if (!allApplications || !accounts) return

    let filteredApplications = allApplications

    // First filter by accounts (showAll)
    if (!showAll) {
      // Filter out applications that already have IBKR accounts
      filteredApplications = filteredApplications.filter(app => {
        // Check if this application has any associated accounts
        return !accounts.some(account => account.application_id === app.id)
      })
    }

    // Sort by created date (newest first)
    filteredApplications = filteredApplications.sort((a, b) => {
      if (!a.created && !b.created) return 0
      if (!a.created) return 1
      if (!b.created) return -1
      return b.created.localeCompare(a.created)
    })

    setApplications(filteredApplications)
  }, [allApplications, accounts, showAll])

  if (!applications || !advisors) return <LoadingComponent className='w-full h-full' />

  const getApplicationTitle = (application: InternalApplication) => {
    const customer = application.application?.customer
    if (!customer) return '-'

    switch (customer.type) {
      case 'INDIVIDUAL': {
        const holder = customer.accountHolder?.accountHolderDetails?.[0]
        if (!holder) return '-'
        const first = holder.name?.first ?? ''
        const last = holder.name?.last ?? ''
        return `${first} ${last}`.trim() || '-'
      }
      case 'JOINT': {
        const firstHolder = customer.jointHolders?.firstHolderDetails?.[0]?.name
        const secondHolder = customer.jointHolders?.secondHolderDetails?.[0]?.name
        if (firstHolder && secondHolder) {
          return `${firstHolder.first} ${firstHolder.last} & ${secondHolder.first} ${secondHolder.last}`
        }
        if (firstHolder) {
          return `${firstHolder.first} ${firstHolder.last}`
        }
        if (secondHolder) {
          return `${secondHolder.first} ${secondHolder.last}`
        }
        return '-'
      }
      case 'ORG': {
        const orgName = customer.organization?.identifications?.[0]?.name
        return orgName ?? '-'
      }
      default:
        return '-'
    }
  }

  const columns = [
    {
      header: 'Title',
      accessorFn: (row: InternalApplication) => getApplicationTitle(row),
      cell: ({ row }: any) => getApplicationTitle(row.original)
    },
    {
      header: 'Advisor',
      accessorKey: 'advisor_id',
      cell: ({ row }: any) => {
        if (!row.original.advisor_id) return '-'
        const advisor = advisors.find(a => a.id === row.original.advisor_id)
        return advisor ? advisor.name : row.original.advisor_id
      }
    },
    {
      header: 'Master Account',
      accessorKey: 'master_account_id',
      cell: ({ row }: any) => {
        if (!row.original.master_account_id) return '-'
        return row.original.master_account_id === 'br' ? 'Broker' : 
               row.original.master_account_id === 'ad' ? 'Advisor' : 
               row.original.master_account_id
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
      header: 'Has Lead',
      accessorKey: 'lead_id',
      cell: ({ row }: any) => {
        return row.original.lead_id ? (
          <Badge variant="success">Yes</Badge>
        ) : (
          <Badge variant="outline">No</Badge>
        )
      }
    },
    {
      header: 'Has IBKR Account?',
      accessorKey: 'has_ibkr_account',
      cell: ({ row }: any) => {
        // Check if this application has any associated accounts
        const hasAccount = accounts?.some(account => account.application_id === row.original.id)
        return hasAccount ? (
          <Badge variant="success">Yes</Badge>
        ) : (
          <Badge variant="outline">No</Badge>
        )
      }
    },
    {
      header: 'Account Type',
      accessorKey: 'account_type',
      cell: ({ row }: any) => {
        const accountType = row.original.application?.customer?.type
        return accountType ? (
          <Badge variant="outline">
            {accountType === 'INDIVIDUAL' ? 'Individual' : 
             accountType === 'JOINT' ? 'Joint' : 
             accountType === 'ORG' ? 'Institutional' :
             accountType}
          </Badge>
        ) : '-'
      }
    }
  ] as ColumnDefinition<InternalApplication>[]

  console.log(applications)

  return (
    <div>
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="showAll"
            checked={showAll}
            onCheckedChange={(checked) => setShowAll(checked as boolean)}
          />
          <Label htmlFor="showAll">Show applications with existing accounts</Label>
        </div>
      </div>
      <motion.div variants={itemVariants} className="w-full">
        <DataTable 
          data={applications}
          columns={columns}
          infiniteScroll
          enableFiltering
          enableRowActions
          rowActions={[
            {
              label: 'View',
              onClick: (row: InternalApplication) => handleRowClick(row)
            },
            {
              label: 'View User',
              onClick: (row: InternalApplication) => {
                const user = users?.find(user => user.id === row.user_id)
                if (user) {
                  redirect(formatURL(`/dashboard/users/${user.id}`, lang))
                }
              }
            },
            {
              label: 'View Account',
              onClick: (row: InternalApplication) => {
                const associatedAccount = accounts?.find(account => account.application_id === row.id)
                if (associatedAccount) {
                  redirect(formatURL(`/dashboard/accounts/${associatedAccount.id}`, lang))
                } else {
                  toast({
                    title: "No Account Found",
                    description: "This application does not have an associated IBKR account yet.",
                    variant: "destructive"
                  })
                }
              }
            }
          ]}
        />
      </motion.div>
    </div>
  )
}

export default ApplicationsPage