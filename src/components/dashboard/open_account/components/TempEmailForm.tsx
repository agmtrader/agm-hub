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

import { DocumentData } from 'firebase/firestore'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { addDocument } from "@/utils/api"
import { formatTimestamp } from "@/utils/dates"
import { temp_email_schema } from '@/lib/form'
import { useForm } from 'react-hook-form'

interface Props {
    currentTicket: DocumentData,
    setCanContinue: React.Dispatch<React.SetStateAction<boolean>>
}

const TempEmailForm = ({currentTicket, setCanContinue}: Props) => {

    let initialFormValues = {
      temp_email:'',
      temp_password:''
    }

    const form = useForm<z.infer<typeof temp_email_schema>>({
      resolver: zodResolver(temp_email_schema),
      values: initialFormValues,
    })
    
    async function onSubmit(values: z.infer<typeof temp_email_schema>) {

        let timestamp = new Date()
        let accountTimestamp = formatTimestamp(timestamp)
        
        // TODO create type for this
        const account_details:any = {'Timestamp':accountTimestamp, 'TicketID':currentTicket['TicketID'], 'TemporalEmail':values.temp_email, 'TemporalPassword':values.temp_password}
        
        //await addDocument(account, 'db/clients/accounts', currentTicket['TicketID'])
        console.log(account_details)
    }

  return (
    <div>
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

export default TempEmailForm