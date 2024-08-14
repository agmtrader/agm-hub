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

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { addColumnsFromJSON, addDocument, queryDocumentsFromCollection } from "@/utils/api"
import { formatTimestamp } from "@/utils/dates"
import { getDefaults, account_access_schema } from '@/lib/form'
import { useForm } from 'react-hook-form'
import { Map, Ticket } from '@/lib/types'

interface Props {
  currentTicket:Ticket, 
  setCanContinue: React.Dispatch<React.SetStateAction<boolean>>,
  setAccount: React.Dispatch<React.SetStateAction<any | null>>,
  account: any
}

const OpenAccount = ({currentTicket, setCanContinue, setAccount, account}:Props) => {

  let formSchema:any
  let initialFormValues:any
  
  formSchema = account_access_schema
  initialFormValues = getDefaults(formSchema)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: initialFormValues,
  })
  
  async function onSubmit(values: z.infer<typeof formSchema>) {

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
  console.log(ticketID)

  // Fetch account and ticket data associated to current ticket
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


      data = await queryDocumentsFromCollection('db/clients/accounts/', 'TicketID', ticketID)
      console.log(data)
      if (data.length > 0) {
        setAccount(data)
        setCanContinue(true)
      } else {
        setAccount(null)
      }

    }
    
    queryData()

  }, [])

  return (
    <div className='h-full w-full flex flex-col justify-star items-center'>
      {!account && ticket ? 
          <div className='w-[70%] h-full flex flex-col justify-center items-center gap-y-10'>
            <h1 className='text-7xl font-bold'>Create a temporary email.</h1>
            <DataTable data={ticket} width={100}/>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className=" flex-wrap gap-x-5 gap-y-5 h-fit w-full flex flex-col justify-center items-center">
                <FormField
                  control={form.control}
                  name="temp_email"
                  render={({ field }) => (
                  <FormItem className='w-full h-full'>
                    <FormLabel>Temporary email address</FormLabel>
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
                    <FormLabel>Temporary password</FormLabel>
                    <FormControl>
                        <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <h1 className='text-7xl font-bold'>IBKR Account Accesses</h1>
                <FormField
                  control={form.control}
                  name="account_number"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>IBKR Accout number</FormLabel>
                      <FormControl>
                          <Input {...field} />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ibkr_username"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>IBKR Username</FormLabel>
                      <FormControl>
                          <Input {...field} />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ibkr_password"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>IBKR Password</FormLabel>
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
          :
          <div className='w-[70%] h-full flex flex-col gap-y-10 items-center justify-center'>
            <h1 className='text-7xl font-bold'>Account already created.</h1>
            {ticket && <DataTable data={ticket} width={100}/>}
            {account && <DataTable data={account} width={100}/>}
          </div>
        }
    </div>
  )
}

export default OpenAccount