import React from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getDefaults } from '@/utils/form'
import { poi_schema } from "@/lib/entities/schemas/application"
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
import { Loader2 } from 'lucide-react'

interface Props {
  onSubmit: (values: any) => void | Promise<void>
  uploading: boolean
}

const POIForm = ({ onSubmit, uploading }:Props) => {

  const defaultValues = getDefaults(poi_schema)

  const form = useForm({
    resolver: zodResolver(poi_schema),
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
        className="space-y-6"
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
                  <SelectItem value="National ID Card">National ID Card</SelectItem>
                  <SelectItem value="Passport">Passport</SelectItem>
                  <SelectItem value="Driver License">Driver License</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        {
          uploading ? (
            <Button className="h-fit w-full sm:w-fit" type="submit">
              <Loader2 className="h-4 w-4 animate-spin text-background" /> 
              Submitting...
            </Button>
          ) : (
            <Button className="h-fit w-full sm:w-fit text-background" type="submit">Submit</Button>
          )
        }

      </form>
    </Form>
  )
}

export default POIForm
