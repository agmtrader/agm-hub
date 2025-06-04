'use client'

import React from 'react'
import { FollowUp, FollowUpPayload, Lead } from '@/lib/entities/lead'
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
import { Contact } from '@/lib/entities/contact'
import GenerateApplicationLink from './GenerateApplicationLink'
import ContactCard from '../contacts/ContactCard'
import { UpdateLeadFollowUpByID } from '@/utils/entities/lead'

interface LeadViewProps {
  lead: Lead |  null
  followUps: FollowUp[]
  contacts: Contact[]
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const LeadView = ({ lead, followUps, contacts, isOpen, onOpenChange, onSuccess }: LeadViewProps) => {

  const contact = contacts.find(c => c.id === lead?.contact_id)
  const referrer = contacts.find(c => c.id === lead?.referrer_id)

  async function handleCompleteFollowUp(followUp: FollowUpPayload) {
    if (!lead) return

    if (followUp.completed) {
      followUp.completed = false
    } else {
      followUp.completed = true
    }

    try {
      await UpdateLeadFollowUpByID(lead.id, followUp)
      onSuccess?.()

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete follow-up',
        variant: 'destructive'
      })
    }
  }

  if (!lead || !contact) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Lead View</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] w-full rounded-md">
          <div className="space-y-6 p-4">
            {/* Lead Status */}
            <div className="flex justify-between items-center">
              <Badge variant={followUps.every(f => f.completed) ? "success" : "outline"} className="text-sm">
                {followUps.filter(f => f.completed).length}/{followUps.length} follow-ups completed
              </Badge>
              <Badge variant={lead.status === 'Applied' ? 'success' : 'outline'} className="text-sm"> {lead.status} </Badge>
            </div>

            {/* Basic Information */}
            <ContactCard contact={contact} />
            {referrer && <ContactCard contact={referrer} title="Referrer Information" />}

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
                        <div className="flex flex-col items-end gap-2">
                          <Checkbox checked={followUp.completed} onCheckedChange={() => handleCompleteFollowUp(followUp)} />
                        </div>
                      </div>
                      <p className="text-sm text-subtitle whitespace-pre-wrap">{followUp.description}</p>
                      <Separator className="w-full" orientation="horizontal" />
                    </div>
                  ))}
              </div>
            </Card>
            {lead && <GenerateApplicationLink lead={lead} followUps={followUps} />}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default LeadView 