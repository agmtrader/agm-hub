"use client"
import React, { useEffect, useState } from 'react'

import { Upload } from "lucide-react"
import { Button } from '@/components/ui/button'

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
import { DocumentData } from 'firebase-admin/firestore'

const DocumentUploader = ({type}:{type:string}) => {
  
    //const searchParams = useSearchParams()
    let formSchema:any;
    let initialFormValues:any;

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
      console.log(values)
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

                      <Button className="bg-agm-orange" type="submit">
                        Upload file
                      </Button>

                    </form>
                  </Form>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default DocumentUploader

