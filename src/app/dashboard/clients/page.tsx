"use client"
import React, { useEffect, useState } from 'react'

import { DocumentData } from 'firebase/firestore';

import { getDocumentsFromCollection } from '@/utils/api';

import { DataTable } from '@/components/dashboard/components/DataTable';

const page = () => {

  const [clients, setClients] = useState<DocumentData[] | null>(null)

  useEffect(() => {
      async function fetchData () {
          let data = await getDocumentsFromCollection('db/clients/accounts/')
          setClients(data)
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