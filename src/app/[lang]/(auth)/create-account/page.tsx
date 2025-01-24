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
import { ArrowLeft } from 'lucide-react'
import { containerVariants, itemVariants } from '@/lib/anims'
import { motion } from 'framer-motion'

type UserPayload = User & {
  password: string
}

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

  const { lang, t } = useTranslationProvider()
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

      const user:UserPayload = {
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
    <div className="container mx-auto p-8 min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-xl bg-card p-8 rounded-lg shadow-lg">
        <motion.div variants={itemVariants} className='flex flex-col items-center gap-2 mb-6'>
          <div className="flex items-center gap-2">
            <Button className='w-fit' variant="ghost" asChild>
              <Link href={formatURL('/signin', lang)}>
                <ArrowLeft/>
              </Link>
            </Button>
            <h1 className="text-4xl font-bold">{t('createAccount.title')}</h1>
          </div>
          <p className='text-sm text-muted-foreground'>{t('createAccount.message')}</p>
        </motion.div>

        <Form {...form}>
          <motion.form 
            variants={itemVariants}
            onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('createAccount.name')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="" />
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
                  <FormLabel>{t('createAccount.email')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CountriesFormField form={form} element={{ title: t('createAccount.country'), name: 'country' }} />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('createAccount.username')}</FormLabel>
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
                  <FormLabel>{t('createAccount.password')}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="" {...field} />
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
                  <FormLabel>{t('createAccount.confirmPassword')}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full">
                {t('createAccount.createAccount')}
              </Button>
              <Button variant="ghost" className="w-full" asChild>
                <Link href={formatURL('/', lang)}>{t('createAccount.goBackHome')}</Link>
              </Button>
            </div>
          </motion.form>
        </Form>
      </div>
    </div>
  )
}

export default CreateAccount
