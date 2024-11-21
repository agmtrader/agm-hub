"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
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
import { getDefaults } from '@/utils/form'
import { useToast } from '@/hooks/use-toast'
import { accessAPI } from '@/utils/api'
import CountriesFormField from '@/components/ui/CountriesFormField'
import { formatTimestamp } from '@/utils/dates'
import { signIn } from 'next-auth/react'
import { formatURL } from '@/utils/lang'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { User } from 'next-auth'

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
  confirmPassword: z.string().min(8, {
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
  const { lang } = useTranslationProvider()

  const router = useRouter()
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  async function onSubmit(values: z.infer<typeof formSchema>) {

      let response = await accessAPI('/database/read', 'POST', {
          path: 'users',
          query: {
            email: values.email
          }
      })

      if (response['status'] === 'error') {
        toast({
          title: 'Error',
          description: response['message'],
          variant: 'destructive'
        })
        throw new Error('Tragic failure')
      } else if (response['content'].length === 1) {
        toast({
          title: 'Error',
          description: 'User with that email already exists',
          variant: 'destructive'
        })
        throw new Error('User with that email already exists')
      } else if (response['content'].length > 1) {
        toast({
          title: 'Error',
          description: 'Multiple users with that email',
          variant: 'destructive'
        })
        throw new Error('Multiple users with that email')
      }

      response = await accessAPI('/database/read', 'POST', {
        path: 'users',
        query: {
          username: values.username
        }
      })

      if (response['status'] === 'error') {
        toast({
          title: 'Error',
          description: response['message'],
          variant: 'destructive'
        })
        throw new Error('Tragic failure')
      } else if (response['content'].length !== 0) {
        toast({
          title: 'Error',
          description: 'Username already taken.',
          variant: 'destructive'
        })
        throw new Error('Username already taken')
      }

      if (values.password !== values.confirmPassword) {
        toast({
          title: 'Error',
          description: 'Passwords do not match',
          variant: 'destructive'
        })
        throw new Error('Passwords do not match')
      }

      const timestamp = formatTimestamp(new Date())

      const user:User = {
        'id': timestamp,
        'name': values.name,
        'email': values.email,
        'emailVerified': false,
        'image': '',
        'username': values.username,
        'password': values.password,
        'country': values.country,
        'role': 'user'
      }

      response = await accessAPI('/database/create', 'POST', {
          path: 'users',
          data: user,
          id: timestamp
      })

      if (response['status'] !== 'success') {
        console.error('Failed to create user:', response.message);
        toast({
          title: 'Error',
          description: response.message,
          variant: 'destructive'
        })
      }

      toast({
        title: 'Success',
        description: 'Account created successfully',
        variant: 'default'
      })

      const result = await signIn('credentials', {
        username: values.username,
        password: values.password,
        redirect: false,
        callbackUrl: callbackUrl ? formatURL(callbackUrl, lang) : formatURL('/', lang)
      });

      if (result?.ok) {
        router.push(callbackUrl ? formatURL(callbackUrl, lang) : formatURL('/', lang));
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm your password" {...field} />
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
