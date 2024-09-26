"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import 'chart.js/auto'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"

import { getDefaults, risk_assesment_schema } from "@/lib/form"
import { Input } from "@/components/ui/input"
import { formatTimestamp } from "@/utils/dates"
import RiskProfile from "@/components/dashboard/risk-assesment/RiskProfile"

// Risk profiles
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

// Question weights
const weights = [
  {
    name: 'type',
    weight: 0.2
  }, 
  {
    name: 'loss',
    weight: 0.15
  },
  {
    name: 'gain',
    weight: 0.15
  }, 
  {
    name: 'period',
    weight: 0.15
  },
  {
    name: 'diversification',
    weight: 0.15
  },
  {
    name: 'goals',
    weight: 0.2
  }
]

const RiskForm = () => {

  // Client message and portfolio
  const [message, setMessage] = useState<string | null>(null)
  const [riskProfile, setRiskProfile] = useState<any | null>(null)

  // Form
  let formSchema:any;
  let initialFormValues:any = {};
  formSchema = risk_assesment_schema
  initialFormValues = getDefaults(formSchema)
  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      values: initialFormValues,
  })
  async function onSubmit(values: z.infer<typeof formSchema>) {

    setMessage('Loading...')

    const timestamp = new Date()
    const riskProfileID = formatTimestamp(timestamp)

    // Calculate risk score
    let sum = 0
    Object.entries(values).forEach((element) => {
      if (element[0] !== 'account_number' && element[0] !== 'client_name') {
        sum += weights.filter(el => el['name'] == element[0])[0]['weight'] * Number(element[1])
      }
    })

    // Build a risk profile
    const risk_profile = {
      'AccountNumber':values.account_number,
      'ClientName': values.client_name,
      'Score':sum,
      'RiskProfileID':riskProfileID,
    }

    // Add risk profile to database
    //await addDocument(risk_profile, 'db/clients/risk_profiles', riskProfileID)

    // Remove account number and client name from values !?
    delete values.account_number
    delete values.client_name

    setMessage('Risk profile successfully submitted.')

    // Calculate risk type
    let risk_profile_type = ''
    if (sum < .9) {
      risk_profile_type = 'Conservative A'
    } else if (sum >= 0.9 && sum < 1.25) {
      risk_profile_type = 'Conservative B'
    } else if (sum >= 1.25 && sum < 1.5) {
      risk_profile_type = 'Moderate A'
    } else if (sum >= 1.5 && sum < 2) {
      risk_profile_type = 'Moderate B'
    } else if (sum >= 2 && sum < 2.5) {
      risk_profile_type = 'Moderate C'
    } else if (sum >= 2.5 && sum < 2.75) {
      risk_profile_type = 'Aggressive A'
    } else if (sum >= 2.75 && sum < 3) {
      risk_profile_type = 'Aggressive B'
    } else if (sum >= 3) {
      risk_profile_type = 'Aggressive C'
    }
    
    // Get risk type from asset allocations
    setRiskProfile(risk_profile_types.filter((element) => element.name === risk_profile_type)[0])

  }

  return (
      <div className="w-3/4 px-10 pb-10 h-fit flex">

        <Form {...form}>

          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-10">

          <FormField
                control={form.control}
                name="account_number"
                render={({ field }) => (
                  <FormItem>
                  <FormLabel>Account number</FormLabel>
                  <FormControl>
                      <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
            />

            <FormField
                control={form.control}
                name="client_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client name</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What type of investor do you consider yourself?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex flex-row gap-x-2">
                        <FormControl>
                          <RadioGroupItem value="1" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Conservative
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex flex-row gap-x-2">
                        <FormControl>
                          <RadioGroupItem value="2.5" />
                        </FormControl>
                        <FormLabel className="font-normal">Moderate</FormLabel>
                      </FormItem>
                      <FormItem className="flex flex-row gap-x-2">
                        <FormControl>
                          <RadioGroupItem value="4" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Aggresive
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="loss"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>If your portfolio loses 20% of its value what action would you take?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col"
                    >
                      <FormItem className="flex flex-row gap-x-2">
                        <FormControl>
                          <RadioGroupItem value="1" />
                        </FormControl>
                        <FormLabel className="font-normal">Sell everything</FormLabel>
                      </FormItem>
                      <FormItem className="flex flex-row gap-x-2">
                        <FormControl>
                          <RadioGroupItem value="2" />
                        </FormControl>
                        <FormLabel className="font-normal">Sell some investments</FormLabel>
                      </FormItem>
                      <FormItem className="flex flex-row gap-x-2">
                        <FormControl>
                          <RadioGroupItem value="3" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Do nothing
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex flex-row gap-x-2">
                        <FormControl>
                          <RadioGroupItem value="4" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Invest more
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>If your portfolio appreciates 20% of its value what action would you take?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex flex-row gap-x-2">
                        <FormControl>
                          <RadioGroupItem value="1" />
                        </FormControl>
                        <FormLabel className="font-normal">Sell everything</FormLabel>
                      </FormItem>
                      <FormItem className="flex flex-row gap-x-2">
                        <FormControl>
                          <RadioGroupItem value="2" />
                        </FormControl>
                        <FormLabel className="font-normal">Sell some investments</FormLabel>
                      </FormItem>
                      <FormItem className="flex flex-row gap-x-2">
                        <FormControl>
                          <RadioGroupItem value="3" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Do nothing
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex flex-row gap-x-2">
                        <FormControl>
                          <RadioGroupItem value="4" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Invest more
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What do you think the average term of your investment portfolio should be?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex flex-row gap-x-2">
                        <FormControl>
                          <RadioGroupItem value="4" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          0-5 years
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex flex-row gap-x-2">
                        <FormControl>
                          <RadioGroupItem value="3" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          5-10 years
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex flex-row gap-x-2">
                        <FormControl>
                          <RadioGroupItem value="2" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          11-20 years
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex flex-row gap-x-2">
                        <FormControl>
                          <RadioGroupItem value="1" />
                        </FormControl>
                        <FormLabel className="font-normal">More than 21 years</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diversification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Considering asset class diversification, which of these portfolios would you select?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex flex-row gap-x-2">
                        <FormControl>
                          <RadioGroupItem value="1" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Portfolio A: 100% bonds, 0% equity
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex flex-row gap-x-2">
                        <FormControl>
                          <RadioGroupItem value="2" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Portfolio B: 80% bonds, 20% equity
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex flex-row gap-x-2">
                        <FormControl>
                          <RadioGroupItem value="3" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Portfolio C: 60% bonds, 40% equity
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Which of these portfolios best represent your goals with the most acceptable outcomes?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex flex-row gap-x-2">
                        <FormControl>
                          <RadioGroupItem value="1" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Portfolio A: Average 4% return
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex flex-row gap-x-2">
                        <FormControl>
                          <RadioGroupItem value="2" />
                        </FormControl>
                        <FormLabel className="font-normal">
                        Portfolio A: Average 5% return
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex flex-row gap-x-2">
                        <FormControl>
                          <RadioGroupItem value="3" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Portfolio C: Average 7% return
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*TODO AGREGAR FOTOS DE LOUIS */}
            
            <Button type="submit">Submit</Button>
            {message && <p className="text-green-600">{message}</p>}

          </form>

        </Form>


        <div className="w-full">
          <Dialog open={riskProfile ? true:false}>
            <DialogContent className="max-w-fit w-full">
            <DialogClose className="w-fit h-fit" asChild>
              <Button type="button" onClick={() => {setRiskProfile(null); setMessage(null)}} variant="secondary">
                X
              </Button>
            </DialogClose>
            {riskProfile &&
              <div className="w-full h-full flex flex-col gap-y-5 justify-center items-center">
                <p className="text-5xl font-bold">Your Risk Profile</p>
                <RiskProfile riskProfile={riskProfile}/>
                <p className="text-sm text-red-500 font-bold">Please take a picture of this, as it will be very hard to see it again!</p>
              </div>
            }
            </DialogContent>
          </Dialog>
        </div>

      </div> 
  )
}

export default RiskForm

import {
  Dialog,
  DialogClose,
  DialogContent
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

