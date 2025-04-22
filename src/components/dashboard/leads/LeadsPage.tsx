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
import { formatDateFromTimestamp } from '@/utils/dates'
import { Contact } from '@/lib/entities/contact'
import { ReadContacts } from '@/utils/entities/contact'
import GenerateApplicationLink from './GenerateApplicationLink'

const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
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
    
    if (selectedLead) {
      const updatedSelectedLead = sortedLeads.find(lead => lead.LeadID === selectedLead.LeadID)
      if (updatedSelectedLead) {
        setSelectedLead(updatedSelectedLead)
      }
    }
  }

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const fetchedContacts = await ReadContacts()
        setContacts(fetchedContacts)
      } catch (error) {
        console.error('Failed to fetch contacts:', error)
        toast({
          title: "Error",
          description: "Failed to fetch contacts",
          variant: "destructive"
        })
      }
    }
    fetchContacts()
  }, [])

  useEffect(() => {
    handleFetchLeads()
  }, [])
  
  const columns = [
    {
      header: 'Contact',
      accessorKey: 'ContactID',
      cell: ({ row }: any) => {
        const contact = contacts.find(c => c.ContactID === row.original.ContactID)
        return contact ? contact.ContactName : row.original.ContactID
      }
    },
    {
      header: 'Referrer',
      accessorKey: 'Referrer',
      cell: ({ row }: any) => {
        const contact = contacts.find(c => c.ContactID === row.original.ReferrerID)
        return contact ? contact.ContactName : row.original.ReferrerID
      }
    },
    {
      header: 'Status',
      accessorKey: 'Status',
    },
    {
      header: 'Contact Date',
      accessorKey: 'Contact_Date',
      cell: ({ row }: any) => {
        return formatDateFromTimestamp(row.original.Contact_Date)
      }
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
            <span>{formatDateFromTimestamp(nextFollowUp.date)}</span>
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
          <CreateLead onSuccess={handleFetchLeads} />
        </div>
        <div className="w-full">
          <DataTable 
            data={leads} 
            columns={columns} 
            filterColumns={['ContactID']} 
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

      <LeadView 
        lead={selectedLead} 
        isOpen={isViewDialogOpen} 
        onOpenChange={setIsViewDialogOpen} 
        onSuccess={handleFetchLeads}
      />
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