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
      const account_details:any = {
        'AccountID':accountTimestamp, 
        'TicketID':currentTicket['TicketID'], 
        'TemporalEmail':values.temp_email, 
        'TemporalPassword':values.temp_password, 
        'AccountNumber':values.account_number,
        'IBKRUsername':values.ibkr_username,
        'IBKRPassword':values.ibkr_password
      }
      
      await addDocument(account_details, 'db/clients/accounts', currentTicket['TicketID'])
    
      setCanContinue(true)
  }
  
  // Current ticket
  const [tickets, setTickets] = useState<Ticket[] | null>(null)
  const ticketID = currentTicket['TicketID']

  // Fetch account and ticket data associated to current ticket
  useEffect(() => {

    async function queryData () {

      setTickets(null)
      setAccount(null)

      let data = await queryDocumentsFromCollection('db/clients/accounts/', 'TicketID', ticketID)
      if (data.length > 0) {
        setAccount(data)
        setCanContinue(true)
      } else {
        setAccount(null)
      }

      data = await queryDocumentsFromCollection('db/clients/tickets/', 'TicketID', ticketID)
      let tickets:Ticket[] = []
      if (data) {
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
      }
      tickets = await addColumnsFromJSON(tickets)
      setTickets(tickets)


    }
    
    queryData()

  }, [])

  if (!tickets) {
    return (
      <div></div>
    )
  }

  if (tickets && !account) {
    return (
      <div className='w-[70%] h-full flex flex-col justify-center items-center gap-y-10'>
      <h1 className='text-7xl font-bold'>Create a temporary email.</h1>
      <p className='text-lg font-semibold'>Ticket</p>
      <DataTable data={tickets} width={100}/>
      <p className='text-lg font-semibold'>Account Access Form</p>
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
          <FormField
            control={form.control}
            name="ibkr_account_number"
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
    )
  }

  if (tickets && account) {
    return (
      <div className='w-[70%] h-full flex flex-col gap-y-10 items-center justify-center'>
      <h1 className='text-7xl font-bold'>Account already created.</h1>
      <p className='text-lg font-semibold'>Ticket</p>
      {tickets && <DataTable data={tickets} width={100}/>}
      <p className='text-lg font-semibold'>Account</p>
      {account && <DataTable data={account} width={100}/>}
    </div>
    )
  }
}

export default OpenAccount