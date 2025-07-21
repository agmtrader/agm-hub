'use client'
import React, { useState, useEffect } from 'react'
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { lead_schema, follow_up_schema } from "@/lib/entities/schemas/lead"
import { z } from "zod"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CreateLead as CreateLeadAPI } from '@/utils/entities/lead'
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
import { LeadPayload, FollowUpPayload } from '@/lib/entities/lead'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getDefaults } from '@/utils/form'
import { User } from 'next-auth'

interface Props {
  users: User[]
  refreshLeads?: () => void
  refreshUsers?: () => void
}

const CreateLead = ({ users, refreshLeads, refreshUsers }: Props) => {

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Create a combined schema for the form that includes both lead and follow-ups
  const formSchema = z.object({
    ...lead_schema.shape,
    follow_ups: z.array(follow_up_schema)
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...getDefaults(lead_schema),
      ...getDefaults(follow_up_schema)
    }
  })

  // Use field array for follow-ups
  const { fields, append, remove } = useFieldArray({
    name: "follow_ups",
    control: form.control
  })

  const handleLeadSubmit = async (values: any) => {
    setIsSubmitting(true)

    try {
      
      // Format the follow-ups for submission
      const followUpsPayload: FollowUpPayload[] = values.follow_ups.map((followUp: any) => ({
        date: formatTimestamp(followUp.date),
        description: followUp.description,
        completed: followUp.completed || false
      }))

      // Prepare the lead data according to our schema
      const leadPayload: LeadPayload = {
        contact_id: values.contact_id,
        referrer_id: values.referrer_id,
        description: values.description,
        status: 'Started',
        completed: false,
        contact_date: formatTimestamp(new Date())
      }

      await CreateLeadAPI(leadPayload, followUpsPayload)
      
      toast({
        title: "Success",
        description: "Lead created successfully",
        variant: "success"
      })

      refreshLeads?.()  
      refreshUsers?.()

      form.reset()
      setIsOpen(false)
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create lead. " + error,
        variant: "destructive"
      })
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
          <form onSubmit={form.handleSubmit(handleLeadSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="contact_id"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>Contact</FormLabel>
                    <FormMessage />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {field.value
                            ? users.find(
                                (user) => user.id === field.value
                              )?.name
                            : "Select a contact"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search contacts..." />
                        <CommandList>
                          <CommandEmpty>
                            <div className="flex flex-col gap-2 p-2">
                              <p>No contacts found.</p>
                            </div>
                          </CommandEmpty>
                          <CommandGroup>
                            {users.map((user: User) => (
                              <CommandItem
                                value={user.name || ''}
                                key={user.id}
                                onSelect={() => {
                                  field.onChange(user.id)
                                }}
                              >
                                {user.name}
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

            <FormField
              control={form.control}
              name="referrer_id" // This is a valid field in our combined schema
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>Referrer</FormLabel>
                    <FormMessage />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {field.value
                            ? users.find(
                                (user) => user.id === field.value
                              )?.name
                            : "Select a referrer"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search referrers..." />
                        <CommandList>
                          <CommandEmpty>No referrers found.</CommandEmpty>
                          <CommandGroup>
                            {users.map((user: User) => (
                              <CommandItem
                                value={user.name || ''}
                                key={user.id}
                                onSelect={() => {
                                  field.onChange(user.id)
                                }}
                              >
                                {user.name}
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

            <FormField
              control={form.control}
              name="description" // This is a valid field in our combined schema
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
                      value={field.value?.toString() || ""} // Ensure value is a string
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
                  onClick={() => append({date: new Date(), description: "", completed: false})}
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
                        name={`follow_ups.${index}.date`}
                        render={({ field: dateField }) => (
                          <FormItem>
                            <div className="flex gap-2 items-center">
                              <FormLabel>Follow-up Date</FormLabel>
                              <FormMessage />
                            </div>
                            <FormControl>
                              <DateTimePicker 
                                value={dateField.value} 
                                onChange={dateField.onChange}
                                granularity="day"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`follow_ups.${index}.description`}
                        render={({ field: descField }) => (
                          <FormItem>
                            <div className="flex gap-2 items-center">
                              <FormLabel>Follow-up Description</FormLabel>
                              <FormMessage />
                            </div>
                            <FormControl>
                              <Textarea 
                                placeholder="What needs to be done in this follow-up?"
                                {...descField}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`follow_ups.${index}.completed`}
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