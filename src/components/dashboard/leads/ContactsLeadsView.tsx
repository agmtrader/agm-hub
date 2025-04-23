import React from 'react'
import { Lead } from '@/lib/entities/lead'
import { DataTable } from '@/components/misc/DataTable'
import { ColumnDefinition } from '@/components/misc/DataTable'

interface Props {
  leads: Lead[]
  columns: ColumnDefinition<Lead>[]
  setSelectedLead: (lead: Lead) => void
  setIsViewDialogOpen: (open: boolean) => void
  setIsEditDialogOpen: (open: boolean) => void
  handleDeleteLead: (leadID: string) => void
}

const ContactsLeadsView = ({ leads, columns, setSelectedLead, setIsViewDialogOpen, setIsEditDialogOpen, handleDeleteLead }: Props) => {
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
        },
        {
          label: 'Edit',
          onClick: (row: Lead) => {
            setSelectedLead(row)
            setIsEditDialogOpen(true)
          }
        },
        {
          label: 'Delete',
          onClick: (row: any) => {
            handleDeleteLead(row.LeadID)
          },
        }
      ]}
    />
  </div>
  )
}

export default ContactsLeadsView