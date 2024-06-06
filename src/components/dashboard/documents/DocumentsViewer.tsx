import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { DataTable } from "../DataTable"
import { Button } from "@/components/ui/button"

import DocumentUploader from "./DocumentUploader"

const DocumentsViewer = ({documents}:{documents:any}) => {
  return (
    <Carousel className="w-full max-w-3xl h-fit">
      <CarouselContent>
        {Array.from({ length: 3 }).map((document:any, index:number) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex items-center justify-center">
                  <div className='w-full flex flex-col gap-y-5 justify-center items-center h-fit overflow-hidden'>
                    <iframe 
                      src={documents[index] ? documents[index]['URL']:'404'}
                      width="500" 
                      height="600" 
                      className=' '
                      allow="autoplay">
                    </iframe>
                    {documents[index] && <DataTable data={[documents[index]]} width={100}/>}
                    <div className='flex gap-x-5'>
                      <Button className='w-fit h-fit'>Edit document info</Button>
                      <DocumentUploader type={index} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default DocumentsViewer

//https://drive.google.com/file/d/fileID/preview
