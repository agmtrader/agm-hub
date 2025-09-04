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
import { useEffect, useState } from "react"
import { getDefaults } from '@/utils/form'
import { risk_assesment_schema } from "@/lib/tools/schemas/risk-profile"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CreateRiskProfile, ListRiskArchetypes } from "@/utils/tools/risk-profile"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useToast } from "@/hooks/use-toast"
import { useTranslationProvider } from "@/utils/providers/TranslationProvider"
import { Progress } from "@/components/ui/progress"
import { useSession } from "next-auth/react"
import { getRiskFormQuestions, RiskArchetype, RiskProfile, weights } from "@/lib/tools/risk-profile"
import { Account } from "@/lib/entities/account"
import { ReadAccounts } from "@/utils/entities/account"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import LoadingComponent from "@/components/misc/LoadingComponent"
import { CreateInvestmentProposal } from "@/utils/tools/investment_proposals" 
import InvestmentProposalView from "@/components/dashboard/tools/investment-center/InvestmentProposal"
import { InvestmentProposal as InvestmentProposalType } from "@/lib/tools/investment-proposals"
import { RiskProfilePayload } from "@/lib/tools/risk-profile"

// Each question in the form has a weight and each answer in the question has a weight
// The risk score is calculated by summing the weighted values of the answers

// Question weight is stored in the weights array
// Answer weight is stored in the question schema

const RiskForm = () => {

  const {toast} = useToast()
  const {data:session} = useSession()
  const { t } = useTranslationProvider()

  const { types, losses, gains, periods, diversifications, goals } = getRiskFormQuestions()

  const formSchema = risk_assesment_schema(t)
  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: getDefaults(formSchema),
  })

  const [accounts, setAccounts] = useState<Account[] | null>(null)
  const [riskArchetypes, setRiskArchetypes] = useState<RiskArchetype[] | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [investmentProposal, setInvestmentProposal] = useState<InvestmentProposalType | null>(null)
  const [isProposalOpen, setIsProposalOpen] = useState(false)
  const [riskProfile, setRiskProfile] = useState<RiskProfile | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accounts, riskArchetypes] = await Promise.all([
          ReadAccounts(),
          ListRiskArchetypes()
        ])
        setAccounts(accounts)
        setRiskArchetypes(riskArchetypes)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch accounts',
          variant: 'destructive',
        })
      }
    }
    fetchData()
  }, [])

  function CalculateRiskScore(values: z.infer<typeof formSchema>): number {
    let risk_score = 0
    Object.entries(values).forEach((answer) => {
  
      // Extract the question key and answer value
      const [key, value] = answer
  
      // Ignore certain fields
      if (key !== 'account_id' && key !== 'client_name') {
  
        // Get the weight of the question
        const weight = weights.find(el => el.name === key)?.weight || 0
  
        // Add onto the risk score by multiplying the weight of the question by the value of the answer
        risk_score += weight * Number(value)
      }
    })
    return risk_score
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {

    setSubmitting(true)

    try {

      if (!session?.user) throw new Error('User not found')
      if (!riskArchetypes) throw new Error('Risk archetypes not found')
        
      // Calculate the risk score and find the assigned risk profile
      const risk_score = CalculateRiskScore(values)
      
      // Find the assigned risk archetype
      const assigned_risk_archetype = riskArchetypes.find(archetype => risk_score >= archetype.min_score && risk_score < archetype.max_score)
      if (!assigned_risk_archetype) throw new Error('No risk profile found')

      const answers = {
        type: types.find((q) => q.value === values.type)?.label,
        loss: losses.find((q) => q.value === values.loss)?.label,
        gain: gains.find((q) => q.value === values.gain)?.label,
        period: periods.find((q) => q.value === values.period)?.label,
        diversification: diversifications.find((q) => q.value === values.diversification)?.label,
        goals: goals.find((q) => q.value === values.goals)?.label
      }

      // Create the account risk profile
      const riskProfile: any = {
        name: values.client_name,
        account_id: values.account_id,
        risk_profile_id: assigned_risk_archetype.id,
        score: risk_score,
        answers: answers
      }
       
      setRiskProfile(riskProfile)
      const riskProfileResponse = await CreateRiskProfile(riskProfile)
      if (!riskProfileResponse) throw new Error('Failed to create risk profile')
      riskProfile['id'] = riskProfileResponse.id

      // Generate the investment proposal for the assigned risk profile
      const proposal = await CreateInvestmentProposal(riskProfile)
      if (!proposal) throw new Error('Failed to create investment proposal')
      
      setInvestmentProposal(proposal)
      setIsProposalOpen(true)

      // Reset the form after submission
      form.reset(getDefaults(formSchema))

    } catch (error:any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate investment proposal',
        variant: 'destructive'
      })
    } finally {
      setSubmitting(false)
    }

  }

  if (!accounts) return <LoadingComponent />

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
              name="account_id"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.risk.form.account_id')}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between bg-muted"
                        >
                          {field.value
                            ? accounts.find((account) => account.id === field.value)?.ibkr_account_number
                            : t('forms.none') ?? 'None'
                          }
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandList>
                            <CommandInput placeholder={t('forms.search')} />
                            <CommandEmpty>{t('forms.no_results')}</CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                key="none"
                                value="none"
                                onSelect={() => {
                                  field.onChange(null)
                                }}
                              >
                                {t('forms.none') ?? 'None'}
                              </CommandItem>
                              {accounts.map((account) => (
                                <CommandItem
                                  key={account.id}
                                  value={account.ibkr_account_number}
                                  onSelect={() => {
                                    field.onChange(account.id)
                                  }}
                                >
                                  {account.ibkr_account_number}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
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
                      value={field.value}
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
                      value={field.value}
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
                      value={field.value}
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
                      value={field.value}
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
                      value={field.value}
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
                      value={field.value}
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

            <Dialog open={isProposalOpen} onOpenChange={setIsProposalOpen}>
            <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Investment Proposal</DialogTitle>
                </DialogHeader>
                {investmentProposal && riskProfile && (
                  <InvestmentProposalView riskProfile={riskProfile} investmentProposal={investmentProposal} />
                )}
              </DialogContent>
            </Dialog>

        </motion.form>
      </Form>
    </motion.div>
  )

}

export default RiskForm