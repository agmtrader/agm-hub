'use client'
import React, { useState } from 'react'
import { ContactPayload } from '@/lib/entities/contact'
import { CreateContact as CreateContactAPI } from '@/utils/entities/contact'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { DialogTitle, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { Dialog } from '@/components/ui/dialog'
import { DialogContent } from '@/components/ui/dialog'
import CountriesFormField from '@/components/ui/CountriesFormField'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contact_schema } from '@/lib/entities/schemas/contact'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { getDefaults } from '@/utils/form'
import { Plus } from 'lucide-react'

interface CreateContactProps {
    onSuccess?: () => void
    variant?: 'primary' | 'ghost'
}

export default function CreateContact({ onSuccess, variant = 'primary' }: CreateContactProps) {
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
            const contactData:ContactPayload = {
                name: values.name,
                email: values.email || null,
                phone: values.phone || null,
                country: values.country || null,
                company_name: values.company_name || null
            }
            await CreateContactAPI(contactData)
            toast({
                title: "Success",
                description: "Contact created successfully",
                variant: "success"
            })
            onSuccess?.()
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
                <Button type="button" className="flex gap-2 w-fit" variant={variant}>
                    <Plus className="h-4 w-4" />
                    {variant === 'primary' && 'Create Contact'}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Contact</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit(handleSubmit)(e);
                    }} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <CountriesFormField
                            form={form}
                            element={{ 
                                name: "country", 
                                title: "Country" 
                            }} 
                        />

                        <FormField
                            control={form.control}
                            name="company_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
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