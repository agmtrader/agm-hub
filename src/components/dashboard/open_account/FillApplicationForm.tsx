"use client"
import React, { useEffect, useState } from 'react'

import { DataTable } from '@/components/dashboard/components/DataTable';
import { Map, Ticket } from '@/lib/types';
import { about_you_primary_schema, about_you_secondary_schema, getDefaults, regulatory_schema } from '@/lib/form';
import { accessAPI } from '@/utils/api';

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
      let response = await accessAPI('/database/read', 'POST', {'path': 'db/clients/tickets', 'key': 'TicketID', 'value': ticketID})
      let data = response['content']
      let ticket:Ticket | null = null

      if (data && data.length === 1) {
        ticket = data[0]
      } else {
        throw new Error('Ticket not found')
      }

      let primaryHolderInfo:Map = {}
      if (ticket) {
        Object.keys(primaryDefaultValues).forEach((key:any) => {
          primaryHolderInfo[key] = ticket['ApplicationInfo'][key as keyof Ticket]
        })
      }
      setPrimaryHolderInfo(primaryHolderInfo)

      let secondaryHolderInfo:Map = {}
      if (ticket) {
        Object.keys(secondaryDefaultValues).forEach((key:any) => {
          secondaryHolderInfo[key] = ticket['ApplicationInfo']['secondary_' + key as keyof Ticket]
        })
      }
      setSecondaryHolderInfo(secondaryHolderInfo)

      let regulatoryInfo:Map = {}
      if (ticket) {
        Object.keys(regulatoryDefaultValues).forEach((key:any) => {
          regulatoryInfo[key] = ticket['ApplicationInfo'][key as keyof Ticket]
        })
      }
      setRegulatoryInfo(regulatoryInfo)

      setCanContinue(true)
      
    }
    
    queryData()
  }, [])

  return (
    <div className='h-full w-[50%] flex flex-col justify-start gap-y-10 items-center'>
        <h1 className='text-7xl font-bold'>Open account.</h1>
        {primaryHolderInfo && 
          <div className=''>
            <p className='text-lg font-semibold'>Primary Holder Information</p>
            <DataTable data={[primaryHolderInfo]} width={90}/>
          </div>
        }
        {secondaryHolderInfo && 
          <div className=''>
            <p className='text-lg font-semibold'>Secondary Holder Information</p>
            <DataTable data={[secondaryHolderInfo]} width={90}/>
          </div>
        }
        {regulatoryInfo &&
          <div className=''>
            <p className='text-lg font-semibold'>Regulatory Information</p>
            <DataTable data={[regulatoryInfo]} width={90}/>
          </div>
        }
    </div>
  )
}

export default FillApplicationForm