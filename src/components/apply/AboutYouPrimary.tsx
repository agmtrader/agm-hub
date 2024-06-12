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


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { addDays, format, subDays } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"

const languages = [
{ label: "Mr.", value: "mr" },
{ label: "Ms.", value: "ms" },
{ label: "Mrs.", value: "mrs" },
{ label: "Dr.", value: "dr" },
] as const

const formSchema = z.object({

  salutation: z.string().min(1, {
    message: "You must select a salutation.",
  }),

  first_name: z.string().min(1, {
    message: "First name cannot be empty.",
  }),

  middle_name: z.string().optional().transform(e => e === "" ? undefined : e),

  last_name: z.string().min(1, {
    message: "Last name cannot be empty.",
  }),



  address: z.string().min(1, {
    message: 'Address cannot be empty.'
  }),

  city: z.string().min(1, {
    message: 'City cannot be empty.'
  }),

  state: z.string().min(1, {
    message: 'State/Province cannot be empty.'
  }),

  zip:  z.string().min(1, {
    message: 'State/Province cannot be empty.'
  }),

  date_of_birth: z.date({
    required_error: "A date of birth is required.",
  }),

  marital_status: z.string().min(1, {
    message: 'You must select a marital status'
  }),

  number_of_dependents: z.string().min(1, {
    message: 'You must select a Country of Residence.'
  }),

  country_of_residence: z.string().min(1, {
    message: 'You must select a Country of Residence.'
  }),

  tax_id: z.string().min(1, {
    message: 'Date of birth cannot be empty.'
  }),

})

interface Props {
  stepForward:() => void,
  setCanContinue?:React.Dispatch<React.SetStateAction<boolean>>,
  stepBackwards?:() => void
}

const AboutYouPrimary = ({stepForward, setCanContinue, stepBackwards}:Props) => {

  const [date, setDate] = useState<Date>(new Date())

  const initialFormValues = {
    salutation: '',
    first_name: '',
    middle_name: '',
    last_name: '',

    address: '',
    city: '',
    state: '',
    zip: '',

    date_of_birth: date,
    marital_status: '',
    number_of_dependents: '',
    country_of_residence: '',
    tax_id: '',
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
        <h1 className='text-7xl font-bold'>About you</h1>
        <h1 className='text-3xl font-light'>Primary holder</h1>
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
                            ? languages.find(
                                (language) => language.value === field.value
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
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {languages.map((language) => (
                              <CommandItem
                                value={language.label}
                                key={language.value}
                                onSelect={() => {
                                  form.setValue("salutation", language.value)
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

            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
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
          </div>

          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
            <p className="text-xl font-bold">Personal Info</p>

            <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full justify-center">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full flex gap-x-5 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}

                        <CalendarIcon className="h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                    <Select
                      onValueChange={(value) => {
                        setDate(subDays(new Date(), parseInt(value)))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>

                      <SelectContent position="popper">

                        <SelectItem value="0">Today</SelectItem>
                        <SelectItem value="1">Yesterday</SelectItem>
                        <SelectItem value="7">A week ago</SelectItem>
                        <SelectItem value="14">Two weeks ago</SelectItem>
                        <SelectItem value="365">1 Year Ago</SelectItem>

                      </SelectContent>
                    </Select>

                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      date={date}
                      setDate={setDate}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
            />

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
                            ? languages.find(
                                (language) => language.value === field.value
                              )?.label
                            : "Select"}
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
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {languages.map((language) => (
                              <CommandItem
                                value={language.label}
                                key={language.value}
                                onSelect={() => {
                                  form.setValue("marital_status", language.value)
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
                <FormItem>
                <FormLabel>Country of Residence</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
          </div>

          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
            <p className="text-xl font-bold">Basic info</p>

            <FormField
              control={form.control}
              name="salutation"
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
                            ? languages.find(
                                (language) => language.value === field.value
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
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {languages.map((language) => (
                              <CommandItem
                                value={language.label}
                                key={language.value}
                                onSelect={() => {
                                  form.setValue("salutation", language.value)
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

            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
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

export default AboutYouPrimary