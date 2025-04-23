'use client'
import DashboardPage from '@/components/misc/DashboardPage'
import React, { useEffect, useState } from 'react'
import CreateLead from './CreateLead'
import LeadView from './LeadView'
import EditLead from './EditLead'
import { Lead, FollowUp } from '@/lib/entities/lead'
import { DeleteLeadByID, ReadLeads } from '@/utils/entities/lead'
import { ColumnDefinition } from '@/components/misc/DataTable'
import { toast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { formatDateFromTimestamp } from '@/utils/dates'
import { Contact } from '@/lib/entities/contact'
import { ReadContacts } from '@/utils/entities/contact'
import ContactsLeadsView from './ContactsLeadsView'
import FollowUpsLeadsView from './FollowUpsLeadsView'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const LeadsPage = () => {

  const [leads, setLeads] = useState<Lead[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

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

  async function handleRefreshData() {
    await fetchContacts()
    await handleFetchLeads()
  }

  useEffect(() => {
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
        <Tabs defaultValue="contacts" className="w-full">
          <div className="flex justify-between gap-2">
          <TabsList>
            <TabsTrigger value="contacts">Contacts View</TabsTrigger>
            <TabsTrigger value="followups">Follow-ups View</TabsTrigger>
          </TabsList>
          <CreateLead contacts={contacts} refreshLeads={handleRefreshData} refreshContacts={fetchContacts} />
          </div>
          <TabsContent value="contacts">
            <ContactsLeadsView
              leads={leads} 
              columns={columns} 
              setSelectedLead={setSelectedLead} 
              setIsViewDialogOpen={setIsViewDialogOpen} 
              setIsEditDialogOpen={setIsEditDialogOpen} 
              handleDeleteLead={handleDeleteLead} 
            />
          </TabsContent>
          <TabsContent value="followups">
            <FollowUpsLeadsView
              leads={leads}
              contacts={contacts}
            />
          </TabsContent>
        </Tabs>
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
        contacts={contacts}
        onSuccess={handleFetchLeads}
      />
    </DashboardPage>
  )
}

export default LeadsPage