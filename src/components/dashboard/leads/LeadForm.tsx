'use client'
import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { lead_schema } from "@/lib/schemas/lead"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CreateLead } from '@/utils/entities/lead'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
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
import { Lead } from '@/lib/entities/lead'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface LeadFormProps {
  isDialogOpen: boolean
  setIsDialogOpen: (isDialogOpen: boolean) => void
  onSuccess?: () => void
}

const LeadForm = ({ isDialogOpen, setIsDialogOpen, onSuccess }: LeadFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(lead_schema),
    defaultValues: {
      Name: "",
      Email: "",
      Phone: "",
      Description: "",
      FollowupDate: new Date(),
    }
  })

  const handleSubmit = async (values: any) => {
    
    setIsSubmitting(true)

    try {

        const LeadID = formatTimestamp(new Date())
        const ContactDate = formatTimestamp(new Date())
        const FollowupDate = formatTimestamp(values.FollowupDate)

        const leadData:Lead = {
          ...values,
          ContactDate: ContactDate,
          LeadID: LeadID,
          FollowupDate: FollowupDate,
          Completed: false
        }
        
        await CreateLead(leadData, LeadID)
        
        toast({
        title: "Success",
        description: "Lead created successfully",
        variant: "success"
        })

        onSuccess?.()
        form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create lead",
        variant: "destructive"
      })
      console.error(error)
    } finally {
      setIsSubmitting(false)
      setIsDialogOpen(false)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    <DialogContent>
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

          <FormField
            control={form.control}
            name="FollowupDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="flex gap-2">
                  <FormLabel>Follow-up Date</FormLabel>
                  <FormMessage />
                </div>
                <DateTimePicker {...field} granularity="minute" />
              </FormItem>
            )}
          />

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

export default LeadForm 