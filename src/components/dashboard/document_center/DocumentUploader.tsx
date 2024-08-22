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

import { getDefaults, new_poa_schema, new_poi_schema, new_sow_schema, poa_schema, poi_schema, sow_schema } from "@/lib/form"
import { drive } from 'googleapis/build/src/apis/drive'
import { DocumentData } from 'firebase/firestore'
import { formatTimestamp } from '@/utils/dates'
import { addDocument } from '@/utils/api'
import { Document } from '@/lib/types'
import { useSession } from 'next-auth/react'

const DocumentUploader = ({type, document, accountNumber}:{type:string, document?:Document, accountNumber?:string}) => {
  
    let formSchema:any;
    let initialFormValues:any;

    const [file, setFile] = useState<File | null>(null)
    let driveId = ''

    // Set initial form values
    switch (type) {

      case 'POA':
        if (document) {

          // If reuploading
          formSchema = poa_schema
          initialFormValues = getDefaults(formSchema)

        } else {

          // New document
          formSchema = new_poa_schema
          initialFormValues = getDefaults(formSchema)

          if (!accountNumber) {
            initialFormValues['account_number'] = ''
          } else {
            initialFormValues['account_number'] = accountNumber
          }

        }
        driveId = '1tuS0EOHoFm9TiJlv3uyXpbMrSgIKC2QL'
        break;

      case 'POI':

        if (document) {

          // If reuploading
          formSchema = poi_schema
          initialFormValues = getDefaults(formSchema)

        } else {

          // New document
          formSchema = new_poi_schema
          initialFormValues = getDefaults(formSchema)

          if (!accountNumber) {
            initialFormValues['account_number'] = ''
          } else {
            initialFormValues['account_number'] = accountNumber
          }
          
        }
        driveId = '1VY0hfcj3EKcDMD6O_d2_gmiKL6rSt_M3'
        break;

      case 'SOW':
        if (document) {

          // If reuploading
          formSchema = sow_schema
          initialFormValues = getDefaults(formSchema)

        } else {

          // New document
          formSchema = new_sow_schema
          initialFormValues = getDefaults(formSchema)

          if (!accountNumber) {
            initialFormValues['account_number'] = ''
          } else {
            initialFormValues['account_number'] = accountNumber
          }
          
        }
        driveId = '1WNJkWYWPX6LqWGOTsdq6r1ihAkPJPMHb'
        break;
    
    }
    
    const {data:session} = useSession()
    const [message, setMessage] = useState<string>('')

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        values: initialFormValues,
    })
    
    async function onSubmit(values: z.infer<typeof formSchema>) {

      setMessage('Loading...')

      const fileInfo = await uploadFile()

      let timestamp = new Date()
      let documentTimestamp = formatTimestamp(timestamp)

      let documentInfo:any

      // https://drive.google.com/uc?export=download&id={id}
      // https://drive.google.com/file/d/{id}/preview


      if (fileInfo) {

        if (!session) {return};
        if (!session.user.email) {return};

        documentInfo = {
          'DocumentID':documentTimestamp, 
          'FileID':fileInfo['id'], 
          'Type':type, 
          'FileName':fileInfo['name'], 
          'FileInfo':values, 
          'AGMUser':session?.user.email,
          'AccountNumber':values.account_number
        }

        if (accountNumber) {
          documentInfo['AccountNumber'] = accountNumber
        }


      await addDocument(documentInfo, `db/document_center/${documentInfo['Type'].toLowerCase()}`, documentTimestamp)
      setMessage('File uploaded successfully')
      }

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
      console.log(response)

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
            <DialogContent className="h-[75%] gap-y-5 max-w-[80%] w-full flex-wrap flex">
                <DialogHeader>
                <DialogTitle>Upload {type}</DialogTitle>
                <DialogDescription>
                    Upload {type} to the document center
                </DialogDescription>
                </DialogHeader>
                  <Form {...form}>
    
                    <form onSubmit={form.handleSubmit(onSubmit)} className="h-[80%] w-full flex flex-col flex-wrap justify-center gap-y-5 gap-x-5 items-center">

                      {Object.keys(initialFormValues).map((key:any) => (
                        <FormField
                        key={key}
                        control={form.control}
                        name={key}
                        render={({ field }) => (
                            <FormItem className='w-[20%]'>
                            <FormLabel>{key}</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                      ))}

                      <FormField
                        control={form.control}
                        name='file'
                        render={({ field }) => (
                            <FormItem className='w-[20%]'>
                            <FormLabel>File</FormLabel>
                            <FormControl>
                            <Input
                              placeholder="Picture"
                              type="file"
                              accept="image/*, application/pdf, text/csv"
                              onChange={(e) => setFile(e.target.files![0])}
                            />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                      />

                      <Button className="bg-agm-orange" type="submit">
                        Submit
                      </Button>

                      <p>{message}</p>

                    </form>

                  </Form>
            </DialogContent>
        </Dialog>
    </div>
  )
    
}

export default DocumentUploader

//https://drive.google.com/file/d/{id}/preview
