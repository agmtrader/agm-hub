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

import { getDefaults } from '@/utils/form'
import { risk_assesment_schema } from "@/lib/schemas"

import { Input } from "@/components/ui/input"
import { formatTimestamp } from "@/utils/dates"
import RiskProfile from "@/components/dashboard/risk-assesment/RiskProfile"
import { motion, AnimatePresence, m } from "framer-motion"

import {
  Dialog,
  DialogClose,
  DialogContent
} from "@/components/ui/dialog"
import { accessAPI } from "@/utils/api"
import { ReloadIcon } from "@radix-ui/react-icons"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTranslationProvider } from "@/utils/providers/TranslationProvider"

// Risk profile types
export const risk_profile_types = [
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

// Each question in the form has a weight and each answer in the question has a weight
// The risk score is calculated by summing the weighted values of the answers

// Question weight is stored in the weights array
// Answer weight is stored in the question schema

const RiskForm = () => {

  // Client message and portfolio
  const [riskProfile, setRiskProfile] = useState<any | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const {t} = useTranslationProvider()

  // Form
  let formSchema:any;
  let initialFormValues:any = {};
  formSchema = risk_assesment_schema(t)
  initialFormValues = getDefaults(formSchema)
  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      values: initialFormValues,
  })

  const {toast} = useToast()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true)
    
    const timestamp = new Date()
    const riskProfileID = formatTimestamp(timestamp)

    // Calculate risk score
    let sum = 0

    // Loop through form values, ignore certain fields and calculate risk score using the category and question weights
    Object.entries(values).forEach((element) => {
      const [key, value] = element
      if (key !== 'account_number' && key !== 'client_name') {
        const weight = weights.find(el => el.name === key)?.weight || 0
        sum += weight * Number(value)
      }
    })

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
    
    // Get risk profile type from dictionary
    const profile = risk_profile_types.find((type) => type.name === risk_profile_type) || null

    // Build a risk profile for the user
    delete values.account_number
    delete values.client_name

    const risk_profile = {
      AccountNumber: values.account_number,
      ClientName: values.client_name,
      Score: sum,
      Answers: values,
      RiskProfileID: riskProfileID,
      RiskProfile: profile
    }

    // Save the user's risk profile in the database
    let data = await accessAPI('/database/create', 'POST', {data: risk_profile, path:'db/clients/risk', id:riskProfileID})
    setSubmitting(false)

    if (data.status === 'error') {
      toast({
        title: 'Error submitting risk profile',
        description: 'Contact support or try again later.',
        variant: 'destructive'
      })

      throw new Error(data.message)
    }
    
    // Display the risk profile
    setRiskProfile(profile)

    // Reset the form after submission
    form.reset(initialFormValues)

  }

  const handleDialogClose = () => {
    setRiskProfile(null);
  }

  const types = [
    {
      value: '1',
      label: t('apply.risk.form.type.conservative'),
      id: 1
    },
    {
      value: '2.5',
      label: t('apply.risk.form.type.moderate'),
      id: 2
    },
    {
      value: '4',
      label: t('apply.risk.form.type.aggressive'),
      id: 3
    }
  ]

  const losses = [
    {
      value: '1',
      label: t('apply.risk.form.loss.sell_everything'),
      id: 1
    },
    {
      value: '2',
      label: t('apply.risk.form.loss.sell_some'),
      id: 2
    },
    {
      value: '3',
      label: t('apply.risk.form.loss.do_nothing'),
      id: 3
    },
    {
      value: '4',
      label: t('apply.risk.form.loss.invest_more'),
      id: 4
    },
  ]

  const gains = [
    {
      value: '1',
      label: t('apply.risk.form.gain.sell_everything'),
      id: 1
    },
    {
      value: '2',
      label: t('apply.risk.form.gain.sell_some'),
      id: 2
    },
    {
      value: '3',
      label: t('apply.risk.form.gain.do_nothing'),
      id: 3
    },
    {
      value: '4',
      label: t('apply.risk.form.gain.invest_more'),
      id: 4
    }
  ] 

  const periods = [
    {
      value: '1',
      label: t('apply.risk.form.period.more_than_21_years'),
      id: 1
    },
    {
      value: '2',
      label: t('apply.risk.form.period.11_to_20_years'),
      id: 2
    },
    {
      value: '3',
      label: t('apply.risk.form.period.5_to_10_years'),
      id: 3
    }
  ]

  const diversifications = [
    {
      value: '1',
      label: t('apply.risk.form.diversification.portfolio_a'),
      id: 1
    },
    {
      value: '2',
      label: t('apply.risk.form.diversification.portfolio_b'),
      id: 2
    },
    {
      value: '3',
      label: t('apply.risk.form.diversification.portfolio_c'),
      id: 3
    }
  ]

  const goals = [
    {
      value: '1',
      label: t('apply.risk.form.goals.portfolio_a'),
      id: 1
    },
    {
      value: '2',
      label: t('apply.risk.form.goals.portfolio_b'),
      id: 2
    },
    {
      value: '3',
      label: t('apply.risk.form.goals.portfolio_c'),
      id: 3
    }
  ]

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full justify-center items-center"
    >
      <Form {...form}>
        <motion.form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="w-full flex flex-col gap-10"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >

          <FormField
                control={form.control}
                name="account_number"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2">
                      <FormLabel>{t('apply.risk.form.account_number')}</FormLabel>
                      <FormMessage />
                    </div>
                  <FormControl>
                      <Input placeholder="" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
                control={form.control}
                name="client_name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2">
                      <FormLabel>{t('apply.risk.form.client_name')}</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                  </FormItem>
                )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2">
                    <FormLabel>{t('apply.risk.form.type.title')}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col"
                    >

                      {types.map((type) => (
                        <FormItem key={type.id} className="flex flex-row gap-x-2">
                          <FormControl>
                            <RadioGroupItem value={type.value} />
                          </FormControl>
                          <FormLabel className="font-normal">{type.label}</FormLabel>
                        </FormItem>
                      ))}

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
                  <div className="flex gap-2">
                    <FormLabel>{t('apply.risk.form.loss.title')}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col"
                    >
                      {losses.map((loss) => (
                        <FormItem key={loss.id} className="flex flex-row gap-x-2">
                          <FormControl>
                            <RadioGroupItem value={loss.value} />
                          </FormControl>
                          <FormLabel className="font-normal">{loss.label}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gain"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2">
                    <FormLabel>{t('apply.risk.form.gain.title')}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col"
                    >

                      {gains.map((gain) => (
                        <FormItem key={gain.id} className="flex flex-row gap-x-2">
                          <FormControl>
                            <RadioGroupItem value={gain.value} />
                          </FormControl>
                          <FormLabel className="font-normal">{gain.label}</FormLabel>
                        </FormItem>
                      ))}
  
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2">
                    <FormLabel>{t('apply.risk.form.period.title')}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col"
                    >

                      {periods.map((period) => (
                        <FormItem key={period.id} className="flex flex-row gap-x-2">
                          <FormControl>
                            <RadioGroupItem value={period.value} />
                          </FormControl>
                          <FormLabel className="font-normal">{period.label}</FormLabel>
                        </FormItem>
                      ))}

                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diversification"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2">
                    <FormLabel>{t('apply.risk.form.diversification.title')}</FormLabel>
                    <FormMessage />
                  </div>



                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col"
                    >

                      {diversifications.map((diversification) => (
                        <FormItem key={diversification.id} className="flex flex-row gap-x-2">
                          <FormControl>
                            <RadioGroupItem value={diversification.value} />
                          </FormControl>
                          <FormLabel className="font-normal">{diversification.label}</FormLabel>
                        </FormItem>
                      ))}

                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2">
                    <FormLabel>{t('apply.risk.form.goals.title')}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col"
                    >

                      {
                        goals.map((goal) => (
                          <FormItem key={goal.id} className="flex flex-row gap-x-2">
                            <FormControl>
                              <RadioGroupItem value={goal.value} />
                            </FormControl>
                            <FormLabel className="font-normal">{goal.label}</FormLabel>
                          </FormItem>
                        ))
                      }

                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/*TODO AGREGAR FOTOS DE LOUIS */}
            
            <Button type="submit" className="" disabled={submitting}>
              {submitting ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  {t('forms.submitting')}
                </>
              ) : (
                t('forms.submit')
              )}
            </Button>


        </motion.form>
      </Form>

      <AnimatePresence>
          {riskProfile && (
            <Dialog open={!!riskProfile} onOpenChange={handleDialogClose}>
              <DialogContent className="max-w-fit w-full">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="w-full h-full flex flex-col gap-y-5 justify-center items-center"
                >
                  <DialogClose className="absolute right-4 top-4" asChild>
                    <Button type="button" variant="ghost" size="icon">
                      <X className="h-4 w-4" />
                    </Button>
                  </DialogClose>
                  <motion.p 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl font-bold"
                  >
                    {t('apply.risk.result.title')}
                  </motion.p>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <RiskProfile riskProfile={riskProfile}/>
                  </motion.div>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-sm text-red-500 font-bold"
                  >
                    {t('apply.risk.result.warning')}
                  </motion.p>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>

    </motion.div>
  )

}

export default RiskForm