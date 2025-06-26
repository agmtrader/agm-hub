"use client"
import React, {useState} from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"

import { investment_objectives, products, worths } from "@/lib/form"
import { getDefaults } from '@/utils/form'

import { regulatory_schema } from "@/lib/schemas/ticket"
import { IndividualTicket, Ticket } from "@/lib/ticket"
import { useTranslationProvider } from "@/utils/providers/TranslationProvider"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import {
  Form,
  FormControl,
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

import { FileCheck2, Loader2 } from "lucide-react"
import { Account, IndividualAccountApplicationInfo } from "@/lib/entities/account"

interface Props {
  stepForward: () => void,
  stepBackwards: () => void,
  account: Account,
  accountInfo: IndividualAccountApplicationInfo,
  syncAccountData: (accountID:string, accountInfo: IndividualAccountApplicationInfo) => Promise<boolean>
}

const Regulatory = ({stepBackwards, account, accountInfo, stepForward, syncAccountData}:Props) => {
  
  const { toast } = useToast()

  const [generating, setGenerating] = useState(false)

  const {t} = useTranslationProvider()
  const translatedInvestmentObjectives = investment_objectives(t)
  const translatedProducts = products(t)

  let formSchema:any;
  let initialFormValues:any;

  formSchema = regulatory_schema(t)
  initialFormValues = accountInfo || getDefaults(formSchema)

  // Ensure arrays are properly initialized
  if (!initialFormValues.investment_objectives) {
    initialFormValues.investment_objectives = []
  }
  if (!initialFormValues.products) {
    initialFormValues.products = []
  }

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      values: initialFormValues,
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setGenerating(true);

    try {
      
      const individualAccount: IndividualAccountApplicationInfo = {
        email: values.email || accountInfo?.email,
        country: values.country || accountInfo?.country,
        account_type: values.account_type || accountInfo?.account_type,
        referrer: values.referrer || accountInfo?.referrer,
        salutation: values.salutation || accountInfo?.salutation,
        first_name: values.first_name || accountInfo?.first_name,
        middle_name: values.middle_name || accountInfo?.middle_name,
        last_name: values.last_name || accountInfo?.last_name,
        address: values.address || accountInfo?.address,
        city: values.city || accountInfo?.city,
        state: values.state || accountInfo?.state,
        zip: values.zip || accountInfo?.zip,
        phone_type: values.phone_type || accountInfo?.phone_type,
        phone_country: values.phone_country || accountInfo?.phone_country,
        phone_number: values.phone_number || accountInfo?.phone_number,
        citizenship: values.citizenship || accountInfo?.citizenship,
        occupation: values.occupation || accountInfo?.occupation,
        country_of_birth: values.country_of_birth || accountInfo?.country_of_birth,
        date_of_birth: values.date_of_birth || accountInfo?.date_of_birth,
        marital_status: values.marital_status || accountInfo?.marital_status,
        number_of_dependents: values.number_of_dependents || accountInfo?.number_of_dependents,
        source_of_wealth: values.source_of_wealth || accountInfo?.source_of_wealth,
        country_of_residence: values.country_of_residence || accountInfo?.country_of_residence,
        tax_id: values.tax_id || accountInfo?.tax_id,
        id_country: values.id_country || accountInfo?.id_country,
        id_type: values.id_type || accountInfo?.id_type,
        id_number: values.id_number || accountInfo?.id_number,
        id_expiration_date: values.id_expiration_date || accountInfo?.id_expiration_date,
        employment_status: values.employment_status || accountInfo?.employment_status,
        employer_name: values.employer_name || accountInfo?.employer_name,
        employer_address: values.employer_address || accountInfo?.employer_address,
        employer_city: values.employer_city || accountInfo?.employer_city,
        employer_state: values.employer_state || accountInfo?.employer_state,
        employer_country: values.employer_country || accountInfo?.employer_country,
        employer_zip: values.employer_zip || accountInfo?.employer_zip,
        nature_of_business: values.nature_of_business || accountInfo?.nature_of_business,
        currency: values.currency || accountInfo?.currency,
        security_q_1: values.security_q_1 || accountInfo?.security_q_1,   
        security_a_1: values.security_a_1 || accountInfo?.security_a_1,
        security_q_2: values.security_q_2 || accountInfo?.security_q_2,
        security_a_2: values.security_a_2 || accountInfo?.security_a_2,
        security_q_3: values.security_q_3 || accountInfo?.security_q_3,
        security_a_3: values.security_a_3 || accountInfo?.security_a_3,
        annual_net_income: values.annual_net_income || accountInfo?.annual_net_income,
        net_worth: values.net_worth || accountInfo?.net_worth,
        liquid_net_worth: values.liquid_net_worth || accountInfo?.liquid_net_worth,
        investment_objectives: values.investment_objectives || accountInfo?.investment_objectives,
        products: values.products || accountInfo?.products,
        amount_to_invest: values.amount_to_invest || accountInfo?.amount_to_invest
      }

      const success = await syncAccountData(account.id, individualAccount);
      if (!success) {
        throw new Error('Failed to sync account data');
      }

      stepForward();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="h-full w-full flex flex-col justify-center gap-y-20 items-center">
        
      <div className='flex'>
        <div className='flex flex-col justify-center gap-y-5 items-center text-center w-full h-full'>
          <FileCheck2 className='h-24 w-24 text-secondary'/>
          <p className='text-5xl font-bold'>{t('apply.account.regulatory.title')}</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-y-5 justify-center items-center">

          <FormField
            control={form.control}
            name="annual_net_income"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-2 items-center">
                  <FormLabel>{t('apply.account.regulatory.annual_net_income')}</FormLabel>
                  <FormMessage />
                </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="form"
                          role="combobox"
                        >
                        {field.value
                          ? worths.find(
                              (worths) => worths.value === field.value
                            )?.label
                          : ""
                        }
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Command>
                      <CommandList>
                        <CommandInput
                          placeholder={t('forms.search')}
                          className="h-9"
                        />
                        <CommandEmpty>{t('forms.no_results')}</CommandEmpty>
                        <CommandGroup>
                          {worths.map((worth) => (
                            <CommandItem
                              value={worth.label}
                              key={worth.value}
                              onSelect={() => {
                                form.setValue("annual_net_income", worth.value)
                              }}
                            >
                              {worth.label}
                            </CommandItem>
                          ))}

                        </CommandGroup>
                        </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="net_worth"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-2 items-center">
                  <FormLabel>{t('apply.account.regulatory.net_worth')}</FormLabel>
                  <FormMessage />
                </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="form"
                          role="combobox"
                        >
                        {field.value
                          ? worths.find(
                              (worths) => worths.value === field.value
                            )?.label
                          : ""
                        }
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Command>
                      <CommandList>
                        <CommandInput
                          placeholder={t('forms.search')}
                          className="h-9"
                        />
                        <CommandEmpty>{t('forms.no_results')}</CommandEmpty>
                        <CommandGroup>
                          {worths.map((worth) => (
                            <CommandItem
                              value={worth.label}
                              key={worth.value}
                              onSelect={() => {
                                form.setValue("net_worth", worth.value)
                              }}
                            >
                              {worth.label}
                            </CommandItem>
                          ))}

                        </CommandGroup>
                        </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="liquid_net_worth"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-2 items-center">
                  <FormLabel>{t('apply.account.regulatory.liquid_net_worth')}</FormLabel>
                  <FormMessage />
                </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="form"
                          role="combobox"
                        >
                        {field.value
                          ? worths.find(
                              (worths) => worths.value === field.value
                            )?.label
                          : ""
                        }
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Command>
                      <CommandList>
                        <CommandInput
                          placeholder={t('forms.search')}
                          className="h-9"
                        />
                        <CommandEmpty>{t('forms.no_results')}</CommandEmpty>
                        <CommandGroup>
                          {worths.map((worth) => (
                            <CommandItem
                              value={worth.label}
                              key={worth.value}
                              onSelect={() => {
                                form.setValue("liquid_net_worth", worth.value)
                              }}
                            >
                              {worth.label}
                            </CommandItem>
                          ))}

                        </CommandGroup>
                        </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="investment_objectives"
            render={() => (
              <FormItem>
                <div className="flex gap-2 items-center">
                  <FormLabel>{t('apply.account.regulatory.investment_objectives')}</FormLabel>
                  <FormMessage />
                </div>
                {translatedInvestmentObjectives.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="investment_objectives"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value:any) => value !== item.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal w-fit">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="products"
            render={() => (
              <FormItem>
                <div className="flex gap-2 items-center">
                  <FormLabel>{t('apply.account.regulatory.products_to_trade')}</FormLabel>
                  <FormMessage />
                </div>
                {translatedProducts.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="products"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value:any) => value !== item.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal w-fit">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount_to_invest"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-2 items-center">
                  <FormLabel>{t('apply.account.regulatory.amount_to_invest')}</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Input placeholder='' {...field} />
                </FormControl>
              </FormItem>
          )}
          />

          <div className="flex gap-x-5 justify-center items-center w-full h-full">
            <Button onClick={stepBackwards} variant="ghost">
              {t('forms.previous_step')}
            </Button>
            <Button type="submit" disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  {t('forms.submitting')}
                </>
              ) : (
                t('forms.submit')
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default Regulatory