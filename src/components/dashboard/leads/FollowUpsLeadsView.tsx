import { DataTable, ColumnDefinition } from '@/components/misc/DataTable'
import { Lead, FollowUp } from '@/lib/entities/lead'
import { Contact } from '@/lib/entities/contact'
import { formatDateFromTimestamp } from '@/utils/dates'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'

interface FollowUpsLeadsViewProps {
  leads: Lead[]
  contacts: Contact[]
}

const FollowUpsLeadsView = ({
  leads,
  contacts,
}: FollowUpsLeadsViewProps) => {
  const [showCompleted, setShowCompleted] = useState(false)

  const allFollowUps = leads.flatMap(lead => 
    lead.FollowUps.map(followUp => ({
      ...followUp,
      leadID: lead.LeadID,
      contactName: contacts.find(c => c.ContactID === lead.ContactID)?.ContactName || lead.ContactID,
      status: lead.Status,
    }))
  )

  // Sort follow-ups by date
  const sortedFollowUps = [...allFollowUps]
    .filter(followUp => showCompleted || !followUp.completed)
    .sort(
      (a, b) => new Date(formatDateFromTimestamp(a.date)).getTime() - new Date(formatDateFromTimestamp(b.date)).getTime()
    )

  const columns = [
    {
      header: 'Contact',
      accessorKey: 'contactName',
    },
    {
      header: 'Status',
      accessorKey: 'status',
    },
    {
      header: 'Follow-up Date',
      accessorKey: 'date',
      cell: ({ row }: any) => {
        const date = new Date(formatDateFromTimestamp(row.original.date))
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
  ] as ColumnDefinition<any>[]

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
        data={sortedFollowUps}
        columns={columns}
        infiniteScroll
      />
    </div>
  )
}

export default FollowUpsLeadsView 