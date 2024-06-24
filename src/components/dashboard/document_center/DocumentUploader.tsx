"use client"
import React, { useEffect } from 'react'

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
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

type Props = {
    type: number
}
const formSchema = z.object({

    ticket_id: z.string().min(1, {
      message: "Username cannot be empty.",
    }),
  
    timestamp: z.string().min(2, {
      message: "Country cannot be empty.",
    }),
  
    type: z.string().min(2, {
      message: "You must select an account type.",
    }),
  
    url: z.string().min(2, {
      message: "You must select an account type.",
    }),
  
  })

const DocumentUploader = ({type}: Props) => {
    
    //const searchParams = useSearchParams()
    
    let initialFormValues = {
        ticket_id: '',
    
        timestamp: '',
    
        type: '',
    
        agm_user: '',
    
        url: ''
    }
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        values: initialFormValues,
    })
    
    async function onSubmit(values: z.infer<typeof formSchema>) {
    
    }

  return (
    <div>
        <Dialog>
            <DialogTrigger asChild>
                <Button className='w-fit h-fit flex gap-x-5' >
                    <p>Reupload file</p>
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

                            <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            
                            <FormField
                            control={form.control}
                            name="timestamp"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                                                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />

                            <Button className="bg-agm-orange" type="submit">
                            Start my application
                            </Button>

                        </form>
                    </Form>
                <DialogFooter>
                <Button type="submit">Upload</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default DocumentUploader

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Ticket } from "@/lib/types"

import { addDocument } from "@/utils/api"
import { formatTimestamp } from "@/utils/dates"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { countries, account_types } from "@/lib/form"

