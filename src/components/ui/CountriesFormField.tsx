'use client'

import React, { useState } from 'react'
import { Button } from './button'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from './form'
import { Popover, PopoverTrigger, PopoverContent } from './popover'
import { Command, CommandList, CommandInput, CommandEmpty, CommandGroup, CommandItem } from './command'
import { countries } from '@/lib/public/form'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

interface CountriesFormFieldProps {
  form: any
  element: { name: string, title: string }
}

const CountriesFormField = ({ form, element }: CountriesFormFieldProps) => {

  const { t } = useTranslationProvider();
  const [open, setOpen] = useState(false)

  return (
    <FormField
    control={form.control}
    name={element.name}
      render={({ field }) => (
        <FormItem>
          <div className='flex gap-2 items-center'>
            <FormLabel className='capitalize'>{element.title}</FormLabel>
            <FormMessage />
          </div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  role="combobox"
                  variant="form"
                >
                  {field.value
                    ? countries.find(
                        (country) => country.value === field.value
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
                    {countries.map((country) => (
                      <CommandItem
                        value={country.label}
                        key={country.value}
                        onSelect={() => {
                          field.onChange(country.value)
                          setOpen(false)
                        }}
                      >
                        {country.label}
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
  )
}

export default CountriesFormField