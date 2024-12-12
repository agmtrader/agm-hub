"use client"
import React, { useState, useEffect, SetStateAction, Dispatch } from 'react'
import { motion } from 'framer-motion'
import { addColumnsFromJSON } from '@/utils/table';
import { ColumnDefinition, DataTable } from '@/components/dashboard/components/DataTable';
import { Ticket } from '@/lib/types';
import { accessAPI } from '@/utils/api';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from '@/hooks/use-toast';

interface Props {
  setTicket: React.Dispatch<React.SetStateAction<Ticket | null>>,
  ticket: Ticket | null,
  setCanContinue: any
}

const TicketManager = ({setTicket, ticket, setCanContinue}:Props) => {

  const { toast } = useToast()

  // Initialize data variables
  const [tickets, setTickets] = useState<Ticket[] | null>(null)

  const columns = [
    { accessorKey: 'TicketID', header: 'Ticket ID' },
    { accessorKey: 'Status', header: 'Status' },
    { accessorKey: 'first_name', header: 'First Name' },
    { accessorKey: 'last_name', header: 'Last Name' },
    { accessorKey: 'Advisor', header: 'Advisor' },
  ]

  // Fetch tickets from database
  useEffect(() => {

    async function fetchData () {

        setTicket(null)

        // Fetch all tickets from database
        let response = await accessAPI('/database/read', 'POST', {'path': 'db/clients/tickets'})
        const data = response['content']

        // Add columns and sort tickets
        let tickets:Ticket[] = await addColumnsFromJSON(data)
        setTickets(tickets)
        
    }
    fetchData()

  }, [])

  // Allow user to continue if a ticket has been selected
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <motion.div
      className='w-full h-fit gap-5 flex flex-col justify-center items-center'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 className='text-7xl text-foreground font-bold' variants={itemVariants}>
        Open a new account.
      </motion.h1>
      <motion.p className='text-2xl text-subtitle' variants={itemVariants}>
        Open Account Applications
      </motion.p>
      {tickets ? (
        <motion.div variants={itemVariants} className="w-full">
          <DataTable 
            columns={columns as ColumnDefinition<Ticket>[]} 
            enableSelection 
            data={tickets}
            setSelection={(selectedTickets: Ticket[]) => handleTicketSelection(selectedTickets)}
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
    </motion.div>
  )
}

export default TicketManager
