'use client'

import React, { useState, useEffect } from 'react'
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
import { UpdatePendingTaskByID, UpdatePendingTaskFollowUpByID, DeletePendingTaskFollowUpByID } from '@/utils/entities/pending_task'
import { toast } from '@/hooks/use-toast'
import { Checkbox } from '@/components/ui/checkbox'
import { Mail, Plus, Trash2 } from 'lucide-react'
import AddFollowUp from './AddFollowUp'
import { Button } from '@/components/ui/button'
import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from '@/components/ui/command'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { ReadUsers } from '@/utils/entities/user'
import { sendTaskReminderEmail } from '@/utils/tools/email'
import { User } from 'next-auth'
import { ReadAccountByAccountID } from '@/utils/entities/account'
import UserCard from '../users/UserCard'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { ReadPendingTaskByID } from '@/utils/entities/pending_task'

interface Props {
  taskID: string | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const PendingTaskDialog = ({ taskID, isOpen, onOpenChange, onSuccess }: Props) => {

  const [task, setTask] = useState<PendingTask | null>(null)
  const [followUps, setFollowUps] = useState<PendingTaskFollowUp[]>([])

  const taskFollowUps = followUps.filter(f => task && f.pending_task_id === task.id)
  const completed = taskFollowUps.filter(f => f.completed).length

  const [user, setUser] = useState<User | null>(null)

  // Emails to notify editing state
  const [isEditingEmails, setIsEditingEmails] = useState(false)
  const [emails, setEmails] = useState<string[]>(task?.emails_to_notify || [])
  const [AGMUsers, setAGMUsers] = useState<{ id: string; email: string | null }[]>([])
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  // Fetch task + follow-ups whenever taskID changes or after updates
  useEffect(() => {
    async function fetchData() {
      if (!taskID) return
      try {
        const data = await ReadPendingTaskByID(taskID)
        if (!data.pending_tasks || data.pending_tasks.length === 0) throw new Error('Task not found')
        setTask(data.pending_tasks[0])
        setFollowUps(data.follow_ups || [])

        const users = await ReadUsers()
        const agm = users
          .filter((u: any) => u.email?.includes('@agmtechnology.com'))
          .map((u: any) => ({ id: u.id, email: u.email ?? null }))
        setAGMUsers(agm)

        if (!task) return
        const account = await ReadAccountByAccountID(task.account_id)
        if (!account || !account.user_id) throw new Error('Account or user ID not found')
        const user = users.find((u: User) => u.id === account.user_id)
        if (!user) throw new Error('User not found')
        setUser(user)

      } catch (e) {
        toast({ title: 'Error', description: e instanceof Error ? e.message : 'Failed to fetch task', variant: 'destructive' })
      }
    }
    fetchData()
  }, [taskID])

  // Keep local email state in sync when task is fetched/updated
  useEffect(() => {
    if (task) {
      setEmails(task.emails_to_notify || [])
      setIsEditingEmails(false)
    }
  }, [task])

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

  async function handleSendReminderEmail(task: PendingTask) {
    try {
      if (!task) throw new Error('Task not found')
      const emails = task.emails_to_notify || []
      for (const email of emails) {
        await sendTaskReminderEmail({ task_name: task.description + ' for account ' + task.account_id }, email)
      }
      toast({ title: 'Sent', description: `Reminder email sent to ${emails.length} users`, variant: 'success' })
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : 'Failed to send reminder email', variant: 'destructive' })
    }
  }

  const addEmail = (candidate: string) => {
    const normalized = candidate.trim().toLowerCase()
    if (!normalized) return
    if (!emails.includes(normalized)) {
      setEmails([...emails, normalized])
    }
  }

  const removeEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email))
  }

  const saveEmails = async () => {
    if (!task) return
    try {
      await UpdatePendingTaskByID(task.id, { emails_to_notify: emails })
      toast({ title: 'Updated', description: 'Emails updated successfully', variant: 'success' })
      setIsEditingEmails(false)
      onSuccess?.()
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to update emails', variant: 'destructive' })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        {task ? (
          <>
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
                {user ? 
                  <UserCard user={user} title="User Information" /> 
                  : 
                  <LoadingComponent />
                }
                <Card className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Pending Task Information</h3>
                  <div className="grid grid-cols-2 gap-4">
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
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <p className="text-foreground font-medium text-md">Emails to notify</p>
                          <Button className="bg-transparent hover:bg-transparent text-foreground" size="icon" onClick={() => handleSendReminderEmail(task)}>
                            <Mail className="h-3 w-3" />
                          </Button>
                        </div>
                        {!isEditingEmails ? (
                          <Button variant="ghost" size="sm" onClick={() => setIsEditingEmails(true)}>Edit</Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button type="button" size="sm" className="bg-primary text-background hover:bg-primary/90" onClick={saveEmails}>Save</Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => { setIsEditingEmails(false); setEmails(task.emails_to_notify || []) }}>Cancel</Button>
                          </div>
                        )}
                      </div>
                      {isEditingEmails ? (
                        <div className="flex gap-2">
                          <div className="flex flex-wrap gap-2">
                            {emails.map(email => (
                              <span key={email} className="px-2 py-0.5 rounded bg-muted text-xs flex items-center gap-1 break-all">
                                {email}
                                <button onClick={() => removeEmail(email)} className="ml-1 text-destructive hover:text-destructive/80">×</button>
                              </span>
                            ))}
                          </div>
                          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                            <PopoverTrigger asChild>
                              <Button type="button" variant="ghost">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-[300px]">
                              <Command>
                                <CommandInput placeholder="Search email" />
                                <CommandList>
                                  <CommandEmpty>No results</CommandEmpty>
                                  <CommandGroup>
                                    {AGMUsers.map(u => (
                                      <CommandItem key={u.id} value={u.email || ''} onSelect={(val) => {
                                        addEmail(val)
                                        setIsPopoverOpen(false)
                                      }}>
                                        {u.email}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          {emails && emails.length !== 0 && (
                            emails.map((email) => (
                              <span key={email} className="flex items-center gap-2 text-xs break-all">
                                {email}
                              </span>
                            ))  
                          )}
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
          </>
        ) : (
          <LoadingComponent />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default PendingTaskDialog
