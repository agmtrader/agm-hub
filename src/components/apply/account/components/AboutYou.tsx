"use client"
import React, { useState } from "react"
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

import { marital_status, salutations, countries, id_type, employment_status, currencies, source_of_wealth, about_you_primary_schema, getDefaults, phone_types, about_you_secondary_schema } from "@/lib/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Ticket } from "@/lib/types"
import { updateFieldInDocument } from "@/utils/api"

interface Props {
  stepForward:() => void,
  stepBackward:() => void,
  ticket: Ticket,
  setTicket:React.Dispatch<React.SetStateAction<Ticket | null>>
  primary: boolean
}

const AboutYou = ({primary, stepBackward, stepForward, ticket, setTicket}:Props) => {

  let formSchema:any;
  let initialFormValues:any = {};

  if (primary) {
    formSchema = about_you_primary_schema 
  } else {
    formSchema = about_you_secondary_schema
  }
  initialFormValues = getDefaults(formSchema)

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      values: initialFormValues,
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {

    const dob_date = values.dob_day + '/' + values.dob_month + '/' + values.dob_year;

    (values as any).date = dob_date;

    delete (values as any).dob_day
    delete (values as any).dob_month
    delete (values as any).dob_year

    Object.keys(values).forEach(async (key) => {
      await updateFieldInDocument(`db/clients/tickets/${ticket.TicketID}`, `ApplicationInfo.${key}`, values[key as keyof object])
    })

    console.log(values)

    stepForward()

  }

  console.log(form.formState.errors)

  return (
    <div className="h-full w-full flex flex-col justify-center items-center gap-y-10">
      <div className="flex flex-col justify-center items-center">
        <h1 className='text-7xl font-bold'>About you</h1>
        <h1 className='text-3xl font-light'>{primary ? 'Primary holder':'Secondary holder'}</h1>
      </div>

      <Form {...form}>

        <form onSubmit={form.handleSubmit(onSubmit)} className="gap-y-8 text-center flex flex-col justify-center items-center">

          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
            <p className="text-xl font-bold">Basic info</p>

            <FormField
              control={form.control}
              name="salutation"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col text-center gap-x-5 font-normal">
                  <FormLabel>Salutation</FormLabel>
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
                            : "Select a salutation"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder="Search salutations..."
                            className="h-9"
                          />
                          <CommandEmpty>No salutatation found.</CommandEmpty>
                          <CommandGroup>
                            {salutations.map((salutation) => (
                              <CommandItem
                                value={salutation.label}
                                key={salutation.value}
                                onSelect={() => {
                                  form.setValue("salutation", salutation.value)
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
              name="FirstName"
              render={({ field }) => (
                <FormItem className="w-full">
                <FormLabel>First name</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
              control={form.control}
              name="MiddleName"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Middle name</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
          </div>

          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
            <p className="text-xl font-bold">Residential Info</p>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                <FormLabel>State/Province</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Zip</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
              control={form.control}
              name="phone_type"
              render={({ field }) => (
                <FormItem className="flex w-full h-full flex-col text-center gap-x-5 font-normal justify-center">
                  <FormLabel>Phone type</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full text-sm flex justify-center",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? phone_types.find(
                                (type) => type.value === type.value
                              )?.label
                            : "Select a type"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder="Search types..."
                            className="h-9"
                          />
                          <CommandEmpty>No type found.</CommandEmpty>
                          <CommandGroup>
                            {phone_types.map((type) => (
                              <CommandItem
                                value={type.label}
                                key={type.value}
                                onSelect={() => {
                                  form.setValue("phone_type", type.value)
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

            <FormField
              control={form.control}
              name="phone_country"
              render={({ field }) => (
                <FormItem className="flex w-full h-full flex-col text-center gap-x-5 font-normal justify-center">
                  <FormLabel>Phone country</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full text-sm flex justify-center",
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
                                  form.setValue("phone_country", country.value)
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
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />            
            <FormField
              control={form.control}
              name="citizenship"
              render={({ field }) => (
                <FormItem className="flex w-full h-full flex-col text-center gap-x-5 font-normal justify-center">
                  <FormLabel>Citizenship</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full text-sm flex justify-center",
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
                                  form.setValue("citizenship", country.value)
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
              name="country_of_birth"
              render={({ field }) => (
                <FormItem className="flex w-full h-full flex-col text-center gap-x-5 font-normal justify-center">
                  <FormLabel>Country of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full text-sm flex justify-center",
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
                                  form.setValue("country_of_birth", country.value)
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
          </div>

          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
            <p className="text-xl font-bold">Personal Info</p>

            <p className="text-sm text-start">Date of birth</p>

            <div className="flex gap-x-5 w-full h-full">
              <FormField
                control={form.control}
                name="dob_day"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Input className="w-16" placeholder="DD" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                /
                <FormField
                control={form.control}
                name="dob_month"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Input className="w-16" placeholder="MM" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                /
                <FormField
                control={form.control}
                name="dob_year"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Input placeholder="YYYY" className="w-16"{...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <FormField
              control={form.control}
              name="marital_status"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col text-center gap-x-5 font-normal">
                  <FormLabel>Marital Status</FormLabel>
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
                            ? marital_status.find(
                                (status) => status.value === field.value
                              )?.label
                            : "Select a status"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder="Search status..."
                            className="h-9"
                          />
                          <CommandEmpty>No status found.</CommandEmpty>
                          <CommandGroup>
                            {marital_status.map((status) => (
                              <CommandItem
                                value={status.label}
                                key={status.value}
                                onSelect={() => {
                                  form.setValue("marital_status", status.value)
                                }}
                              >
                                {status.label}
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
              name="number_of_dependents"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Number of dependents</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
              control={form.control}
              name="country_of_residence"
              render={({ field }) => (
                <FormItem className="flex w-full h-full flex-col text-center gap-x-5 font-normal justify-center">
                  <FormLabel>Country of residence</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full text-sm flex justify-center",
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
                                  form.setValue("country_of_residence", country.value)
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
              name="tax_id"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Tax ID</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
          </div>

          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
            <p className="text-xl font-bold">ID Info</p>


            <FormField
              control={form.control}
              name="id_country"
              render={({ field }) => (
                <FormItem className="flex w-full h-full flex-col text-center gap-x-5 font-normal justify-center">
                  <FormLabel>ID Country</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full text-sm flex justify-center",
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
                                  form.setValue("id_country", country.value)
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
              name="id_type"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col text-center gap-x-5 font-normal">
                  <FormLabel>ID Type</FormLabel>
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
                            ? id_type.find(
                                (status) => status.value === field.value
                              )?.label
                            : "Select ID type"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder="Search types..."
                            className="h-9"
                          />
                          <CommandEmpty>No type found.</CommandEmpty>
                          <CommandGroup>
                            {id_type.map((status) => (
                              <CommandItem
                                value={status.label}
                                key={status.value}
                                onSelect={() => {
                                  form.setValue("id_type", status.value)
                                }}
                              >
                                {status.label}
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
              name="id_number"
              render={({ field }) => (
                <FormItem>
                <FormLabel>ID Number</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
              )}
            />

            <p className="text-sm">ID Expiration</p>

            <div className="flex gap-x-5 w-full justify-center h-full">
                <FormField
                control={form.control}
                name="id_expiration_month"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Input className="w-16" placeholder="MM" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                /
                <FormField
                control={form.control}
                name="id_expiration_year"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Input placeholder="YYYY" className="w-16"{...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

          </div>

          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
            <p className="text-xl font-bold">Employer info</p>

            <FormField
              control={form.control}
              name="employment_status"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col text-center gap-x-5 font-normal">
                  <FormLabel>Employment Status</FormLabel>
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
                            ? employment_status.find(
                                (status) => status.value === field.value
                              )?.label
                            : "Select a status"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder="Search status..."
                            className="h-9"
                          />
                          <CommandEmpty>No status found.</CommandEmpty>
                          <CommandGroup>
                            {employment_status.map((status) => (
                              <CommandItem
                                value={status.label}
                                key={status.value}
                                onSelect={() => {
                                  form.setValue("employment_status", status.value)
                                }}
                              >
                                {status.label}
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
              name="employer_name"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Employer name</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
              control={form.control}
              name="employer_address"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Employer address</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
              control={form.control}
              name="employer_city"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Employer city</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
              control={form.control}
              name="employer_state"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Employer state/province</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
              control={form.control}
              name="employer_country"
              render={({ field }) => (
                <FormItem className="flex w-full h-full flex-col text-center gap-x-5 font-normal justify-center">
                  <FormLabel>Employer Country</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full text-sm flex justify-center",
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
                                  form.setValue("employer_country", country.value)
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
              name="employer_zip"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Employer zip</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
              control={form.control}
              name="nature_of_business"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Nature of business</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Occupation</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

          </div>

          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
            <p className="text-xl font-bold">Financial info</p>

            <FormField
              control={form.control}
              name="source_of_wealth"
              render={() => (
                <FormItem className="w-full flex flex-col justify-center text-center gap-x-5 font-normal">
                  <div className="w-full mb-4 flex flex-col justify-center items-center text-center">
                    <FormLabel>Source of Wealth</FormLabel>
                  </div>
                  {source_of_wealth.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="source_of_wealth"
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
              name="currency"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col text-center gap-x-5 font-normal">
                  <FormLabel>Currency</FormLabel>
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
                            ? currencies.find(
                                (status) => status.value === field.value
                              )?.label
                            : "Select a currency"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder="Search currency..."
                            className="h-9"
                          />
                          <CommandEmpty>No currency found.</CommandEmpty>
                          <CommandGroup>
                            {currencies.map((status) => (
                              <CommandItem
                                value={status.label}
                                key={status.value}
                                onSelect={() => {
                                  form.setValue("currency", status.value)
                                }}
                              >
                                {status.label}
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

          {primary ?
            <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
              <p className="text-xl font-bold">Security Questions</p>
  
              <FormField
                control={form.control}
                name="security_q_1"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col text-center gap-x-5 font-normal">
                    <FormLabel>Security Question 1</FormLabel>
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
                              ? marital_status.find(
                                  (status) => status.value === field.value
                                )?.label
                              : "Select a security question"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandList>
                            <CommandInput
                              placeholder="Search questions..."
                              className="h-9"
                            />
                            <CommandEmpty>No question found.</CommandEmpty>
                            <CommandGroup>
                              {marital_status.map((status) => (
                                <CommandItem
                                  value={status.label}
                                  key={status.value}
                                  onSelect={() => {
                                    form.setValue("security_q_1", status.value)
                                  }}
                                >
                                  {status.label}
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
                name="security_a_1"
                render={({ field }) => (
                  <FormItem>
                  <FormLabel>Security Answer 1</FormLabel>
                  <FormControl>
                      <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="security_q_2"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col text-center gap-x-5 font-normal">
                    <FormLabel>Security Question 2</FormLabel>
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
                              ? marital_status.find(
                                  (status) => status.value === field.value
                                )?.label
                              : "Select a security question"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandList>
                            <CommandInput
                              placeholder="Search questions..."
                              className="h-9"
                            />
                            <CommandEmpty>No question found.</CommandEmpty>
                            <CommandGroup>
                              {marital_status.map((status) => (
                                <CommandItem
                                  value={status.label}
                                  key={status.value}
                                  onSelect={() => {
                                    form.setValue("security_q_2", status.value)
                                  }}
                                >
                                  {status.label}
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
                name="security_a_2"
                render={({ field }) => (
                  <FormItem>
                  <FormLabel>Security Answer 2</FormLabel>
                  <FormControl>
                      <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="security_q_3"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col text-center gap-x-5 font-normal">
                    <FormLabel>Security Question 3</FormLabel>
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
                              ? marital_status.find(
                                  (status) => status.value === field.value
                                )?.label
                              : "Select a security question"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandList>
                            <CommandInput
                              placeholder="Search questions..."
                              className="h-9"
                            />
                            <CommandEmpty>No question found.</CommandEmpty>
                            <CommandGroup>
                              {marital_status.map((status) => (
                                <CommandItem
                                  value={status.label}
                                  key={status.value}
                                  onSelect={() => {
                                    form.setValue("security_q_3", status.value)
                                  }}
                                >
                                  {status.label}
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
                name="security_a_3"
                render={({ field }) => (
                  <FormItem>
                  <FormLabel>Security Answer 3</FormLabel>
                  <FormControl>
                      <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            :
            <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
              <p className="text-xl font-bold">Basic information</p>
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                  <FormLabel>Username</FormLabel>
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                      <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          }

          <div className="flex gap-x-5 justify-center items-center w-full h-full">
            <Button variant={'default'} type="button" onClick={stepBackward}>
              Previous step
            </Button>
            <Button variant={'default'} type="submit">
              Next step
            </Button>
          </div>

        </form>
      </Form>
    </div>
  )
}

export default AboutYou