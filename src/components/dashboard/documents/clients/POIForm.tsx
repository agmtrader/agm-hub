import React from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getDefaults } from '@/utils/form'
import { poi_schema } from "@/lib/schemas/document-center"
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
import { Loader2 } from "lucide-react"
import { countries } from "@/lib/form"
import { DateTimePicker } from '@/components/ui/datetime-picker'

interface POIFormProps {
  onSubmit: (values: any, files: File[] | null) => Promise<void>
  uploading: boolean
}

const POIForm: React.FC<POIFormProps> = ({ onSubmit, uploading }) => {

  const defaultValues = getDefaults(poi_schema)
  
  const form = useForm({
    resolver: zodResolver(poi_schema),
    defaultValues: defaultValues,
  })

  const handleSubmit = (values: any) => {
    onSubmit(values, null)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

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

        <FormField
          control={form.control}
          name="country_of_issue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country of Issue</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  <SelectItem value="ID">ID</SelectItem>
                  <SelectItem value="Passport">Passport</SelectItem>
                  <SelectItem value="License">License</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="id_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
              <DateTimePicker {...field}  granularity="day" />
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

        <FormField
          control={form.control}
          name="country_of_birth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country of Birth</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Button className="h-fit w-fit text-background" type="submit">
                Submit
            </Button>
          )
        }
      </form>
    </Form>
  )
}

export default POIForm
