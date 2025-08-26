'use client'

import React from 'react'
import { PendingTask, PendingTaskFollowUp } from '@/lib/entities/pending_task'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { formatDateFromTimestamp } from '@/utils/dates'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { UpdatePendingTaskFollowUpByID, DeletePendingTaskFollowUpByID } from '@/utils/entities/pending_task'
import { toast } from '@/hooks/use-toast'
import { Checkbox } from '@/components/ui/checkbox'
import { CreatePendingTaskFollowUp } from '@/utils/entities/pending_task'
import { Trash2 } from 'lucide-react'
import AddFollowUp from './AddFollowUp'

interface Props {
  task: PendingTask | null
  followUps: PendingTaskFollowUp[]
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const PendingTaskDialog = ({ task, followUps, isOpen, onOpenChange, onSuccess }: Props) => {
  if (!task) return null

  const taskFollowUps = followUps.filter(f => f.pending_task_id === task.id)
  const completed = taskFollowUps.filter(f => f.completed).length

  async function handleToggleFollowUp(fu: PendingTaskFollowUp) {
    try {
      if (!task || !fu.id) throw new Error('Task or follow-up ID not found')
      await UpdatePendingTaskFollowUpByID(task.id, fu.id, {
        ...fu,
        completed: !fu.completed,
      })
      onSuccess?.()
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' })
    }
  }

  async function handleDeleteFollowUp(fu: PendingTaskFollowUp) {
    try {
      if (!task || !fu.id) throw new Error('Task or follow-up ID not found')
      await DeletePendingTaskFollowUpByID(task.id, fu.id)
      toast({ title: 'Deleted', description: 'Follow-up removed successfully', variant: 'success' })
      onSuccess?.()
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to delete follow-up', variant: 'destructive' })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Pending Task Overview</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] w-full rounded-md">
          <div className="space-y-6 p-4">
            {taskFollowUps.length === 0 ? (
              <Badge variant="warning">Not started</Badge>
            ) : (
              <Badge variant={completed === taskFollowUps.length ? 'success' : 'outline'}>
                {completed}/{taskFollowUps.length} follow-ups completed
              </Badge>
            )}
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-foreground font-medium text-md">Account ID</p>
                  <p className="text-subtitle text-sm">{task.account_id}</p>
                </div>
                <div>
                  <p className="text-foreground font-medium text-md">Date</p>
                  <p className="text-subtitle text-sm">{formatDateFromTimestamp(task.date.toString())}</p>
                </div>
                <div>
                  <p className="text-foreground font-medium text-md">Priority</p>
                  <p className="text-subtitle text-sm">
                    {task.priority === 1 && 'High'}
                    {task.priority === 2 && 'Medium'}
                    {task.priority === 3 && 'Low'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-foreground font-medium text-md">Emails to notify</p>
                  {(!task.emails_to_notify || task.emails_to_notify.length === 0) ? (
                    <p className="text-subtitle text-sm">-</p>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {task.emails_to_notify.map((email) => (
                        <span key={email} className="px-2 py-0.5 rounded bg-muted text-xs break-all">
                          {email}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="col-span-2">
                  <p className="text-foreground font-medium text-md">Tags</p>
                  {(!task.tags || task.tags.length === 0) ? (
                    <p className="text-subtitle text-sm">-</p>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {task.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-muted text-xs">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-subtitle text-sm whitespace-pre-wrap">{task.description}</p>
            </Card>
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Follow-ups</h3>
              <div className="space-y-4">
                {taskFollowUps
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map(fu => (
                    <div key={fu.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>{formatDateFromTimestamp(fu.date.toString())}</span>
                        <div className="flex items-center gap-2">
                          <Checkbox checked={fu.completed} onCheckedChange={() => handleToggleFollowUp(fu)} />
                          <button onClick={() => handleDeleteFollowUp(fu)} className="text-destructive hover:text-destructive/80">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-subtitle whitespace-pre-wrap">{fu.description}</p>
                      <Separator />
                    </div>
                  ))}
              </div>
              <AddFollowUp taskId={task.id} onSuccess={onSuccess} />
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default PendingTaskDialog
