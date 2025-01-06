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
import { Progress } from "@/components/ui/progress"
import { useSession } from "next-auth/react"

// Risk profile types
export const risk_profile_types = [
  {
    name: 'Conservative A',
    bonds_aaa_a: 0.3,
    bonds_bbb: 0.7,
    bonds_bb: 0,
    etfs: 0,
    average_yield: .06103,
    min_score: 0,
    max_score: 0.9
  },
  {
    name: 'Conservative B',
    bonds_aaa_a: 0.18,
    bonds_bbb: 0.54,
    bonds_bb: .18,
    etfs: .1,
    average_yield: .0723,
    min_score: 0.9,
    max_score: 1.25
  },
  {
    name: 'Moderate A',
    bonds_aaa_a: 0.16,
    bonds_bbb: 0.48,
    bonds_bb: 0.16,
    etfs: 0.2,
    average_yield: .0764,
    min_score: 1.25,
    max_score: 1.5
  },
  {
    name: 'Moderate B',
    bonds_aaa_a: 0.15,
    bonds_bbb: 0.375,
    bonds_bb: 0.15,
    etfs: 0.25,
    average_yield: .0736,
    min_score: 1.5,
    max_score: 2
  },
  {
    name: 'Moderate C',
    bonds_aaa_a: 0.14,
    bonds_bbb: 0.35,
    bonds_bb: 0.21,
    etfs: 0.3,
    average_yield: .06103,
    min_score: 2,
    max_score: 2.5
  },
  {
    name: 'Aggressive A',
    bonds_aaa_a: 0.13,
    bonds_bbb: 0.325,
    bonds_bb: .195,
    etfs: .35,
    average_yield: .0845,
    min_score: 2.5,
    max_score: 2.75
  },
  {
    name: 'Aggressive B',
    bonds_aaa_a: 0.12,
    bonds_bbb: 0.30,
    bonds_bb: 0.18,
    etfs: 0.4,
    average_yield: .0865,
    min_score: 2.75,
    max_score: 3
  },
  {
    name: 'Aggressive C',
    bonds_aaa_a: 0.05,
    bonds_bbb: 0.25,
    bonds_bb: 0.20,
    etfs: 0.5,
    average_yield: .0925,
    min_score: 3,
    max_score: 10
  }
]

// Question weights
export const weights = [
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

export type RiskProfile = {
  AccountNumber: string;
  ClientName: string;
  Score: number;
  RiskProfileID: string;
  RiskProfile: any;
  UserID: string;
}

const RiskForm = () => {

  // Client message and portfolio
  const [riskProfile, setRiskProfile] = useState<any | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const {toast} = useToast()
  const {data:session} = useSession()
  const {t} = useTranslationProvider()

  let formSchema:any;
  let initialFormValues:any = {};
  formSchema = risk_assesment_schema(t)
  initialFormValues = getDefaults(formSchema)

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      values: initialFormValues,
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {

    setSubmitting(true)

    try {

      if (!session?.user) throw new Error('User not found')
      
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
      risk_profile_types.forEach(type => {
        if (sum >= type.min_score && sum < type.max_score) {
          risk_profile_type = type.name;
        }
      })
      
      // Get risk profile type from dictionary
      const risk_profile_properties = risk_profile_types.find((type) => type.name === risk_profile_type) || null

      // Build a risk profile for the user
      const risk_profile:RiskProfile = {
        AccountNumber: values.account_number || '',
        ClientName: values.client_name,
        Score: sum,
        RiskProfileID: riskProfileID,
        RiskProfile: risk_profile_properties,
        UserID: session?.user?.id
      }

      // Save the user's risk profile in the database
      let data = await accessAPI('/database/create', 'POST', {data: risk_profile, path:'db/clients/risk', id:riskProfileID})
      setSubmitting(false)

      if (data['status'] !== 'success') throw new Error('Error submitting risk profile')
      
      // Display the risk profile
      setRiskProfile(risk_profile_properties)

      // Reset the form after submission
      form.reset(initialFormValues)

    } catch (error:any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }

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
      bonds_percentage: 100,
      stocks_percentage: 0,
      id: 1
    },
    {
      value: '2',
      label: t('apply.risk.form.diversification.portfolio_b'),
      bonds_percentage: 80,
      stocks_percentage: 20,
      id: 2
    },
    {
      value: '3',
      label: t('apply.risk.form.diversification.portfolio_c'),
      bonds_percentage: 60,
      stocks_percentage: 40,
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
          className="w-full flex flex-col gap-10 p-5"
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
                      <Input placeholder={t('forms.not_required')} {...field} />
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
                          <FormLabel className="font-normal whitespace-nowrap">{diversification.label}</FormLabel>
                          <Progress className="bg-secondary w-64" value={diversification.bonds_percentage} />
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