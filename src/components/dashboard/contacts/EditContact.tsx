'use client'
import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contact_schema } from "@/lib/schemas/contact"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UpdateContactByID } from '@/utils/entities/contact'
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
import { Contact } from '@/lib/entities/contact'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import CountriesFormField from '@/components/ui/CountriesFormField'
import { getDefaults } from '@/utils/form'

interface Props {
  isDialogOpen: boolean
  setIsDialogOpen: (isDialogOpen: boolean) => void
  contact: Contact | null
  onSuccess?: () => void
}

const EditContact = ({ isDialogOpen, setIsDialogOpen, contact, onSuccess }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(contact_schema),
    defaultValues: getDefaults(contact_schema)
  })

  useEffect(() => {
    if (contact) {
      form.reset(contact)
    }
  }, [contact, form])

  const handleSubmit = async (values: any) => {
    if (!contact) return

    setIsSubmitting(true)

    try {
      const contactData: Contact = {
        ContactName: values.ContactName,
        ContactEmail: values.ContactEmail || null,
        ContactPhone: values.ContactPhone || null,
        ContactCountry: values.ContactCountry || null,
        CompanyName: values.CompanyName || null,
        ContactID: contact.ContactID
      }
      
      await UpdateContactByID(contactData)
      
      toast({
        title: "Success",
        description: "Contact updated successfully",
        variant: "success"
      })

      onSuccess?.()
      setIsDialogOpen(false)
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update contact",
        variant: "destructive"
      })
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="ContactName"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
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
              name="ContactEmail"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>Email</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input placeholder="" type="email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <CountriesFormField
                form={form} 
                element={{ 
                  name: "ContactCountry", 
                  title: "Country" 
                }} 
              />
              
              <FormField
                control={form.control}
                name="ContactPhone"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-center">
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
                name="CompanyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel> 
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
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
                "Update Contact"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditContact 