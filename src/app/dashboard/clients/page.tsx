"use client"
import React, { useEffect, useState } from 'react'

import { DocumentData } from 'firebase/firestore';
import { Map } from '@/lib/types';

import { getDocumentsFromCollection, getForeignTables } from '@/utils/api';

import { DataTable } from '@/components/dashboard/DataTable';
import { sortColumns } from '@/utils/table';

const page = () => {

  const [clients, setClients] = useState<DocumentData[] | null>(null)
  const columns = ['TicketID', 'Name', 'Last name', 'TemporalEmail', 'TemporalPassword', 'IBKR Account Number', 'IBKR Username', 'IBKR Password', 'Advisor']

  useEffect(() => {
      async function fetchData () {
          var data = await getDocumentsFromCollection('db/clients/accounts/')
          data = await getForeignTables(data)
          setClients(sortColumns(data, columns))
      }
      fetchData()
  }, [])

  return (
    <div className='w-full h-full flex flex-col justify-center gap-y-20 items-center'>
      <p className='text-7xl font-bold'> AGM Clients Database</p>
      {clients && <DataTable width={90} data={clients}/>}
    </div>
  )
}

export default page