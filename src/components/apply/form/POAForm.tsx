import React from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getDefaults } from '@/utils/form'
import { poa_schema } from "@/lib/entities/schemas/application"
import { Button } from '@/components/ui/button'
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

interface Props {
  onSubmit: (values: any) => void | Promise<void>
  uploading: boolean
}

const POAForm = ({ onSubmit, uploading }:Props) => {

  const defaultValues = getDefaults(poa_schema)

  const form = useForm({
    resolver: zodResolver(poa_schema),
    defaultValues: defaultValues,
  })

  const handleSubmit = (documentInfo: any) => {
    onSubmit(documentInfo);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit(handleSubmit)(e);
        }}
        className="space-y-4"
      >

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
                <div className="flex gap-2">
                  <FormLabel>Type</FormLabel>
                  <FormMessage />
                </div>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Utility Bill">Utility Bill</SelectItem>
                  <SelectItem value="Bank Statement">Bank Statement</SelectItem>
                  <SelectItem value="Tax Return">Tax Return</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="issued_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="flex gap-2">
                <FormLabel>Issued Date</FormLabel>
                <FormMessage />
              </div>
              <DateTimePicker {...field} granularity="day" />
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
