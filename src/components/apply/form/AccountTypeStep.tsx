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
import { Application } from '@/lib/entities/application'

interface AccountTypeStepProps {
  form: UseFormReturn<Application>
}

const AccountTypeStep = ({ form }: AccountTypeStepProps) => {
  return (
    <div className="space-y-6">

      <FormField
        control={form.control}
        name="customer.type"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
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

                {/* Disabled options for future implementation */}
                <Card className="p-6 opacity-50 cursor-not-allowed">
                  <div>
                    <p>Trust Account</p>
                      <p className="text-sm text-muted-foreground">
                        Coming soon - An account managed by a trustee
                      </p>
                  </div>
                </Card>

                <Card className="p-6 opacity-50 cursor-not-allowed">
                <div>
                    <p>Organization Account</p>
                      <p className="text-sm text-muted-foreground">
                        Coming soon - An account for businesses and organizations
                      </p>
                  </div>
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