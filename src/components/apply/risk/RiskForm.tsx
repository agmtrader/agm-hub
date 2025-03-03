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
import { risk_assesment_schema } from "@/lib/schemas/risk-profile"
import { Input } from "@/components/ui/input"
import { formatTimestamp } from "../../../utils/dates"
import RiskProfile from "@/components/dashboard/risk-assesment/RiskProfile"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogClose,
  DialogContent
} from "@/components/ui/dialog"
import { getRiskProfile, saveRiskProfile } from "@/utils/entities/risk-profile"
import { ReloadIcon } from "@radix-ui/react-icons"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTranslationProvider } from "@/utils/providers/TranslationProvider"
import { Progress } from "@/components/ui/progress"
import { useSession } from "next-auth/react"
import { getRiskFormQuestions, UserRiskProfile, weights, RiskProfile as RiskProfileType } from "@/lib/entities/risk-profile"
import { CreateNotification } from "@/utils/entities/notification"
import { Notification } from "@/lib/entities/notification"

// Each question in the form has a weight and each answer in the question has a weight
// The risk score is calculated by summing the weighted values of the answers

// Question weight is stored in the weights array
// Answer weight is stored in the question schema



const RiskForm = () => {

  const {toast} = useToast()
  const {data:session} = useSession()
  const {t} = useTranslationProvider()

  const [riskProfile, setRiskProfile] = useState<RiskProfileType | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { types, losses, gains, periods, diversifications, goals } = getRiskFormQuestions()

  // Define the form schema and initial values
  let formSchema:any;
  let initialFormValues:any = {};
  formSchema = risk_assesment_schema(t)
  initialFormValues = getDefaults(formSchema)
  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      values: initialFormValues,
  })

  function calculateRiskScore(values: z.infer<typeof formSchema>): number {
    let risk_score = 0
    Object.entries(values).forEach((answer) => {
  
      // Extract the question key and answer value
      const [key, value] = answer
  
      // Ignore certain fields
      if (key !== 'account_number' && key !== 'client_name') {
  
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

      // Calculate the risk score and find the assigned risk profile
      const risk_score = calculateRiskScore(values)
      const assigned_risk_profile = getRiskProfile(risk_score)
      if (!assigned_risk_profile) throw new Error('No risk profile found')

      // Build a user risk profile for the database
      const timestamp = new Date()
      const riskProfileID = formatTimestamp(timestamp)
      const user_risk_profile:UserRiskProfile = {
        RiskProfileID: riskProfileID,
        AccountNumber: values.account_number || '',
        ClientName: values.client_name,
        Score: risk_score,
        RiskProfile: assigned_risk_profile,
        UserID: session?.user?.id
      }
      await saveRiskProfile(user_risk_profile)

      // Send a notification to the AGM Team
      const notification:Notification = {
        UserID: session?.user?.id || '',
        Title: session?.user?.name || '',
        Description: 'Risk profile submitted',
        NotificationID: new Date().toISOString()
      }
      await CreateNotification(notification, 'risk_profiles')
      setSubmitting(false)
      
      // Display the assigned risk profile
      setRiskProfile(user_risk_profile.RiskProfile)

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