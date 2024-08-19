"use client"
import React, { useEffect, useState } from 'react'

import { sortColumns } from '@/utils/table';
import { addColumnsFromJSON, queryDocumentsFromCollection, updateFieldInDocument } from '@/utils/api';

import { DataTable } from '@/components/dashboard/components/DataTable';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import Link from 'next/link';

import { Document, Documents, Map, Ticket } from '@/lib/types';
import DocumentCenter from '../document_center/DocumentCenter';


interface Props {
  currentTicket: Ticket,
  setCanContinue: React.Dispatch<React.SetStateAction<boolean>>,
  canContinue: boolean,
  account: any
}

const BackupDocuments = ({currentTicket, setCanContinue, canContinue, account}:Props) => {

  // Selection variables
  const [selection, setSelection] = useState<Document | null>(null)

  // Current ticket
  const [tickets, setTickets] = useState<Ticket[] | null>(null)
  const ticketID = currentTicket['TicketID']

  // Account number to be used
  const [accountNumber, setAccountNumber] = useState<string | null>(null)

  // Documents
  const [documents, setDocuments] = useState<Documents | null>(null)

  // Fetch account and ticket data associated to current ticket
  useEffect(() => {

    async function queryData () {

      let data = await queryDocumentsFromCollection('db/clients/accounts/', 'TicketID', ticketID)
      let account_number = ''
      if (data) {
        account_number = data[0]['AccountNumber']
      }
      console.log(account_number)
      setAccountNumber(account_number)

      data = await queryDocumentsFromCollection('/db/document_center/poa', 'AccountNumber', account_number)
      let poaData:Document[] = []
      if (data) {
        data.forEach((entry) => {
          poaData.push({
            'DocumentID': entry['DocumentID'],
            'FileID': entry['FileID'],
            'FileName': entry['FileName'],
            'FileInfo': entry['FileInfo'],
            'AccountNumber': entry['AccountNumber'],
            'Type': entry['Type'],
            'AGMUser':entry['AGMUser']
          })
        })
      }

      data = await queryDocumentsFromCollection('/db/document_center/poi', 'AccountNumber', account_number)
      let poiData:Document[] = []
      if (data) {
        data.forEach((entry) => {
          poiData.push({
            'DocumentID': entry['DocumentID'],
            'FileID': entry['FileID'],
            'FileName': entry['FileName'],
            'FileInfo': entry['FileInfo'],
            'AccountNumber': entry['AccountNumber'],
            'Type': entry['Type'],
            'AGMUser':entry['AGMUser']
          })
        })
      }

      data = await queryDocumentsFromCollection('/db/document_center/sow', 'AccountNumber', account_number)
      let sowData:Document[] = []
      if (data) {
        data.forEach((entry) => {
          sowData.push({
            'DocumentID': entry['DocumentID'],
            'FileID': entry['FileID'],
            'FileName': entry['FileName'],
            'FileInfo': entry['FileInfo'],
            'AccountNumber': entry['AccountNumber'],
            'Type': entry['Type'],
            'AGMUser':entry['AGMUser']
          })
        })
      }
      console.log({'POA':poaData,'POI': poiData, 'SOW': sowData})
      setDocuments({'POA':poaData,'POI': poiData, 'SOW': sowData})

      data = await queryDocumentsFromCollection('db/clients/tickets/', 'TicketID', ticketID)
      console.log(data)

      // Update ticket status      
      if (data) {
        if (poaData.length === 0 || poiData.length === 0 || sowData.length === 0) {
          await updateFieldInDocument(`db/clients/tickets/${ticketID}`, 'Status','Missing documents')
        } else if (data[0]['Status'] !== 'Ready for application') {
          await updateFieldInDocument(`db/clients/tickets/${ticketID}`, 'Status','Documents need revision')
        } else {
          setCanContinue(true)
        } 
      }


      // Fetch ticket with updated status
      data = await queryDocumentsFromCollection('db/clients/tickets/', 'TicketID', ticketID)
      let tickets = await addColumnsFromJSON(data)
      tickets = sortColumns(tickets, ['TicketID', 'Status'])
      setTickets(tickets)

    }
    
    queryData()

  }, [canContinue])

  // Update ticket status depending on checkbox
  async function updateTicketStatus() {
    setCanContinue(!canContinue)
    if (canContinue) {
      await updateFieldInDocument(`db/clients/tickets/${ticketID}`, 'Status','Documents need revision')
    } else {
      await updateFieldInDocument(`db/clients/tickets/${ticketID}`, 'Status','Ready for application')
    }
  }

  return (
    <div className='h-full w-full flex flex-col justify-start gap-y-10 items-center'>
      <h1 className='text-7xl font-bold'>Upload and revise documents.</h1>
      <div className='flex gap-x-5'>
          <Button asChild className='w-fit h-fit'>
            <Link href='/dashboard/document-center' target="_blank" rel="noopener noreferrer">
              Document Center
            </Link>
          </Button>
          <Button>Refresh</Button>
      </div>

      {documents && accountNumber && <DocumentCenter documents={documents} setSelection={setSelection} accountNumber={accountNumber} selection={selection}/>}

      {documents && Object.keys(documents).length === 3 && 
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
      {tickets && <DataTable data={tickets}/>}
    </div>
  )
}

export default BackupDocuments