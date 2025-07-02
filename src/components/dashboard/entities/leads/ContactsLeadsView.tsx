import React from 'react'
import { Lead } from '@/lib/entities/lead'
import { DataTable } from '@/components/misc/DataTable'
import { ColumnDefinition } from '@/components/misc/DataTable'

interface Props {
  leads: Lead[]
  columns: ColumnDefinition<Lead>[]
  setSelectedLead: (lead: Lead) => void
  setIsViewDialogOpen: (open: boolean) => void
}

const ContactsLeadsView = ({ leads, columns, setSelectedLead, setIsViewDialogOpen }: Props) => {
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
            setSelectedLead(row)
            setIsViewDialogOpen(true)
          }
        }
      ]}
    />
  </div>
  )
}

export default ContactsLeadsView