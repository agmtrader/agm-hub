'use client'
import React, { useEffect, useState } from 'react'
import CreateLead from './CreateLead'
import LeadDialog from './LeadDialog' 
import { Lead, FollowUp } from '@/lib/entities/lead'
import { ReadLeads } from '@/utils/entities/lead'
import { ColumnDefinition } from '@/components/misc/DataTable'
import { toast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { formatDateFromTimestamp, getDateObjectFromTimestamp } from '@/utils/dates'
import ContactsLeadsView from './ContactsLeadsView'
import FollowUpsLeadsView from './FollowUpsLeadsView'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { User } from 'next-auth'
import { ReadUsers } from '@/utils/entities/user'

const LeadsPage = () => {

  const [allLeads, setAllLeads] = useState<Lead[] | null>(null)
  const [leads, setLeads] = useState<Lead[] | null>(null)
  const [followUps, setFollowUps] = useState<FollowUp[] | null>(null)
  const [users, setUsers] = useState<User[] | null>(null)

  const [showClosed, setShowClosed] = useState(false)
  
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  async function handleFetchLeads() {

    const leadsWithFollowUps = await ReadLeads()

    const getTimeSafe = (ts: string) => {
      try {
        return getDateObjectFromTimestamp(ts).getTime()
      } catch {
        return 0
      }
    }

    const sortedLeads = leadsWithFollowUps.leads.sort(
      (a, b) => getTimeSafe(b.contact_date) - getTimeSafe(a.contact_date)
    )

    setAllLeads(sortedLeads)

    const filteredLeads = showClosed ? sortedLeads : sortedLeads.filter(l => l.closed === null)

    setLeads(filteredLeads)
    setFollowUps(leadsWithFollowUps.follow_ups)
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

  async function handleRefreshData() {
    await fetchUsers()
    await handleFetchLeads()
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    handleFetchLeads()
  }, [])

  // Re-filter leads whenever the showClosed toggle changes or when allLeads updates
  useEffect(() => {
    if (!allLeads) return
    const filtered = showClosed ? allLeads : allLeads.filter(l => l.closed === null)
    setLeads(filtered)
  }, [allLeads, showClosed])

  if (!leads || !followUps || !users) return <LoadingComponent className='w-full h-full' />
  
  const columns = [
    {
      header: 'Contact',
      accessorKey: 'contact_id',
      cell: ({ row }: any) => {
        const user = users.find(u => u.id === row.original.contact_id)
        return user ? user.name : row.original.contact_id
      }
    },
    {
      header: 'Referrer',
      accessorKey: 'referrer_id',
      cell: ({ row }: any) => {
        const user = users.find(u => u.id === row.original.referrer_id)
        return user ? user.name : row.original.referrer_id
      }
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
      header: 'Sent?',
      accessorKey: 'sent',
      cell: ({ row }: any) => {
        return row.original.sent ? (
          <Badge variant="success">Sent</Badge>
        ) : (
          <Badge variant="outline">Not Sent</Badge>
        )
      }
    },
    {
      header: 'Closed?',
      accessorKey: 'closed',
      cell: ({ row }: any) => {
        return row.original.closed ? (
          <Badge variant="success">Closed</Badge>
        ) : (
          <Badge variant="outline">Open</Badge>
        )
      }
    },
  ] as ColumnDefinition<Lead>[]

  return (
    <div>
      <div className="flex flex-col gap-6">
        {/* Filters */}
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="showClosed"
            checked={showClosed}
            onCheckedChange={(checked) => setShowClosed(checked as boolean)}
          />
          <Label htmlFor="showClosed">Show closed leads</Label>
        </div>

        <Tabs defaultValue="contacts" className="w-full">
          <div className="flex justify-between gap-2">
          <TabsList>
            <TabsTrigger value="contacts">Contacts View</TabsTrigger>
            <TabsTrigger value="followups">Follow-ups View</TabsTrigger>
          </TabsList>
          <CreateLead users={users} refreshLeads={handleRefreshData} refreshUsers={fetchUsers} />
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
              users={users}
            />
          </TabsContent>
        </Tabs>
      </div>

      <LeadDialog
        lead={selectedLead} 
        users={users}
        followUps={followUps.filter(f => f.lead_id === selectedLead?.id)}
        isOpen={isViewDialogOpen} 
        onOpenChange={setIsViewDialogOpen} 
        onSuccess={handleFetchLeads}
      />
    </div>
  )
}

export default LeadsPage