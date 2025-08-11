'use client'
import React, { useEffect, useState } from 'react'
import { PendingTask, PendingTaskFollowUp } from '@/lib/entities/pending_task'
import { ReadPendingTasks } from '@/utils/entities/pending_task'
import { ColumnDefinition, DataTable } from '@/components/misc/DataTable'
import { formatDateFromTimestamp } from '@/utils/dates'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import LoadingComponent from '@/components/misc/LoadingComponent'
import CreatePendingTask from './CreatePendingTask'
import PendingTaskView from './PendingTaskView'
import { ReadAccounts } from '@/utils/entities/account'
import { Account } from '@/lib/entities/account'

const PendingTasksPage = () => {
  const [tasks, setTasks] = useState<PendingTask[]>([])
  const [followUps, setFollowUps] = useState<PendingTaskFollowUp[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])

  const [selectedTask, setSelectedTask] = useState<PendingTask | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)

  async function fetchAccounts() {
    try {
      const accs = await ReadAccounts()
      setAccounts(accs)
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to fetch accounts', variant: 'destructive' })
    }
  }

  async function fetchTasks() {
    const res = await ReadPendingTasks()
    setTasks(res.pending_tasks)
    setFollowUps(res.follow_ups)
  }
  console.log(tasks, followUps)

  useEffect(() => {
    fetchAccounts()
    fetchTasks()
  }, [])

  if (!accounts.length) return <LoadingComponent className="w-full h-full" />

  const columns: ColumnDefinition<PendingTask>[] = [
    {
      header: 'Account',
      accessorKey: 'account_id',
      cell: ({ row }: any) => accounts.find(a => a.id === row.original.account_id)?.ibkr_account_number || row.original.account_id,
    },
    {
      header: 'Tags',
      accessorKey: 'tags',
      cell: ({ row }: any) => {
        const tags: string[] = row.original.tags || []
        if (!tags.length) return '-'
        return (
          <div className="flex flex-wrap gap-1">
            {tags.map((t: string) => (
              <span key={t} className="px-2 py-0.5 rounded bg-muted text-xs">{t}</span>
            ))}
          </div>
        )
      }
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: ({ row }: any) => formatDateFromTimestamp(row.original.date),
    },
    {
      header: 'Description',
      accessorKey: 'description',
    },
    {
      header: 'Next Follow-up',
      accessorKey: 'next_follow_up',
      cell: ({ row }: any) => {
        const fus = followUps.filter(f => f.pending_task_id === row.original.id && !f.completed)
        if (!fus.length) return '-'
        const next = fus.sort((a, b) => a.date.getTime() - b.date.getTime())[0]
        return formatDateFromTimestamp(next.date.toString())
      },
    },
    {
      header: 'Progress',
      accessorKey: 'completed',
      cell: ({ row }: any) => {
        const fus = followUps.filter(f => f.pending_task_id === row.original.id)
        const completed = fus.filter(f => f.completed).length
        const total = fus.length
        return <Badge variant={completed === total ? 'success' : 'outline'}>{completed}/{total}</Badge>
      },
    },
  ] as ColumnDefinition<PendingTask>[]

  if (!tasks) return <LoadingComponent className="w-full h-full" />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <CreatePendingTask refreshTasks={fetchTasks} />
      </div>
      <DataTable
        data={tasks}
        columns={columns}
        enableFiltering
        enableRowActions
        rowActions={[
          {
            label: 'View',
            onClick: (row: PendingTask) => {
              setSelectedTask(row)
              setIsViewOpen(true)
            },
          },
        ]}
      />
      <PendingTaskView
        task={selectedTask}
        followUps={followUps}
        isOpen={isViewOpen}
        onOpenChange={setIsViewOpen}
        onSuccess={fetchTasks}
      />
    </div>
  )
}

export default PendingTasksPage
