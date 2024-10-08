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
import { addColumnsFromJSON, sortColumns } from '@/utils/table'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

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

  const {toast} = useToast()
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
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
      
      let response = await accessAPI('/database/create', 'POST', {'path': 'db/clients/accounts', 'data': account_details, 'id': accountTimestamp})
      
      if (response.status !== 'success') {
        throw new Error('Failed to create account');
      }

      setCanContinue(true);
      setAccount(account_details);
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An unexpected error occurred',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false);
    }
  }
  
  // Current ticket
  const [tickets, setTickets] = useState<Ticket[] | null>(null)
  const ticketID = currentTicket['TicketID']

  const ticketColumns = ['TicketID', 'Status', 'first_name', 'last_name', 'Advisor']
  const accountColumns = ['AccountID', 'TicketID', 'TemporalEmail', 'TemporalPassword', 'AccountNumber', 'IBKRUsername', 'IBKRPassword']

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch account and ticket data associated to current ticket
  useEffect(() => {

    async function queryData () {
      try {
        setIsLoading(true)
        setTickets(null)
        setAccount(null)

        let response = await accessAPI('/database/read', 'POST', {'path': 'db/clients/tickets', 'key': 'TicketID', 'value': ticketID})
        if (response.status !== 'success') {
          throw new Error('Failed to fetch ticket data');
        }
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
        tickets = await addColumnsFromJSON(tickets)
        tickets = sortColumns(tickets, ticketColumns)
        setTickets(tickets)

        response = await accessAPI('/database/read', 'POST', {'path': 'db/clients/accounts', 'query': {'TicketID': ticketID}})
        if (response.status !== 'success') {
          throw new Error('Failed to fetch account data');
        }
        let accounts = response['content']
        console.log(accounts)
        if (accounts.length === 1) {
          accounts = await addColumnsFromJSON(accounts)
          accounts = sortColumns(accounts, accountColumns)
          setAccount(accounts)
          setCanContinue(true)
        } else if (accounts.length === 0) {
          throw new Error('No account found for ticket.')
        } else if (accounts.length > 1) {
          throw new Error('Too many accounts found for ticket.')
        } else {
          throw new Error('An unexpected error occurred.')
        }
      } catch (error) {
        console.error(error)
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'An unexpected error occurred',
          variant: 'destructive'
        })
        setAccount(null)
        setCanContinue(false)
      } finally {
        setIsLoading(false)
      }
    }
    
    queryData()

  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center gap-y-10">
        <p className='text-7xl font-bold'>Checking account status...</p>
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    )
  }

  if (tickets && !account) {
    return (
    <div className='w-fit h-fit justify-center items-center flex flex-col gap-y-10'>
      <h1 className='text-7xl font-bold'>Open a new IBKR account.</h1>
      <p className='text-2xl text-subtitle'>Current Ticket</p>
      <div className='w-full h-full'>
      {tickets && <DataTable data={tickets} width={100}/>}
      </div>
      <p className='text-2xl text-subtitle'>Internal IBKR Account Access Form</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-10 w-full">
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
          <div className='w-full h-full flex justify-center items-center'>
            <Button className="bg-green-600 h-full w-fit" type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
    )
  }

  if (tickets && account) {
    return (
      <div className='w-full h-full flex flex-col items-center justify-center gap-y-10'>
      <h1 className='text-7xl font-bold'>Active IBKR account</h1>
      <p className='text-lg text-subtitle'>Ticket</p>
      {tickets && <DataTable data={tickets} width={90}/>}
      <p className='text-lg text-subtitle'>IBKR Account Details</p>
      {account && <DataTable data={account} width={90}/>}
    </div>
    )
  }
}

export default OpenAccount