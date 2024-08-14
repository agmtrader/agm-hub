"use client"
import React, { useEffect, useState } from 'react'

import { sortColumns } from '@/utils/table';
import { addColumnsFromJSON, queryDocumentsFromCollection } from '@/utils/api';

import { DataTable } from '@/components/dashboard/components/DataTable';
import AccessForm from './components/AccessForm';
import { Documents, Map, Ticket } from '@/lib/types';

interface Props {
  currentTicket: Ticket,
  setCanContinue: React.Dispatch<React.SetStateAction<boolean>>,
}

const FillApplicationForm = ({currentTicket, setCanContinue}:Props) => {
  
  // Initialize data variables
  const [ticket, setTicket] = useState<Ticket[] | null>(null)

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

      let tickets:Ticket[] = []
      data.forEach((entry:Map) => {
        tickets.push(
          {
            'TicketID': entry['TicketID'],
            'Status': entry['Status'],
            'ApplicationInfo': entry['ApplicationInfo'],
            'Advisor': entry['Advisor']
          }
        )
      })
      tickets = await addColumnsFromJSON(tickets)

      setTicket(tickets)
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