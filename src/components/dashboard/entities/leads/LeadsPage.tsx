'use client'
import DashboardPage from '@/components/misc/DashboardPage'
import React, { useEffect, useState } from 'react'
import CreateLead from './CreateLead'
import LeadView from './LeadView'
import { Lead, FollowUp } from '@/lib/entities/lead'
import { DeleteLeadByID, ReadLeads, ReadFollowUpsByLeadID } from '@/utils/entities/lead'
import { ColumnDefinition } from '@/components/misc/DataTable'
import { toast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { formatDateFromTimestamp, getDateObjectFromTimestamp } from '@/utils/dates'
import { Contact } from '@/lib/entities/contact'
import { ReadContacts } from '@/utils/entities/contact'
import ContactsLeadsView from './ContactsLeadsView'
import FollowUpsLeadsView from './FollowUpsLeadsView'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LoadingComponent from '@/components/misc/LoadingComponent'

const LeadsPage = () => {

  const [leads, setLeads] = useState<Lead[] | null>(null)
  const [followUps, setFollowUps] = useState<FollowUp[] | null>(null)
  const [contacts, setContacts] = useState<Contact[] | null>(null)
  
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  async function handleFetchLeads() {

    const leadsWithFollowUps = await ReadLeads()

    const getTimeSafe = (ts: string) => {
      try {
        return getDateObjectFromTimestamp(ts).getTime()
      } catch {
        return 0 // Fallback for malformed timestamps
      }
    }

    setLeads(
      leadsWithFollowUps.leads.sort(
        (a, b) => getTimeSafe(b.contact_date) - getTimeSafe(a.contact_date)
      )
    )
    setFollowUps(leadsWithFollowUps.follow_ups)
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

  console.log(leads)

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

  if (!leads || !followUps || !contacts) return <LoadingComponent className='w-full h-full' />
  
  const columns = [
    {
      header: 'Contact',
      accessorKey: 'contact_id',
      cell: ({ row }: any) => {
        const contact = contacts.find(c => c.id === row.original.contact_id)
        return contact ? contact.name : row.original.contact_id
      }
    },
    {
      header: 'Referrer',
      accessorKey: 'referrer_id',
      cell: ({ row }: any) => {
        const contact = contacts.find(c => c.id === row.original.referrer_id)
        return contact ? contact.name : row.original.referrer_id
      }
    },
    {
      header: 'Status',
      accessorKey: 'status',
    },
    {
      header: 'Contact Date',
      accessorKey: 'contact_date',
      cell: ({ row }: any) => {
        return formatDateFromTimestamp(row.original.contact_date)
      }
    },
    {
      header: 'Next Follow-up',
      accessorKey: 'NextFollowUp',
      cell: ({ row }: any) => {
        const filteredFollowUps = followUps.filter(f => f.lead_id === row.original.id)
        if (!filteredFollowUps?.length) return '-'
        
        const sortedFollowUps = [...filteredFollowUps]
          .filter(followUp => !followUp.completed)
          .sort((a, b) => (
            (a.date instanceof Date ? a.date : getDateObjectFromTimestamp(a.date as string)).getTime() -
            (b.date instanceof Date ? b.date : getDateObjectFromTimestamp(b.date as string)).getTime()
          ))

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
            <span>{formatDateFromTimestamp(nextFollowUp.date.toString())}</span>
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
        const filteredFollowUps = followUps.filter(f => f.lead_id === row.original.id)
        if (!filteredFollowUps?.length) return '-'
        
        const completed = filteredFollowUps.filter(f => f.completed).length
        const total = filteredFollowUps.length
        
        return (
          <Badge variant={completed === total ? "success" : "outline"}>
            {completed}/{total}
          </Badge>
        )
      }
    },
    {
      header: 'Application',
      accessorKey: 'application_id',
      cell: ({ row }: any) => {
        if (!row.original.application_id) return '-'
        return row.original.application_id ? 'Yes' : 'No'
      }
    },
    {
      header: 'Application Date',
      accessorKey: 'application_date',
      cell: ({ row }: any) => {
        if (!row.original.application_date) return '-'
        return formatDateFromTimestamp(row.original.application_date)
      }
    }
  ] as ColumnDefinition<Lead>[]

  return (
    <div>
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
            />
          </TabsContent>
          <TabsContent value="followups">
            <FollowUpsLeadsView
              leads={leads}
              followUps={followUps}
              contacts={contacts}
            />
          </TabsContent>
        </Tabs>
      </div>

      <LeadView
        lead={selectedLead} 
        contacts={contacts}
        followUps={followUps.filter(f => f.lead_id === selectedLead?.id)}
        isOpen={isViewDialogOpen} 
        onOpenChange={setIsViewDialogOpen} 
        onSuccess={handleFetchLeads}
      />
    </div>
  )
}

export default LeadsPage