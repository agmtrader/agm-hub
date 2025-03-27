"use client"
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ColumnDefinition, DataTable } from '@/components/misc/DataTable';
import { Ticket } from '@/lib/entities/ticket';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DashboardPage from '@/components/misc/DashboardPage';
import { itemVariants } from '@/lib/anims';
import { ReadTickets } from '@/utils/entities/ticket';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { addColumnsFromJSON } from '@/utils/table';

interface Props {
  setTicket: React.Dispatch<React.SetStateAction<Ticket | null>>,
  ticket: Ticket | null,
  setCanContinue: React.Dispatch<React.SetStateAction<boolean>>
}

const TicketManager = ({setTicket, ticket, setCanContinue}:Props) => {

  const { toast } = useToast()
  const [tickets, setTickets] = useState<Ticket[] | null>(null)
  const [showAll, setShowAll] = useState(false)

  const columns = [
    { accessorKey: 'TicketID', header: 'Ticket ID' },
    { accessorKey: 'Status', header: 'Status' },
    { accessorKey: 'first_name', header: 'First Name' },
    { accessorKey: 'last_name', header: 'Last Name' },
    { accessorKey: 'Advisor', header: 'Advisor' },
    { accessorKey: 'MasterAccount', header: 'Master Account' },
  ]

  useEffect(() => {

    async function fetchData () {

        setTicket(null)
        const tickets = await ReadTickets()
        const sortedTickets = tickets.sort((a, b) => (b.TicketID.toString().localeCompare(a.TicketID.toString())))
        const expandedSortedTickets = await addColumnsFromJSON(sortedTickets)
        setTickets(showAll ? expandedSortedTickets : expandedSortedTickets.filter((ticket) => ticket.Status !== "Started" && ticket.Status !== "Opened"))
        
    }
    fetchData()

  }, [showAll])

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
      <div className="flex items-center space-x-2 mb-4">
        <Checkbox
          id="showAll"
          checked={showAll}
          onCheckedChange={(checked) => setShowAll(checked as boolean)}
        />
        <Label htmlFor="showAll">Show all tickets</Label>
      </div>
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
