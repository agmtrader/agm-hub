"use client"
import React, { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { faker } from '@faker-js/faker';
import { Building, ChevronDown, Fingerprint, Loader2, User } from "lucide-react"

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

import { salutations, countries, id_type, employment_status, phone_types, security_questions, currencies, source_of_wealth, purposes } from "@/lib/form"
import { getDefaults } from '@/utils/form'

import { about_organization_schema } from "@/lib/schemas/ticket"
import { Ticket } from "@/lib/entities/ticket"

import { Checkbox } from "@/components/ui/checkbox"

import { accessAPI } from "@/utils/api"
import CountriesFormField from "@/components/ui/CountriesFormField"
import { useToast } from "@/hooks/use-toast"
import { useTranslationProvider } from "@/utils/providers/TranslationProvider"

interface Props {
  stepForward:() => void,
  stepBackward:() => void,
  ticket: Ticket,
  setTicket: React.Dispatch<React.SetStateAction<Ticket | null>>,
}

const AboutOrganization = ({stepForward, ticket, setTicket, stepBackward}:Props) => {

  const backdoor = process.env.DEV_MODE === 'true'

  let formSchema:any;

  const { toast } = useToast()

  const [generating, setGenerating] = useState(false)

  const { t } = useTranslationProvider()
  const translatedPhoneTypes = phone_types(t)
  const translatedSourceOfWealth = source_of_wealth(t)
  const translatedPurposes = purposes(t)

  formSchema = about_organization_schema(t)

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      values: getDefaults(formSchema),
  })

  console.log(form.formState.errors)

  async function onSubmit(values: z.infer<typeof formSchema>) {

    setGenerating(true)

    try {

      if (values.proprietary_assets === false) {
        toast({
          title: "Error",
          description: t('apply.account.organization.proprietary_assets.error'),
          variant: "destructive",
        })
        throw new Error('Proprietary assets verification is required.')
      }

      const updatedApplicationInfo = { ...ticket.ApplicationInfo }

      for (const [key, value] of Object.entries(values)) {
        updatedApplicationInfo[key] = value
      }

      const updatedTicket:Ticket = {
        ...ticket,
        ApplicationInfo: updatedApplicationInfo,
      }

      const response = await accessAPI('/database/update', 'POST', {
        path: `db/clients/tickets`,
        query: { TicketID: ticket.TicketID },
        data: { ApplicationInfo: updatedApplicationInfo }
      })

      if (response['status'] !== 'success') {
        throw new Error(response['message'] || 'Failed to update ticket')
      }

      setTicket(updatedTicket)
      setGenerating(false)
      stepForward()

    } catch (err) {

      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="h-full w-full flex flex-col justify-center gap-y-20 items-center">

      <div className='flex flex-col justify-center gap-y-5 items-center w-full h-full'>
        <Building className='h-24 w-24 text-secondary'/>
        <p className='text-5xl font-bold'>{t('apply.account.organization.title')}</p>
      </div>

      <Form {...form}>

        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-y-5 justify-center items-center">

          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
            <p className="text-3xl font-bold">{t('apply.account.organization.basic_info')}</p>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.organization.name')}</FormLabel>
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.organization.type')}</FormLabel>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                    <div className="flex gap-2 items-center">
                      <FormLabel>{t('apply.account.organization.description')}</FormLabel>
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
              name="website"
              render={({ field }) => (
                <FormItem>
                    <div className="flex gap-2 items-center">
                      <FormLabel>{t('apply.account.organization.website')}</FormLabel>
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
              name="legal_entity_id"
              render={({ field }) => (
                <FormItem>
                    <div className="flex gap-2 items-center">
                      <FormLabel>{t('apply.account.organization.legal_entity_id')}</FormLabel>
                      <FormMessage />
                    </div>
                  <FormControl>
                    <Input placeholder={t('forms.not_required')} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

          </div>

          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
              <p className="text-3xl font-bold">{t('apply.account.organization.purpose_info')}</p>
              <FormField
                control={form.control}
                name="purpose"
                render={() => (
                  <FormItem>
                    <div className="flex gap-2 items-center">
                      <FormLabel>{t('apply.account.organization.purpose_list.title')}</FormLabel>
                      <FormMessage />
                    </div>
                    {translatedPurposes.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="purpose"
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

              <p className="text-2xl font-bold">{t('apply.account.organization.proprietary_assets.title')}</p>

              <FormField
                control={form.control}
                name="proprietary_assets"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-center leading-none">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>
                        Confirm that the account will only hold the business's proprietary assets and will not hold funds of clients or passive investors
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>


          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
            <p className="text-3xl font-bold">{t('apply.account.organization.contact_info')}</p>

            <FormField
              control={form.control}
              name="phone_type"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.authorized_person.phone_type')}</FormLabel>
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
                            ? 
                            translatedPhoneTypes.find(
                                (type) => type.value === type.value
                              )?.label
                            : 
                            ''
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

            <CountriesFormField form={form} element={{ name: "phone_country", title: t('apply.account.authorized_person.phone_country') }} />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.authorized_person.phone_number')}</FormLabel>
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
            <p className="text-3xl font-bold">{t('apply.account.organization.residential_info')}</p>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.authorized_person.address')}</FormLabel>
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
                    <FormLabel>{t('apply.account.authorized_person.city')}</FormLabel>
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
                    <FormLabel>{t('apply.account.authorized_person.state')}</FormLabel>
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
                    <FormLabel>{t('apply.account.authorized_person.zip')}</FormLabel>
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
            <p className="text-3xl font-bold">{t('apply.account.organization.tax_info')}</p>
            <CountriesFormField form={form} element={{ name: "tax_country", title: t('apply.account.organization.tax_country') }} />

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
                  {translatedSourceOfWealth.map((item:any) => (
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

export default AboutOrganization
