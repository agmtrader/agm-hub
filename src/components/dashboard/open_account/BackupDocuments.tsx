"use client"
import React, { useEffect, useState } from 'react'

import { sortColumns } from '@/utils/table';

import { DataTable } from '@/components/dashboard/components/DataTable';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import Link from 'next/link';

import { Document, Documents, Map, Ticket } from '@/lib/types';
import DocumentCenter from '../document_center/DocumentCenter';
import { accessAPI } from '@/utils/api';


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

      let response = await accessAPI('/database/read', 'POST', {'path': 'db/clients/accounts', 'key': 'TicketID', 'value': ticketID})
      let data = response['content']
      let account_number = ''
      if (data && data.length == 1) {
        account_number = data[0]['AccountNumber']
      }
      console.log(account_number)
      setAccountNumber(account_number)

      response = await accessAPI('/database/read', 'POST', {'path': 'db/document_center/poa', 'key': 'AccountNumber', 'value': account_number})
      data = response['content']
      let poaData:Document[] = []
      if (data) {
        data.forEach((entry:any) => {
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

      response = await accessAPI('/database/read', 'POST', {'path': 'db/document_center/poi', 'key': 'AccountNumber', 'value': account_number})
      data = response['content']
      let poiData:Document[] = []
      if (data) {
        data.forEach((entry:any) => {
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

      response = await accessAPI('/database/read', 'POST', {'path': 'db/document_center/sow', 'key': 'AccountNumber', 'value': account_number})
      data = response['content']
      let sowData:Document[] = []
      if (data) {
        data.forEach((entry:any) => {
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

      response = await accessAPI('/database/read', 'POST', {'path': 'db/clients/tickets', 'key': 'TicketID', 'value': ticketID})
      data = response['content']

      // Update ticket status      
      if (data) {
        if (data[0]['Status'] !== 'Ready for application') {
          if ((poaData.length === 0 || poiData.length === 0 || sowData.length === 0)) {
            await accessAPI('/database/update', 'POST', {'path': `db/clients/tickets/${ticketID}`, 'key': 'Status', 'value': 'Missing documents'})
          } else {
            await accessAPI('/database/update', 'POST', {'path': `db/clients/tickets/${ticketID}`, 'key': 'Status', 'value': 'Documents need revision'})
          }
        } else {
          setCanContinue(true)
        } 
      }


      // Fetch ticket with updated status
      response = await accessAPI('/database/read', 'POST', {'path': 'db/clients/tickets', 'key': 'TicketID', 'value': ticketID})
      data = response['content']
      let tickets = sortColumns(data, ['TicketID', 'Status'])
      setTickets(tickets)

    }
    
    queryData()

  }, [canContinue])

  // Update ticket status depending on checkbox
  async function updateTicketStatus() {
    setCanContinue(!canContinue)
    if (canContinue) {
      await accessAPI('/database/update', 'POST', {'path': `db/clients/tickets/${ticketID}`, 'key': 'Status', 'value': 'Documents need revision'})
    } else {
      await accessAPI('/database/update', 'POST', {'path': `db/clients/tickets/${ticketID}`, 'key': 'Status', 'value': 'Ready for application'})
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