"use client"
import React, { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { faker } from '@faker-js/faker';
import { ChevronDown, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

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

import { marital_status, salutations, countries, id_type, employment_status, currencies, source_of_wealth, about_you_primary_schema, getDefaults, phone_types, about_you_secondary_schema, security_questions } from "@/lib/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Ticket } from "@/lib/types"
import { accessAPI } from "@/utils/api"
import { PersonLinesFill } from "react-bootstrap-icons"
import { DateTimePicker } from "@/components/ui/datetime-picker"
import CountriesFormField from "@/components/ui/CountriesFormField"
import { useToast } from "@/hooks/use-toast"

interface Props {
  stepForward:() => void,
  stepBackward:() => void,
  ticket: Ticket,
  setTicket: React.Dispatch<React.SetStateAction<Ticket | null>>,
  primary: boolean
}

const AboutYou = ({primary, stepForward, stepBackward, ticket, setTicket}:Props) => {

  const backdoor = false

  let formSchema:any;
  let initialFormValues:any = {};

  const { toast } = useToast()

  const [generating, setGenerating] = useState(false)

  if (primary) {
    formSchema = about_you_primary_schema 
  } else {
    formSchema = about_you_secondary_schema
  }

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      values: initialFormValues,
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setGenerating(true)

    try {
      const updatedApplicationInfo = { ...ticket.ApplicationInfo }

      for (const [key, value] of Object.entries(values)) {
        if (primary) {
          updatedApplicationInfo[key] = value
        } else {
          updatedApplicationInfo[`secondary_${key}`] = value
        }
      }

      const updatedTicket: Ticket = {
        ...ticket,
        ApplicationInfo: updatedApplicationInfo,
      }

      const response = await accessAPI('/database/update', 'POST', {
        path: `db/clients/tickets`,
        query: { TicketID: ticket.TicketID },
        data: { ApplicationInfo: updatedApplicationInfo }
      })

      if (response['status'] !== 'success') {
        throw new Error(response['message'] || 'Failed to update ticket')
      }

      setTicket(updatedTicket)
      stepForward()
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const fillWithFakeData = () => {

    const fakeData:z.infer<typeof formSchema> = {
      salutation: faker.helpers.arrayElement(salutations).value,
      first_name: faker.person.firstName(),
      middle_name: faker.person.middleName(),
      last_name: faker.person.lastName(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zip: faker.location.zipCode(),
      phone_type: faker.helpers.arrayElement(phone_types).value,
      phone_country: faker.helpers.arrayElement(countries).value,
      phone_number: faker.phone.number(),
      citizenship: faker.helpers.arrayElement(countries).value,
      country_of_birth: faker.helpers.arrayElement(countries).value,
      date_of_birth: faker.date.past({ years: 50 }).toISOString(),
      marital_status: faker.helpers.arrayElement(marital_status).value,
      number_of_dependents: faker.number.int({ min: 0, max: 5 }).toString(),
      country_of_residence: faker.helpers.arrayElement(countries).value,
      tax_id: faker.finance.accountNumber(),
      id_country: faker.helpers.arrayElement(countries).value,
      id_type: faker.helpers.arrayElement(id_type).value,
      id_number: faker.string.alphanumeric(10),
      id_expiration_date: faker.date.future().toISOString(),
      employment_status: faker.helpers.arrayElement(employment_status).value,
      employer_name: faker.company.name(),
      employer_address: faker.location.streetAddress(),
      employer_city: faker.location.city(),
      employer_state: faker.location.state(),
      employer_country: faker.helpers.arrayElement(countries).value,
      employer_zip: faker.location.zipCode(),
      nature_of_business: faker.company.buzzPhrase(),
      occupation: faker.person.jobTitle(),
      source_of_wealth: faker.helpers.arrayElements(source_of_wealth, { min: 1, max: 3 }).map(item => item.id),
      currency: faker.helpers.arrayElement(currencies).value,
    };

    if (primary) {
      fakeData.security_q_1 = faker.helpers.arrayElement(security_questions).value;
      fakeData.security_a_1 = faker.lorem.sentence();
      fakeData.security_q_2 = faker.helpers.arrayElement(security_questions).value;
      fakeData.security_a_2 = faker.lorem.sentence();
      fakeData.security_q_3 = faker.helpers.arrayElement(security_questions).value;
      fakeData.security_a_3 = faker.lorem.sentence();
    } else {
      fakeData.email = faker.internet.email();
      fakeData.username = faker.internet.userName();
      fakeData.password = faker.internet.password();
    }

    form.reset(fakeData);
  };

  return (
    <div className="h-full w-full flex flex-col justify-center gap-y-20 items-center">

      <div className='flex'>
        <div className='flex flex-col justify-center gap-y-5 items-center w-full h-full'>
          <PersonLinesFill className='h-24 w-24 text-secondary'/>
          <p className='text-5xl font-bold'>About You</p>
          <p>{primary ? 'Primary' : 'Secondary'} Holder</p>
        </div>
      </div>

      <Form {...form}>

        <form onSubmit={form.handleSubmit(onSubmit)} className="w-96 flex flex-col gap-y-5 justify-center items-center">

          {backdoor && 
            <Button
              type="button"
              variant="primary"
              onClick={fillWithFakeData}
              className="mb-4"
            >
              Fill with Fake Data
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          }

          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
            <p className="text-3xl font-bold">Basic info</p>

            <FormField
              control={form.control}
              name="salutation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salutation</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="form"
                            role="combobox"
                          >
                          {field.value
                            ? salutations.find(
                                (salutation) => salutation.value === field.value
                              )?.label
                            : "Select a salutation"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder="Search salutations..."
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
              name="first_name"
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
              name="middle_name"
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
            <p className="text-3xl font-bold">Residential Info</p>

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
                <FormItem>
                  <FormLabel>Phone type</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="form"
                          role="combobox"
                        >
                          {field.value
                            ? phone_types.find(
                                (type) => type.value === type.value
                              )?.label
                            : "Select a type"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder="Search types..."
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

            <CountriesFormField form={form} element={{ name: "phone_country", title: "Phone country" }} />

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

            <CountriesFormField form={form} element={{ name: "citizenship", title: "Citizenship" }} />
            <CountriesFormField form={form} element={{ name: "country_of_birth", title: "Country of Birth" }} />
            
          </div>

          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
            <p className="text-3xl font-bold">Personal Info</p>

            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Date of birth</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => field.onChange(date?.toISOString())}
                      granularity="day"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marital_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marital Status</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="form"
                          role="combobox"
                        >
                          {field.value
                            ? marital_status.find(
                                (status) => status.value === field.value
                              )?.label
                            : "Select a status"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder="Search status..."
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

          <CountriesFormField form={form} element={{ name: "country_of_residence", title: "Country of Residence" }} />

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
            <p className="text-3xl font-bold">ID Info</p>


            <CountriesFormField form={form} element={{ name: "id_country", title: "ID Country" }} />

            <FormField
              control={form.control}
              name="id_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Type</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="form"
                          role="combobox"
                        >
                          {field.value
                            ? id_type.find(
                                (status) => status.value === field.value
                              )?.label
                            : "Select ID type"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder="Search types..."
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

            <FormField
              control={form.control}
              name="id_expiration_date"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>ID Expiration</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => field.onChange(date?.toISOString())}
                      granularity="day"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>

          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
            <p className="text-3xl font-bold">Employer info</p>

            <FormField
              control={form.control}
              name="employment_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Status</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="form"
                          role="combobox"
                        >
                          {field.value
                            ? employment_status.find(
                                (status) => status.value === field.value
                              )?.label
                            : "Select a status"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder="Search status..."
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

            {form.watch("employment_status") === "Employed" && (
              <>
                <FormField
                  control={form.control}
                  name="employer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employer name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter employer name" {...field} />
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
                        <Input placeholder="Enter employer address" {...field} />
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
                        <Input placeholder="Enter employer city" {...field} />
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
                        <Input placeholder="Enter employer state/province" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CountriesFormField form={form} element={{ name: "employer_country", title: "Employer Country" }} />

                <FormField
                  control={form.control}
                  name="employer_zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employer zip</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter employer zip" {...field} />
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
                        <Input placeholder="Enter nature of business" {...field} />
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
                        <Input placeholder="Enter occupation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
            <p className="text-3xl font-bold">Financial info</p>

            <FormField
              control={form.control}
              name="source_of_wealth"
              render={() => (
                <FormItem>
                  <FormLabel>Source of Wealth</FormLabel>
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
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="form"
                          role="combobox"
                        >
                          {field.value
                            ? currencies.find(
                                (status) => status.value === field.value
                              )?.label
                            : "Select a currency"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder="Search currency..."
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
              <p className="text-3xl font-bold">Security Questions</p>
  
              <FormField
                control={form.control}
                name="security_q_1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Security Question 1</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="form"
                            role="combobox"
                          >
                            {field.value
                              ? security_questions.find(
                                  (status) => status.value === field.value
                                )?.label
                              : "Select a security question"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          <CommandList>
                            <CommandInput
                              placeholder="Search questions..."
                            />
                            <CommandEmpty>No question found.</CommandEmpty>
                            <CommandGroup>
                              {security_questions.map((question) => (
                                <CommandItem
                                  value={question.label}
                                  key={question.value}
                                  onSelect={() => {
                                    form.setValue("security_q_1", question.value)
                                  }}
                                >
                                  {question.label}
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
                  <FormItem>
                    <FormLabel>Security Question 2</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="form"
                            role="combobox"
                          >
                            {field.value
                              ? security_questions.find(
                                  (status) => status.value === field.value
                                )?.label
                              : "Select a security question"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          <CommandList>
                            <CommandInput
                              placeholder="Search questions..."
                            />
                            <CommandEmpty>No question found.</CommandEmpty>
                            <CommandGroup>
                              {security_questions.map((question) => (
                                <CommandItem
                                  value={question.label}
                                  key={question.value}
                                  onSelect={() => {
                                    form.setValue("security_q_2", question.value)
                                  }}
                                >
                                  {question.label}
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
                  <FormItem>
                    <FormLabel>Security Question 3</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="form"
                            role="combobox"
                          >
                            {field.value
                              ? security_questions.find(
                                  (status) => status.value === field.value
                                )?.label
                              : "Select a security question"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          <CommandList>
                            <CommandInput
                              placeholder="Search questions..."
                            />
                            <CommandEmpty>No question found.</CommandEmpty>
                            <CommandGroup>
                              {security_questions.map((question) => (
                                <CommandItem
                                  value={question.label}
                                  key={question.value}
                                  onSelect={() => {
                                    form.setValue("security_q_3", question.value)
                                  }}
                                >
                                  {question.label}
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
              <p className="text-3xl font-bold">Basic information</p>
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
            <Button type="button" variant='ghost' onClick={stepBackward}>
              Previous step
            </Button>
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
          </div>

        </form>
      </Form>

    </div>
  )
}

export default AboutYou