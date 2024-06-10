"use client"
import React, { useEffect, useState } from 'react'

import { DocumentData } from 'firebase/firestore';

import { sortColumns } from '@/utils/table';
import { addColumnsFromJSON, queryDocumentsFromCollection, updateFieldInDocument } from '@/utils/api';

import { DataTable } from '@/components/dashboard/components/DataTable';
import { Button } from '@/components/ui/button';
import DocumentsViewer from '../documents/DocumentsViewer';
import { Checkbox } from '@/components/ui/checkbox';

interface Props {
  currentTicket: DocumentData,
  setCanContinue: React.Dispatch<React.SetStateAction<boolean>>,
  canContinue: boolean
}

const BackupDocuments = ({currentTicket, setCanContinue, canContinue}:Props) => {

  // Initialize data variables
  const [ticket, setTicket] = useState<DocumentData[] | null>(null)
  const [documents, setDocuments] = useState<DocumentData[] | null>(null)

  // Column defs - pass to dictionary!
  const columns = ['TicketID', 'Status','email', 'username']
  const documentColumns = ['DocumentID', 'URL']

  // Initialize state variables for refreshing data
  const [refresh, setRefresh] = useState<boolean>(false)

  // Current Ticket ID
  const ticketID = currentTicket['TicketID']

  // Fetch documents and ticket data associated to current ticket
  useEffect(() => {

    async function queryData () {

      // Query documents associated to current ticket
      let poaData = await queryDocumentsFromCollection('/db/document_center/poa', 'DocumentID', ticketID)
      let poiData = await queryDocumentsFromCollection('/db/document_center/poi', 'DocumentID', ticketID)
      let sowData = await queryDocumentsFromCollection('/db/document_center/sow', 'DocumentID', ticketID)

      // Fill documents data
      let documentsData:DocumentData[] = []
      documentsData = documentsData.concat(poaData, poiData, sowData)

      // Fetch ticket
      currentTicket = await queryDocumentsFromCollection('db/clients/tickets/', 'TicketID', ticketID)

      // Update ticket status depending on query
      if (documentsData && documentsData.length !== 3) {
        await updateFieldInDocument(`db/clients/tickets/${ticketID}`, 'Status','Missing documents')
      } else if (currentTicket[0]['Status'] !== 'Ready for application') {
        await updateFieldInDocument(`db/clients/tickets/${ticketID}`, 'Status','Documents need revision')
      } else {
        setCanContinue(true)
      }

      // Fetch ticket with updated status
      let ticketData = await queryDocumentsFromCollection('db/clients/tickets/', 'TicketID', ticketID)
      ticketData = await addColumnsFromJSON(ticketData)
      setTicket(sortColumns(ticketData, columns))
      
      // Set documents to sorted document data
      setDocuments(sortColumns(documentsData, documentColumns))
    }
    
    queryData()

  }, [refresh])

  // Update ticket status depending on checkbox
  async function updateTicketStatus() {
    setCanContinue(!canContinue)
    if (canContinue) {
      await updateFieldInDocument(`db/clients/tickets/${ticketID}`, 'Status','Documents need revision')
    } else {
      await updateFieldInDocument(`db/clients/tickets/${ticketID}`, 'Status','Ready for application')
    }
    setRefresh(!refresh)
  }

  return (
    <div className='h-full w-full flex flex-col justify-start gap-y-10 items-center'>
      <h1 className='text-7xl font-bold'>Upload and revise documents.</h1>
      <div className='flex gap-x-5'>
        <Button className='w-fit h-fit'>Document Center</Button>
      </div>
      {ticket && <DataTable data={ticket}/>}
      {documents && <DocumentsViewer documents={documents}/> }
      {documents && documents.length === 3 && 
        <div className="items-top flex space-x-2">
            <Checkbox
              checked={canContinue}
              onCheckedChange={updateTicketStatus}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms1"
                className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Documents look good.
              </label>
            </div>
        </div>
      }
    </div>
  )
}

export default BackupDocuments