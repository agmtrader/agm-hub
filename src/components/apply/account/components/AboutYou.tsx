"use client"
import React, { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Fingerprint, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { marital_status, salutations, id_type, employment_status, currencies, source_of_wealth, phone_types, security_questions, countries } from "@/lib/form"
import { getDefaults } from '@/utils/form'
import { about_you_primary_schema, about_you_secondary_schema } from "@/lib/schemas/ticket"
import { Checkbox } from "@/components/ui/checkbox"
import { IndividualTicket, Ticket } from "@/lib/entities/ticket"
import { DateTimePicker } from "@/components/ui/datetime-picker"
import CountriesFormField from "@/components/ui/CountriesFormField"
import { useToast } from "@/hooks/use-toast"
import { useTranslationProvider } from "@/utils/providers/TranslationProvider"
import { formatDateFromTimestamp, getDateObjectFromTimestamp } from "@/utils/dates"
import { Account, IndividualAccountApplicationInfo } from "@/lib/entities/account"

interface Props {
  primary: boolean,
  stepForward: () => void,
  stepBackward: () => void,
  account: Account,
  accountInfo: IndividualAccountApplicationInfo,
  syncAccountData: (accountID:string, accountInfo: IndividualAccountApplicationInfo) => Promise<boolean>
}

const AboutYou = ({primary, stepForward, stepBackward, account, accountInfo, syncAccountData}:Props) => {

  let formSchema:any;

  const { toast } = useToast()

  const [generating, setGenerating] = useState(false)

  const { t } = useTranslationProvider()
  const translatedSourceOfWealth = source_of_wealth(t)
  const translatedMaritalStatus = marital_status(t)
  const translatedIdType = id_type(t)
  const translatedEmploymentStatus = employment_status(t)
  const translatedPhoneTypes = phone_types(t)

  formSchema = about_you_primary_schema(t)
  let initialFormValues = accountInfo || getDefaults(formSchema);

  // Ensure source_of_wealth is always an array
  if (initialFormValues.source_of_wealth && !Array.isArray(initialFormValues.source_of_wealth)) {
    initialFormValues.source_of_wealth = [initialFormValues.source_of_wealth];
  } else if (!initialFormValues.source_of_wealth) {
    initialFormValues.source_of_wealth = [];
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
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  }
  console.log(initialFormValues, form.formState.errors)

  return (
    <div className="h-full w-full flex flex-col justify-center gap-y-20 items-center">

      <div className='flex flex-col justify-center gap-y-5 items-center w-full h-full'>
        <Fingerprint className='h-24 w-24 text-secondary'/>
        <p className='text-5xl font-bold'>{t('apply.account.about_you.title')}</p>
        <p>{primary ? t('apply.account.about_you.primary') : t('apply.account.about_you.secondary')}</p>
      </div>

      <Form {...form}>

        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-y-5 justify-center items-center">

          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
            <p className="text-3xl font-bold">{t('apply.account.about_you.basic_info')}</p>

            <FormField
              control={form.control}
              name="salutation"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.about_you.salutation')}</FormLabel>
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
                            ? salutations.find(
                                (salutation) => salutation.value === field.value
                              )?.label
                            : ''
                          }
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder={t('forms.search')}
                          />
                          <CommandEmpty>{t('forms.no_results')}</CommandEmpty>
                          <CommandGroup>
                            {salutations.map((salutation) => (
                              <CommandItem
                                value={salutation.label}
                                key={salutation.value}
                                onSelect={() => {
                                  form.setValue("salutation", salutation.value)
                                }}
                              >
                                {salutation.label}
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
              name="first_name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.about_you.first_name')}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input placeholder='' {...field} />
                  </FormControl>
                </FormItem>
            )}
            />

            <FormField
              control={form.control}
              name="middle_name"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.about_you.middle_name')}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input placeholder='' {...field} />
                  </FormControl>
                </FormItem>
            )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.about_you.last_name')}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input placeholder='' {...field} />
                  </FormControl>
                </FormItem>
            )}
            />
          </div>

          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
            <p className="text-3xl font-bold">{t('apply.account.about_you.residential_info')}</p>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.about_you.address')}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input placeholder='' {...field} />
                  </FormControl>
                </FormItem>
            )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.about_you.city')}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input placeholder='' {...field} />
                  </FormControl>
                </FormItem>
            )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.about_you.state')}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input placeholder='' {...field} />
                  </FormControl>
                </FormItem>
            )}
            />

            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.about_you.zip')}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input placeholder='' {...field} />
                  </FormControl>
                </FormItem>
            )}
            />

            <FormField
              control={form.control}
              name="phone_type"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.about_you.phone_type')}</FormLabel>
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
                            ? translatedPhoneTypes.find(
                                (type) => type.value === type.value
                              )?.label
                            : ''
                          }
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder={t('forms.search')}
                          />
                          <CommandEmpty>{t('forms.no_results')}</CommandEmpty>
                          <CommandGroup>
                            {translatedPhoneTypes.map((type) => (
                              <CommandItem
                                value={type.label}
                                key={type.value}
                                onSelect={() => {
                                  form.setValue("phone_type", type.value)
                                }}
                              >
                                {type.label}
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

            <CountriesFormField form={form} element={{ name: "phone_country", title: t('apply.account.about_you.phone_country') }} />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.about_you.phone_number')}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input placeholder='' {...field} />
                </FormControl>
                </FormItem>
            )}
            />   

            <CountriesFormField form={form} element={{ name: "citizenship", title: t('apply.account.about_you.citizenship') }} />
            <CountriesFormField form={form} element={{ name: "country_of_birth", title: t('apply.account.about_you.country_of_birth') }} />
            
          </div>

          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
            <p className="text-3xl font-bold">{t('apply.account.about_you.personal_info')}</p>

            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem className="w-full">
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.about_you.date_of_birth')}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <DateTimePicker
                      value={field.value ? getDateObjectFromTimestamp(field.value) : undefined}
                      onChange={(date) => field.onChange(date?.toISOString())}
                      granularity="day"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marital_status"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.about_you.marital_status')}</FormLabel>
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
                            ? translatedMaritalStatus.find(
                                (status) => status.value === field.value
                              )?.label
                            : ''
                          }
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder={t('forms.search')}
                          />
                          <CommandEmpty>{t('forms.no_results')}</CommandEmpty>
                          <CommandGroup>
                            {translatedMaritalStatus.map((status) => (
                              <CommandItem
                                value={status.label}
                                key={status.value}
                                onSelect={() => {
                                  form.setValue("marital_status", status.value)
                                }}
                              >
                                {status.label}
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
              name="number_of_dependents"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.about_you.number_of_dependents')}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input placeholder='' {...field} />
                  </FormControl>
                </FormItem>
            )}
            />

          <CountriesFormField form={form} element={{ name: "country_of_residence", title: t('apply.account.about_you.country_of_residence') }} />

          <FormField
              control={form.control}
              name="tax_id"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.about_you.tax_id')}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input placeholder='' {...field} />
                  </FormControl>
                </FormItem>
            )}
            />
          </div>

          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
            <p className="text-3xl font-bold">{t('apply.account.about_you.id_info')}</p>


            <CountriesFormField form={form} element={{ name: "id_country", title: t('apply.account.about_you.id_country') }} />

            <FormField
              control={form.control}
              name="id_type"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.about_you.id_type')}</FormLabel>
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
                            ? translatedIdType.find(
                                (status) => status.value === field.value
                              )?.label  
                            : ''
                          }
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder={t('forms.search')}
                          />
                          <CommandEmpty>{t('forms.no_results')}</CommandEmpty>
                          <CommandGroup>
                            {translatedIdType.map((status) => (
                              <CommandItem
                                value={status.label}
                                key={status.value}
                                onSelect={() => {
                                  form.setValue("id_type", status.value)
                                }}
                              >
                                {status.label}
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
              name="id_number"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.about_you.id_number')}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input placeholder='' {...field} />
                  </FormControl>
                </FormItem>
            )}
            />

            <FormField
              control={form.control}
              name="id_expiration_date"
              render={({ field }) => (
                <FormItem className="w-full">
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.about_you.id_expiration')}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <DateTimePicker
                      value={field.value ? getDateObjectFromTimestamp(field.value) : undefined}
                      onChange={(date) => field.onChange(date?.toISOString())}
                      granularity="day"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

          </div>

          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
            <p className="text-3xl font-bold">{t('apply.account.about_you.employer_info')}</p>

            <FormField
              control={form.control}
              name="employment_status"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.about_you.employment_status')}</FormLabel>
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
                            ? translatedEmploymentStatus.find(
                                (status) => status.value === field.value
                              )?.label
                            : ''
                          }
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder={t('forms.search')}
                          />
                          <CommandEmpty>{t('forms.no_results')}</CommandEmpty>
                          <CommandGroup>
                            {translatedEmploymentStatus.map((status) => (
                              <CommandItem
                                value={status.label}
                                key={status.value}
                                onSelect={() => {
                                  form.setValue("employment_status", status.value)
                                }}
                              >
                                {status.label}
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

            {(form.watch("employment_status") === "Employed" || form.watch("employment_status") === "Self-employed") && (
              <>
                <FormField
                  control={form.control}
                  name="employer_name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2 items-center">
                        <FormLabel>{t('apply.account.about_you.employer_name')}</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input placeholder="Enter employer name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employer_address"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2 items-center">
                        <FormLabel>{t('apply.account.about_you.employer_address')}</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input placeholder="Enter employer address" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employer_city"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2 items-center">
                        <FormLabel>{t('apply.account.about_you.employer_city')}</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input placeholder="Enter employer city" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employer_state"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2 items-center">
                        <FormLabel>{t('apply.account.about_you.employer_state')}</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input placeholder="Enter employer state/province" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <CountriesFormField form={form} element={{ name: "employer_country", title: "Employer Country" }} />

                <FormField
                  control={form.control}
                  name="employer_zip"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2 items-center">
                        <FormLabel>{t('apply.account.about_you.employer_zip')}</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input placeholder="Enter employer zip" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nature_of_business"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2 items-center">
                        <FormLabel>{t('apply.account.about_you.nature_of_business')}</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input placeholder="Enter nature of business" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2 items-center">
                        <FormLabel>{t('apply.account.about_you.occupation')}</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input placeholder="Enter occupation" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
            <p className="text-3xl font-bold">{t('apply.account.about_you.financial_info')}</p>

            <FormField
              control={form.control}
              name="source_of_wealth"
              render={() => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.about_you.source_of_wealth')}</FormLabel>
                    <FormMessage />
                  </div>
                  {translatedSourceOfWealth.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="source_of_wealth"
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
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.about_you.currency')}</FormLabel>
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
                            ? currencies.find(
                                (status) => status.value === field.value
                              )?.label
                            : ''
                          }
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder={t('forms.search')}
                          />
                          <CommandEmpty>{t('forms.no_results')}</CommandEmpty>
                          <CommandGroup>
                            {currencies.map((status) => (
                              <CommandItem
                                value={status.label}
                                key={status.value}
                                onSelect={() => {
                                  form.setValue("currency", status.value)
                                }}
                              >
                                {status.label}
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


          </div>

          {primary ?
            <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
              <p className="text-3xl font-bold">{t('apply.account.about_you.security_questions')}</p>
  
              <FormField
                control={form.control}
                name="security_q_1"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-center">
                      <FormLabel>{t('apply.account.about_you.security_question_1')}</FormLabel>
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
                              ? security_questions.find(
                                  (status) => status.value === field.value
                                )?.label
                              : ''
                            }
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          <CommandList>
                            <CommandInput
                              placeholder={t('forms.search')}
                            />
                            <CommandEmpty>{t('forms.no_results')}</CommandEmpty>
                            <CommandGroup>
                              {security_questions.map((question) => (
                                <CommandItem
                                  value={question.label}
                                  key={question.value}
                                  onSelect={() => {
                                    form.setValue("security_q_1", question.value)
                                  }}
                                >
                                  {question.label}
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
                name="security_a_1"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-center">
                      <FormLabel>{t('apply.account.about_you.security_answer_1')}</FormLabel>
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
                name="security_q_2"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-center">
                      <FormLabel>{t('apply.account.about_you.security_question_2')}</FormLabel>
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
                              ? security_questions.find(
                                  (status) => status.value === field.value
                                )?.label
                              : ''
                            }
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          <CommandList>
                            <CommandInput
                              placeholder={t('forms.search')}
                            />
                            <CommandEmpty>{t('forms.no_results')}</CommandEmpty>
                            <CommandGroup>
                              {security_questions.map((question) => (
                                <CommandItem
                                  value={question.label}
                                  key={question.value}
                                  onSelect={() => {
                                    form.setValue("security_q_2", question.value)
                                  }}
                                >
                                  {question.label}
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
                name="security_a_2"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-center">
                      <FormLabel>{t('apply.account.about_you.security_answer_2')}</FormLabel>
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
                name="security_q_3"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-center">
                      <FormLabel>{t('apply.account.about_you.security_question_3')}</FormLabel>
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
                              ? security_questions.find(
                                  (status) => status.value === field.value
                                )?.label
                              : ''
                            }
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          <CommandList>
                            <CommandInput
                              placeholder={t('forms.search')}
                            />
                            <CommandEmpty>{t('forms.no_results')}</CommandEmpty>
                            <CommandGroup>
                              {security_questions.map((question) => (
                                <CommandItem
                                  value={question.label}
                                  key={question.value}
                                  onSelect={() => {
                                    form.setValue("security_q_3", question.value)
                                  }}
                                >
                                  {question.label}
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
                name="security_a_3"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-center">
                      <FormLabel>{t('apply.account.about_you.security_answer_3')}</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            :
            <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
              <p className="text-3xl font-bold">{t('apply.account.about_you.login_info')}</p>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-center">
                      <FormLabel>{t('apply.account.about_you.email')}</FormLabel>
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-center">
                      <FormLabel>{t('apply.account.about_you.username')}</FormLabel>
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-center">
                      <FormLabel>{t('apply.account.about_you.password')}</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          }

          <div className="flex gap-x-5 justify-center items-center w-full h-full">
            <Button type="button" variant='ghost' onClick={stepBackward}>
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

export default AboutYou