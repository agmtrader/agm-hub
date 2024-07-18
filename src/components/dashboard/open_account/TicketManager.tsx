"use client"
import React, { useState, useEffect } from 'react'

import { DocumentData } from 'firebase/firestore/lite';

import { addColumnsFromJSON, getDocumentsFromCollection } from '@/utils/api';
import { sortColumns } from '@/utils/table';

import { DataTableSelect } from '@/components/dashboard/components/DataTable';
import { Map, Ticket } from '@/lib/types';

interface Props {
  setCurrentTicket: React.Dispatch<React.SetStateAction<Ticket | null>>,
  currentTicket: Ticket | null,
  setCanContinue: any
}

const TicketManager = ({setCurrentTicket, currentTicket, setCanContinue}:Props) => {

  // Initialize data variables
  const [tickets, setTickets] = useState<Ticket[] | null>(null)

  // Ticket columns - export to dictionary!
  const columns = ['TicketID', 'Status', 'first_name', 'last_name', 'email', 'country', 'currency']

  // Fetch tickets from database
  useEffect(() => {

    async function fetchData () {
        setCurrentTicket(null)

        let data = await getDocumentsFromCollection('db/clients/tickets/')
        data = await addColumnsFromJSON(data)
        data = sortColumns(data, columns)

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
        setTickets(tickets)
        
    }
    fetchData()

  }, [])

  // Allow user to continue if a ticket has been selected
  useEffect(() => {

    if (currentTicket) {
      setCanContinue(true)
    } else {
      setCanContinue(false)
    }

  }, [currentTicket])

  return (
    <div className='h-full w-full flex flex-col justify-start gap-y-10 items-center'>
        <h1 className='text-7xl font-bold'>Select ticket to process.</h1>
        {tickets && <DataTableSelect data={tickets} setSelection={setCurrentTicket}/>}
    </div>
  )
}

export default TicketManager