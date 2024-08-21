"use client"
import React, { useEffect, useState } from 'react'

import { addColumnsFromJSON, queryDocumentsFromCollection } from '@/utils/api';

import { DataTable } from '@/components/dashboard/components/DataTable';
import { Map, Ticket } from '@/lib/types';
import { about_you_primary_schema, about_you_secondary_schema, getDefaults, regulatory_schema } from '@/lib/form';

interface Props {
  currentTicket: Ticket,
  setCanContinue: React.Dispatch<React.SetStateAction<boolean>>
}

const FillApplicationForm = ({currentTicket, setCanContinue}:Props) => {
  
  // Initialize data variables
  const [primaryHolderInfo, setPrimaryHolderInfo] = useState<Map | null>(null)
  const [secondaryHolderInfo, setSecondaryHolderInfo] = useState<Map | null>(null)
  const [regulatoryInfo, setRegulatoryInfo] = useState<Map | null>(null)

  // Current Ticket ID
  const ticketID = currentTicket['TicketID']

  const primaryDefaultValues = getDefaults(about_you_primary_schema)
  const secondaryDefaultValues = getDefaults(about_you_secondary_schema)
  const regulatoryDefaultValues = getDefaults(regulatory_schema)

  // Query
  useEffect(() => {
    
    async function queryData () {

      // Fetch ticket
      let data = await queryDocumentsFromCollection('db/clients/tickets/', 'TicketID', ticketID)

      let tickets:Ticket[] = []
      if (data) {
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
      }
      tickets = await addColumnsFromJSON(tickets)

      let primaryHolderInfo:Map = {}
      if (tickets) {
        Object.keys(primaryDefaultValues).forEach((key:any) => {
          primaryHolderInfo[key] = tickets[0][key as keyof Ticket]
        })
      }
      setPrimaryHolderInfo(primaryHolderInfo)

      let secondaryHolderInfo:Map = {}
      if (tickets) {
        Object.keys(secondaryDefaultValues).forEach((key:any) => {
          secondaryHolderInfo[key] = tickets[0]['secondary_' + key as keyof Ticket]
        })
      }
      setSecondaryHolderInfo(secondaryHolderInfo)

      let regulatoryInfo:Map = {}
      if (tickets) {
        Object.keys(regulatoryDefaultValues).forEach((key:any) => {
          regulatoryInfo[key] = tickets[0][key as keyof Ticket]
        })
      }
      setRegulatoryInfo(regulatoryInfo)

      setCanContinue(true)
      
    }
    
    queryData()
  }, [])

  return (
    <div className='h-full w-[90%] flex flex-col justify-start gap-y-10 items-center'>
        <h1 className='text-7xl font-bold'>Open account.</h1>
        {primaryHolderInfo && 
          <div className='w-full h-full gap-y-10 flex flex-col justify-center items-center'>
            <p className='text-lg font-semibold'>Primary Holder Information</p>
            <DataTable data={[primaryHolderInfo]} dark width={90}/>
          </div>
        }
        {secondaryHolderInfo && 
          <div className='w-full h-full gap-y-10 flex flex-col justify-center items-center'>
            <p className='text-lg font-semibold'>Secondary Holder Information</p>
            <DataTable data={[secondaryHolderInfo]} dark width={90}/>
          </div>
        }
        {regulatoryInfo &&
          <div className='w-full h-full gap-y-10 flex flex-col justify-center items-center'>
            <p className='text-lg font-semibold'>Regulatory Information</p>
            <DataTable data={[regulatoryInfo]} dark width={90}/>
          </div>
        }
    </div>
  )
}

export default FillApplicationForm