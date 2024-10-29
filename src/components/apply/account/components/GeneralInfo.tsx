"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useSearchParams } from 'next/navigation'

import { cn } from "@/lib/utils"
import { Ticket } from "@/lib/types"
import { formatTimestamp } from "@/utils/dates"

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

import { countries, account_types, general_info_schema, getDefaults } from "@/lib/form"
import { PersonLinesFill } from "react-bootstrap-icons"
import { accessAPI } from "@/utils/api"
import { useState } from "react"
import CountriesFormField from "@/components/ui/CountriesFormField"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Props {
  stepForward: () => void,
  setTicket: React.Dispatch<React.SetStateAction<Ticket | null>>,
  ticket: Ticket | null
  step: number,
}

const GeneralInfo = ({ stepForward, setTicket, step, ticket }: Props) => {

  const [generating, setGenerating] = useState(false)
  const searchParams = useSearchParams()

  let formSchema: any;
  let initialFormValues: any;

  formSchema = general_info_schema
  initialFormValues = ticket?.ApplicationInfo || getDefaults(formSchema)

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      values: initialFormValues,
  })

  const {toast} = useToast()

  async function onSubmit(values: z.infer<typeof formSchema>) {

    setGenerating(true)
    try {
      const timestamp = new Date()
      const advisor = searchParams.get('ad') || ''
      const ticketID = ticket?.TicketID || formatTimestamp(timestamp)

      const updatedTicket: Ticket = {
        'TicketID': ticketID,
        'Status': 'Started',
        'ApplicationInfo': values,
        'Advisor': advisor,
      }
      setTicket(updatedTicket)

      const response = await accessAPI('/database/create', 'POST', { 'data': updatedTicket, 'path': 'db/clients/tickets', 'id': ticketID })

      if (response['status'] !== 'success') {
        throw new Error('Failed to create ticket')
      }

      stepForward()
    } catch {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
      throw new Error('An unexpected error occurred')
    } finally {
      setGenerating(false)
    }
  }

  return (
      <div className="h-full w-full flex flex-col justify-center gap-y-20 items-center">
        
        <div className='flex'>
          <div className='flex flex-col justify-center gap-y-5 items-center w-full h-full'>
            <PersonLinesFill className='h-24 w-24 text-secondary'/>
            <p className='text-5xl font-bold'>General Information</p>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-96 flex flex-col gap-y-5 justify-center items-center">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input {...field} placeholder="Enter your email" />
                  </FormControl>
                </FormItem>
              )}
            />
          
            <CountriesFormField form={form} element={{ name: "country", title: "Country of Residence" }} />

            <FormField
              control={form.control}
              name="account_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <FormMessage />
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="form"
                          role="combobox"
                        >
                          {field.value
                            ? account_types.find(
                                (type) => type.value === field.value
                              )?.label
                            : "Select an account type"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder="Search account types..."
                          />
                          <CommandEmpty>No account type found.</CommandEmpty>
                          <CommandGroup>
                            {account_types.map((type) => (
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
                  Submitting...
                </>
              ) : (
                'Next step'
              )}
            </Button>
          </form>
        </Form>

      </div>
    )
}

export default GeneralInfo