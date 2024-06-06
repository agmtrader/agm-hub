"use client"

import Link from "next/link"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"



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


import { cn } from "@/lib/utils"
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

import { Ticket } from "@/lib/types"
import { addDocument } from "@/utils/api"
import { formatTimestamp } from "@/utils/dates"

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const

const formSchema = z.object({

    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }).max(50),

    email: z.string().min(2, {
      message: "Email must be at least 2 characters.",
    }).max(50),

    language: z.string()

  })

export function ProfileForm() {

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
    })
  
    async function onSubmit(values: z.infer<typeof formSchema>) {
        let timestamp = new Date()
        let ticketID = formatTimestamp(timestamp)
        const ticket:Ticket = {'TicketID':ticketID, 'Status':'Open', 'ApplicationInfo':values}
        await addDocument(ticket, 'db/clients/tickets', ticket['TicketID'])
    }

    return (
        <div className="h-full w-full flex flex-col justify-center items-center">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col justify-center items-center">
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                  <FormLabel>Country of Residence</FormLabel>
                  <FormControl>
                      <Input placeholder="123" {...field} />
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
                      <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem className="flex flex-col text-start justify-center">
                    <FormLabel>Country of Residence</FormLabel>
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
                              ? languages.find(
                                  (language) => language.value === field.value
                                )?.label
                              : "Select language"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandList>
                            <CommandInput
                              placeholder="Search countries..."
                              className="h-9"
                            />
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup>
                              {languages.map((language) => (
                                <CommandItem
                                  value={language.label}
                                  key={language.value}
                                  onSelect={() => {
                                    form.setValue("language", language.value)
                                  }}
                                >
                                  {language.label}
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

              <Button className="bg-agm-light-orange" type="submit">Submit</Button>
              </form>
            </Form>
        </div>
      )
  }
  
  