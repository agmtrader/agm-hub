"use client"
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useSearchParams } from 'next/navigation'

import { IndividualAccountApplicationInfo, Account, AccountPayload } from "@/lib/entities/account"
import { formatTimestamp } from "../../../../utils/dates"
import { account_types } from "@/lib/form"
import { getDefaults } from '@/utils/form'
import { general_info_schema } from "@/lib/schemas/account"
import CountriesFormField from "@/components/ui/CountriesFormField"

import { useToast } from "@/hooks/use-toast"
import { useTranslationProvider } from "@/utils/providers/TranslationProvider"

import { Button } from "@/components/ui/button"
import { Loader2, UserRound } from "lucide-react"

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
import { useSession } from "next-auth/react"


interface Props {
  stepForward: () => void,
  account: Account | null,
  accountInfo: IndividualAccountApplicationInfo | null,
  syncAccountData: (accountID:string, accountInfo: IndividualAccountApplicationInfo) => Promise<boolean>,
  createAccount: (payload: AccountPayload, infoData: IndividualAccountApplicationInfo) => Promise<Account | null>;
}

const GeneralInfo = ({ stepForward, account, accountInfo, syncAccountData, createAccount }: Props) => {

  const {data:session} = useSession()
  const userID = session?.user.id
  if (!userID) throw new Error('Critical Error: User ID not found')

  const [generating, setGenerating] = useState(false)
  const searchParams = useSearchParams()


  let formSchema: any;
  let initialFormValues: any;

  const {t} = useTranslationProvider()
  formSchema = general_info_schema(t)
  initialFormValues = accountInfo || getDefaults(formSchema)

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      values: initialFormValues,
  })

  const {toast} = useToast()
  const translatedAccountTypes = account_types(t)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setGenerating(true);

    if (!userID) {
      toast({
        title: 'Error',
        description: 'Critical Error: User ID not found. Cannot continue with application.',
        variant: 'destructive',
      });
      setGenerating(false);
      return;
    }
    if (!session?.user?.name) {
      toast({
        title: 'Error',
        description: 'Critical Error: User name not found. Cannot continue with application.',
        variant: 'destructive',
      });
      setGenerating(false);
      return;
    }

    try {
      const advisor_id = account?.advisor_id || searchParams.get('ad') || null;
      const master_account_id = account?.master_account_id || searchParams.get('ma') || null;
      const lead_id = account?.lead_id || searchParams.get('ld') || null;

      // Create minimal payload for initial account creation
      const payload: AccountPayload = {
        status: 'Started',
        advisor_id: advisor_id,
        user_id: userID,
        master_account_id: master_account_id,
        lead_id: lead_id,
        account_type: values.account_type,
        ibkr_account_number: null,
      };

      const individualAccountInfo: IndividualAccountApplicationInfo = {
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

      console.log('individualAccountInfo', individualAccountInfo)

      if (!account) {

        const newAccount = await createAccount(payload, individualAccountInfo);
        if (newAccount) {
          stepForward();
        }
        
      } else {
        // For existing account, just sync the data
        const success = await syncAccountData(account.id, individualAccountInfo);
        if (success) {
          stepForward();
        }

      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || "An unexpected error occurred",
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  }

  return (
      <div className="h-full w-full flex flex-col justify-center gap-y-20 items-center">
        
        <div className='flex'>
          <div className='flex flex-col justify-center gap-y-5 items-center text-center w-full h-full'>
            <UserRound className='h-24 w-24 text-secondary'/>
            <p className='text-5xl font-bold'>{t('apply.account.general_info.title')}</p>
          </div>
        </div>

        <div className='flex flex-col bg-error/20 p-5 max-w-xl rounded-lg justify-center gap-y-5 items-center w-full h-full'>
          <div className='flex flex-col gap-y-5 justify-center items-center w-full h-full'>
            <div className="space-y-4 text-sm text-subtitle">
              <p className="font-semibold">
                {t('apply.account.general_info.disclaimer.title')}
              </p>
              <p>
                {t('apply.account.general_info.disclaimer.content')}
              </p>
              <p>
                {t('apply.account.general_info.disclaimer.contact')}
                <br />
                <span className="font-medium">Email:</span> <a className="underline" href="mailto:info@agmtechnology.com" target="_blank" rel="noopener noreferrer">info@agmtechnology.com</a>
                <br />
                <span className="font-medium">Whatsapp:</span> <a className="underline" href="https://wa.me/17862511496" target="_blank" rel="noopener noreferrer">+1 (786) 251-1496</a>
              </p>
            </div>
          </div>
        </div>
        
        <Form {...form}>
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-y-5 justify-center items-center">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className='flex gap-2 items-center'>
                    <FormLabel>{t('apply.account.general_info.email')}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input {...field} placeholder=''/>
                  </FormControl>
                </FormItem>
              )}
            />
          
            <CountriesFormField 
              form={form} 
              element={{ 
                name: "country", 
                title: t('apply.account.general_info.country') 
              }} 
            />

            <FormField
              control={form.control}
              name="account_type"
              render={({ field }) => (
                <FormItem>
                  <div className='flex gap-2 items-center'>
                    <FormLabel>{t('apply.account.general_info.account_type')}</FormLabel>
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
                            ? translatedAccountTypes.find(
                                (type) => type.value === field.value
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
                            {translatedAccountTypes.map((type) => (
                              <CommandItem
                                value={type.label}
                                key={type.value}
                                onSelect={() => {
                                  form.setValue("account_type", type.value)
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

            <FormField
              control={form.control}
              name="referrer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('apply.account.general_info.referrer')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder=''/>
                  </FormControl>
                </FormItem>
              )}
            />
            

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
          </form>
        </Form>

      </div>
    )
}

export default GeneralInfo