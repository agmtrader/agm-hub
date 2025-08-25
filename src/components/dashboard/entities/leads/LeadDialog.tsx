'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { FollowUp, Lead } from '@/lib/entities/lead'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card } from '@/components/ui/card'
import { formatDateFromTimestamp } from '@/utils/dates'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import { Checkbox } from '@/components/ui/checkbox'
import GenerateApplicationLink from './GenerateApplicationLink'
import UserCard from '../users/UserCard'
import { UpdateLeadFollowUpByID, DeleteLeadFollowUpByID, ReadLeadByID } from '@/utils/entities/lead'
import { ReadApplicationByLeadID } from '@/utils/entities/application'
import { InternalApplication } from '@/lib/entities/application'
import { formatURL } from '@/utils/language/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import AddFollowUp from './AddFollowUp'
import { Trash2 } from 'lucide-react'
import { User } from 'next-auth'
import { ReadUserByID } from '@/utils/entities/user'
import LoadingComponent from '@/components/misc/LoadingComponent'

interface Props {
  leadID: string | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const LeadDialog = ({ leadID, isOpen, onOpenChange, onSuccess }: Props) => {

  const [lead, setLead] = useState<Lead | null>(null)
  const [followUps, setFollowUps] = useState<FollowUp[]>([])
  const [contact, setContact] = useState<User | null>(null)
  const [referrer, setReferrer] = useState<User | null>(null)

  useEffect(() => {
    const fetchLead = async () => {
      if (!leadID) return
      try { 
        // Fetch lead and follow-ups
        const leadWithFollowUps = await ReadLeadByID(leadID)
        console.log(leadWithFollowUps)
        if (!leadWithFollowUps.leads) throw new Error('Leads not found')
        if (!leadWithFollowUps.follow_ups) throw new Error('Follow-ups not found')
        setLead(leadWithFollowUps.leads[0])
        setFollowUps(leadWithFollowUps.follow_ups)

        // Fetch contact and referrer
        const [contact, referrer] = await Promise.all([ReadUserByID(leadWithFollowUps.leads[0].contact_id), ReadUserByID(leadWithFollowUps.leads[0].referrer_id)])
        if (!contact) throw new Error('Contact not found')
        if (!referrer) throw new Error('Referrer not found')
        setContact(contact)
        setReferrer(referrer)
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to fetch lead',
          variant: 'destructive'
        })
      }
    }
    fetchLead()
  }, [leadID])

  async function handleCompleteFollowUp(followUp: FollowUp) {
    if (!lead) return

    const updatedFollowUp: FollowUp = {
      ...followUp,
      completed: !followUp.completed,
    }

    try {
      await UpdateLeadFollowUpByID(lead.id, followUp.id, updatedFollowUp)
      onSuccess?.()

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete follow-up',
        variant: 'destructive'
      })
    }
  }

  async function handleDeleteFollowUp(followUp: FollowUp) {
    if (!lead) return

    try {
      await DeleteLeadFollowUpByID(lead.id, followUp.id)
      toast({
        title: 'Deleted',
        description: 'Follow-up removed successfully',
        variant: 'success',
      })
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete follow-up',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Lead View</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] w-full rounded-md">
          {lead && contact ? (
            <div className="space-y-6 p-4">

              {/* Basic Information */}
              <UserCard user={contact} />
              {referrer && <UserCard user={referrer} title="Referrer Information" />}

              {/* Description */}
              <Card className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Description</h3>
                <div>
                  <p className="text-foreground font-medium text-md">Contact Date</p>
                  <p className="text-subtitle text-sm">{formatDateFromTimestamp(lead.contact_date || '')}</p>
                </div>
                <p className="text-subtitle text-sm whitespace-pre-wrap">{lead.description}</p>
              </Card>

              {/* Follow-ups */}
              <Card className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Follow-ups</h3>
                <div className="space-y-4">
                  {followUps.map((followUp) => (
                      <div key={followUp.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium text-foreground">{formatDateFromTimestamp(followUp.date.toString())}</p>
                          <div className="flex items-center gap-2">
                            <Checkbox checked={followUp.completed} onCheckedChange={() => handleCompleteFollowUp(followUp)} />
                            <button onClick={() => handleDeleteFollowUp(followUp)} className="text-destructive hover:text-destructive/80">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-subtitle whitespace-pre-wrap">{followUp.description}</p>
                        <Separator className="w-full" orientation="horizontal" />
                      </div>
                    ))}
                </div>
                <AddFollowUp leadId={lead.id} onSuccess={onSuccess} />
              </Card>
                {lead && <GenerateApplicationLink lead={lead} followUps={followUps} user={contact} />}
            </div>
          ): (
            <LoadingComponent />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default LeadDialog