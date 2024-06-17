"use client"
import React, { useEffect, useState } from 'react'
import DocumentsViewer from '@/components/dashboard/documents/DocumentsViewer'
import { addColumnsFromJSON, getDocumentsFromCollection } from '@/utils/api'
import { sortColumns } from '@/utils/table'
import { DocumentData } from 'firebase-admin/firestore'
import { DataTable, DataTableSelect } from '@/components/dashboard/components/DataTable'

type Props = {}

const page = (props: Props) => {

    // Initialize data variables
    const [documents, setDocuments] = useState<DocumentData[] | null>(null)
    const [currentDocument, setCurrentDocument] = useState<DocumentData | null>(null)

    // Column defs - pass to dictionary!
    const documentColumns = ['Timestamp', 'Type', 'AccountNumber', 'TicketID', 'AGM User', 'URL']
    console.log(documents)
  
    // Fetch documents and ticket data associated to current ticket
    useEffect(() => {
  
      async function queryData () {

        // Fetch ticket with updated status
        let documentsData = await getDocumentsFromCollection('db/clients/documents/')
        documentsData = await addColumnsFromJSON(documentsData)
        setDocuments(sortColumns(documentsData, documentColumns))
      }
      
      queryData()
  
    }, [])
    
  return (
    <div>
        <div className='flex flex-col my-10 gap-x-5'>
          {documents && <DataTableSelect setSelection={setCurrentDocument} data={documents}/>}
          {currentDocument && <DocumentsViewer documents={[currentDocument]}/>}
        </div>
    </div>
  )
}

export default page