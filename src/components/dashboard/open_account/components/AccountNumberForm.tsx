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
import { useForm } from 'react-hook-form'

import { account_number_schema } from '@/lib/form'
import { DocumentData } from 'firebase/firestore'

interface Props {
    currentTicket:DocumentData, 
    setCanContinue: React.Dispatch<React.SetStateAction<boolean>>
}

const AccountNumberForm = ({setCanContinue}: Props) => {

    let initialFormValues = {
        account_number:''
    }

    const form = useForm<z.infer<typeof account_number_schema>>({
        resolver: zodResolver(account_number_schema),
        values: initialFormValues,
    })
    
    async function onSubmit(values: z.infer<typeof account_number_schema>) {

        // TODO create type for account access form
        const account_number:any = {'AccountNumber':values.account_number}
        
        //await addDocument(account, 'db/clients/accounts', currentTicket['TicketID'])
        setCanContinue(true)

        console.log(account_number)
    }

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" flex-wrap gap-x-5 gap-y-5 h-fit w-full flex flex-row justify-center items-center">
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
  )
}

export default AccountNumberForm