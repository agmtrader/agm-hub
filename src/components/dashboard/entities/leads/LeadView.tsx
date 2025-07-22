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
import { UpdateLeadFollowUpByID, DeleteLeadFollowUpByID } from '@/utils/entities/lead'
import { ReadApplicationByLeadID } from '@/utils/entities/application'
import { InternalApplication } from '@/lib/entities/application'
import { formatURL } from '@/utils/language/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import AddFollowUp from './AddFollowUp'
import { Trash2 } from 'lucide-react'
import { User } from 'next-auth'

interface LeadViewProps {
  lead: Lead |  null
  followUps: FollowUp[]
  users: User[]
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const LeadView = ({ lead, followUps, users, isOpen, onOpenChange, onSuccess }: LeadViewProps) => {

  const user = users.find(u => u.id === lead?.contact_id)
  const referrer = users.find(u => u.id === lead?.referrer_id)
  const [application, setApplication] = useState<InternalApplication | null>(null)

  const { lang } = useTranslationProvider()

  // Fetch application when lead changes
  useEffect(() => {
    const fetchApplication = async () => {
      if (lead?.id) {
        try {
          const app = await ReadApplicationByLeadID(lead.id)
          setApplication(app)
        } catch (error) {
          console.error('Error fetching application:', error)
          setApplication(null)
        }
      } else {
        setApplication(null)
      }
    }

    fetchApplication()
  }, [lead?.id])

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

  if (!lead || !user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Lead View</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] w-full rounded-md">
          <div className="space-y-6 p-4">

            {/* Application Information */}
            {application && (
              <Card className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Application Information</h3>
                <div>
                  <p className="text-foreground font-medium text-md">Application ID</p>
                  <Link 
                    href={formatURL(`/dashboard/applications/${application.id}`, lang)}
                    className="text-primary hover:text-primary/80 underline text-sm transition-colors"
                  >
                    {application.id}
                  </Link>
                </div>
              </Card>
            )}

            {/* Basic Information */}
            <UserCard user={user} />
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
            {lead && <GenerateApplicationLink lead={lead} followUps={followUps} user={user} />}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default LeadView 