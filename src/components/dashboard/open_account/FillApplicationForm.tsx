"use client"
import React, { useEffect, useState } from 'react'

import { DocumentData } from 'firebase/firestore/lite';

import { sortColumns } from '@/utils/table';
import { addColumnsFromJSON, queryDocumentsFromCollection } from '@/utils/api';

import { DataTable } from '@/components/dashboard/components/DataTable';
import AccessForm from './components/AccessForm';

interface Props {
  currentTicket: DocumentData,
  setCanContinue: React.Dispatch<React.SetStateAction<boolean>>,
}

const FillApplicationForm = ({currentTicket, setCanContinue}:Props) => {
  
  // Initialize data variables
  const [ticket, setTicket] = useState<DocumentData[] | null>(null)
  const [documents, setDocuments] = useState<DocumentData[] | null>(null)

  // Columns - pass to dict!
  const ticketColumns = ['TicketID', 'Status', 'email', 'username', 'language']
  const documentColumns = ['DocumentsID', 'POA']

  // Current Ticket ID
  const ticketID = currentTicket['TicketID']

  // Query
  useEffect(() => {
    
    async function queryData () {

      // Fetch ticket
      let data = await queryDocumentsFromCollection('db/clients/tickets/', 'TicketID', ticketID)
      data = await addColumnsFromJSON(data)
      setTicket(sortColumns(data, ticketColumns))

      // Fetch ticket
      data = await queryDocumentsFromCollection('db/clients/documents/', 'DocumentsID', ticketID)
      setDocuments(sortColumns(data, documentColumns))
    }
    
    queryData()
  }, [documentColumns, ticketColumns, ticketID])

  return (
    <div className='h-full w-full flex flex-col justify-start gap-y-10 items-center'>
        <h1 className='text-7xl font-bold'>Open account.</h1>
        {ticket && <DataTable data={ticket}/>}
        <AccessForm ticketID={ticketID} setCanContinue={setCanContinue}/>
    </div>
  )
}

export default FillApplicationForm