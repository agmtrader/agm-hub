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
import { formatTimestamp } from "../../../utils/dates"

import { getDefaults } from '@/utils/form'
import { account_access_schema } from '@/lib/schemas/account'

import { useForm } from 'react-hook-form'
import { Account } from '@/lib/entities/account'
import { Ticket } from '@/lib/entities/ticket'
import { accessAPI } from '@/utils/api'
import { addColumnsFromJSON } from '@/utils/table'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import DashboardPage from '@/components/misc/DashboardPage'
import LoadingComponent from '@/components/misc/LoadingComponent'

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
    { accessorKey: 'country', header: 'Country' },
  ]

  const accountColumns = [
    { accessorKey: 'AccountID', header: 'Account ID' },
    { accessorKey: 'AccountNumber', header: 'Account Number' },
    { accessorKey: 'IBKRUsername', header: 'IBKR Username' },
    { accessorKey: 'IBKRPassword', header: 'IBKR Password' },
    { accessorKey: 'TemporalEmail', header: 'Temporal Email' },
    { accessorKey: 'TemporalPassword', header: 'Temporal Password' },
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

  const slideUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  if (isLoading) return <LoadingComponent className='w-full h-full'/>

  if (!account) {
    return (
      <DashboardPage title='User does not have an active IBKR account' description=''>
      <motion.div className='w-full h-full' variants={slideUp}>
        <motion.p className='text-lg font-semibold' variants={slideUp}>Current Ticket</motion.p>
        <DataTable data={[ticket]} columns={ticketColumns as ColumnDefinition<Ticket>[]}/>
      </motion.div>
      <motion.p className='text-lg font-semibold' variants={slideUp}>IBKR Account Access Form</motion.p>
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
      </DashboardPage>
    )
  } 
  
  else if (account) {
    return (
      <DashboardPage title='User has an active IBKR account' description=''>
        <motion.p className='text-lg font-semibold' variants={slideUp}>Current Ticket</motion.p>
        <motion.div variants={slideUp}>
          <DataTable columns={ticketColumns as ColumnDefinition<Ticket>[]} data={[ticket]}/>
        </motion.div>
        <motion.p className='text-lg font-semibold' variants={slideUp}>IBKR Account Details</motion.p>
        {account && (
          <motion.div variants={slideUp}>
            <DataTable columns={accountColumns as ColumnDefinition<Account>[]} data={[account]}/>
          </motion.div>
        )}
      </DashboardPage>
    )
  }
}

export default OpenAccount
