"use client"
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useSearchParams } from 'next/navigation'

import { Ticket } from "@/lib/entities/ticket"
import { formatTimestamp } from "../../../../utils/dates"
import { account_types } from "@/lib/form"
import { getDefaults } from '@/utils/form'
import { general_info_schema } from "@/lib/schemas/ticket"
import CountriesFormField from "@/components/ui/CountriesFormField"

import { useToast } from "@/hooks/use-toast"
import { useTranslationProvider } from "@/utils/providers/TranslationProvider"

import { Button } from "@/components/ui/button"
import { Loader2, UserRound } from "lucide-react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useSession } from "next-auth/react"
import { CreateTicket } from "@/utils/entities/ticket"

interface Props {
  stepForward: () => void,
  setTicket: React.Dispatch<React.SetStateAction<Ticket | null>>,
  ticket: Ticket | null
}

const GeneralInfo = ({ stepForward, setTicket, ticket }: Props) => {

  const [generating, setGenerating] = useState(false)
  const searchParams = useSearchParams()

  let formSchema: any;
  let initialFormValues: any;

  const {t} = useTranslationProvider()
  formSchema = general_info_schema(t)
  initialFormValues = ticket?.ApplicationInfo || getDefaults(formSchema)

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      values: initialFormValues,
  })

  const {toast} = useToast()
  const translatedAccountTypes = account_types(t)

  const {data:session} = useSession()
  const userID = session?.user.id
  if (!userID) {
    throw new Error('Critical Error: User ID not found')
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {

    setGenerating(true)
    try {
      
      const timestamp = new Date()
      const advisor = searchParams.get('ad') || ''
      const master_account = searchParams.get('ma') || ''

      // Get the ticket ID from the current ticket or create a new one if it doesn't exist
      const ticketID = ticket?.TicketID || formatTimestamp(timestamp)

      if (!userID) {
        throw new Error('Critical Error: User ID not found. Cannot continue with application.')
      }

      const newTicket:Ticket = {
        'TicketID': ticketID,
        'Status': 'Started',
        'ApplicationInfo': values,
        'Advisor': advisor,
        'UserID': userID,
        'MasterAccount': master_account
      }

      await CreateTicket(newTicket, ticketID)
      setTicket(newTicket)
      setGenerating(false)
      stepForward()

    } catch (error:any) {
      toast({
        title: 'Error',
        description: error.message || "An unexpected error occurred",
        variant: 'destructive',
      })
    }
  }

  return (
      <div className="h-full w-full flex flex-col justify-center gap-y-20 items-center">
        
        <div className='flex'>
          <div className='flex flex-col justify-center gap-y-5 items-center text-center w-full h-full'>
            <UserRound className='h-24 w-24 text-secondary'/>
            <p className='text-5xl font-bold'>{t('apply.account.general_info.title')}</p>
          </div>
        </div>

        <div className='flex flex-col bg-error/20 p-5 max-w-xl rounded-lg justify-center gap-y-5 items-center w-full h-full'>
          <div className='flex flex-col gap-y-5 justify-center items-center w-full h-full'>
            <div className="space-y-4 text-sm text-subtitle">
              <p className="font-semibold">
                {t('apply.account.general_info.disclaimer.title')}
              </p>
              <p>
                {t('apply.account.general_info.disclaimer.content')}
              </p>
              <p>
                {t('apply.account.general_info.disclaimer.contact')}
                <br />
                <span className="font-medium">Email:</span> <a className="underline" href="mailto:info@agmtechnology.com" target="_blank" rel="noopener noreferrer">info@agmtechnology.com</a>
                <br />
                <span className="font-medium">Whatsapp:</span> <a className="underline" href="https://wa.me/17862511496" target="_blank" rel="noopener noreferrer">+1 (786) 251-1496</a>
              </p>
            </div>
          </div>
        </div>
        
        <Form {...form}>
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-y-5 justify-center items-center">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className='flex gap-2 items-center'>
                    <FormLabel>{t('apply.account.general_info.email')}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input {...field} placeholder=''/>
                  </FormControl>
                </FormItem>
              )}
            />
          
            <CountriesFormField 
              form={form} 
              element={{ 
                name: "country", 
                title: t('apply.account.general_info.country') 
              }} 
            />

            <FormField
              control={form.control}
              name="account_type"
              render={({ field }) => (
                <FormItem>
                  <div className='flex gap-2 items-center'>
                    <FormLabel>{t('apply.account.general_info.account_type')}</FormLabel>
                    <FormMessage />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="form"
                          role="combobox"
                        >
                          {field.value
                            ? translatedAccountTypes.find(
                                (type) => type.value === field.value
                              )?.label
                            : ''
                          }
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder={t('forms.search')}
                          />
                          <CommandEmpty>{t('forms.no_results')}</CommandEmpty>
                          <CommandGroup>
                            {translatedAccountTypes.map((type) => (
                              <CommandItem
                                value={type.label}
                                key={type.value}
                                onSelect={() => {
                                  form.setValue("account_type", type.value)
                                }}
                              >
                                {type.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  {t('forms.submitting')}
                </>
              ) : (
                t('forms.submit')
              )}
            </Button>
          </form>
        </Form>

      </div>
    )
}

export default GeneralInfo