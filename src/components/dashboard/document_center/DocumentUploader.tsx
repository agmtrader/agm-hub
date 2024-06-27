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
import { createFile } from '@/utils/google-drive'

const DocumentUploader = ({type}:{type:string}) => {
  
    //const searchParams = useSearchParams()
    let formSchema:any;
    let initialFormValues:any;

    const [file, setFile] = useState<File | null>(null)
    console.log(file)

    const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setFile(e.target.files[0]);
      }
    }

    switch (type) {
      case 'poa':
        formSchema = new_poa_schema
        initialFormValues = {
          account_number:'',
          issued_date:'',
          type:'',
          upload:''
        }
        break;
      case 'poi':
        formSchema = new_poa_schema
        initialFormValues = {
          account_number:'',
          issued_date:'',
          type:'',
          upload:''
        }
        break;
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        values: initialFormValues,
    })
    
    async function onSubmit(values: z.infer<typeof formSchema>) {

      if (file) {
  
        const requestBody = {
          name: 'test.csv',
          fields: 'id',
        }
  
        const media = {
          mimeType: 'text/csv',
          body: file,
        }

        try {

          //const file = await createFile(requestBody, media)
          const file = null
          
          if (file) {
            console.log('File Id:', file.data.id);
            return file.data.id;
          }

        } catch (err) {
          // TODO(developer) - Handle error
          throw err;
        }
        console.log(values, file)
      }
    }

  return (
    <div>
        <Dialog>
            <DialogTrigger asChild>
                <Button className='w-fit h-fit flex gap-x-5' >
                    <p>Upload new file</p>
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

                      {Object.keys(initialFormValues).slice(0,Object.keys(initialFormValues).length - 1).map((key:any) => (
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
                        onChange={(event) =>
                          handleUploadFile(event)
                        }
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

