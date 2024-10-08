"use client"
import React, { useEffect, useState } from 'react'

import { Document, Documents } from '@/lib/types';
import DocumentCenter from '@/components/dashboard/document_center/DocumentCenter';
import { accessAPI } from '@/utils/api';
import { addColumnsFromJSON } from '@/utils/table';

const page = () => {
  
  const [selection, setSelection] = useState<Document | null>(null)
  const [documents, setDocuments] = useState<Documents | null>(null)

  const [refresh, setRefresh] = useState<boolean>(false)

  // Fetch documents and ticket data associated to current ticket
  useEffect(() => {

    async function queryData () {

      let poaFetch = await accessAPI('/database/read', 'POST', {'path': 'db/document_center/poa'})

      let poaData:Document[] = []
      if (poaFetch) {
        poaFetch['content'].forEach((entry:Document) => {
          poaData.push(entry)
        })
      }

      let poaFiles = await accessAPI('/drive/get_files_in_folder', 'POST', {'parent_id': '1tuS0EOHoFm9TiJlv3uyXpbMrSgIKC2QL'})
      console.log(poaFiles)

      poaData = await addColumnsFromJSON(poaData)

      let poiData:Document[] = []
      poiData = await addColumnsFromJSON(poiData)

      let sowData:Document[] = []
      let sowFetch = await accessAPI('/database/read', 'POST', {'path': 'db/document_center/sow'})
      if (sowFetch) {
        sowFetch['content'].forEach((entry:Document) => {
          sowData.push(entry)
        })
      }

      sowData = await addColumnsFromJSON(sowData)

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