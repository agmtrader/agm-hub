'use client'
import { formatURL } from '@/utils/lang';
import { toast, useToast } from '@/hooks/use-toast';
import { accessAPI } from '@/utils/api';
import { useSession } from 'next-auth/react';
import React, { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { User } from 'next-auth';
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getDefaults } from '@/utils/form';
import Link from 'next/link';

const Onboarding = () => {

    const { data: session } = useSession();

    const router = useRouter();
    const { lang } = useTranslationProvider();

    const [saving, setSaving] = useState(false);

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl');

    const { formSchema, undefinedFields } = useMemo(() => {

        if (!session?.user) return { formSchema: null, undefinedFields: {} };

        const user = session.user as User;

        const undefinedFields: Record<string, boolean> = {};
        const schemaFields: Record<string, z.ZodTypeAny> = {};

        Object.keys(user).forEach((key) => {

            if (user[key as keyof User] === undefined || user[key as keyof User] === null) {

                undefinedFields[key] = true;
                
                switch(key) {
                    case 'name':
                        schemaFields[key] = z.string().min(2);
                        break;
                    case 'emailVerified':
                        undefinedFields['emailVerified'] = false;
                        delete undefinedFields['emailVerified'];
                        updateVerifiedEmail();
                        break;
                    case 'email':
                        schemaFields[key] = z.string().email();
                        break;
                    case 'name':
                        schemaFields[key] = z.string().min(2);
                        break;
                    case 'country':
                        schemaFields[key] = z.string().min(2);
                        break;
                    case 'username':
                        schemaFields[key] = z.string();
                        break;
                    case 'image':
                        schemaFields[key] = z.string();
                        break;
                    default:
                        toast({
                            title: 'Error',
                            description: 'Developer Error: Unknown user property',
                            variant: 'destructive'
                        });
                        throw new Error('Unknown user property');
                }
            }
        });

        return {
            formSchema: Object.keys(schemaFields).length > 0 ? z.object(schemaFields) : null,
            undefinedFields
        };

    }, [session]);

    if (!formSchema) return router.push(callbackUrl ? formatURL(callbackUrl, lang) : formatURL('/', lang));

    const form = useForm<z.infer<NonNullable<typeof formSchema>>>({
        resolver: zodResolver(formSchema),
        defaultValues: getDefaults(formSchema),
    });

    async function updateVerifiedEmail() {
        const response = await accessAPI('/database/update', 'POST', {
            path: 'users',
            data: {
                emailVerified: false
            },
            query: {
                email: session?.user?.email
            }
        });
        if (response['status'] !== 'success') {
            toast({
                title: 'Error',
                description: 'Error updating email verification status',
                variant: 'destructive'
            });
            throw new Error('Error updating email verification status');
        }
    }

    async function onSubmit(values: z.infer<NonNullable<typeof formSchema>>) {

        if (!session || !session.user) return;

        setSaving(true);

        Object.keys(session.user).forEach((key) => {

            try {
                if (values[key as keyof typeof values] !== undefined && values[key as keyof typeof values] !== null) {
                    (session.user as any)[key] = values[key as keyof typeof values];
                }
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Error updating user property',
                    variant: 'destructive'
                });
                throw new Error('Error updating user property');
            }
        });

        const user = session.user as User;
        delete user.accessToken;
        delete user.refreshToken;

        const response = await accessAPI('/database/update', 'POST', {
            path: 'users',
            data: session.user,
            query: {
                email: session.user.email
            }
        });

        if (response['status'] !== 'success') {
            toast({
                title: 'Error',
                description: 'Error updating user profile',
                variant: 'destructive'
            });
            throw new Error('Error updating user profile');
        }

        setSaving(false);
        router.push(callbackUrl ? formatURL(callbackUrl, lang) : formatURL('/', lang));
    }

    return (
        <div className="container mx-auto p-8 min-h-screen flex flex-col items-center justify-center">
            <div className="w-full max-w-xl bg-card p-8 rounded-lg shadow-lg">
                <h1 className="text-5xl font-bold mb-6 text-center">Complete Your Profile</h1>
                <p className="text-center text-sm text-muted-foreground mb-6">
                    Please fill in the following fields to complete your profile.
                </p>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {Object.keys(undefinedFields).map((fieldName) => (
                            <FormField
                                key={fieldName}
                                control={form.control}
                                name={fieldName}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize">{fieldName}</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                        
                        <Button 
                            type="submit" 
                            className="w-full"
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save Profile"}
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link href={callbackUrl ? formatURL(callbackUrl, lang) : formatURL('/', lang)}>
                                Skip
                            </Link>
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default Onboarding
