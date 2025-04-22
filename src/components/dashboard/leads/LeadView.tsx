'use client'

import React, { useEffect, useState } from 'react'
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
import { UpdateLeadByID } from '@/utils/entities/lead'
import { toast } from '@/hooks/use-toast'
import { Checkbox } from '@/components/ui/checkbox'
import { Contact } from '@/lib/entities/contact'
import { ReadContacts } from '@/utils/entities/contact'
import GenerateApplicationLink from './GenerateApplicationLink'
import { countries } from '@/lib/form'

interface LeadViewProps {
  lead: Lead | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const LeadView = ({ lead, isOpen, onOpenChange, onSuccess }: LeadViewProps) => {
  const [contact, setContact] = useState<Contact | null>(null)
  const [referrer, setReferrer] = useState<Contact | null>(null)

  useEffect(() => {
    const fetchContacts = async () => {
      if (!lead) return
      try {
        const contacts = await ReadContacts()
        const foundContact = contacts.find(c => c.ContactID === lead.ContactID)
        const foundReferrer = contacts.find(c => c.ContactID === lead.ReferrerID)
        setContact(foundContact || null)
        setReferrer(foundReferrer || null)
      } catch (error) {
        console.error('Failed to fetch contacts:', error)
        toast({
          title: "Error",
          description: "Failed to fetch contact information",
          variant: "destructive"
        })
      }
    }
    fetchContacts()
  }, [lead])

  if (!lead) return null

  // Calculate follow-up progress
  const completedFollowUps = lead.FollowUps.filter(f => f.completed).length
  const totalFollowUps = lead.FollowUps.length

  async function handleCompleteFollowUp(followUp: FollowUp) {
    if (!lead) return
    try {
      if (followUp.completed) {
        await UpdateLeadByID(lead.LeadID, {
          FollowUps: lead.FollowUps.map(f => f.date === followUp.date ? { ...f, completed: false } : f)
        })
      } else {
        await UpdateLeadByID(lead.LeadID, {
          FollowUps: lead.FollowUps.map(f => f.date === followUp.date ? { ...f, completed: true } : f)
        })
      }

      if (!lead.FollowUps.every(f => f.completed)) {
        await UpdateLeadByID(lead.LeadID, {
          Status: 'Waiting for Application'
        })
      } else {
        await UpdateLeadByID(lead.LeadID, {
          Status: 'Started'
        })
      }

      onSuccess?.()

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete follow-up',
        variant: 'destructive'
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Lead Overview</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] w-full rounded-md">
          <div className="space-y-6 p-4">
            {/* Lead Status */}
            <div className="flex justify-between items-center">
              <Badge variant={completedFollowUps === totalFollowUps ? "success" : "outline"} className="text-sm">
                {completedFollowUps}/{totalFollowUps} follow-ups completed
              </Badge>
              <Badge variant={lead.Status === 'Applied' ? 'success' : 'outline'} className="text-sm"> {lead.Status} </Badge>
            </div>

            {/* Basic Information */}
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-foreground font-medium text-md">Contact</p>
                  <p className="text-subtitle text-sm">{contact?.ContactName || 'Loading...'}</p>
                </div>
                <div>
                  <p className="text-foreground font-medium text-md">Contact Date</p>
                  <p className="text-subtitle text-sm">{formatDateFromTimestamp(lead.ContactDate || '')}</p>
                </div>
                <div>
                  <p className="text-foreground font-medium text-md">Email</p>
                  <p className="text-subtitle text-sm">{contact?.ContactEmail || '-'}</p>
                </div>
                <div>
                  <p className="text-foreground font-medium text-md">Phone</p>
                  <p className="text-subtitle text-sm">{contact?.ContactPhone || '-'}</p>
                </div>
                <div>
                  <p className="text-foreground font-medium text-md">Country</p>
                  <p className="text-subtitle text-sm">{countries.find(c => c.value === contact?.ContactCountry)?.label || '-'}</p>
                </div>
                <div>
                  <p className="text-foreground font-medium text-md">Referrer</p>
                  <p className="text-subtitle text-sm">{referrer?.ContactName || 'Loading...'}</p>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-subtitle text-sm whitespace-pre-wrap">{lead.Description}</p>
            </Card>

            {/* Follow-ups */}
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Follow-ups</h3>
              <div className="space-y-4">
                {lead.FollowUps
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((followUp, index) => (
                    <div key={followUp.date} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-foreground">{formatDateFromTimestamp(followUp.date)}</p>
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
            {lead && <GenerateApplicationLink lead={lead} />}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default LeadView 