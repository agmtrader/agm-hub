import { DataTable, ColumnDefinition } from '@/components/misc/DataTable'
import { Lead, FollowUp } from '@/lib/entities/lead'
import { formatDateFromTimestamp } from '@/utils/dates'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import { User } from 'next-auth'

interface Props {
  leads: Lead[]
  followUps: FollowUp[]
  users: User[]
}

const FollowUpsLeadsView = ({ leads, followUps, users}: Props) => {
  const [showCompleted, setShowCompleted] = useState(false)

  const columns = [
    {
      header: 'Contact Name',
      accessorKey: 'contactName',
      cell: ({ row }: any) => {
        const lead = leads.find(l => l.id === row.original.lead_id)
          const user = users.find(u => u.id === lead?.contact_id)
        return user?.name || "Contact not found"
      }
    },
    {
      header: 'Follow-up Date',
      accessorKey: 'date',
      cell: ({ row }: any) => {
        const date = new Date(row.original.date)
        const isPast = date < new Date()
        return (
          <span className={isPast ? 'text-red-500' : ''}>
            {formatDateFromTimestamp(row.original.date)}
          </span>
        )
      }
    },
    {
      header: 'Description',
      accessorKey: 'description',
    },
    {
      header: 'Completed',
      accessorKey: 'completed',
      cell: ({ row }: any) => (
        <Badge variant={row.original.completed ? "success" : "outline"}>
          {row.original.completed ? 'Yes' : 'No'}
        </Badge>
      )
    }
  ] as ColumnDefinition<FollowUp>[]

  return (
    <div className="flex flex-col my-5 gap-5">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="show-completed"
          checked={showCompleted}
          onCheckedChange={(checked) => setShowCompleted(checked as boolean)}
        />
        <label
          htmlFor="show-completed"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show completed follow-ups
        </label>
      </div>
      <DataTable
        data={followUps.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}
        columns={columns}
        infiniteScroll
      />
    </div>
  )
}

export default FollowUpsLeadsView 