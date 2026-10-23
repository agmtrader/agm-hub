"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import 'chart.js/auto'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCallback, useEffect, useState } from "react"
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
  const [archetypesLoadFailed, setArchetypesLoadFailed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [investmentProposal, setInvestmentProposal] = useState<InvestmentProposalType | null>(null)
  const [isProposalOpen, setIsProposalOpen] = useState(false)

  const loadRiskArchetypes = useCallback(async () => {
    setArchetypesLoadFailed(false)
    try {
      const archetypes = await ListRiskArchetypes()
      if (!Array.isArray(archetypes) || archetypes.length === 0) {
        throw new Error('No risk archetypes returned')
      }
      setRiskArchetypes(archetypes)
    } catch {
      setArchetypesLoadFailed(true)
    }
  }, [])

  useEffect(() => {
    void loadRiskArchetypes()
  }, [loadRiskArchetypes])

  async function onSubmit(values: RiskFormValues) {

    setSubmitting(true)

    try {
      if (!riskArchetypes) throw new Error('Risk archetypes not found')

      const risk_score = calcRiskScore(values)

      const answers = Object.fromEntries(
        questions.map(q => [q.key, q.choices.find(c => c.value === values[q.key])?.label])
      ) as RiskProfilePayload['answers']

      const raw_answers = Object.fromEntries(
        questions.map(q => [q.key, Number(values[q.key])])
      )

      const riskProfilePayload: RiskProfilePayload = {
        name: values.name,
        email: values.email,
        estimated_deposit: values.starting_amount,
        score: risk_score,
        answers,
        raw_answers,
      }

      const riskProfileResponse = await CreateRiskProfile(riskProfilePayload)
      if (!riskProfileResponse) throw new Error('Failed to create risk profile')

      const savedRiskProfile = {
        ...riskProfilePayload,
        id: riskProfileResponse.id,
        contact_id: riskProfileResponse.contact_id,
      }
      const proposal = await CreateInvestmentProposal(savedRiskProfile, values.starting_amount)
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

  if (archetypesLoadFailed) {
    return (
      <div role="alert" className="flex flex-col items-center gap-4 p-5 text-center">
        <p>{t('risk.form.load_error')}</p>
        <Button type="button" onClick={() => void loadRiskArchetypes()}>
          {t('risk.form.retry')}
        </Button>
      </div>
    )
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
          noValidate
          onSubmit={form.handleSubmit(onSubmit)} 
          className="w-full flex flex-col gap-8 px-0 py-5 sm:p-5"
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

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="starting_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('risk.form.estimated_deposit')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    required
                    inputMode="decimal"
                    min="0.01"
                    step="0.01"
                    value={field.value ?? ''}
                    onChange={(event) => field.onChange(event.target.value === '' ? null : Number(event.target.value))}
                  />
                </FormControl>
                <FormDescription>{t('risk.form.estimated_deposit_help')}</FormDescription>
                <FormMessage />
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
                  <div className="flex flex-col gap-2">
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
                        <FormItem key={choice.value} className="flex flex-wrap gap-x-3 gap-y-2 items-center space-y-0 rounded-md py-2">
                          <FormControl>
                            <RadioGroupItem value={String(choice.value)} />
                          </FormControl>
                          <FormLabel className="min-w-0 flex-1 font-normal leading-relaxed cursor-pointer">{choice.label}</FormLabel>
                          {q.key === 'diversification' && (
                            <Progress className="bg-secondary basis-full w-full sm:basis-auto sm:w-48 sm:shrink-0" value={choice.bonds_percentage} />
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
        <DialogContent className="max-w-7xl max-h-[90dvh] overflow-y-auto">
          <DialogHeader className="sr-only"><DialogTitle>{t('risk.title')}</DialogTitle></DialogHeader>
          {investmentProposal && (
            <InvestmentProposalView investmentProposal={investmentProposal} />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

export default RiskForm
