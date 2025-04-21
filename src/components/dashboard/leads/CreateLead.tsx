'use client'
import React, { useState } from 'react'
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { lead_schema } from "@/lib/schemas/lead"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CreateLead as CreateLeadFunction } from '@/utils/entities/lead'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { DateTimePicker } from '@/components/ui/datetime-picker'
import { formatTimestamp } from '@/utils/dates'
import { Lead, FollowUp } from '@/lib/entities/lead'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { countries } from "@/lib/form"

interface Props {
  onSuccess?: () => void
}

const CreateLead = ({ onSuccess }: Props) => {

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(lead_schema),
    defaultValues: {
      Name: "",
      Email: "",
      Phone: "",
      PhoneCountry: "",
      Referrer: "",
      Description: "",
      FollowUps: [{
        date: new Date(),
        description: "",
        completed: false
      }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    name: "FollowUps",
    control: form.control
  })

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true)

    try {
      const LeadID = formatTimestamp(new Date())
      const ContactDate = formatTimestamp(new Date())
      
      const formattedFollowUps: FollowUp[] = values.FollowUps.map((followUp: any) => ({
        date: formatTimestamp(followUp.date),
        description: followUp.description,
        completed: followUp.completed
      }))

      const leadData: Lead = {
        ...values,
        ContactDate: ContactDate,
        LeadID: LeadID,
        FollowUps: formattedFollowUps,
        Completed: false
      }
      
      await CreateLeadFunction(leadData, LeadID)
      
      toast({
        title: "Success",
        description: "Lead created successfully",
        variant: "success"
      })

      onSuccess?.()
      form.reset()
      setIsOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create lead",
        variant: "destructive"
      })
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
            className="bg-primary text-background hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Lead
          </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Lead</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="Name"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2">
                    <FormLabel>Name</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Email"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2">
                    <FormLabel>Email</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input placeholder="" type="email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Referrer"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2">
                    <FormLabel>Referrer</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="PhoneCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Country</FormLabel>
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
                name="Phone"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2">
                      <FormLabel>Phone</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="Description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2">
                    <FormLabel>Description</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Textarea 
                      placeholder="" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Follow-ups</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ date: new Date(), description: "", completed: false })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Follow-up
                </Button>
              </div>
              
              {fields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-4">
                      <FormField
                        control={form.control}
                        name={`FollowUps.${index}.date`}
                        render={({ field: dateField }) => (
                          <FormItem>
                            <FormLabel>Follow-up Date</FormLabel>
                            <FormControl>
                              <DateTimePicker 
                                value={dateField.value} 
                                onChange={dateField.onChange}
                                granularity="minute"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`FollowUps.${index}.description`}
                        render={({ field: descField }) => (
                          <FormItem>
                            <FormLabel>Follow-up Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What needs to be done in this follow-up?"
                                {...descField}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`FollowUps.${index}.completed`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Mark as completed
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary text-background hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Lead"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateLead