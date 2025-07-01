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
import { ReadAccountByApplicationID } from '@/utils/entities/account';
import { InternalApplication } from '@/lib/entities/application';
import { Contact } from '@/lib/entities/contact';
import { Advisor } from '@/lib/entities/advisor';
import { ReadContacts } from '@/utils/entities/contact';
import { ReadAdvisors } from '@/utils/entities/advisor';
import { formatDateFromTimestamp } from '@/utils/dates';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

const ApplicationsPage = () => {

  const {lang} = useTranslationProvider()
  const [applications, setApplications] = useState<InternalApplication[] | null>(null)
  const [contacts, setContacts] = useState<Contact[] | null>(null)
  const [advisors, setAdvisors] = useState<Advisor[] | null>(null)
  const [showAll, setShowAll] = useState(false)

  const handleRowClick = (row: InternalApplication) => {
    redirect(formatURL(`/dashboard/applications/${row.id}`, lang))
  }

  async function fetchContacts() {
    try {
      const fetchedContacts = await ReadContacts()
      setContacts(fetchedContacts)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch contacts",
        variant: "destructive"
      })
    }
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

  useEffect(() => {
    fetchContacts()
    fetchAdvisors()
  }, [])

  useEffect(() => {

    async function fetchData () {
        const allApplications = await ReadApplications()
        
        if (!showAll) {
          // Filter out applications that already have IBKR accounts
          // Check all applications in parallel for better performance
          const accountChecks = await Promise.all(
            allApplications.map(app => ReadAccountByApplicationID(app.id))
          )
          
          // Filter out applications that have accounts
          const filteredApplications = allApplications.filter((app, index) => {
            const accounts = accountChecks[index]
            return !accounts || accounts.length === 0
          })
          
          setApplications(filteredApplications)
        } else {
          // Show all applications when showAll is true
          setApplications(allApplications)
        }
    }

    fetchData()

  }, [showAll])

  if (!applications || !contacts || !advisors) return <LoadingComponent className='w-full h-full' />

  const columns = [
    {
      header: 'Application ID',
      accessorKey: 'id',
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
      header: 'Created',
      accessorKey: 'created',
      cell: ({ row }: any) => {
        return formatDateFromTimestamp(row.original.created)
      }
    },
    {
      header: 'Updated',
      accessorKey: 'updated',
      cell: ({ row }: any) => {
        return formatDateFromTimestamp(row.original.updated)
      }
    },
    {
      header: 'Sent to IBKR',
      accessorKey: 'date_sent_to_ibkr',
      cell: ({ row }: any) => {
        return row.original.date_sent_to_ibkr ? (
          <div className="flex flex-col">
            <Badge variant="success">Yes</Badge>
            <span className="text-xs text-subtitle mt-1">
              {formatDateFromTimestamp(row.original.date_sent_to_ibkr)}
            </span>
          </div>
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
             accountType}
          </Badge>
        ) : '-'
      }
    }
  ] as ColumnDefinition<InternalApplication>[]

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <Checkbox
          id="showAll"
          checked={showAll}
          onCheckedChange={(checked) => setShowAll(checked as boolean)}
        />
        <Label htmlFor="showAll">Show applications with existing accounts</Label>
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
            }
          ]}
        />
      </motion.div>
    </div>
  )
}

export default ApplicationsPage