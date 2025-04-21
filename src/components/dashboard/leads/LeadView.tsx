'use client'

import React from 'react'
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
import { CheckCircle2, Circle } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { countries } from "@/lib/form"
import { UpdateLeadByID } from '@/utils/entities/lead'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'

interface LeadViewProps {
  lead: Lead | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const LeadView = ({ lead, isOpen, onOpenChange }: LeadViewProps) => {
  if (!lead) return null

  // Calculate follow-up progress
  const completedFollowUps = lead.FollowUps.filter(f => f.completed).length
  const totalFollowUps = lead.FollowUps.length

  // Find country label
  const getCountryLabel = (value: string) => {
    const country = countries.find(c => c.value === value)
    return country ? country.label : value
  }

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
      toast({
        title: 'Follow-up updated',
        description: 'The follow-up has been updated',
        variant: 'success'
      })
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
          <DialogTitle className="text-2xl font-bold">Lead Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] w-full rounded-md">
          <div className="space-y-6 p-4">
            {/* Lead Status */}
            <div className="flex justify-between items-center">
              <Badge variant={completedFollowUps === totalFollowUps ? "success" : "outline"} className="text-sm">
                {completedFollowUps}/{totalFollowUps} follow-ups completed
              </Badge>
            </div>

            {/* Basic Information */}
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">{lead.Name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Contact Date</p>
                  <p className="font-medium">{formatDateFromTimestamp(lead.ContactDate || '')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{lead.Email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{lead.Phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone Country</p>
                  <p className="font-medium">{getCountryLabel(lead.PhoneCountry)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Referrer</p>
                  <p className="font-medium">{lead.Referrer}</p>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{lead.Description}</p>
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
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">Follow-up Date</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <p className="text-sm font-medium">{followUp.date}</p>
                          <Button variant="ghost" asChild onClick={() => handleCompleteFollowUp(followUp)}>
                            <Badge variant={followUp.completed ? "success" : "outline"}>
                              {followUp.completed ? "Completed" : "Pending"}
                            </Badge>
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{followUp.description}</p>
                      <Separator className="w-full" orientation="horizontal" />
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default LeadView 