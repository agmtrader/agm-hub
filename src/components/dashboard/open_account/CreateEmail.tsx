"use client"
import React from 'react'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { addDocument } from "@/utils/api"
import { formatTimestamp } from "@/utils/dates"
import { DocumentData } from 'firebase/firestore'

const formSchema = z.object({

  temp_email: z.string(),

  temp_password: z.string()

})

interface Props {
  currentTicket:DocumentData, 
  setCanContinue: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateEmail = ({currentTicket, setCanContinue}:Props) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
      let timestamp = new Date()
      let accountTimestamp = formatTimestamp(timestamp)
      const account:any = {'Timestamp':accountTimestamp, 'TicketID':currentTicket['TicketID'], 'TemporalEmail':values.temp_email, 'TemporalPassword':values.temp_password}
      await addDocument(account, 'db/clients/accounts', currentTicket['TicketID'])
      setCanContinue(true)
  }

  return (
    <div className='h-full w-full flex flex-col justify-start gap-y-10 items-center'>
        <h1 className='text-7xl font-bold'>Create a temporary email.</h1>
        
        <div className="h-full w-full flex flex-col justify-center items-center">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" flex-wrap gap-x-5 gap-y-5 h-fit w-full flex flex-row justify-center items-center">
              <FormField
                control={form.control}
                name="temp_email"
                render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                      <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
              <FormField
                control={form.control}
                name="temp_password"
                render={({ field }) => (
                  <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                      <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
              />
              <Button className="bg-green-600 h-full" type="submit">Submit</Button>
              </form>
            </Form>
        </div>
    </div>
  )
}

export default CreateEmail