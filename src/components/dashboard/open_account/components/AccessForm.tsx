"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { updateFieldInDocument } from "@/utils/api"

import { account_access_schema, getDefaults } from "@/lib/form"

interface Props {
  ticketID:string,
  setCanContinue: React.Dispatch<React.SetStateAction<boolean>>
}

const AccessForm = ({ticketID, setCanContinue}:Props) => {

  let formSchema:any
  let initialValues: any
  
  formSchema = account_access_schema
  initialValues = getDefaults(formSchema)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: initialValues
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {

    // TODO create type for account access form
    const account:any = {'Name':values.name, 'Last name':values.lastname, 'IBKR Username':values.username, 'IBKR Password':values.password, 'Advisor':null}

    Object.keys(account).forEach(async key =>  {
      await updateFieldInDocument(`db/clients/accounts/${ticketID}`, key, account[key])
    })

  }

  return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="gap-x-10 flex-wrap gap-y-5 h-full w-[50%] flex flex-row justify-center items-center">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                    <Input {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                <FormLabel>IBKR Username</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                <FormLabel>IBKR Password</FormLabel>
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
                <FormLabel>IBKR Account Number</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button className="bg-green-600" type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    )
}
  
export default AccessForm