"use client"
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ColumnDefinition, DataTable } from '@/components/dashboard/components/DataTable';
import { Ticket } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DashboardPage from '@/components/misc/DashboardPage';
import { itemVariants } from '@/lib/anims';
import { ReadTickets } from '@/utils/entities/ticket';

interface Props {
  setTicket: React.Dispatch<React.SetStateAction<Ticket | null>>,
  ticket: Ticket | null,
  setCanContinue: any
}

const TicketManager = ({setTicket, ticket, setCanContinue}:Props) => {

  const { toast } = useToast()

  const [tickets, setTickets] = useState<Ticket[] | null>(null)

  const columns = [
    { accessorKey: 'TicketID', header: 'Ticket ID' },
    { accessorKey: 'Status', header: 'Status' },
    { accessorKey: 'first_name', header: 'First Name' },
    { accessorKey: 'last_name', header: 'Last Name' },
    { accessorKey: 'Advisor', header: 'Advisor' },
  ]

  useEffect(() => {

    async function fetchData () {

        setTicket(null)

        const tickets = await ReadTickets()
        setTickets(tickets.sort((a, b) => (b.TicketID.toString().localeCompare(a.TicketID.toString()))))
        
    }
    fetchData()

  }, [])

  useEffect(() => {

    if (ticket) {
      setCanContinue(true)
    } else {
      setCanContinue(false)
    }

  }, [ticket])

  const handleTicketSelection = (selectedTickets: Ticket[]) => {
    if (selectedTickets && selectedTickets.length > 0 && selectedTickets[0].Status === "Opened") {
      setTicket(null)
      toast({
        title: "Ticket already opened.",
        description: "Please select a different ticket or contact support if you need to modify this ticket.",
      })
    } else {
      setTicket(selectedTickets[0])
    }
  }

  return (
    <DashboardPage title='Open a new account in IBKR' description='Select a ticket to open a new account.'>
      {tickets ? (
        <motion.div variants={itemVariants} className="w-full">
          <DataTable 
            columns={columns as ColumnDefinition<Ticket>[]} 
            enableSelection 
            data={tickets}
            setSelection={(selectedTickets: Ticket[]) => handleTicketSelection(selectedTickets)}
            infiniteScroll
          />
        </motion.div>
      ) : (
        <motion.div
          className='flex w-full h-full items-center justify-center'
          variants={itemVariants}
        >
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </motion.div>
      )}
    </DashboardPage>
  )
}

export default TicketManager
