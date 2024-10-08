"use client"
import React, { useState } from 'react'

import { DataTableSelect } from '@/components/dashboard/components/DataTable';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import DocumentViewer from '@/components/dashboard/document_center/DocumentViewer'
import DocumentUploader from '@/components/dashboard/document_center/DocumentUploader'
import { Document, Documents } from '@/lib/types';

interface Props {
  documents: Documents | null,
  setSelection: React.Dispatch<React.SetStateAction<Document | null>>,
  selection: Document | null,
  accountNumber?: string,
  dark?: boolean
}

const DocumentCenter = ({documents, setSelection, selection, accountNumber, dark}:Props) => {

  const [type, setType] = useState<string>('POA')

  return (
    <div className='h-full w-full flex flex-col justify-start gap-y-10 items-center'>

      <Tabs defaultValue="POA" onValueChange={setType} className="w-[80%]">
        <TabsList className={`grid w-full grid-cols-3`}>
            {documents && Object.keys(documents).map((type) => (
              <TabsTrigger key={type} value={type}>{type}</TabsTrigger>
            ))}
          </TabsList>
          {documents && Object.keys(documents).map((type) => (
            <TabsContent key={type} value={type} className='flex flex-col gap-y-10'>
              {document && <DataTableSelect data={documents[type]} setSelection={setSelection} width={100}/>}
            </TabsContent>
          ))}

      </Tabs>

      {selection && <DocumentViewer document={selection}/>}

      <DocumentUploader accountNumber={accountNumber} type={type}/>

    </div>
  )
}

export default DocumentCenter