"use client"
import React, {SetStateAction, useState} from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { Checkbox } from "@/components/ui/checkbox"

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

import { getDefaults, investment_objectives, products, regulatory_schema, salutations, worths } from "@/lib/form"
import { Ticket } from "@/lib/types"
import { accessAPI } from "@/utils/api"

interface Props {
  stepForward:() => void,
  stepBackwards?:() => void,
  ticket: Ticket,
  setTicket: React.Dispatch<React.SetStateAction<Ticket | null>>,
}

const Regulatory = ({stepBackwards, ticket, setTicket, stepForward}:Props) => {

  const [generating, setGenerating] = useState(false)

  let formSchema:any;
  let initialFormValues:any;

  formSchema = regulatory_schema
  initialFormValues = getDefaults(formSchema)

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      values: initialFormValues,
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setGenerating(true)

    try {
      const updatedApplicationInfo = { ...ticket.ApplicationInfo }

      for (const [key, value] of Object.entries(values)) {
        updatedApplicationInfo[key] = value
        const response = await accessAPI('/database/update', 'POST', {
          'path': `db/clients/tickets/${ticket.TicketID}`,
          'key': `ApplicationInfo.${key}`,
          'value': value
        })
        if (response.status !== 'success') {
          throw new Error(`Failed to update ${key}`)
        }
      }

      const statusResponse = await accessAPI('/database/update', 'POST', {
        'path': `db/clients/tickets/${ticket.TicketID}`,
        'key': 'Status',
        'value': 'Open'
      })
      if (statusResponse.status !== 'success') {
        throw new Error('Failed to update ticket status')
      }

      const updatedTicket: Ticket = {
        ...ticket,
        ApplicationInfo: updatedApplicationInfo,
        Status: 'Open'
      }
      setTicket(updatedTicket)

      stepForward()
    } catch (error) {
      console.error('Error updating ticket:', error)
      // Handle error (e.g., show error message to user)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="h-full w-full flex flex-col justify-center items-center gap-y-10">

      <div className="flex flex-col justify-center items-center">
        <h1 className='text-7xl font-bold'>Regulatory Information</h1>
      </div>

      <Form {...form}>

        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-y-5 justify-center items-center">

          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
            <p className="text-xl font-bold">Basic info</p>

            <FormField
              control={form.control}
              name="annual_net_income"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col text-center gap-x-5 font-normal">
                  <FormLabel>Annual net income</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="form"
                            role="combobox"
                          >
                          {field.value
                            ? worths.find(
                                (worths) => worths.value === field.value
                              )?.label
                            : "Select an income"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder="Search..."
                            className="h-9"
                          />
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup>
                            {worths.map((worth) => (
                              <CommandItem
                                value={worth.label}
                                key={worth.value}
                                onSelect={() => {
                                  form.setValue("annual_net_income", worth.value)
                                }}
                              >
                                {worth.label}
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
              name="net_worth"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col text-center gap-x-5 font-normal">
                  <FormLabel>Net worth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="form"
                            role="combobox"
                          >
                          {field.value
                            ? worths.find(
                                (worths) => worths.value === field.value
                              )?.label
                            : "Select a worth"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder="Search..."
                            className="h-9"
                          />
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup>
                            {worths.map((worth) => (
                              <CommandItem
                                value={worth.label}
                                key={worth.value}
                                onSelect={() => {
                                  form.setValue("net_worth", worth.value)
                                }}
                              >
                                {worth.label}
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
              name="liquid_net_worth"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col text-center gap-x-5 font-normal">
                  <FormLabel>Liquid net worth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="form"
                            role="combobox"
                          >
                          {field.value
                            ? worths.find(
                                (worths) => worths.value === field.value
                              )?.label
                            : "Select a worth"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder="Search..."
                            className="h-9"
                          />
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup>
                            {worths.map((worth) => (
                              <CommandItem
                                value={worth.label}
                                key={worth.value}
                                onSelect={() => {
                                  form.setValue("liquid_net_worth", worth.value)
                                }}
                              >
                                {worth.label}
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
              name="investment_objectives"
              render={() => (
                <FormItem className="w-full flex flex-col justify-center text-center gap-x-5 font-normal">
                  <div className="w-full mb-4 flex flex-col justify-center items-center text-center">
                    <FormLabel>Investment Objectives</FormLabel>
                  </div>
                  {investment_objectives.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="investment_objectives"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value:any) => value !== item.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal w-fit">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="products"
              render={() => (
                <FormItem className="w-full flex flex-col justify-center text-center gap-x-5 font-normal">
                  <div className="w-full mb-4 flex flex-col justify-center items-center text-center">
                    <FormLabel>Products to trade</FormLabel>
                  </div>
                  {products.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="products"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value:any) => value !== item.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal w-fit">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount_to_invest"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Amount to Invest ($)</FormLabel>
                <FormControl>
                    <Input placeholder="Enter an amount" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            
          </div>

          <div className="flex gap-x-5 justify-center items-center w-full h-full">
            <Button onClick={stepBackwards}>
              Previous step
            </Button>
            <Button type="submit" disabled={generating}>
              {generating ? (
                <>
                  <span className="mr-2">Saving...</span>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                </>
              ) : (
                'Finish'
              )}
            </Button>
          </div>

        </form>
      </Form>
    </div>
  )
}

export default Regulatory