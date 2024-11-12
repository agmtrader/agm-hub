import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getDefaults } from "@/lib/form"
import { poa_schema } from "@/lib/schemas"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateTimePicker } from '@/components/ui/datetime-picker'
import { Loader2 } from 'lucide-react'

interface POAFormProps {
  onSubmit: (values: any, files: File[] | null) => Promise<void>
  accountNumber?: string
  uploading: boolean
}

const POAForm: React.FC<POAFormProps> = ({ onSubmit, accountNumber, uploading }) => {

  const defaultValues = getDefaults(poa_schema)
  if (accountNumber) defaultValues.account_number = accountNumber

  const form = useForm({
    resolver: zodResolver(poa_schema),
    defaultValues: defaultValues,
  })

  const handleSubmit = (values: any) => {
    onSubmit(values, null) // We're not passing files here, as they're managed in the parent component
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="account_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Utility bill">Utility bill</SelectItem>
                  <SelectItem value="Bank Statement">Bank Statement</SelectItem>
                  <SelectItem value="Tax Return">Tax Return</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="issued_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Issued Date</FormLabel>
              <DateTimePicker {...field} granularity="day" />
              <FormMessage />
            </FormItem>
          )}
        />

        {
          uploading ? (
            <Button className="h-fit w-fit" type="submit">
              <Loader2 className="h-4 w-4 animate-spin text-background" /> 
              Submitting...
            </Button>
          ) : (
            <Button className="h-fit w-fit text-background" type="submit">Submit</Button>
          )
        }

      </form>
    </Form>
  )
}

export default POAForm
