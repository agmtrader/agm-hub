"use client"
import React, { useEffect, useState } from 'react'

import { sortColumns } from '@/utils/table';
import { addColumnsFromJSON, queryDocumentsFromCollection, updateFieldInDocument } from '@/utils/api';

import { DataTable } from '@/components/dashboard/components/DataTable';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import Link from 'next/link';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import DocumentViewer from '@/components/dashboard/document_center/DocumentViewer'
import { Document, Documents, Map, POA, POI, Ticket } from '@/lib/types';
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
  const [ticket, setTicket] = useState<Ticket[] | null>(null)
  const ticketID = currentTicket['TicketID']
  const ticketColumns = ['TicketID', 'Status']

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
    
      setAccountNumber(account_number)

      //let sowData = await queryDocumentsFromCollection('/db/document_center/sow', 'TicketID', ticketID)
      
      data = await queryDocumentsFromCollection('/db/document_center/poa', 'AccountNumber', account_number)
      let poaData:POA[] = []
      if (data) {
        data.forEach((entry) => {
          poaData.push({
            'TicketID': entry['TicketID'],
            'Timestamp': entry['Timestamp'],
            'AccountNumber': entry['AccountNumber'],
            'IssuedDate': entry['IssuedDate'],
            'ExpirationDate': entry['ExpirationDate'],
            'Type': entry['Type'],
            'URL': entry['URL']
          })
        })
      }

      data = await queryDocumentsFromCollection('/db/document_center/poi', 'AccountNumber', account_number)
      let poiData:POI[] = []
      data.forEach((entry) => {
        poiData.push({
          'TicketID': entry['TicketID'],
          'Timestamp': entry['Timestamp'],
          'AccountNumber': entry['AccountNumber'],
          'IssuedDate': entry['IssuedDate'],
          'ExpirationDate': entry['ExpirationDate'],
          'Type': entry['Type'],
        })
      })
      
      setDocuments({'POA':poaData,'POI': poiData})
      

      // Fetch ticket
      data = await queryDocumentsFromCollection('db/clients/tickets/', 'TicketID', ticketID)

      data.forEach((entry:Map) => {
        currentTicket = {
            'TicketID': entry['TicketID'],
            'Status': entry['Status'],
            'ApplicationInfo': entry['ApplicationInfo'],
            'Advisor': entry['Advisor']
          }
      })

      //fix this
      if (!documents) {
        await updateFieldInDocument(`db/clients/tickets/${ticketID}`, 'Status','Missing documents')
      } else if (currentTicket['Status'] !== 'Ready for application') {
        await updateFieldInDocument(`db/clients/tickets/${ticketID}`, 'Status','Documents need revision')
      } else {
        setCanContinue(true)
      }

      // Fetch ticket with updated status
      data = await queryDocumentsFromCollection('db/clients/tickets/', 'TicketID', ticketID)
      data = await addColumnsFromJSON(data)
      data = sortColumns(data, ticketColumns)

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

      setTicket(tickets)
    }
    
    queryData()

  }, [])

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
            <Link href={'/dashboard/document_center'}>
              Document Center
            </Link>
          </Button>
      </div>

      {documents && accountNumber && <DocumentCenter documents={documents} setSelection={setSelection} accountNumber={accountNumber} selection={selection}/>}

      {documents && Object.keys(documents).length === 2 && 
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
      {ticket && <DataTable data={ticket}/>}
    </div>
  )
}

export default BackupDocuments