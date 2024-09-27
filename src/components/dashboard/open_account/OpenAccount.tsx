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
import { formatTimestamp } from "@/utils/dates"
import { getDefaults, account_access_schema } from '@/lib/form'
import { useForm } from 'react-hook-form'
import { Map, Ticket } from '@/lib/types'
import { accessAPI } from '@/utils/api'
import { ScrollArea } from '@/components/ui/scroll-area'

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
        'AccountNumber':values.ibkr_account_number,
        'IBKRUsername':values.ibkr_username,
        'IBKRPassword':values.ibkr_password
      }
      
      let response = await accessAPI('/database/create', 'POST', {'path': 'db/clients/accounts', 'data': account_details, 'id': accountTimestamp})
      console.log(response)
    
      setCanContinue(true)
  }

  console.log(form.formState.errors)
  
  // Current ticket
  const [tickets, setTickets] = useState<Ticket[] | null>(null)
  const ticketID = currentTicket['TicketID']

  // Fetch account and ticket data associated to current ticket
  useEffect(() => {

    async function queryData () {

      setTickets(null)
      setAccount(null)

      let response = await accessAPI('/database/read', 'POST', {'path': 'db/clients/tickets', 'key': 'TicketID', 'value': ticketID})
      let data = response['content']
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
      setTickets(tickets)

      response = await accessAPI('/database/read', 'POST', {'path': 'db/clients/accounts', 'key': 'TicketID', 'value': ticketID})
      let accounts = response['content']
      if (accounts.length == 1) {
        setAccount(accounts)
        setCanContinue(true)
      } else {
        console.error('No account or too many accounts found for ticket.')
        setAccount(null)
        setCanContinue(false)
      }

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
    <div className='w-full h-fit justify-center items-center flex flex-col gap-y-10'>
      <h1 className='text-7xl font-bold'>Open the user's IBKR account.</h1>
      <p className='text-2xl text-subtitle'>Current Ticket</p>
      <DataTable data={tickets} width={90}/>
      <p className='text-2xl text-subtitle'>Internal IBKR Account Access Form</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-10">
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
    )
  }

  if (tickets && account) {
    return (
      <div className='w-full h-full flex flex-col gap-y-10'>
      <h1 className='text-7xl font-bold'>User already has an IBKR account.</h1>
      <p className='text-lg font-semibold'>Ticket</p>
      {tickets && <DataTable data={tickets} width={90}/>}
      <p className='text-lg font-semibold'>IBKR Account Details</p>
      {account && <DataTable data={account} width={90}/>}
    </div>
    )
  }
}

export default OpenAccount