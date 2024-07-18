"use client"
import React, { useEffect, useState } from 'react'

import { sortColumns } from '@/utils/table';
import { addColumnsFromJSON, queryDocumentsFromCollection, updateFieldInDocument } from '@/utils/api';

import { DataTable } from '@/components/dashboard/components/DataTable';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { Document, Documents, Map, POA, POI, Ticket } from '@/lib/types';
import DocumentCenter from '../document_center/DocumentCenter';
import Link from 'next/link';

interface Props {
  // Fix this
  currentTicket: Ticket,
  setCanContinue: React.Dispatch<React.SetStateAction<boolean>>,
  canContinue: boolean
}

const BackupDocuments = ({currentTicket, setCanContinue, canContinue}:Props) => {

  const [selection, setSelection] = useState<Document | null>(null)

  // Initialize data variables
  // Current Ticket ID
  const [ticket, setTicket] = useState<Ticket[] | null>(null)
  const ticketID = currentTicket['TicketID']
  const ticketColumns = ['TicketID', 'Status','email', 'username']

  // Documents -- this map is an array of objects
  const [documents, setDocuments] = useState<Documents | null>(null)

  // Initialize state variables for refreshing data
  const [refresh, setRefresh] = useState<boolean>(false)

  // Fetch documents and ticket data associated to current ticket
  useEffect(() => {

    async function queryData () {

      // Query documents associated to current ticket


      //let sowData = await queryDocumentsFromCollection('/db/document_center/sow', 'TicketID', ticketID)
      
      let data = await queryDocumentsFromCollection('/db/document_center/poa', 'TicketID', ticketID)

      let poaData:POA[] = []

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

      data = await queryDocumentsFromCollection('/db/document_center/poi', 'TicketID', ticketID)

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
      if (documents && Object.keys(documents).length !== 3) {
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

  }, [refresh])

  console.log(documents)

  // Update ticket status depending on checkbox
  async function updateTicketStatus() {
    setCanContinue(!canContinue)
    if (canContinue) {
      await updateFieldInDocument(`db/clients/tickets/${ticketID}`, 'Status','Documents need revision')
    } else {
      await updateFieldInDocument(`db/clients/tickets/${ticketID}`, 'Status','Ready for application')
    }
    setRefresh(!refresh)
  }

  console.log(documents)

  return (
    <div className='h-full w-full flex flex-col justify-start gap-y-10 items-center'>
      <h1 className='text-7xl font-bold'>Upload and revise documents.</h1>
      <div className='flex gap-x-5'>
          <Button asChild className='w-fit h-fit'>
            <Link href={'/dashboard/document-center'}>
              Document Center
            </Link>
          </Button>
      </div>

      {ticket && <DataTable data={ticket}/>}

      <DocumentCenter documents={documents} setSelection={setSelection} selection={selection}/>

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
    </div>
  )
}

export default BackupDocuments