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
import { DateTimePicker } from '@/components/ui/datetime-picker'
import { Loader2 } from 'lucide-react'
import CountriesFormField from '@/components/ui/CountriesFormField'

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <CountriesFormField
          form={form}
          element={{ name: "country_of_issue", title: "Country of Issue" }}
        />

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

          <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Full Name</FormLabel>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

          <FormField
          control={form.control}
          name="id_number"
          render={({ field }) => (
            <FormItem className="col-span-2 sm:col-span-1">
              <FormLabel>ID Number</FormLabel>
              <Input {...field} />
              <FormMessage />
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

          <FormField
          control={form.control}
          name="date_of_birth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="flex gap-2">
                <FormLabel>Date of Birth</FormLabel>
                <FormMessage />
              </div>
              <DateTimePicker {...field} granularity="day" />
            </FormItem>
          )}
        />

          <FormField
          control={form.control}
          name="expiration_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="flex gap-2">
                <FormLabel>Expiration Date</FormLabel>
                <FormMessage />
              </div>
              <DateTimePicker {...field} granularity="day" />
            </FormItem>
          )}
        />

        <CountriesFormField
          form={form}
          element={{ name: "country_of_birth", title: "Country of Birth" }}
        />
        </div>

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
