"use client"
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Ticket } from '@/lib/entities/ticket';
import DocumentCenter from '../document_center/DocumentCenter';
import { accessAPI } from '@/utils/api';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from "@/hooks/use-toast"
import { ColumnDefinition, DataTable } from '../../misc/DataTable';
import DashboardPage from '@/components/misc/DashboardPage';
import { Account } from '@/lib/entities/account';

interface Props {
  ticket: Ticket,
  setCanContinue: React.Dispatch<React.SetStateAction<boolean>>,
  canContinue: boolean,
  account: Account | null
}

// Static folder dictionary
export const clientFolderDictionary = [
  { drive_id: '1tuS0EOHoFm9TiJlv3uyXpbMrSgIKC2QL', id: 'poa', name: 'POA', label: 'Proof of Address' },
  { drive_id: '1VY0hfcj3EKcDMD6O_d2_gmiKL6rSt_M3', id: 'identity', name: 'Identity', label: 'Proof of Identity' },
  { drive_id: '1WNJkWYWPX6LqWGOTsdq6r1ihAkPJPMHb', id: 'sow', name: 'SOW', label: 'Source of Wealth' },
]

const BackupDocuments = ({ticket, setCanContinue, account}:Props) => {
  const { toast } = useToast()
  const ticketID = ticket['TicketID']
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const isReadyForApplication = ticket.Status === 'Ready for application' || ticket.Status === 'Opened'
    setIsReady(isReadyForApplication)
    setCanContinue(isReadyForApplication)
  }, [ticket.Status, setCanContinue])

  const ticketColumns = [
    {header: 'Ticket ID', accessorKey: 'TicketID'},
    {header: 'Status', accessorKey: 'Status'}
  ]

  const handleStatusChange = async () => {
    const newStatus = !isReady
    const statusText = newStatus ? 'Ready for application' : 'Documents need revision'

    // Optimistically update the UI
    setIsReady(newStatus)
    setCanContinue(newStatus)

    try {
      
      const response = await accessAPI('/database/update', 'POST', {
        'path': `db/clients/tickets`,
        'query': {'TicketID': ticketID},
        'data': {'Status': statusText}
      })

      if (response['status'] !== 'success') {
        throw new Error('Failed to update ticket status')
      }
    } catch (error) {
      // Revert the UI change on failure
      setIsReady(!newStatus)
      setCanContinue(!newStatus)
      
      toast({
        title: "Error",
        description: "Failed to update ticket status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3 
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 100
      }
    }
  }

  return (
    <DashboardPage title='Backup Documents' description=''>

      <motion.p className='text-lg font-semibold' variants={itemVariants}>Current Ticket</motion.p>
      
      <motion.div variants={itemVariants}>
        <DataTable data={[ticket]} columns={ticketColumns as ColumnDefinition<Ticket>[]}/>
      </motion.div>

      <motion.p className='text-lg font-semibold' variants={itemVariants}>Client Documents</motion.p>
      
      {account && (
        <motion.div variants={itemVariants}>
          <DocumentCenter folderDictionary={clientFolderDictionary} query={{'DocumentInfo.account_number': account.AccountNumber}} />
        </motion.div>
      )}
      
      <motion.div 
        className='flex gap-x-2 items-center justify-center'
        variants={itemVariants}
      >
        <Checkbox 
          id="document-verification"
          checked={isReady} 
          onCheckedChange={handleStatusChange}
        />
        <label 
          htmlFor="document-verification"
          className='text-foreground cursor-pointer'
        >
          I have verified the documents.
        </label>
      </motion.div>

    </DashboardPage>
  )
}

export default BackupDocuments
