"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { risk_assesment_schema } from "@/lib/clients/schemas/risk-profile"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CreateRiskProfile, ListRiskArchetypes } from "@/utils/clients/risk-profile"
import { CreateInvestmentProposal } from "@/utils/clients/investment_proposals"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useToast } from "@/hooks/use-toast"
import { useTranslationProvider } from "@/utils/providers/TranslationProvider"
import { Progress } from "@/components/ui/progress"
import { RiskArchetype, RiskProfilePayload } from "@/lib/clients/risk-profile"
import { useRiskTranslations, calcRiskScore, RiskFormValues } from "@/lib/clients/schemas/risk-questions"
import LoadingComponent from "@/components/misc/LoadingComponent"
import InvestmentProposalView from "@/components/hub/risk/InvestmentProposal"
import { InvestmentProposal as InvestmentProposalType } from "@/lib/clients/investment-proposals"

const RiskForm = () => {

  const {toast} = useToast()
  const { t } = useTranslationProvider()

  const questions = useRiskTranslations()

  const formSchema = risk_assesment_schema(t)
  const form = useForm<RiskFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: getDefaults(formSchema) as unknown as RiskFormValues,
  })

  const [riskArchetypes, setRiskArchetypes] = useState<RiskArchetype[] | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [investmentProposal, setInvestmentProposal] = useState<InvestmentProposalType | null>(null)
  const [isProposalOpen, setIsProposalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const riskArchetypes = await ListRiskArchetypes()
        setRiskArchetypes(riskArchetypes)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch risk archetypes',
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
      const assigned_risk_archetype = riskArchetypes.find(a => risk_score >= a.min_score && (risk_score < a.max_score || (risk_score === a.max_score && a.max_score === 10)))
      if (!assigned_risk_archetype) throw new Error('No risk profile found')

      const answers = Object.fromEntries(
        questions.map(q => [q.key, q.choices.find(c => c.value === values[q.key])?.label])
      ) as RiskProfilePayload['answers']

      const raw_answers = Object.fromEntries(
        questions.map(q => [q.key, Number(values[q.key])])
      )

      const riskProfilePayload: RiskProfilePayload = {
        name: values.name,
        score: risk_score,
        assigned_risk_archetype: assigned_risk_archetype.name,
        answers,
        raw_answers,
      }

      const riskProfileResponse = await CreateRiskProfile(riskProfilePayload)
      if (!riskProfileResponse) throw new Error('Failed to create risk profile')

      const savedRiskProfile = { ...riskProfilePayload, id: riskProfileResponse.id }
      const proposal = await CreateInvestmentProposal(savedRiskProfile)
      if (!proposal) throw new Error('Failed to create investment proposal')

      setInvestmentProposal(proposal)
      setIsProposalOpen(true)
      form.reset(getDefaults(formSchema) as unknown as RiskFormValues)
      toast({
        title: 'Success',
        description: 'Risk profile and investment proposal created successfully',
      })

    } catch (error:any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create risk profile',
        variant: 'destructive'
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (!riskArchetypes) return <LoadingComponent />

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full"
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
              'Submit'
            )}
          </Button>
        </motion.form>
      </Form>

      <Dialog open={isProposalOpen} onOpenChange={setIsProposalOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Investment Proposal</DialogTitle>
          </DialogHeader>
          {investmentProposal && (
            <InvestmentProposalView investmentProposal={investmentProposal} />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

export default RiskForm
