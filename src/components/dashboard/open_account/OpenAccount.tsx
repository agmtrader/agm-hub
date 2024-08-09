"use client"
import React, { useEffect, useState } from 'react'

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

import { DataTable } from '../components/DataTable'

import { DocumentData } from 'firebase/firestore'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { addColumnsFromJSON, addDocument, queryDocumentsFromCollection } from "@/utils/api"
import { formatTimestamp } from "@/utils/dates"
import { account_access_schema, getDefaults, temp_email_schema } from '@/lib/form'
import { useForm } from 'react-hook-form'
import { Documents, Map, Ticket } from '@/lib/types'
import { sortColumns } from '@/utils/table'

interface Props {
  currentTicket:Ticket, 
  setCanContinue: React.Dispatch<React.SetStateAction<boolean>>
}

const OpenAccount = ({currentTicket, setCanContinue}:Props) => {

  let formSchema:any
  let initialFormValues:any
  
  formSchema = temp_email_schema
  initialFormValues = getDefaults(formSchema)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: initialFormValues,
  })
  
  async function onSubmit(values: z.infer<typeof temp_email_schema>) {

      let timestamp = new Date()
      let accountTimestamp = formatTimestamp(timestamp)
      
      // TODO create type for this
      const account_details:any = {'AccountID':accountTimestamp, 'TicketID':currentTicket['TicketID'], 'TemporalEmail':values.temp_email, 'TemporalPassword':values.temp_password, 'AccountNumber':values.account_number}
      
      await addDocument(account_details, 'db/clients/accounts', currentTicket['TicketID'])
    
      setCanContinue(true)
  }
  
  // Current ticket
  const [ticket, setTicket] = useState<Ticket[] | null>(null)
  const ticketID = currentTicket['TicketID']

  // Fetch documents and ticket data associated to current ticket
  useEffect(() => {

    async function queryData () {

      let data = await queryDocumentsFromCollection('db/clients/tickets/', 'TicketID', ticketID)

      let tickets:Ticket[] = []
      data.forEach((entry:Map) => {
        tickets.push(
          {
            'TicketID': entry['TicketID'],
            'Status': entry['Status'],
            'ApplicationInfo': entry['ApplicationInfo'],
            'Advisor': entry['Advisor']
          }
        )
      })

      tickets = await addColumnsFromJSON(tickets)
      setTicket(tickets)

    }
    
    queryData()

  }, [])


  return (
    <div className='h-full w-[70%] flex flex-col justify-start gap-y-10 items-center'>

        <h1 className='text-7xl font-bold'>Create a temporary email.</h1>
        {ticket && <DataTable data={ticket} width={100}/>}

        <div className="h-full w-full flex flex-col justify-center items-center">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" flex-wrap gap-x-5 gap-y-5 h-fit w-full flex flex-col justify-center items-center">
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
              <h1 className='text-3xl'>Open user's account and save account number.</h1>
              <FormField
                control={form.control}
                name="account_number"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Accout number</FormLabel>
                    <FormControl>
                        <Input {...field} />
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

export default OpenAccount