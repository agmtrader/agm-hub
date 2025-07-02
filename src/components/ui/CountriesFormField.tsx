'use client'

import React from 'react'
import { Button } from './button'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from './form'
import { Popover, PopoverTrigger, PopoverContent } from './popover'
import { Command, CommandList, CommandInput, CommandEmpty, CommandGroup, CommandItem } from './command'
import { countries } from '@/lib/public/form'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const CountriesFormField = ({ form, element }: { form: any, element: { name: string, title: string } }) => {

  const { t, lang } = useTranslationProvider();

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
          <Popover>
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
                          form.setValue(element.name, country.value)
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