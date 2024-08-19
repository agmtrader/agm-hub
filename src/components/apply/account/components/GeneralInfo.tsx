"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Ticket } from "@/lib/types"

import { addDocument } from "@/utils/api"
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
//import { useSearchParams } from "next/navigation"
import { PersonLinesFill } from "react-bootstrap-icons"

interface Props {
  stepForward:() => void,
  setTicket: React.Dispatch<React.SetStateAction<Ticket | null>>,
  step: number
}

const GeneralInfo = ({stepForward, setTicket, step}:Props) => {

  //const searchParams = useSearchParams()

  let formSchema:any;
  let initialFormValues:any;

  formSchema = general_info_schema
  initialFormValues = getDefaults(formSchema)

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      values: initialFormValues,
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {

      const timestamp = new Date()
      //const advisor = searchParams.get('ad')
      const advisor = ''
      const ticketID = formatTimestamp(timestamp)

      const ticket:Ticket = {'TicketID':ticketID, 'Status':'Started', 'ApplicationInfo':values, 'Advisor':advisor}
      setTicket(ticket)

      await addDocument(ticket, '/db/clients/tickets', ticketID)
      stepForward()
      
  }

  return (
      <div className="h-full w-full flex flex-col justify-center items-center gap-y-10">
        <div className='flex relative flex-row h-full mt-20 w-full justify-center items-center z-0 gap-x-5'>
            <div key={step} className='flex flex-col justify-center gap-y-5 items-center w-full h-full'>
              <PersonLinesFill className='h-24 w-24 text-agm-blue'/>
              <p className='text-5xl font-bold'>{step}. <span className='font-light'>General Info</span></p>
            </div>
        </div>
        
        <Form {...form}>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col justify-center items-center">

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="flex w-full h-full flex-col text-start justify-center">
                  <FormLabel>Country of Residence</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full text-sm justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? countries.find(
                                (country) => country.value === field.value
                              )?.label
                            : "Select a country"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder="Search countries..."
                            className="h-9"
                          />
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {countries.map((country) => (
                              <CommandItem
                                value={country.label}
                                key={country.value}
                                onSelect={() => {
                                  form.setValue("country", country.value)
                                }}
                              >
                                {country.label}
                              </CommandItem>
                            ))}

                          </CommandGroup>
                          </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="account_type"
              render={({ field }) => (
                <FormItem className="flex flex-col text-start justify-center">
                  <FormLabel>Account Type</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] text-sm justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? account_types.find(
                                (type) => type.value === field.value
                              )?.label
                            : "Select an account type"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder="Search account types..."
                            className="h-9"
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="bg-agm-orange" type="submit">
              Start my application
            </Button>

          </form>
        </Form>
      </div>
    )
}

export default GeneralInfo
  