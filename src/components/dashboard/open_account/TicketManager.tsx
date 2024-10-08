"use client"
import React, { useState, useEffect } from 'react'

import { addColumnsFromJSON, sortColumns } from '@/utils/table';

import { DataTableSelect } from '@/components/dashboard/components/DataTable';
import { Map, Ticket } from '@/lib/types';
import { accessAPI } from '@/utils/api';
import { Loader2 } from 'lucide-react';

interface Props {
  setCurrentTicket: React.Dispatch<React.SetStateAction<Ticket | null>>,
  currentTicket: Ticket | null,
  setCanContinue: any
}

const columns = ['TicketID', 'Status', 'first_name', 'last_name', 'Advisor']

const TicketManager = ({setCurrentTicket, currentTicket, setCanContinue}:Props) => {

  // Initialize data variables
  const [tickets, setTickets] = useState<Ticket[] | null>(null)

  // Fetch tickets from database
  useEffect(() => {

    async function fetchData () {

        setCurrentTicket(null)

        let response = await accessAPI('/database/read', 'POST', {'path': 'db/clients/tickets'})
        console.log(response)
        const data = response['content']

        let tickets:Ticket[] = []
        if (data) {
          data.forEach((entry:Map) => {
            console.log(entry)
            tickets.push(
              {
                'TicketID': entry['TicketID'],
                'Status': entry['Status'],
                'ApplicationInfo': entry['ApplicationInfo'],
                'Advisor': entry['Advisor'],
              }
            )
          })
        }

        tickets = await addColumnsFromJSON(tickets)
        tickets = sortColumns(tickets, columns)
        
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
    <div className='h-fit w-full flex flex-col justify-start gap-y-10 items-center'>
        <h1 className='text-7xl font-bold'>Open a new account.</h1>
        <p className='text-2xl text-subtitle'>Open Account Applications</p>
        {tickets ? 
          <DataTableSelect data={tickets} setSelection={setCurrentTicket}/> 
          : 
          <div className='flex w-full h-full items-center justify-center'>
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
        }
    </div>
  )
}

export default TicketManager