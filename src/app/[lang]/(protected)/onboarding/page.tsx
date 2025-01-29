'use client'
import { formatURL } from '@/utils/lang';
import { toast, useToast } from '@/hooks/use-toast';
import { accessAPI } from '@/utils/api';
import { signIn, signOut, useSession } from 'next-auth/react';
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
import CountriesFormField from '@/components/ui/CountriesFormField';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/anims';
import Image from 'next/image';

interface UserWithPassword extends User {
    password: string;
}

const Onboarding = () => {

    const { data: session, update } = useSession();

    const router = useRouter();
    const { lang } = useTranslationProvider();

    const [saving, setSaving] = useState(false);

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl');

    const formSchema = useMemo(() => {

        if (!session?.user) return null;
        const user = session.user as UserWithPassword;

        if (!user) return null;

        const schemaFields: Record<string, z.ZodTypeAny> = {};

        ['name', 'email', 'country', 'username', 'image', 'password'].forEach((key) => {

            // If the user does not have the value associated with the key, add it to the schema
            if (user[key as keyof User] === undefined || user[key as keyof User] === null) {

                
                switch(key) {
                    case 'name':
                        schemaFields[key] = z.string().min(2);
                        break;
                    case 'email':
                        schemaFields[key] = z.string().email();
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
                    case 'password':
                        schemaFields[key] = z.string().min(8);
                        break;
                    default:
                        console.log(key)
                        toast({
                            title: 'Error',
                            description: 'Developer Error: Unknown user property',
                            variant: 'destructive'
                        });
                        throw new Error('Unknown user property');
                }
            }

        });

        return Object.keys(schemaFields).length > 0 ? z.object(schemaFields) : null

    }, [session]);

    if (!formSchema) {
        router.push(callbackUrl ? formatURL(callbackUrl, lang) : formatURL('/', lang))
        return null;
    };

    toast({
        title: 'Profile missing key information',
        description: 'Please fill in the following fields to complete your profile.',
        variant: 'destructive'
    });

    const form = useForm<z.infer<NonNullable<typeof formSchema>>>({
        resolver: zodResolver(formSchema),
        defaultValues: getDefaults(formSchema),
    });

    async function onSubmit(values: z.infer<NonNullable<typeof formSchema>>) {

        if (!session || !session.user) return;
        setSaving(true);

        // Update the current user object with the new values
        Object.keys(session.user as User).forEach((key) => {

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

        // Create a new user object with the updated values (including password)
        const user = session.user as UserWithPassword;
        user.password = values.password;
        delete user.accessToken;
        delete user.refreshToken;

        // Update the user in the database
        const response = await accessAPI('/database/update', 'POST', {
            path: 'users',
            data: user,
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
        <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className='flex items-center justify-center min-h-screen'
        >
            <Card className="w-full max-w-xl p-8">
                <motion.div variants={itemVariants}>
                    <CardHeader className='flex flex-col justify-center items-center gap-2'>
                        <Image src='/images/brand/agm-logo.png' alt='AGM Logo' width={200} height={200} />
                        <CardTitle className='text-center font-bold text-3xl'>Complete Your Profile</CardTitle>
                        <CardDescription className='text-center text-sm text-muted-foreground'>Please fill in the following fields to complete your profile.</CardDescription>
                    </CardHeader>
                </motion.div>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {Object.keys(formSchema.shape).map((fieldName) => (
                                fieldName === 'country' ? (
                                    <CountriesFormField 
                                        key={fieldName}
                                        form={form} 
                                        element={{ name: fieldName, title: fieldName }}
                                    />
                                ) : (
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
                                )
                            ))}

                            <div className='flex flex-col gap-2'>
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
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default Onboarding