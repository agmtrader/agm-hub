"use client"
import React, { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2, User } from "lucide-react"

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

import { salutations, id_type, employment_status, phone_types, security_questions } from "@/lib/form"
import { getDefaults } from '@/utils/form'

import { authorized_person_schema } from "@/lib/schemas/ticket"

import { Checkbox } from "@/components/ui/checkbox"
import { Ticket } from "@/lib/entities/ticket"
import { DateTimePicker } from "@/components/ui/datetime-picker"
import CountriesFormField from "@/components/ui/CountriesFormField"
import { useToast } from "@/hooks/use-toast"
import { useTranslationProvider } from "@/utils/providers/TranslationProvider"

interface Props {
  stepForward: () => void,
  stepBackward: () => void,
  ticket: Ticket,
  syncTicketData: (updatedTicket: Ticket) => Promise<boolean>
}

const AuthorizedPerson = ({stepForward, ticket, stepBackward, syncTicketData}:Props) => {

  let formSchema:any;

  const { toast } = useToast()

  const [generating, setGenerating] = useState(false)

  const { t } = useTranslationProvider()
  const translatedIdType = id_type(t)
  const translatedEmploymentStatus = employment_status(t)
  const translatedPhoneTypes = phone_types(t)

  formSchema = authorized_person_schema(t)

  let initialFormValues = ticket?.ApplicationInfo || getDefaults(formSchema);
  
  if (initialFormValues.position && !Array.isArray(initialFormValues.position)) {
    initialFormValues.position = [initialFormValues.position];
  } else if (!initialFormValues.position) {
    initialFormValues.position = [];
  }

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      values: initialFormValues,
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setGenerating(true);

    try {
      const updatedApplicationInfo = { ...ticket.ApplicationInfo };

      for (const [key, value] of Object.entries(values)) {
        updatedApplicationInfo[key] = value;
      }

      const updatedTicket: Ticket = {
        ...ticket,
        ApplicationInfo: updatedApplicationInfo,
      };

      const success = await syncTicketData(updatedTicket);
      if (!success) {
        throw new Error('Failed to sync ticket data');
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

  return (
    <div className="h-full w-full flex flex-col justify-center gap-y-20 items-center">

      <div className='flex flex-col justify-center gap-y-5 items-center w-full h-full'>
        <User className='h-24 w-24 text-secondary'/>
        <p className='text-5xl font-bold'>{t('apply.account.authorized_person.title')}</p>
      </div>

      <Form {...form}>

        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-y-5 justify-center items-center">

          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
            <p className="text-3xl font-bold">{t('apply.account.authorized_person.basic_info')}</p>

            <FormField
              control={form.control}
              name="salutation"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.authorized_person.salutation')}</FormLabel>
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
                    <FormLabel>{t('apply.account.authorized_person.first_name')}</FormLabel>
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
                    <FormLabel>{t('apply.account.authorized_person.middle_name')}</FormLabel>
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
                    <FormLabel>{t('apply.account.authorized_person.last_name')}</FormLabel>
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
              name="suffix"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.authorized_person.suffix')}</FormLabel>
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
              name="date_of_birth"
              render={({ field }) => (
                <FormItem className="w-full">
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.authorized_person.date_of_birth')}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <DateTimePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => field.onChange(date?.toISOString())}
                      granularity="day"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
                      <FormField
            control={form.control}
            name="position"
            render={() => (
              <FormItem>
                <div className="flex gap-2 items-center">
                  <FormLabel>{t('apply.account.authorized_person.position')}</FormLabel>
                  <FormMessage />
                </div>
                {['Director', 'Officer', 'Shareholder'].map((pos) => (
                  <FormField
                    key={pos}
                    control={form.control}
                    name="position"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={pos}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(pos)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), pos])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value: string) => value !== pos
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal w-fit">
                            {pos}
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.authorized_person.email')}</FormLabel>
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


          <FormField
            control={form.control}
            name="third_party"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-2 items-center">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>{t('apply.account.authorized_person.third_party')}</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          </div>

          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
            <p className="text-3xl font-bold">{t('apply.account.authorized_person.residential_info')}</p>

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
            <p className="text-3xl font-bold">{t('apply.account.authorized_person.tax_info')}</p>

            <CountriesFormField form={form} element={{ name: "tax_country", title: t('apply.account.authorized_person.tax_country') }} />

            <FormField
              control={form.control}
              name="tax_id"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.authorized_person.tax_id')}</FormLabel>
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
            <p className="text-3xl font-bold">{t('apply.account.authorized_person.id_info')}</p>


            <CountriesFormField form={form} element={{ name: "id_country", title: t('apply.account.authorized_person.id_country') }} />

            <FormField
              control={form.control}
              name="id_type"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.authorized_person.id_type')}</FormLabel>
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
                    <FormLabel>{t('apply.account.authorized_person.id_number')}</FormLabel>
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
                    <FormLabel>{t('apply.account.authorized_person.id_expiration')}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <DateTimePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => field.onChange(date?.toISOString())}
                      granularity="day"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

          </div>

          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
            <p className="text-3xl font-bold">{t('apply.account.authorized_person.employer_info')}</p>

            <FormField
              control={form.control}
              name="employment_status"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>{t('apply.account.authorized_person.employment_status')}</FormLabel>
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

            {form.watch("employment_status") === "Employed" && (
              <>
                <FormField
                  control={form.control}
                  name="employer_name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2 items-center">
                        <FormLabel>{t('apply.account.authorized_person.employer_name')}</FormLabel>
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
                        <FormLabel>{t('apply.account.authorized_person.employer_address')}</FormLabel>
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
                        <FormLabel>{t('apply.account.authorized_person.employer_city')}</FormLabel>
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
                        <FormLabel>{t('apply.account.authorized_person.employer_state')}</FormLabel>
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
                        <FormLabel>{t('apply.account.authorized_person.employer_zip')}</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input placeholder="Enter employer zip" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <div className="flex flex-col gap-y-5 justify-center items-center w-full h-full">
            <p className="text-3xl font-bold">{t('apply.account.authorized_person.security_questions')}</p>
            
            {[1, 2, 3].map((num) => (
              <React.Fragment key={num}>
                <FormField
                  control={form.control}
                  name={`security_q_${num}`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2 items-center">
                        <FormLabel>{t('apply.account.authorized_person.security_question')} {num}</FormLabel>
                        <FormMessage />
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="form" role="combobox">
                              {field.value
                                ? security_questions.find(q => q.value === field.value)?.label
                                : ''}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Command>
                            <CommandList>
                              <CommandInput placeholder={t('forms.search')} />
                              <CommandEmpty>{t('forms.no_results')}</CommandEmpty>
                              <CommandGroup>
                                {security_questions.map((q) => (
                                  <CommandItem
                                    key={q.value}
                                    value={q.label}
                                    onSelect={() => form.setValue(`security_q_${num}`, q.value)}
                                  >
                                    {q.label}
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
                  name={`security_a_${num}`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2 items-center">
                        <FormLabel>{t('apply.account.authorized_person.security_answer')} {num}</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input placeholder='' {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </React.Fragment>
            ))}
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

export default AuthorizedPerson