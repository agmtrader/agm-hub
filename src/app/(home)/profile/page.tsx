"use client"
import { Button } from '@/components/ui/button'
import { updateFieldInDocument } from '@/utils/api'
import { useSession } from 'next-auth/react'
import React from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { getDefaults } from '@/lib/form'

const page = () => {

  const formSchema = z.object({
    email: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
  })

  let initialFormValues:any = {};
  initialFormValues = getDefaults(formSchema)

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      values: initialFormValues,
  })

  const {data:session} = useSession()

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (session) {
      await updateFieldInDocument(`users/${session.user.id}`, 'email', data.email)
    }
  }

  return (
    <div className='w-full h-[60vh] flex justify-center items-center'>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                Change email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
  </Form>
  </div>
  )
}

export default page