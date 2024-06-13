"use client"
import React, {useState} from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { cn } from "@/lib/utils"
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

import { salutations } from "@/lib/form"

const formSchema = z.object({

  annual_net_income: z.string().min(1, {
    message: "You must select a annual net income.",
  }),
  net_worth: z.string().min(1, {
    message: "You must select a net worth.",
  }),
  liquid_net_worth: z.string().min(1, {
    message: "You must select a liquid net worth.",
  }),
  investment_objectives: z.string().min(1, {
    message: "You must select at least one investment objectives.",
  }),
  trading_experience: z.string().min(1, {
    message: "You must select your trading experience.",
  }),
  products: z.string().min(1, {
    message: "You must select at least one product.",
  }),

})

interface Props {
  stepForward:() => void,
  stepBackwards?:() => void
}

const Regulatory = ({stepBackwards}:Props) => {

  const initialFormValues = {
    annual_net_income: '',
    net_worth: '',
    liquid_net_worth: '',
    investment_objectives: '',
    trading_experience: '',
    products: '',
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: initialFormValues,
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const ticket = {'ApplicationInfo':values}
    console.log(ticket)
  }

  return (
    <div className="h-full w-full flex flex-col justify-center items-center gap-y-10">

      <div className="flex flex-col justify-center items-center">
        <h1 className='text-7xl font-bold'>Regulatory information</h1>
      </div>

      <Form {...form}>

        <form onSubmit={form.handleSubmit(onSubmit)} className="gap-y-8 text-center py-10 flex flex-col justify-center items-center">

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
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full flex text-sm",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                          {field.value
                            ? salutations.find(
                                (salutation) => salutation.value === field.value
                              )?.label
                            : "Select"}
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
                            {salutations.map((salutation) => (
                              <CommandItem
                                value={salutation.label}
                                key={salutation.value}
                                onSelect={() => {
                                  form.setValue("annual_net_income", salutation.value)
                                }}
                              >
                                {salutation.label}
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
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full flex text-sm",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                          {field.value
                            ? salutations.find(
                                (salutation) => salutation.value === field.value
                              )?.label
                            : "Select"}
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
                            {salutations.map((salutation) => (
                              <CommandItem
                                value={salutation.label}
                                key={salutation.value}
                                onSelect={() => {
                                  form.setValue("net_worth", salutation.value)
                                }}
                              >
                                {salutation.label}
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
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full flex text-sm",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                          {field.value
                            ? salutations.find(
                                (salutation) => salutation.value === field.value
                              )?.label
                            : "Select"}
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
                            {salutations.map((salutation) => (
                              <CommandItem
                                value={salutation.label}
                                key={salutation.value}
                                onSelect={() => {
                                  form.setValue("liquid_net_worth", salutation.value)
                                }}
                              >
                                {salutation.label}
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
              name="trading_experience"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col text-center gap-x-5 font-normal">
                  <FormLabel>Trading Experience</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full flex text-sm",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                          {field.value
                            ? salutations.find(
                                (salutation) => salutation.value === field.value
                              )?.label
                            : "Select"}
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
                            {salutations.map((salutation) => (
                              <CommandItem
                                value={salutation.label}
                                key={salutation.value}
                                onSelect={() => {
                                  form.setValue("trading_experience", salutation.value)
                                }}
                              >
                                {salutation.label}
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
            
          </div>

          <div className="flex gap-x-5 justify-center items-center w-full h-full">
            <Button className="bg-agm-light-orange" onClick={stepBackwards}>
              Previous step
            </Button>
            <Button className="bg-agm-light-orange" type="submit">
              Next step
            </Button>
          </div>

        </form>
      </Form>
    </div>
  )
}

export default Regulatory