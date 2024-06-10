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

const countries = [
  { label: "Afghanistan", value: "af" },
  { label: "Albania", value: "al" },
  { label: "Algeria", value: "dz" },
  { label: "Andorra", value: "ad" },
  { label: "Angola", value: "ao" },
  { label: "Antigua and Barbuda", value: "ag" },
  { label: "Argentina", value: "ar" },
  { label: "Armenia", value: "am" },
  { label: "Australia", value: "au" },
  { label: "Austria", value: "at" },
  { label: "Azerbaijan", value: "az" },
  { label: "Bahamas", value: "bs" },
  { label: "Bahrain", value: "bh" },
  { label: "Bangladesh", value: "bd" },
  { label: "Barbados", value: "bb" },
  { label: "Belarus", value: "by" },
  { label: "Belgium", value: "be" },
  { label: "Belize", value: "bz" },
  { label: "Benin", value: "bj" },
  { label: "Bhutan", value: "bt" },
  { label: "Bolivia", value: "bo" },
  { label: "Bosnia and Herzegovina", value: "ba" },
  { label: "Botswana", value: "bw" },
  { label: "Brazil", value: "br" },
  { label: "Brunei", value: "bn" },
  { label: "Bulgaria", value: "bg" },
  { label: "Burkina Faso", value: "bf" },
  { label: "Burundi", value: "bi" },
  { label: "Cabo Verde", value: "cv" },
  { label: "Cambodia", value: "kh" },
  { label: "Cameroon", value: "cm" },
  { label: "Canada", value: "ca" },
  { label: "Central African Republic", value: "cf" },
  { label: "Chad", value: "td" },
  { label: "Chile", value: "cl" },
  { label: "China", value: "cn" },
  { label: "Colombia", value: "co" },
  { label: "Comoros", value: "km" },
  { label: "Congo, Democratic Republic of the", value: "cd" },
  { label: "Congo, Republic of the", value: "cg" },
  { label: "Costa Rica", value: "cr" },
  { label: "Croatia", value: "hr" },
  { label: "Cuba", value: "cu" },
  { label: "Cyprus", value: "cy" },
  { label: "Czech Republic", value: "cz" },
  { label: "Denmark", value: "dk" },
  { label: "Djibouti", value: "dj" },
  { label: "Dominica", value: "dm" },
  { label: "Dominican Republic", value: "do" },
  { label: "Ecuador", value: "ec" },
  { label: "Egypt", value: "eg" },
  { label: "El Salvador", value: "sv" },
  { label: "Equatorial Guinea", value: "gq" },
  { label: "Eritrea", value: "er" },
  { label: "Estonia", value: "ee" },
  { label: "Eswatini", value: "sz" },
  { label: "Ethiopia", value: "et" },
  { label: "Fiji", value: "fj" },
  { label: "Finland", value: "fi" },
  { label: "France", value: "fr" },
  { label: "Gabon", value: "ga" },
  { label: "Gambia", value: "gm" },
  { label: "Georgia", value: "ge" },
  { label: "Germany", value: "de" },
  { label: "Ghana", value: "gh" },
  { label: "Greece", value: "gr" },
  { label: "Grenada", value: "gd" },
  { label: "Guatemala", value: "gt" },
  { label: "Guinea", value: "gn" },
  { label: "Guinea-Bissau", value: "gw" },
  { label: "Guyana", value: "gy" },
  { label: "Haiti", value: "ht" },
  { label: "Honduras", value: "hn" },
  { label: "Hungary", value: "hu" },
  { label: "Iceland", value: "is" },
  { label: "India", value: "in" },
  { label: "Indonesia", value: "id" },
  { label: "Iran", value: "ir" },
  { label: "Iraq", value: "iq" },
  { label: "Ireland", value: "ie" },
  { label: "Israel", value: "il" },
  { label: "Italy", value: "it" },
  { label: "Jamaica", value: "jm" },
  { label: "Japan", value: "jp" },
  { label: "Jordan", value: "jo" },
  { label: "Kazakhstan", value: "kz" },
  { label: "Kenya", value: "ke" },
  { label: "Kiribati", value: "ki" },
  { label: "Korea, North", value: "kp" },
  { label: "Korea, South", value: "kr" },
  { label: "Kosovo", value: "xk" },
  { label: "Kuwait", value: "kw" },
  { label: "Kyrgyzstan", value: "kg" },
  { label: "Laos", value: "la" },
  { label: "Latvia", value: "lv" },
  { label: "Lebanon", value: "lb" },
  { label: "Lesotho", value: "ls" },
  { label: "Liberia", value: "lr" },
  { label: "Libya", value: "ly" },
  { label: "Liechtenstein", value: "li" },
  { label: "Lithuania", value: "lt" },
  { label: "Luxembourg", value: "lu" },
  { label: "Madagascar", value: "mg" },
  { label: "Malawi", value: "mw" },
  { label: "Malaysia", value: "my" },
  { label: "Maldives", value: "mv" },
  { label: "Mali", value: "ml" },
  { label: "Malta", value: "mt" },
  { label: "Marshall Islands", value: "mh" },
  { label: "Mauritania", value: "mr" },
  { label: "Mauritius", value: "mu" },
  { label: "Mexico", value: "mx" },
  { label: "Micronesia", value: "fm" },
  { label: "Moldova", value: "md" },
  { label: "Monaco", value: "mc" },
  { label: "Mongolia", value: "mn" },
  { label: "Montenegro", value: "me" },
  { label: "Morocco", value: "ma" },
  { label: "Mozambique", value: "mz" },
  { label: "Myanmar", value: "mm" },
  { label: "Namibia", value: "na" },
  { label: "Nauru", value: "nr" },
  { label: "Nepal", value: "np" },
  { label: "Netherlands", value: "nl" },
  { label: "New Zealand", value: "nz" },
  { label: "Nicaragua", value: "ni" },
  { label: "Niger", value: "ne" },
  { label: "Nigeria", value: "ng" },
  { label: "North Macedonia", value: "mk" },
  { label: "Norway", value: "no" },
  { label: "Oman", value: "om" },
  { label: "Pakistan", value: "pk" },
  { label: "Palau", value: "pw" },
  { label: "Panama", value: "pa" },
  { label: "Papua New Guinea", value: "pg" },
  { label: "Paraguay", value: "py" },
  { label: "Peru", value: "pe" },
  { label: "Philippines", value: "ph" },
  { label: "Poland", value: "pl" },
  { label: "Portugal", value: "pt" },
  { label: "Qatar", value: "qa" },
  { label: "Romania", value: "ro" },
  { label: "Russia", value: "ru" },
  { label: "Rwanda", value: "rw" },
  { label: "Saint Kitts and Nevis", value: "kn" },
  { label: "Saint Lucia", value: "lc" },
  { label: "Saint Vincent and the Grenadines", value: "vc" },
  { label: "Samoa", value: "ws" },
  { label: "San Marino", value: "sm" },
  { label: "Sao Tome and Principe", value: "st" },
  { label: "Saudi Arabia", value: "sa" },
  { label: "Senegal", value: "sn" },
  { label: "Serbia", value: "rs" },
  { label: "Seychelles", value: "sc" },
  { label: "Sierra Leone", value: "sl" },
  { label: "Singapore", value: "sg" },
  { label: "Slovakia", value: "sk" },
  { label: "Slovenia", value: "si" },
  { label: "Solomon Islands", value: "sb" },
  { label: "Somalia", value: "so" },
  { label: "South Africa", value: "za" },
  { label: "South Sudan", value: "ss" },
  { label: "Spain", value: "es" },
  { label: "Sri Lanka", value: "lk" },
  { label: "Sudan", value: "sd" },
  { label: "Suriname", value: "sr" },
  { label: "Sweden", value: "se" },
  { label: "Switzerland", value: "ch" },
  { label: "Syria", value: "sy" },
  { label: "Taiwan", value: "tw" },
  { label: "Tajikistan", value: "tj" },
  { label: "Tanzania", value: "tz" },
  { label: "Thailand", value: "th" },
  { label: "Timor-Leste", value: "tl" },
  { label: "Togo", value: "tg" },
  { label: "Tonga", value: "to" },
  { label: "Trinidad and Tobago", value: "tt" },
  { label: "Tunisia", value: "tn" },
  { label: "Turkey", value: "tr" },
  { label: "Turkmenistan", value: "tm" },
  { label: "Tuvalu", value: "tv" },
  { label: "Uganda", value: "ug" },
  { label: "Ukraine", value: "ua" },
  { label: "United Arab Emirates", value: "ae" },
  { label: "United Kingdom", value: "gb" },
  { label: "United States", value: "us" },
  { label: "Uruguay", value: "uy" },
  { label: "Uzbekistan", value: "uz" },
  { label: "Vanuatu", value: "vu" },
  { label: "Vatican City", value: "va" },
  { label: "Venezuela", value: "ve" },
  { label: "Vietnam", value: "vn" },
  { label: "Yemen", value: "ye" },
  { label: "Zambia", value: "zm" },
  { label: "Zimbabwe", value: "zw" },
] as const;

