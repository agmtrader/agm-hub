import * as React from "react"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { DataTable } from "../components/DataTable"
import { Button } from "@/components/ui/button"

import DocumentUploader from "./DocumentUploader"
import { DocumentData } from "firebase-admin/firestore"

const DocumentViewer = ({document}:{document:DocumentData}) => {
  return (
    <Card>
      <CardContent className="flex items-center my-5 justify-center">
        <div className='w-full flex flex-col gap-y-5 justify-center items-center h-fit overflow-hidden'>
          <iframe 
            src={document ? document['URL']:'404'}
            width="500" 
            height="600" 
            className=' '
            allow="autoplay">
          </iframe>
          <div className='flex gap-x-5'>
            <DocumentUploader type={document['type']} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DocumentViewer