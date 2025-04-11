'use client'
import DashboardPage from '@/components/misc/DashboardPage'
import React, { useEffect, useState } from 'react'
import LeadForm from './LeadForm'
import { Lead } from '@/lib/entities/lead'
import { ReadLeads } from '@/utils/entities/lead'
import { formatDateFromTimestamp } from '@/utils/dates'
import { DataTable, ColumnDefinition } from '@/components/misc/DataTable'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  async function handleFetchLeads() {
    const leads = await ReadLeads()
    const formattedLeads = leads.map(lead => ({
      ...lead,
      Contact_Date: lead.ContactDate ? formatDateFromTimestamp(lead.ContactDate) : '',
      FollowupDate: lead.FollowupDate ? formatDateFromTimestamp(lead.FollowupDate) : ''
    }))
    setLeads(formattedLeads)
  }

  useEffect(() => {
    handleFetchLeads()
  }, [])

  const columns = [
    {
      header: 'Completed',
      accessorKey: 'Completed',
    },
    {
      header: 'Name',
      accessorKey: 'Name',
    },
    {
      header: 'Email',
      accessorKey: 'Email',
    },
    {
      header: 'Phone',
      accessorKey: 'Phone',
    },
    {
      header: 'Contact Date',
      accessorKey: 'Contact_Date',
    },
    {
      header: 'Followup Date',
      accessorKey: 'FollowupDate',
    }
  ] as ColumnDefinition<Lead>[]

  return (
    <DashboardPage title="Leads" description="Manage and create new leads">
      <div className="flex flex-col gap-6">
        <div className="flex justify-end">
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-primary text-background hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Lead
          </Button>
        </div>
        <div className="w-full">
          <DataTable data={leads} columns={columns} filterColumns={['Name', 'Email', 'Phone', 'Contact_Date']} enableFiltering/>
        </div>
      </div>

      <LeadForm isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} onSuccess={handleFetchLeads} />

    </DashboardPage>
  )
}

export default LeadsPage