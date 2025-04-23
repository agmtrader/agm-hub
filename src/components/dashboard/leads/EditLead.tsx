'use client'
import React, { useState, useEffect } from 'react'
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { lead_schema } from "@/lib/schemas/lead"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { UpdateLeadByID } from '@/utils/entities/lead'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Contact } from '@/lib/entities/contact'
import { getDefaults } from '@/utils/form'

interface Props {
  isDialogOpen: boolean
  setIsDialogOpen: (isDialogOpen: boolean) => void
  lead: Lead | null
  onSuccess?: () => void
  contacts: Contact[]
}

const EditLead = ({ isDialogOpen, setIsDialogOpen, lead, onSuccess, contacts }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(lead_schema),
    defaultValues: getDefaults(lead_schema)
  })

  // Reset form when lead changes
  useEffect(() => {
    if (lead) {
      const followUps = lead.FollowUps.map(followUp => {
        // Parse the date string (format: yyyyMMddHHmmss) into a Date object
        const year = parseInt(followUp.date.slice(0, 4))
        const month = parseInt(followUp.date.slice(4, 6)) - 1 // Months are 0-indexed
        const day = parseInt(followUp.date.slice(6, 8))
        const hour = parseInt(followUp.date.slice(8, 10))
        const minute = parseInt(followUp.date.slice(10, 12))
        
        return {
          ...followUp,
          date: new Date(year, month, day, hour, minute)
        }
      })

      form.reset({
        ...lead,
        FollowUps: followUps
      })
    }
  }, [lead, form])

  const { fields, append, remove } = useFieldArray({
    name: "FollowUps",
    control: form.control
  })

  const handleSubmit = async (values: any) => {
    if (!lead) return

    setIsSubmitting(true)

    try {
      const formattedFollowUps: FollowUp[] = values.FollowUps.map((followUp: any) => ({
        date: formatTimestamp(followUp.date),
        description: followUp.description,
        completed: followUp.completed
      }))

      const leadData: Lead = {
        ...values,
        LeadID: lead.LeadID,
        ContactDate: lead.ContactDate,
        FollowUps: formattedFollowUps,
        Completed: values.FollowUps.every((f: any) => f.completed)
      }
      
      await UpdateLeadByID(lead.LeadID, leadData)
      
      toast({
        title: "Success",
        description: "Lead updated successfully",
        variant: "success"
      })

      onSuccess?.()
      setIsDialogOpen(false)
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lead</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="ContactID"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>Contact</FormLabel>
                    <FormMessage />
                  </div>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a contact" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contacts.map((contact) => (
                        <SelectItem key={contact.ContactID} value={contact.ContactID}>
                          {contact.ContactName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ReferrerID"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>Referrer</FormLabel>
                    <FormMessage />
                  </div>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a referrer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contacts.map((contact) => (
                        <SelectItem key={contact.ContactID} value={contact.ContactID}>
                          {contact.ContactName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
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
                                granularity="day"
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
                  Updating...
                </>
              ) : (
                "Update Lead"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditLead 