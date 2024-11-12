"use client"
import React, {useState} from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"

import { getDefaults, investment_objectives, products, worths } from "@/lib/form"
import { regulatory_schema } from "@/lib/schemas"
import { Ticket } from "@/lib/types"
import { accessAPI } from "@/utils/api"
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

import { Loader2 } from "lucide-react"
import { PersonLinesFill } from "react-bootstrap-icons"

interface Props {
  stepForward:() => void,
  stepBackwards:() => void,
  ticket: Ticket,
  setTicket: React.Dispatch<React.SetStateAction<Ticket | null>>,
}

const Regulatory = ({stepBackwards, ticket, setTicket, stepForward}:Props) => {
  
  const { toast } = useToast()

  const [generating, setGenerating] = useState(false)

  const {t} = useTranslationProvider()
  const translatedInvestmentObjectives = investment_objectives(t)
  const translatedProducts = products(t)

  let formSchema:any;
  let initialFormValues:any;

  formSchema = regulatory_schema(t)
  initialFormValues = getDefaults(formSchema)

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      values: initialFormValues,
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setGenerating(true)

    try {
      
      const updatedApplicationInfo = { ...ticket.ApplicationInfo, ...values };

      const response = await accessAPI('/database/update', 'POST', {
        path: `db/clients/tickets`,
        query: { TicketID: ticket.TicketID },
        data: { 
          ApplicationInfo: updatedApplicationInfo,
          Status: 'Filled'
        }
      });

      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to update ticket');
      }

      const updatedTicket: Ticket = {
        ...ticket,
        ApplicationInfo: updatedApplicationInfo,
        Status: 'Filled'
      };

      setTicket(updatedTicket);
      stepForward();

    } catch (error) {
      console.error('Error updating ticket:', error);
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
        <div className='flex flex-col justify-center gap-y-5 items-center w-full h-full'>
          <PersonLinesFill className='h-24 w-24 text-secondary'/>
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
                t('forms.finish')
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default Regulatory