"use client"
import React, { useState, useEffect } from 'react'

import { DocumentData } from 'firebase/firestore/lite';

import { addColumnsFromJSON, getDocumentsFromCollection } from '@/utils/api';
import { sortColumns } from '@/utils/table';

import { DataTableSelect } from '@/components/dashboard/DataTable';

interface Props {
  setCurrentTicket: React.Dispatch<React.SetStateAction<DocumentData | null>>,
  currentTicket: DocumentData | null,
  setCanContinue: any // !!!!
}

const TicketManager = ({setCurrentTicket, currentTicket, setCanContinue}:Props) => {

  // Initialize data variables
  const [tickets, setTickets] = useState<DocumentData[] | null>(null)

  // Ticket columns - export to dictionary!
  const columns = ['TicketID', 'Status', 'username', 'email']

  // Fetch tickets from database
  useEffect(() => {

    async function fetchData () {
        setCurrentTicket(null)
        let data = await getDocumentsFromCollection('db/clients/tickets/')
        data = await addColumnsFromJSON(data)
        setTickets(sortColumns(data, columns))
    }
    fetchData()

  }, [])

  // Allow user to continue if a ticket has been selected
  useEffect(() => {

    if (currentTicket) {
      console.log('1')
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