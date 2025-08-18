import React from 'react'
import { Lead } from '@/lib/entities/lead'
import { DataTable } from '@/components/misc/DataTable'
import { ColumnDefinition } from '@/components/misc/DataTable'

interface Props {
  leads: Lead[]
  columns: ColumnDefinition<Lead>[]
  setSelectedLeadID: (leadID: string) => void
}

const ContactsLeadsView = ({ leads, columns, setSelectedLeadID }: Props) => {
  return (
    <div className="w-full">
    <DataTable 
      data={leads} 
      columns={columns} 
      infiniteScroll
      enableFiltering
      enableRowActions
      rowActions={[
        {
          label: 'View',
          onClick: (row: Lead) => {
            setSelectedLeadID(row.id)
          }
        }
      ]}
    />
  </div>
  )
}

export default ContactsLeadsView