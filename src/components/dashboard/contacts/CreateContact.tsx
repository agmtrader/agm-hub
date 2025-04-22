'use client'
import React, { useState } from 'react'
import { Contact } from '@/lib/entities/contact'
import { CreateContact as CreateContactAPI } from '@/utils/entities/contact'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { DialogTitle, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { Dialog } from '@/components/ui/dialog'
import { DialogContent } from '@/components/ui/dialog'
import CountriesFormField from '@/components/ui/CountriesFormField'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contact_schema } from '@/lib/schemas/contact'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { formatTimestamp } from '@/utils/dates'
import { getDefaults } from '@/utils/form'
interface CreateContactProps {
    onContactCreated: () => void
}

export default function CreateContact({ onContactCreated }: CreateContactProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof contact_schema>>({
        resolver: zodResolver(contact_schema),
        defaultValues: getDefaults(contact_schema)
    })

    const handleSubmit = async (values: z.infer<typeof contact_schema>) => {
        setIsSubmitting(true)
        try {
            const ContactID = formatTimestamp(new Date())
            const contactData:Contact = {
                ...values,
                ContactID: ContactID,
            }
            await CreateContactAPI(contactData)
            toast({
                title: "Success",
                description: "Contact created successfully",
                variant: "success"
            })
            onContactCreated()
            form.reset()
            setIsOpen(false)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create contact",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>Create Contact</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Contact</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="ContactName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="ContactEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="ContactPhone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <CountriesFormField
                            form={form}
                            element={{ 
                                name: "ContactCountry", 
                                title: "Country" 
                            }} 
                        />

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Contact"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 