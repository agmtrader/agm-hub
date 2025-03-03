'use client'

import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { accessAPI } from '@/utils/api'
import { DataTable } from '@/components/misc/DataTable'
import { toast } from '@/hooks/use-toast'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Command, CommandInput } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Advisor } from '@/lib/entities/advisors'

const formSchema = z.object({
  advisor_code: z.string().min(1, "Advisor Code is required"),
  account_number: z.string().min(1, "Account Number is required"),
})

const page = () => {
    const [changelog, setChangelog] = useState<any[] | null>(null)
    const [accounts, setAccounts] = useState<any[] | null>(null)
    const [advisors, setAdvisors] = useState<Advisor[] | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
    })

    useEffect(() => {
        async function fetchData() {
            try {
                const [changelogResponse, accountsResponse, advisorsResponse] = await Promise.all([
                    accessAPI('/database/read', 'POST', {
                        'path': 'db/advisors/changelog',
                        'query': {}
                    }),
                    accessAPI('/database/read', 'POST', {
                        'path': 'db/clients/accounts',
                        'query': {}
                    }),
                    accessAPI('/database/read', 'POST', {
                        'path': 'db/advisors/dictionary',
                        'query': {}
                    })
                ])
                
                if (changelogResponse.status !== 'success') throw new Error('Error fetching changelog')
                if (accountsResponse.status !== 'success') throw new Error('Error fetching accounts')
                if (advisorsResponse.status !== 'success') throw new Error('Error fetching advisors')
                setAdvisors(advisorsResponse.content)
                setChangelog(changelogResponse.content)
                setAccounts(accountsResponse.content.slice(0, 5))
                
            } catch (error) {
                toast({
                    title: 'Error fetching advisors',
                    description: error instanceof Error ? error.message : 'An unknown error occurred',
                    variant: 'destructive',
                })
            }
        }
        fetchData()
    }, []) // Empty dependency array since we only want to fetch once on mount

    async function onSubmit(values: z.infer<typeof formSchema>) {
      try {
        await accessAPI('/database/write', 'POST', {
          'path': 'db/advisors/changelog',
          'content': {
            AdvisorCode: values.advisor_code,
            AccountNumber: values.account_number,
            Timestamp: new Date().toISOString()
          }
        })
        
        // Refresh the changelog
        const changelogResponse = await accessAPI('/database/read', 'POST', {
          'path': 'db/advisors/changelog',
          'query': {}
        })
        setChangelog(changelogResponse.content)
        
        setDialogOpen(false)
        form.reset()
        
        toast({
          title: 'Success',
          description: 'Advisor change log created successfully',
        })
      } catch (error) {
        toast({
          title: 'Error creating advisor change log',
          description: error instanceof Error ? error.message : 'An unknown error occurred',
          variant: 'destructive',
        })
      }
    }

    if (!changelog || !accounts || !advisors) return <LoadingComponent/>

  return (
    <div className="flex flex-col items-center justify-start w-full h-full gap-10 text-foreground">
        <h1 className="text-7xl font-bold">Advisor Center</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button>Advisor Change</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Advisor Change</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="advisor_code"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Advisor Code</FormLabel>
                        <FormControl>
                            <Select onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select advisor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {advisors.map((advisor: any) => (
                                        <SelectItem key={advisor.AdvisorCode} value={advisor.AdvisorCode}>
                                           {advisor.AdvisorName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="account_number"
                    render={({ field }) => (
                        <FormItem>
                        <div className='flex gap-2 items-center'>
                            <FormLabel>Account Number</FormLabel>
                            <FormMessage />
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                role="combobox"
                                variant="form"
                                >
                                {field.value
                                    ? accounts.find(
                                        (account) => account.AccountNumber === field.value
                                    )?.AccountNumber
                                    : ''
                                } 
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent>
                            <Command>
                                <CommandList>
                                <CommandInput
                                    placeholder='Search for an account'
                                />
                                <CommandEmpty>No results</CommandEmpty>
                                <CommandGroup>
                                    {accounts.map((account) => (
                                    <CommandItem
                                        value={account.AccountNumber}
                                        key={account.AccountNumber}
                                        onSelect={() => {
                                        form.setValue('account_number', account.AccountNumber)
                                        }}
                                    >
                                        {account.AccountNumber}
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
                    <Button type="submit">Create</Button>
                </form>
                </Form>
            </DialogContent>
        </Dialog>
        <DataTable data={changelog} />
    </div>
  )
}

export default page