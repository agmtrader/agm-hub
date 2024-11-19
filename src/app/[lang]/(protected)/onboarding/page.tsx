'use client'

import { formatURL } from '@/utils/lang';
import { useToast } from '@/hooks/use-toast';
import { accessAPI } from '@/utils/api';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CountriesFormField from '@/components/ui/CountriesFormField';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form } from "@/components/ui/form"
import { Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { getDefaults } from '@/utils/form';
import { User } from 'next-auth';

const Onboarding = () => {

    const { data: session } = useSession();

    const { toast } = useToast();

    const router = useRouter();
    const { lang } = useTranslationProvider();

    const [user, setUser] = useState<User | null>(null);
    const [requiresOnboarding, setRequiresOnboarding] = useState(false);

    const [saving, setSaving] = useState(false);
    const [showWarningDialog, setShowWarningDialog] = useState(false);

    // Replace saveProfile function
    async function onSubmit(values: z.infer<typeof formSchema>) {

        if (!user) return;
        setSaving(true);

        const response = await accessAPI('/database/update', 'POST', {
            path: 'users',
            query: {
                'email': user.email
            },
            data: values
        })

        if (response['status'] !== 'success') {
            toast({
                title: 'Error',
                description: response['message'],
                variant: 'destructive'
            })
            return;
        }

        setSaving(false);

        router.push(formatURL('/', lang));
    }

    useEffect(() => {

        async function fetchUser() {
            
            if (!session) return;
            if (!session.user) return;
            if (!session.user.email) return;

            const response = await accessAPI('/database/read', 'POST', {
                path: 'users',
                query: {
                    'email': session.user.email
                }
            })

            const tempUser = response['content'][0];

            if (response['status'] !== 'success') {
                toast({
                    title: 'Error',
                    description: response['message'],
                    variant: 'destructive'
                })
                return
            }

            if (tempUser['email'] !== session.user.email) {
                toast({
                    title: 'Error',
                    description: 'User email mismatch',
                    variant: 'destructive'
                })
                return;
            }

            let user:User = {
                'id': session.user.id,
                'accessToken': session.user.accessToken,
                'refreshToken': session.user.refreshToken,
                'admin': session.user.admin,
                'email': tempUser['email'],
                'name': tempUser['name'],
                'username': tempUser['username'],
                'password': tempUser['password'],
                'country': tempUser['country'],
                'image': tempUser['image'],
                'emailVerified': tempUser['emailVerified']
            };

            setUser(user);

            if (!user.username || !user.password || !user.name) {
                setRequiresOnboarding(true);
            } else {
                router.push(formatURL('/', lang));
            }
        }

        fetchUser();
    }, [session])

    const emptyFields = user ? Object.keys(user).filter(key => user[key as keyof User] === undefined) : [];

    // Build dynamic schema based on empty fields
    const formSchema = z.object(
        emptyFields.reduce((acc, field) => ({
            ...acc,
            [field]: field === 'password' 
                ? z.string().min(6, "Password must be at least 6 characters")
                    : field === 'country'
                    ? z.string().min(1, "Please select a country")
                        : z.string().min(2, `${field} must be at least 2 characters`)
        }), {})
    );

    // Move useForm after schema creation
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: getDefaults(formSchema)
    })

    if (!requiresOnboarding) return null;

    return (
        <div className="container mx-auto p-8 min-h-screen flex flex-col items-center justify-center">
            <div className="w-full max-w-xl bg-card p-8 rounded-lg shadow-lg">
                <h1 className="text-5xl font-bold mb-6 text-center">Complete Your Profile</h1>
                <p className="text-center text-sm text-muted-foreground mb-6">
                    Please fill in the following fields to complete your profile.
                </p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {emptyFields.map((field) => (
                            <div key={field} className="flex flex-col gap-2">
                                {field === 'country' ? (
                                    <CountriesFormField 
                                        form={form} 
                                        element={{ 
                                            name: "country", 
                                            title: 'Country'
                                        }} 
                                    />
                                ) : (
                                    <FormField
                                        control={form.control}
                                        name={field as keyof z.infer<typeof formSchema>}
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className='flex gap-2 items-center'>
                                                    <FormLabel className="capitalize">{field.name}</FormLabel>
                                                    <FormMessage />
                                                </div>
                                                <FormControl>
                                                    <Input
                                                        type={field.name === 'password' ? 'password' : 'text'}
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>
                        ))}
                        {emptyFields.length > 0 && (
                            <div className='flex gap-2 justify-center'>
                                <Button type="submit">
                                    {saving ? 
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <p>Saving...</p>
                                    </>
                                    :
                                    <>
                                        <p>Save</p>
                                    </>
                                }
                                </Button>
                                <Dialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost">
                                            <p>Skip step</p>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Warning</DialogTitle>
                                            <DialogDescription>
                                                If you skip this step, you won't be able to log in using email and password. 
                                                You will only be able to access your account through third-party authentication.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" onClick={() => setShowWarningDialog(false)}>
                                                Cancel
                                            </Button>
                                            <Button onClick={() => router.push(formatURL('/', lang))}>
                                                Continue anyway
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )}
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default Onboarding
