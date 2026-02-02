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
import { RiskArchetype, RiskProfile, RiskProfilePayload } from "@/lib/tools/risk-profile"
import { useRiskTranslations, calcRiskScore, RiskFormValues } from "@/lib/tools/risk-questions"
import { Account } from "@/lib/entities/account"
import { ReadAccounts } from "@/utils/entities/account"
import LoadingComponent from "@/components/misc/LoadingComponent"
import { CreateInvestmentProposal } from "@/utils/tools/investment_proposals" 
import InvestmentProposalView from "@/components/hub/risk/InvestmentProposal"
import { InvestmentProposal as InvestmentProposalType } from "@/lib/tools/investment-proposals"

const RiskForm = () => {

  const {toast} = useToast()
  const { t } = useTranslationProvider()

  const questions = useRiskTranslations()

  const formSchema = risk_assesment_schema(t)
  const form = useForm<RiskFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: getDefaults(formSchema) as unknown as RiskFormValues,
  })

  const [accounts, setAccounts] = useState<Account[] | null>(null)
  const [riskArchetypes, setRiskArchetypes] = useState<RiskArchetype[] | null>(null)
  const [riskProfile, setRiskProfile] = useState<RiskProfilePayload | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [investmentProposal, setInvestmentProposal] = useState<InvestmentProposalType | null>(null)
  const [isProposalOpen, setIsProposalOpen] = useState(false)

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

  async function onSubmit(values: RiskFormValues) {

    setSubmitting(true)

    try {
      if (!riskArchetypes) throw new Error('Risk archetypes not found')

      const risk_score = calcRiskScore(values)
      const assigned_risk_archetype = riskArchetypes.find(a => risk_score >= a.min_score && risk_score < a.max_score)
      if (!assigned_risk_archetype) throw new Error('No risk profile found')

      const answers = Object.fromEntries(
        questions.map(q => [q.key, q.choices.find(c => c.value === values[q.key])?.label])
      ) as RiskProfilePayload['answers']

      const riskProfilePayload: RiskProfilePayload = {
        name: values.name,
        risk_profile_id: assigned_risk_archetype.id,
        score: risk_score,
        answers,
      }
      setRiskProfile(riskProfilePayload)

      const riskProfileResponse = await CreateRiskProfile(riskProfilePayload)
      const riskProfile = { ...riskProfilePayload, id: riskProfileResponse.id }
      if (!riskProfileResponse) throw new Error('Failed to create risk profile')

      const proposal = await CreateInvestmentProposal(riskProfile)
      if (!proposal) throw new Error('Failed to create investment proposal')

      setInvestmentProposal(proposal)
      setIsProposalOpen(true)
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

          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('risk.form.name')}</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Dynamic questions */}
          {questions.map((q) => (
            <FormField
              key={q.key}
              control={form.control as any}
              name={q.key as any}
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2">
                    <FormLabel>{q.label}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(v) => field.onChange(Number(v))}
                      value={String(field.value)}
                      className="flex flex-col"
                    >
                      {q.choices.map((choice) => (
                        <FormItem key={choice.value} className="flex flex-row gap-x-2 items-center">
                          <FormControl>
                            <RadioGroupItem value={String(choice.value)} />
                          </FormControl>
                          <FormLabel className="font-normal whitespace-nowrap">{choice.label}</FormLabel>
                          {q.key === 'diversification' && (
                            <Progress className="bg-secondary w-64" value={choice.bonds_percentage} />
                          )}
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" disabled={submitting}>
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
                <InvestmentProposalView riskProfile={riskProfile as RiskProfile} investmentProposal={investmentProposal} />
              )}
            </DialogContent>
          </Dialog>
        </motion.form>
      </Form>
    </motion.div>
  )
}

export default RiskForm
