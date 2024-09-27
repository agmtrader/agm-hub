"use client"
import React, { useEffect, useState } from 'react'

import { Document, Documents } from '@/lib/types';
import DocumentCenter from '@/components/dashboard/document_center/DocumentCenter';

const page = () => {
  
  const [selection, setSelection] = useState<Document | null>(null)
  const [documents, setDocuments] = useState<Documents | null>(null)

  const [refresh, setRefresh] = useState<boolean>(false)

  // Fetch documents and ticket data associated to current ticket
  useEffect(() => {

    async function queryData () {

      //let data = await getDocumentsFromCollection(`/db/document_center/poa`)

      let poaData:Document[] = []

      let poiData:Document[] = []

      let sowData:Document[] = []

      setDocuments({'POA':poaData,'POI': poiData, 'SOW':sowData})
      
    }
    
    queryData()

  }, [refresh])

  return (
    <div className='h-full w-full flex flex-col justify-start gap-y-10 items-center'>
      <h1 className='text-7xl font-bold'>Document Center</h1>
      <DocumentCenter documents={documents} setSelection={setSelection} selection={selection}/>
    </div>
  )
}

export default page