"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Doughnut } from 'react-chartjs-2'
import 'chart.js/auto'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { getDocumentsFromCollection, queryDocumentsFromCollection } from "@/utils/api"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/dashboard/components/DataTable"

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
import RiskProfile from "@/components/dashboard/risk-assesment/RiskProfile"

const risk_profile_types = [
  {
    name: 'Conservative A',
    bonds_aaa_a: 0.3,
    bonds_bbb: 0.7,
    bonds_bb: 0,
    etfs: 0,
    average_yield: .06103
  },
  {
    name: 'Conservative B',
    bonds_aaa_a: 0.18,
    bonds_bbb: 0.54,
    bonds_bb: .18,
    etfs: .1,
    average_yield: .0723
  },
  {
    name: 'Moderate A',
    bonds_aaa_a: 0.16,
    bonds_bbb: 0.48,
    bonds_bb: 0.16,
    etfs: 0.2,
    average_yield: .0764
  },
  {
    name: 'Moderate B',
    bonds_aaa_a: 0.15,
    bonds_bbb: 0.375,
    bonds_bb: 0.15,
    etfs: 0.25,
    average_yield: .0736
  },
  {
    name: 'Moderate C',
    bonds_aaa_a: 0.14,
    bonds_bbb: 0.35,
    bonds_bb: 0.21,
    etfs: 0.3,
    average_yield: .06103
  },
  {
    name: 'Aggressive A',
    bonds_aaa_a: 0.13,
    bonds_bbb: 0.325,
    bonds_bb: .195,
    etfs: .35,
    average_yield: .0845
  },
  {
    name: 'Aggressive B',
    bonds_aaa_a: 0.12,
    bonds_bbb: 0.30,
    bonds_bb: 0.18,
    etfs: 0.4,
    average_yield: .0865
  },
  {
    name: 'Aggressive C',
    bonds_aaa_a: 0.05,
    bonds_bbb: 0.25,
    bonds_bb: 0.20,
    etfs: 0.5,
    average_yield: .0925
  }
]


const page = () => {

  const [accountNumbers, setAccountNumbers] = useState<any[] | null>(null)
  const [riskProfile, setRiskProfile] = useState<any | null>(null)
  const[account, setAccount] = useState<any | null>(null)

  // Form
  const schema = z.object({
    account_number: z.string().min(1, {
      message: 'Account number cannot be empty.'
    })
  })
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(values: z.infer<typeof schema>) {

    console.log(values)

    const response:any[] = await queryDocumentsFromCollection('db/clients/risk_profiles', 'AccountNumber', values.account_number)

    if (response) {

      if (response[0]) {

        const score = Number(response[0].Score)

        let risk_type = ''

        if (score < .9) {
          risk_type = 'Conservative A'
        } else if (score >= 0.9 && score < 1.25) {
          risk_type = 'Conservative B'
        } else if (score >= 1.25 && score < 1.5) {
          risk_type = 'Moderate A'
        } else if (score >= 1.5 && score < 2) {
          risk_type = 'Moderate B'
        } else if (score >= 2 && score < 2.5) {
          risk_type = 'Moderate C'
        } else if (score >= 2.5 && score < 2.75) {
          risk_type = 'Aggressive A'
        } else if (score >= 2.75 && score < 3) {
          risk_type = 'Aggressive B'
        } else if (score >= 3) {
          risk_type = 'Aggressive C'
        }
        
        setRiskProfile(risk_profile_types.filter((element) => element.name === risk_type).map((element) => {element.bonds_aaa_a = element.bonds_aaa_a * 100; element.bonds_bbb = element.bonds_bbb * 100; element.bonds_bb = element.bonds_bb * 100; element.etfs = element.etfs * 100; element.average_yield = element.average_yield * 100; return element})[0])
        setAccount(response[0])
      }
    }

  }

  // Fetch all risk profiles
  useEffect(() => {

    async function fetchData () {

        let data = await getDocumentsFromCollection('db/clients/risk_profiles/')
        setAccountNumbers(data.map((element:any) => {element.AccountNumber; return {label: element.AccountNumber + ' ' + element.ClientName, value: element.AccountNumber}}))
        
    }

    fetchData()

  }, [])

  return (
    <div className="w-full h-full justify-start items-center flex gap-y-20 flex-col">

      {accountNumbers && !riskProfile &&
        <Form {...form}>
          <h1 className="text-7xl text-agm-dark-blue font-bold">Risk Profiles</h1>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/3 flex flex-col gap-y-5 justify-center items-center">
          
          <p className="text-agm-white font-bold">Account alias</p>

          <div className="flex w-full h-full gap-x-5">
          <FormField
              control={form.control}
              name="account_number"
              render={({ field }) => (
                <FormItem className="flex w-full h-full flex-col text-start justify-center">
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
                            ? accountNumbers.find(
                                (accountNumber) => accountNumber.value === field.value
                              )?.label
                            : "Select an account"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder="Search accounts..."
                            className="h-9"
                          />
                          <CommandEmpty>No account found.</CommandEmpty>
                          <CommandGroup>
                            {accountNumbers.map((accountNumber) => (
                              <CommandItem
                                value={accountNumber.label}
                                key={accountNumber.label}
                                onSelect={() => {
                                  form.setValue("account_number", accountNumber.value)
                                }}
                              >
                                {accountNumber.label}
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
          <Button className="w-[20%]" type="submit">Submit</Button>
          </div>
          
          </form>
        </Form>
      }
      

      {riskProfile && account &&
        <RiskProfile riskProfile={riskProfile} account={account}/>
      }

    </div>
    
    )
  }

export default page