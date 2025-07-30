"use client"
import React, { useState } from 'react'
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
import CountriesFormField from '@/components/ui/CountriesFormField'
import { signIn } from 'next-auth/react'
import { formatURL } from '@/utils/language/lang'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { ArrowLeft } from 'lucide-react'
import { containerVariants, itemVariants } from '@/lib/anims'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateUser } from '@/utils/api'
import { UserPayload } from '@/lib/entities/user'
import LoaderButton from '@/components/misc/LoaderButton'

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  country: z.string(),
  phone: z.string().optional().nullable(),
  company_name: z.string().optional().nullable(),
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

  console.log(form.formState.errors)

  const [creating, setCreating] = useState(false)

  async function onSubmit(values: z.infer<typeof formSchema>) {

    try {
      setCreating(true)

      const user:UserPayload = {
        'country': values.country,
        'phone': values.phone || null,
        'company_name': values.company_name || null,
        'name': values.name,
        'email': values.email,
        'image': '',
        'password': values.password,
        'scopes': ''
      }

      await CreateUser(user)

      toast({
        title: 'Success',
        description: 'Account created successfully',
        variant: 'success'
      })

      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: callbackUrl ? formatURL(callbackUrl, lang) : formatURL('/', lang)
      });

      if (result?.ok) {
        router.push(callbackUrl ? formatURL(callbackUrl, lang) : formatURL('/', lang));
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      })
    } finally {
      setCreating(false)
    }

  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className='flex h-full items-center justify-center'
    >
      <Card className="w-full max-w-xl p-8">
        <motion.div variants={itemVariants}>
          <CardHeader>
            <Button className='w-fit' variant="ghost" asChild>
              <Link href={formatURL('/signin', lang)}>
                <ArrowLeft/>
              </Link>
            </Button>
            <CardTitle>{t('createAccount.title')}</CardTitle>
            <CardDescription>{t('createAccount.message')}</CardDescription>
          </CardHeader>
        </motion.div>

        <motion.div variants={itemVariants} className='w-full'>
          <CardContent>
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
                  <LoaderButton isLoading={creating} text={t('createAccount.createAccount')} />
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href={formatURL('/', lang)}>{t('createAccount.goBackHome')}</Link>
                  </Button>
                </div>
              </motion.form>
            </Form>
          </CardContent>
        </motion.div>

      </Card>
    </motion.div>
  )
}

export default CreateAccount
