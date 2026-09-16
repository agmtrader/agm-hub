'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CreateContact } from '@/utils/clients/contact'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const greetings_schema = z.object({
  name: z.string().trim().min(1, 'Required'),
  email: z.string().trim().min(1, 'Required').email('Invalid email address'),
  phone: z.string().trim().min(1, 'Required'),
  country: z.string().trim().min(1, 'Required'),
  company_name: z.string().trim().min(1, 'Required'),
})

type FormSchema = z.infer<typeof greetings_schema>

const defaultValues: FormSchema = {
  name: '',
  email: '',
  phone: '',
  country: '',
  company_name: '',
}

const GreetingsForm = () => {
  const { t } = useTranslationProvider()
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<FormSchema>({
    resolver: zodResolver(greetings_schema),
    defaultValues,
  })

  const isSubmitting = form.formState.isSubmitting

  async function handleSubmit(values: FormSchema) {
    setSubmitError(null)

    try {
      await CreateContact({ ...values, met_place: 'FIAB' })
      form.reset(defaultValues)
      setSubmitted(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : t('greetings.error'))
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-5 px-6 py-12 text-center sm:px-10">
        <CheckCircle2 className="h-14 w-14 text-secondary" aria-hidden="true" />
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-wrap-balance">{t('greetings.success_title')}</h2>
          <p className="text-muted-foreground text-wrap-pretty">
            {t('greetings.success_description')}
          </p>
        </div>
        <Button type="button" variant="outline" onClick={() => setSubmitted(false)}>
          {t('greetings.add_another')}
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" noValidate>
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('greetings.name')}</FormLabel>
                <FormControl>
                  <Input required autoComplete="name" placeholder={t('greetings.name_placeholder')} {...field} />
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
                <FormLabel>{t('greetings.email')}</FormLabel>
                <FormControl>
                  <Input required type="email" autoComplete="email" inputMode="email" placeholder={t('greetings.email_placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('greetings.phone')}</FormLabel>
                <FormControl>
                  <Input required type="tel" autoComplete="tel" inputMode="tel" placeholder={t('greetings.phone_placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('greetings.country')}</FormLabel>
                <FormControl>
                  <Input required autoComplete="country-name" placeholder={t('greetings.country_placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('greetings.company')}</FormLabel>
              <FormControl>
                <Input required autoComplete="organization" placeholder={t('greetings.company_placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {submitError && (
          <p role="alert" className="text-sm text-destructive">{submitError}</p>
        )}
        <Button type="submit" className="h-12 w-full active:scale-[0.96] transition-transform" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Saving...
            </>
          ) : (
            t('greetings.submit')
          )}
        </Button>
      </form>
    </Form>
  )
}

export default GreetingsForm
