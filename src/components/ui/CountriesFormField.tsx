import React from 'react'
import { Button } from './button'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from './form'
import { Popover, PopoverTrigger, PopoverContent } from './popover'
import { Command, CommandList, CommandInput, CommandEmpty, CommandGroup, CommandItem } from './command'
import { countries } from '@/lib/form'

const CountriesFormField = ({ form, element }: { form: any, element: any }) => {
  return (
    <FormField
    control={form.control}
    name={element.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{element.title}</FormLabel>
          <FormMessage />
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
                    : "Select a country"}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent>
              <Command>
                <CommandList>
                  <CommandInput
                    placeholder="Search countries..."
                  />
                  <CommandEmpty>No country found.</CommandEmpty>
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