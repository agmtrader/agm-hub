'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card } from '@/components/ui/card'
import { Application, organizationApplication, application as individualApplication, jointApplication } from '@/lib/entities/application'

interface AccountTypeStepProps {
  form: UseFormReturn<Application>
}

const AccountTypeStep = ({ form }: AccountTypeStepProps) => {
  const handleAccountTypeChange = (value: string) => {
    // Initialize minimal structures based on selected type to satisfy schema
    if (value === 'INDIVIDUAL') {
      form.reset({ ...individualApplication, customer: { ...individualApplication.customer, type: 'INDIVIDUAL' } } as any)
    }
          if (value === 'JOINT') {
        form.reset({ ...jointApplication, customer: { ...jointApplication.customer, type: 'JOINT' } } as any)
      }
      if (value === 'ORG') {
      form.reset({ ...organizationApplication, customer: { ...organizationApplication.customer, type: 'ORG' } } as any)
    }
  }

  return (
    <div className="space-y-6">

      <FormField
        control={form.control}
        name="customer.type"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormControl>
              <RadioGroup
                onValueChange={(val) => { field.onChange(val); handleAccountTypeChange(val); }}
                value={field.value}
                className="grid gap-4"
              >
                <Card className="p-6 hover:border-primary transition-colors">
                  <FormItem className="flex flex-row items-center justify-start gap-10">
                      <FormControl>
                        <RadioGroupItem value="INDIVIDUAL" />
                      </FormControl>
                      <div> 
                        <FormLabel className="text-lg font-medium text-foreground cursor-pointer">
                          Individual Account
                        </FormLabel>
                        <p className="text-sm text-subtitle">
                          An account owned and controlled by a single person
                        </p>
                      </div>
                  </FormItem>
                </Card>

                <Card className="p-6 hover:border-primary transition-colors">
                  <FormItem className="flex flex-row items-center justify-start gap-10">
                      <FormControl>
                        <RadioGroupItem value="JOINT" />
                      </FormControl>
                      <div> 
                        <FormLabel className="text-lg font-medium text-foreground cursor-pointer">
                          Joint Account
                        </FormLabel>
                        <p className="text-sm text-subtitle">
                          An account owned by two or more people
                        </p>
                      </div>
                  </FormItem>
                </Card>



                <Card className="p-6">
                  <FormItem className="flex flex-row items-center justify-start gap-10">
                    <FormControl>
                      <RadioGroupItem value="ORG" />
                    </FormControl>
                    <div> 
                      <FormLabel className="text-lg font-medium text-foreground cursor-pointer">
                        Organization Account
                      </FormLabel>
                      <p className="text-sm text-subtitle">
                        An account for businesses and organizations
                      </p>
                    </div>
                  </FormItem>
                </Card>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export default AccountTypeStep 