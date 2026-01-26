import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { getSubdivisions } from '@/utils/iso3166'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from './form'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './select'
import { Input } from './input'

interface StatesFormFieldProps {
  form: UseFormReturn<any>
  /** Country code (ISO-3166-1 alpha-2 or alpha-3). Can be undefined. */
  country: string | undefined | null
  /** RHF field path where the subdivision/state code should be stored */
  stateFieldName: string
  label?: string
}

/**
 * Shows a subdivision dropdown for the supplied `country` code.
 * If the country has no ISO-3166-2 data (or no country provided) we fall back to a free-text input.
 */
const StatesFormField = ({ form, country, stateFieldName, label = 'State / Province' }: StatesFormFieldProps) => {
  const subdivisions = React.useMemo(() => getSubdivisions(country || ''), [country])

  if (!country) {
    // Country not selected yet – disable field
    return (
      <FormField
        control={form.control}
        name={stateFieldName as any}
        render={({ field }) => (
          <FormItem>
            <div className='flex flex-row gap-2 items-center'>
              <FormLabel>{label}</FormLabel>
              <FormMessage />
            </div>
            <FormControl>
              <Input placeholder="" {...field} disabled />
            </FormControl>
          </FormItem>
        )}
      />
    )
  }

  if (subdivisions.length === 0) {
    // No subdivisions for country – keep free text input
    return (
      <FormField
        control={form.control}
        name={stateFieldName as any}
        render={({ field }) => (
          <FormItem>
            <div className='flex flex-row gap-2 items-center'>
              <FormLabel>{label}</FormLabel>
              <FormMessage />
            </div>
            <FormControl>
              <Input placeholder="" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    )
  }

  return (
    <FormField
      control={form.control}
      name={stateFieldName as any}
      render={({ field }) => (
        <FormItem>
          <div className='flex flex-row gap-2 items-center'>
            <FormLabel>{label}</FormLabel>
            <FormMessage />
          </div>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-72 overflow-y-auto">
              {subdivisions.map((sub) => (
                <SelectItem key={sub.code} value={sub.code}>{`${sub.name}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  )
}
export default StatesFormField
