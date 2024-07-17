"use client"
import React, { useEffect, useState } from 'react'

import { Upload } from "lucide-react"
import { Button } from '@/components/ui/button'
import { google } from 'googleapis'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { new_poa_schema, poa_schema } from "@/lib/form"
import { drive } from 'googleapis/build/src/apis/drive'
import { DocumentData } from 'firebase/firestore'
import { formatTimestamp } from '@/utils/dates'
import { addDocument } from '@/utils/api'

const DocumentUploader = ({type, document}:{type:string, document?:DocumentData}) => {
  
    let formSchema:any;
    let initialFormValues:any;

    const [file, setFile] = useState<File | null>(null)
    let driveId = ''

    switch (type) {
      case 'poa':
        if (document) {
          formSchema = poa_schema
          initialFormValues = {
            issued_date:'',
          }
        } else {
          formSchema = new_poa_schema
          initialFormValues = {
            account_number:'',
            issued_date:'',
          }
        }
        driveId = '1wPsX533MjJLAocS7WKQMTO2uB6Ozi2Dy'
        break;
      case 'poi':
        if (document) {
          formSchema = poa_schema
          initialFormValues = {
            issued_date:'',
          }
        } else {
          formSchema = new_poa_schema
          initialFormValues = {
            account_number:'',
            issued_date:'',
          }
        }
        driveId = '1wPsX533MjJLAocS7WKQMTO2uB6Ozi2Dy'
        initialFormValues = {
          account_number:'',
          issued_date:'',
        }
        break;
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        values: initialFormValues,
    })
    
    async function onSubmit(values: z.infer<typeof formSchema>) {
      const fileInfo = await uploadFile()
      console.log(fileInfo)

      let timestamp = new Date()
      let documentTimestamp = formatTimestamp(timestamp)

      let documentInfo:any

      // https://drive.google.com/uc?export=download&id=

      if (fileInfo) {
        if (document) {
          documentInfo = {'DocumentID':documentTimestamp, 'FileID':fileInfo['id'], 'URL':`https://drive.google.com/file/d/${fileInfo['id']}/preview`, 'TicketID':document['TicketID'], 'Type':type, 'FileName':fileInfo['name']}
          console.log(documentInfo)
        } else {
          documentInfo = {'DocumentID':documentTimestamp, 'FileID':fileInfo['id'], 'URL':`https://drive.google.com/file/d/${fileInfo['id']}/preview`, 'TicketID':values.account_number, 'Type':type, 'FileName':fileInfo['name']}
          console.log(documentInfo)
        }
      }

      await addDocument(documentInfo, `db/document_center/${documentInfo['Type']}`, documentTimestamp)
    }

    const uploadFile = async () => {
      if (!file) return;

      const formData = new FormData();

      formData.append('file', file)
      formData.append('driveId', driveId)

      if (!driveId) return;

      const response = await fetch("/api/drive", {
        method: "POST",
        body: formData,
      });

      const fileInfo = await response.json();

      return fileInfo
    }

  return (
    <div>
        <Dialog>
            <DialogTrigger asChild>
                <Button className='w-fit h-fit flex gap-x-5' >
                    {document ? <p>Reupload {type}</p>:<p>Upload new {type}</p>}
                    <Upload className="h-5 w-5"/>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Upload file</DialogTitle>
                <DialogDescription>
                    Upload files to the document center
                </DialogDescription>
                </DialogHeader>
                  <Form {...form}>
    
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col justify-center items-center">

                      {Object.keys(initialFormValues).map((key:any) => (
                        <FormField
                        key={key}
                        control={form.control}
                        name={key}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{key}</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                      ))}

                      <Input
                        placeholder="Picture"
                        type="file"
                        accept="image/*, application/pdf, text/csv"
                        onChange={(e) => setFile(e.target.files![0])}
                      />

                      <Button className="bg-agm-orange" type="submit">
                        Submit
                      </Button>

                    </form>
                  </Form>
            </DialogContent>
        </Dialog>
    </div>
  )
    
}

export default DocumentUploader

//https://drive.google.com/file/d/{id}/preview