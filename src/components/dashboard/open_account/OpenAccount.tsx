"use client"
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

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
import { ColumnDefinition, DataTable } from '../components/DataTable'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { formatTimestamp } from "@/utils/dates"
import { getDefaults, account_access_schema } from '@/lib/form'
import { useForm } from 'react-hook-form'
import { Account, Ticket } from '@/lib/types'
import { accessAPI } from '@/utils/api'
import { addColumnsFromJSON } from '@/utils/table'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface Props {
  ticket:Ticket, 
  setCanContinue: React.Dispatch<React.SetStateAction<boolean>>,
  setAccount: React.Dispatch<React.SetStateAction<any | null>>,
  account: any
}

const OpenAccount = ({ticket, setCanContinue, setAccount, account}:Props) => {

  let formSchema:any
  formSchema = account_access_schema

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: getDefaults(formSchema),
  })

  const {toast} = useToast()

  const ticketColumns = [
    { accessorKey: 'TicketID', header: 'Ticket ID' },
    { accessorKey: 'Status', header: 'Status' },
    { accessorKey: 'first_name', header: 'First Name' },
    { accessorKey: 'last_name', header: 'Last Name' },
    { accessorKey: 'Advisor', header: 'Advisor' },
  ]

  const accountColumns = [
    { accessorKey: 'AccountID', header: 'Account ID' },
    { accessorKey: 'AccountNumber', header: 'Account Number' },
  ]
  
  // Current ticket
  const ticketID = ticket['TicketID']
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Try to fetch account and ticket data associated to current ticket
  useEffect(() => {

    async function queryData () {
      try {
        setIsLoading(true)
        setAccount(null)

        // Fetch account data
        let response = await accessAPI('/database/read', 'POST', {'path': 'db/clients/accounts', 'query': {'TicketID': ticketID}})
        if (response.status !== 'success') {
          throw new Error('Failed to fetch account data');
        }
        let accounts = response['content']

        // Verify there is only one account
        if (accounts.length === 1) {
          if (ticket['Status'] !== 'Ready for application' && ticket['Status'] !== 'Opened') {
            response = await accessAPI('/database/update', 'POST', {'path': `db/clients/tickets`, 'query': {'TicketID': ticketID}, 'data': {'Status': 'Documents need revision'}})
            if (response.status !== 'success') {
              throw new Error('Failed to update ticket status')
            }
          }
          accounts = await addColumnsFromJSON(accounts)
          setAccount(accounts[0])
          setCanContinue(true)

        } else if (accounts.length === 0) {
          response = await accessAPI('/database/update', 'POST', {'path': `db/clients/tickets`, 'query': {'TicketID': ticketID}, 'data': {'Status': 'Missing IBKR account'}})
          if (response.status !== 'success') {
            throw new Error('Failed to update ticket status')
          }

        } else if (accounts.length > 1) {
          throw new Error('More than one account found.')

        } else {
          throw new Error('An unexpected error occurred.')
        }

      } catch (error) {
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

  // Submit account details when creating a new account in IBKR
  async function onSubmit(values: z.infer<typeof formSchema>) {
    
    setIsSubmitting(true);
    
    try {
      let timestamp = new Date()
      let accountTimestamp = formatTimestamp(timestamp)
      
      // TODO create type for this
      const account_details:Account = {
        'AccountID':accountTimestamp, 
        'TicketID':ticket['TicketID'], 
        'TemporalEmail':values.temp_email, 
        'TemporalPassword':values.temp_password, 
        'AccountNumber':values.account_number,
        'IBKRUsername':values.ibkr_username,
        'IBKRPassword':values.ibkr_password,
        'Advisor':ticket['Advisor']
      }
      
      let response = await accessAPI('/database/create', 'POST', {'path': 'db/clients/accounts', 'data': account_details, 'id': accountTimestamp})
      
      if (response.status !== 'success') {
        throw new Error('Failed to create account');
      }

      response = await accessAPI('/database/read', 'POST', {'path': 'db/clients/accounts', 'query': {'TicketID': ticketID}})
      if (response.status !== 'success') {
        throw new Error('Failed to fetch account data');
      }
      let accounts = response['content']
      if (accounts.length === 1) {
        accounts = await addColumnsFromJSON(accounts)
        setAccount(accounts[0])
        response = await accessAPI('/database/update', 'POST', {'path': `db/clients/tickets`, 'query': {'TicketID': ticketID}, 'data': {'Status': 'Documents need revision'}})
        if (response.status !== 'success') {
          throw new Error('Failed to update ticket status')
        }
      } else {
        throw new Error('An unexpected error occurred.')
      }
      setCanContinue(true);

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

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  }

  const slideUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  if (isLoading) {
    return (
      <motion.div 
        className="flex flex-col w-full h-full items-center justify-center gap-y-10"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <motion.p className='text-7xl font-bold text-foreground' variants={fadeIn}>Checking account status...</motion.p>
        <motion.div variants={fadeIn}>
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </motion.div>
      </motion.div>
    )
  }

  if (!account) {
    return (
    <motion.div 
      className='w-fit h-fit justify-center items-center flex flex-col gap-y-10'
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <motion.h1 className='text-7xl font-bold text-foreground' variants={slideUp}>Open a new IBKR account.</motion.h1>
      <motion.p className='text-2xl text-subtitle' variants={slideUp}>Current Ticket</motion.p>
      <motion.div className='w-full h-full' variants={slideUp}>
        <DataTable data={[ticket]} width={100} columns={ticketColumns as ColumnDefinition<Ticket>[]}/>
      </motion.div>
      <motion.p className='text-2xl text-subtitle' variants={slideUp}>Internal IBKR Account Access Form</motion.p>
      <Form {...form}>
        <motion.form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="flex flex-col text-foreground gap-y-10 w-full"
          variants={slideUp}
        >
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
          <motion.div 
            className='w-full h-full flex justify-center items-center'
            variants={slideUp}
          >
            {
              isSubmitting ? (
                <Button className="h-full w-fit" type="submit">
                  <Loader2 className="h-4 w-4 animate-spin text-background" /> 
                  Submitting...
                </Button>
              ) : (
                <Button className="h-full w-fit text-background" type="submit">Submit</Button>
              )
            }
          </motion.div>
        </motion.form>
      </Form>
    </motion.div>
    )
  } 
  
  else if (account) {
    return (
      <motion.div 
        className='w-full h-full flex flex-col items-center justify-center gap-y-10'
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <motion.h1 className='text-7xl font-bold text-foreground' variants={slideUp}>Active IBKR account</motion.h1>
        <motion.p className='text-lg text-subtitle' variants={slideUp}>Ticket</motion.p>
        <motion.div variants={slideUp}>
          <DataTable columns={ticketColumns as ColumnDefinition<Ticket>[]} data={[ticket]} width={100}/>
        </motion.div>
        <motion.p className='text-lg text-subtitle' variants={slideUp}>IBKR Account Details</motion.p>
        {account && (
          <motion.div variants={slideUp}>
            <DataTable columns={accountColumns as ColumnDefinition<Account>[]} data={[account]} width={100}/>
          </motion.div>
        )}
      </motion.div>
    )
  }
}

export default OpenAccount