const account_types = [
  { label: "Individual", value: "individual" },
  { label: "Joint", value: "joint" },
  { label: "Institutional", value: "institutional" },
] as const

const formSchema = z.object({

  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }).max(50),

  country: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }).max(50),

  account_type: z.string()

})

interface Props {
  stepForward:() => void,
  setCanContinue:React.Dispatch<React.SetStateAction<boolean>>
}

const GeneralInfo = ({stepForward, setCanContinue}:Props) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
      let timestamp = new Date()
      let ticketID = formatTimestamp(timestamp)
      const ticket:Ticket = {'TicketID':ticketID, 'Status':'Being filled', 'ApplicationInfo':values}
      console.log(ticket)
      setCanContinue(true)
      stepForward()
  }

  return (
      <div className="h-full w-full flex flex-col justify-center items-center gap-y-5">
        <h1 className='text-7xl font-bold'>General info.</h1>
        <Form {...form}>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col justify-center items-center">

            <FormField
              control={form.control}
              name="username"
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
                            ? countries.find(
                                (country) => country.value === field.value
                              )?.label
                            : "Select a country"}
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

            <Button className="bg-agm-light-orange" type="submit">
              Next step
            </Button>

          </form>
        </Form>
      </div>
    )
}

export default GeneralInfo
  