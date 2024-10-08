"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { HardHat } from 'lucide-react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getDefaults } from '@/lib/form'

import { useToast } from '@/hooks/use-toast'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { countries } from '@/lib/form'
import { accessAPI } from '@/utils/api'
import CountriesFormField from '@/components/ui/CountriesFormField'

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  country: z.string(),
  username: z.string().min(4, {
    message: "Username must be at least 4 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

const CreateAccount = () => {

  const { toast } = useToast()

  const initialValues = getDefaults(formSchema)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {

      let data = await accessAPI('/database/read', 'POST', {
          path: 'users',
          key: 'email',
          value: values.email
      })

      console.log(data)
      if (data['status'] === 'error') {
        console.error('Failed to create user:', data['message']);
        toast({
          title: 'Error',
          description: data['message'],
          variant: 'destructive'
        })
      }
      else if (data['content'].length === 1) {
        console.error('User already exists:', data['content'][0]['username']);
        toast({
          title: 'Error',
          description: 'User already exists',
          variant: 'destructive'
        })
      }
      else {
        const response = await accessAPI('/database/create', 'POST', {
            path: 'users',
            data: values,
        })
        if (response['status'] !== 'success') {
          console.error('Failed to create user:', response.message);
          toast({
            title: 'Error',
            description: response.message,
            variant: 'destructive'
          })
        }
      }
      
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while creating your account',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-y-6">
      <h1 className="text-4xl font-bold text-agm-dark-blue">Tell Us About Yourself</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md flex flex-col gap-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="Enter your email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <CountriesFormField form={form} element={{ title: 'Country of Residence', name: 'country' }} />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a username" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter a password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-4">
            Create Account
          </Button>
        </form>
      </Form>
      <Button variant="outline" asChild>
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  )
}

export default CreateAccount
