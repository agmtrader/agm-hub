'use client'
import DashboardPage from '@/components/misc/DashboardPage'
import React, { useEffect, useState } from 'react'
import CreateLead from './CreateLead'
import LeadView from './LeadView'
import EditLead from './EditLead'
import { Lead, FollowUp } from '@/lib/entities/lead'
import { DeleteLeadByID, ReadLeads } from '@/utils/entities/lead'
import { DataTable, ColumnDefinition } from '@/components/misc/DataTable'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { countries } from '@/lib/form'
import GenerateApplicationLink from './GenerateApplicationLink'

const LeadsPage = () => {

  const [leads, setLeads] = useState<Lead[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isGenerateApplicationLinkOpen, setIsGenerateApplicationLinkOpen] = useState(false)

  async function handleDeleteLead(leadID: string) {
    try {
      await DeleteLeadByID(leadID)
      handleFetchLeads()
      toast({
        title: 'Lead deleted',
        description: 'The lead has been deleted successfully',
        variant: 'success'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'The lead could not be deleted',
        variant: 'destructive'
      })
    }
  }

  async function handleFetchLeads() {
    const leads = await ReadLeads()
    const formattedLeads = leads.map(lead => ({
      ...lead,
      Contact_Date: lead.ContactDate ? lead.ContactDate : '',
      FollowUps: lead.FollowUps.map(followUp => ({
        ...followUp,
        date: followUp.date
      }))
    }))
    const sortedLeads = formattedLeads.sort((a, b) => 
      new Date(a.Contact_Date).getTime() - new Date(b.Contact_Date).getTime()
    )
    setLeads(sortedLeads)
  }

  useEffect(() => {
    handleFetchLeads()
  }, [])
  
  const columns = [
    {
      header: 'Name',
      accessorKey: 'Name',
    },
    {
      header: 'Referrer',
      accessorKey: 'Referrer',
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
      header: 'Phone Country',
      accessorKey: 'PhoneCountry',
      cell: ({ row }: any) => {
        const country = countries.find(c => c.value === row.original.PhoneCountry)
        return country ? country.label : row.original.PhoneCountry
      }
    },
    {
      header: 'Contact Date',
      accessorKey: 'Contact_Date',
    },
    {
      header: 'Next Follow-up',
      accessorKey: 'NextFollowUp',
      cell: ({ row }: any) => {
        const followUps = row.original.FollowUps as FollowUp[]
        if (!followUps?.length) return '-'
        
        // Sort follow-ups by date and get the next incomplete one
        const sortedFollowUps = [...followUps]
          .filter(followUp => !followUp.completed)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        if (sortedFollowUps.length === 0) {
          return (
            <Badge className="bg-success">
              All completed
            </Badge>
          )
        }

        const nextFollowUp = sortedFollowUps[0]
        return (
          <div className="flex items-center gap-2">
            <span>{nextFollowUp.date}</span>
            {nextFollowUp.completed && (
              <Badge variant="secondary">Completed</Badge>
            )}
          </div>
        )
      }
    },
    {
      header: 'Progress',
      accessorKey: 'FollowUpProgress',
      cell: ({ row }: any) => {
        const followUps = row.original.FollowUps as FollowUp[]
        if (!followUps?.length) return '-'
        
        const completed = followUps.filter(f => f.completed).length
        const total = followUps.length
        
        return (
          <Badge variant={completed === total ? "success" : "outline"}>
            {completed}/{total}
          </Badge>
        )
      }
    }
  ] as ColumnDefinition<Lead>[]

  return (
    <DashboardPage title="Leads" description="Manage and create new leads">
      <div className="flex flex-col gap-6">
        <div className="flex justify-end gap-2">

          <GenerateApplicationLink />
          <CreateLead onSuccess={handleFetchLeads} />

        </div>
        <div className="w-full">
          <DataTable 
            data={leads} 
            columns={columns} 
            filterColumns={['Name', 'Email']} 
            enableFiltering
            enableRowActions
            rowActions={[
              {
                label: 'View',
                onClick: (row: Lead) => {
                  setSelectedLead(row)
                  setIsViewDialogOpen(true)
                }
              },
              {
                label: 'Edit',
                onClick: (row: Lead) => {
                  setSelectedLead(row)
                  setIsEditDialogOpen(true)
                }
              },
              {
                label: 'Delete',
                onClick: (row: any) => {
                  handleDeleteLead(row.LeadID)
                },
              }
            ]}
          />
        </div>
      </div>

      <LeadView lead={selectedLead} isOpen={isViewDialogOpen} onOpenChange={setIsViewDialogOpen} />
      <EditLead 
        isDialogOpen={isEditDialogOpen} 
        setIsDialogOpen={setIsEditDialogOpen} 
        lead={selectedLead}
        onSuccess={handleFetchLeads}
      />

    </DashboardPage>
  )
}

export default LeadsPage