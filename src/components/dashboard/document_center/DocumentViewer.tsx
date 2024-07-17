import * as React from "react"

import { Card, CardContent, CardTitle } from "@/components/ui/card"

import DocumentUploader from "./DocumentUploader"

import { DocumentData } from "firebase-admin/firestore"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const DocumentViewer = ({document}:{document:DocumentData}) => {
  return (
    <Card>
      <CardContent className="flex items-center my-5 justify-center">
        <div className='w-full flex flex-col gap-y-5 justify-center items-center h-fit overflow-hidden'>
          <iframe 
            src={document ? document['URL']:''}
            width="500" 
            height="600" 
            className=' '
            allow="autoplay">
          </iframe>
          <div className='flex gap-x-5'>
            <DocumentUploader document={document}type={document['Type']}/>
            <Button asChild>
              <Link href={`https://drive.google.com/uc?export=download&id=${document['FileID']}`} passHref>
                Download File
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DocumentViewer