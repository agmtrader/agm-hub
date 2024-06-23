"use client"
import React, { useEffect, useState } from 'react'
import DocumentsViewer from '../../../components/dashboard/document_center/DocumentViewer'
import { addColumnsFromJSON, getDocumentsFromCollection } from '@/utils/api'
import { sortColumns } from '@/utils/table'
import { DocumentData } from 'firebase-admin/firestore'
import { DataTable, DataTableSelect } from '@/components/dashboard/components/DataTable'

type Props = {}

const page = (props: Props) => {

    // Initialize data variables
    const [poiData, setPOIData] = useState<DocumentData[] | null>(null)
    const [poaData, setPOAData] = useState<DocumentData[] | null>(null)

    const [currentDocument, setCurrentDocument] = useState<DocumentData | null>(null)

    // Column defs - pass to dictionary!
    const documentColumns = ['Timestamp', 'Type', 'AccountNumber', 'TicketID', 'AGM User', 'URL']
  
    // Fetch documents and ticket data associated to current ticket
    useEffect(() => {
  
      async function queryData () {

        // Fetch ticket with updated status
        let documentsData = await getDocumentsFromCollection('db/document_center/poi/')
        documentsData = await addColumnsFromJSON(documentsData)
        setPOIData(sortColumns(documentsData, documentColumns))

        documentsData = await getDocumentsFromCollection('db/document_center/poa/')
        documentsData = await addColumnsFromJSON(documentsData)
        setPOAData(sortColumns(documentsData, documentColumns))
      }
      
      queryData()
  
    }, [])
    
  return (
    <div>
        <div className='flex flex-col my-10 justify-center items-center gap-y-10'>
          <h1 className='text-7xl font-bold'>AGM Document Center</h1>

          <Tabs defaultValue="poa" className="w-[80%]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="poa">Proof of Address</TabsTrigger>
              <TabsTrigger value="poi">Proof of Identity</TabsTrigger>
            </TabsList>
            <TabsContent value="poa" className='flex flex-col gap-y-10'>
              {poaData && <DataTableSelect width={100} setSelection={setCurrentDocument} data={poaData}/>}
              {currentDocument && <DocumentsViewer document={currentDocument}/>}
            </TabsContent>
            <TabsContent value="poi">
              {poiData && <DataTableSelect width={100} setSelection={setCurrentDocument} data={poiData}/>}
              {currentDocument && <DocumentsViewer document={currentDocument}/>}
            </TabsContent>
          </Tabs>
        </div>
    </div>
  )
}

export default page

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"